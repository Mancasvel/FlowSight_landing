import { NextRequest, NextResponse } from 'next/server'
import { buildCoachContext } from '@/lib/buildCoachContext'
import { loadCoachDashboardData } from '@/lib/coachChat/loadCoachDashboardData'
import { COACH_SYSTEM_PROMPT, kimiChat } from '@/lib/kimi/client'
import {
  checkPromptAllowance,
  formatPromptUsagePayload,
  incrementPromptUsage,
  createServiceClient,
  type PromptUsageResult,
} from '@/lib/promptLimits'
import { guardCoachApi, coachSecurityErrorResponse } from '@/lib/api/guardCoachApi'
import {
  appendCoachMessages,
  createCoachConversationInDb,
  getCoachConversationFromDb,
  searchCoachMessageRag,
} from '@/lib/coachChat/server'
import { searchCoachContextVectors } from '@/lib/coachChat/contextVectorServer'
import {
  buildConversationHistoryBlock,
  buildRagContextBlock,
  buildSessionDocumentsBlock,
  buildVectorContextBlock,
} from '@/lib/coachChat/ragContext'
import {
  buildCoachCitationIndex,
  buildCitationPromptBlock,
} from '@/lib/coachChat/citations'
import { isSchemaMismatchError } from '@/lib/supabase/schemaCompat'

export const dynamic = 'force-dynamic'

function errorResponse(
  message: string,
  status: number,
  allowance: PromptUsageResult | null
) {
  return NextResponse.json(
    {
      error: message,
      ...(allowance ? { usage: formatPromptUsagePayload(allowance) } : {}),
    },
    { status }
  )
}

