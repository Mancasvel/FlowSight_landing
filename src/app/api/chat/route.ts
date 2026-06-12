import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  getFlowStateData,
  getContextLoadData,
  getPlanningData,
  getMeetingsData,
  getWorkflowData,
} from '@/lib/dashboardData'
import { buildCoachContext } from '@/lib/buildCoachContext'
import { COACH_SYSTEM_PROMPT, kimiChat } from '@/lib/kimi/client'
import {
  checkPromptAllowance,
  incrementPromptUsage,
  isTeamAdmin,
  createServiceClient,
} from '@/lib/promptLimits'
import { assertTeamAccess } from '@/lib/coachChat/access'
import {
  appendCoachMessages,
  createCoachConversationInDb,
  getCoachConversationFromDb,
  searchCoachMessageRag,
} from '@/lib/coachChat/server'
import { getCoachDocumentTexts } from '@/lib/coachChat/documentServer'
import {
  buildConversationHistoryBlock,
  buildDocumentsContextBlock,
  buildRagContextBlock,
} from '@/lib/coachChat/ragContext'
import { isSchemaMismatchError } from '@/lib/supabase/schemaCompat'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as {
      message?: string
      teamId?: string
      conversationId?: string
      documentIds?: string[]
      inlineDocuments?: { fileName: string; text: string }[]
    }
    const message = body.message?.trim()
    const teamId = body.teamId
    let conversationId = body.conversationId

    if (!message || message.length > 500) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }
    if (!teamId) {
      return NextResponse.json({ error: 'teamId is required' }, { status: 400 })
    }

    if (!(await assertTeamAccess(supabase, user.id, teamId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const admin = await isTeamAdmin(supabase, user.id, teamId)
    const allowance = await checkPromptAllowance(supabase, user.id, teamId, admin)

    if (!allowance.allowed) {
      return NextResponse.json(
        {
          error: allowance.reason ?? 'Prompt limit reached',
          usage: {
            used: allowance.used,
            limit: allowance.limit,
            remaining: allowance.remaining,
            planId: allowance.planId,
          },
        },
        { status: 429 }
      )
    }

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

    const [flow, context, planning, meetings, workflow] = await Promise.all([
      getFlowStateData(teamId, now),
      getContextLoadData(teamId, weekStart, now),
      getPlanningData(teamId, 4),
      getMeetingsData(teamId, weekStart, now),
      getWorkflowData(teamId, now),
    ])

    const contextJson = buildCoachContext({
      flow,
      context,
      planning,
      meetings,
      workflow,
      displayName,
    })

    const ragBlock = buildRagContextBlock(ragMatches)
    const historyBlock = buildConversationHistoryBlock(priorMessages)

    let documentTexts: { fileName: string; text: string }[] = []
    try {
      const stored = await getCoachDocumentTexts(
        supabase,
        user.id,
        teamId,
        conversationId!,
        body.documentIds
      )
      documentTexts = stored.map((d) => ({ fileName: d.fileName, text: d.text }))
    } catch (docErr) {
      if (!isSchemaMismatchError(docErr)) {
        console.error('Coach document context error:', docErr)
      }
    }

    if (Array.isArray(body.inlineDocuments)) {
      for (const doc of body.inlineDocuments) {
        if (doc?.fileName && doc?.text) {
          documentTexts.push({ fileName: doc.fileName, text: doc.text })
        }
      }
    }

    const documentsBlock = buildDocumentsContextBlock(documentTexts)

    const promptParts = [
      `Team data:\n${contextJson}`,
      documentsBlock,
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
      return NextResponse.json(
        { error: 'AI coach temporarily unavailable. Try again shortly.' },
        { status: 503 }
      )
    }

    const userMsg = { id: `u-${Date.now()}`, role: 'user' as const, content: message }
    const assistantMsg = {
      id: `a-${Date.now()}`,
      role: 'assistant' as const,
      content: reply,
      reasoning,
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

    await incrementPromptUsage(createServiceClient(), user.id, teamId, allowance.planId)

    const newUsed = allowance.remaining > 0 ? allowance.used + 1 : allowance.used
    const remaining =
      allowance.remaining > 0
        ? allowance.remaining - 1
        : Math.max(0, (allowance.poolLimit ?? 0) - (allowance.poolUsed ?? 0) - 1)

    return NextResponse.json({
      reply,
      reasoning,
      conversationId,
      messages: savedConversation.messages,
      usage: {
        used: newUsed,
        limit: allowance.limit,
        remaining,
        planId: allowance.planId,
        poolUsed: allowance.poolUsed,
        poolLimit: allowance.poolLimit,
      },
    })
  } catch (err) {
    console.error('Chat API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const teamId = req.nextUrl.searchParams.get('teamId')
    if (!teamId) {
      return NextResponse.json({ error: 'teamId is required' }, { status: 400 })
    }

    const admin = await isTeamAdmin(supabase, user.id, teamId)
    const allowance = await checkPromptAllowance(supabase, user.id, teamId, admin)

    return NextResponse.json({
      usage: {
        used: allowance.used,
        limit: allowance.limit,
        remaining: allowance.remaining,
        planId: allowance.planId,
        poolUsed: allowance.poolUsed,
        poolLimit: allowance.poolLimit,
        allowed: allowance.allowed,
      },
    })
  } catch (err) {
    console.error('Chat usage error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