export async function POST(req: NextRequest) {
  let allowance: PromptUsageResult | null = null
  let admin = false

  try {
    const body = (await req.json()) as {
      message?: string
      teamId?: string
      conversationId?: string
      turnstileToken?: string
      inlineDocuments?: { fileName: string; text: string }[]
    }
    const message = body.message?.trim()
    const teamId = body.teamId ?? ''
    let conversationId = body.conversationId

    if (!message || message.length > 500) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }

    const guarded = await guardCoachApi(req, {
      teamId,
      mode: 'ai',
      rateScope: 'chat',
      turnstileToken: body.turnstileToken,
    })
    const { supabase, user, admin: isAdmin, allowance: initialAllowance } = guarded
    admin = isAdmin
    allowance = initialAllowance!

    let conversation =
      conversationId
        ? await getCoachConversationFromDb(supabase, user.id, teamId, conversationId)
        : null

    if (!conversation) {
      conversation = await createCoachConversationInDb(supabase, user.id, teamId)
      conversationId = conversation.id
    }

    const priorMessages = conversation.messages
    const ragMatches = await searchCoachMessageRag(
      supabase,
      user.id,
      teamId,
      message,
      conversationId,
      5
    )

    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single()

    const displayName = profile?.display_name ?? 'User'
    const now = new Date()
    const dayOfWeek = now.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() + mondayOffset)
    weekStart.setHours(0, 0, 0, 0)

    const dashboard = await loadCoachDashboardData(teamId, weekStart, now)

    const contextJson = buildCoachContext({
      flow: dashboard.flow,
      context: dashboard.context,
      planning: dashboard.planning,
      meetings: dashboard.meetings,
      workflow: dashboard.workflow,
      displayName,
    })

    const ragBlock = buildRagContextBlock(ragMatches)
    const historyBlock = buildConversationHistoryBlock(priorMessages)

    let vectorMatches: Awaited<ReturnType<typeof searchCoachContextVectors>> = []
    let vectorBlock = ''
    try {
      vectorMatches = await searchCoachContextVectors(
        supabase,
        user.id,
        teamId,
        conversationId!,
        message,
        6
      )
      vectorBlock = buildVectorContextBlock(vectorMatches)
    } catch (vectorErr) {
      if (isSchemaMismatchError(vectorErr)) {
        // coach_context_chunks table not migrated yet
      } else if (
        vectorErr instanceof Error &&
        (vectorErr.name === 'EmbeddingConfigError' ||
          vectorErr.message.includes('unavailable_model'))
      ) {
        console.warn('Coach vector context skipped (embeddings not configured):', vectorErr.message)
      } else {
        console.error('Coach vector context error:', vectorErr)
      }
    }

    const sessionDocs = Array.isArray(body.inlineDocuments)
      ? body.inlineDocuments.filter((d) => d?.fileName && d?.text)
      : []
    const sessionBlock = buildSessionDocumentsBlock(sessionDocs)

    const citationIndex = buildCoachCitationIndex({
      flow: dashboard.flow,
      context: dashboard.context,
      planning: dashboard.planning,
      meetings: dashboard.meetings,
      workflow: dashboard.workflow,
      vectorMatches,
      sessionDocuments: sessionDocs.map((d) => ({ fileName: d.fileName })),
      ragMatches,
    })
    const citationBlock = buildCitationPromptBlock(citationIndex)

    const promptParts = [
      `Team data:\n${contextJson}`,
      citationBlock,
      vectorBlock,
      sessionBlock,
      ragBlock,
      historyBlock,
      `Question: ${message}`,
    ].filter(Boolean)

    let reply = ''
    let reasoning: string | null = null
    try {
      const result = await kimiChat({
        system: COACH_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: promptParts.join('\n\n') }],
        structuredReasoning: true,
        maxTokens: 1400,
      })
      reply = result.answer
      reasoning = result.reasoning
    } catch (err) {
      console.error('Azure OpenAI chat error:', err)
      return errorResponse(
        'AI coach temporarily unavailable. Try again shortly.',
        503,
        allowance
      )
    }

    if (!reply.trim()) {
      return errorResponse('AI coach returned an empty response.', 503, allowance)
    }

    const userMsg = { id: `u-${Date.now()}`, role: 'user' as const, content: message }
    const assistantMsg = {
      id: `a-${Date.now()}`,
      role: 'assistant' as const,
      content: reply,
      reasoning,
      citations: citationIndex,
    }

    let savedConversation = conversation
    try {
      savedConversation =
        (await appendCoachMessages(supabase, user.id, teamId, conversationId!, [
          userMsg,
          assistantMsg,
        ])) ?? conversation
    } catch (persistErr) {
      if (!isSchemaMismatchError(persistErr)) {
        console.error('Coach message persist error:', persistErr)
      }
    }

    try {
      await incrementPromptUsage(createServiceClient(), user.id, teamId, allowance.planId)
    } catch (usageErr) {
      console.error('Prompt usage increment failed:', usageErr)
      return errorResponse(
        'Could not confirm coach usage. Your prompt was not charged — try again.',
        503,
        allowance
      )
    }

    const updatedAllowance = await checkPromptAllowance(supabase, user.id, teamId, admin)

    return NextResponse.json({
      reply,
      reasoning,
      citations: citationIndex,
      conversationId,
      messages: savedConversation.messages,
      usage: formatPromptUsagePayload(updatedAllowance),
    })
  } catch (err) {
    const security = coachSecurityErrorResponse(err)
    if (security) return security
    console.error('Chat API error:', err)
    return errorResponse('Internal server error', 500, allowance)
  }
}

export async function GET(req: NextRequest) {
  try {
    const teamId = req.nextUrl.searchParams.get('teamId') ?? ''
    const { supabase, user, admin } = await guardCoachApi(req, { teamId, rateScope: 'api' })
    const allowance = await checkPromptAllowance(supabase, user.id, teamId, admin)

    return NextResponse.json({
      usage: {
        ...formatPromptUsagePayload(allowance),
        allowed: allowance.allowed,
      },
    })
  } catch (err) {
    const security = coachSecurityErrorResponse(err)
    if (security) return security
    console.error('Chat usage error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
