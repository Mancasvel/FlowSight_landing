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

    const body = (await req.json()) as { message?: string; teamId?: string }
    const message = body.message?.trim()
    const teamId = body.teamId

    if (!message || message.length > 500) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }
    if (!teamId) {
      return NextResponse.json({ error: 'teamId is required' }, { status: 400 })
    }

    const { data: membership } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .maybeSingle()

    const { data: ownedTeam } = await supabase
      .from('teams')
      .select('id')
      .eq('id', teamId)
      .eq('owner_id', user.id)
      .maybeSingle()

    if (!membership && !ownedTeam) {
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

    let reply: string
    try {
      reply = await kimiChat({
        system: COACH_SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: `Team data:\n${contextJson}\n\nQuestion: ${message}` },
        ],
      })
    } catch (err) {
      console.error('Kimi chat error:', err)
      return NextResponse.json(
        { error: 'AI coach temporarily unavailable. Try again shortly.' },
        { status: 503 }
      )
    }

    await incrementPromptUsage(createServiceClient(), user.id, teamId, allowance.planId)

    const newUsed = allowance.remaining > 0 ? allowance.used + 1 : allowance.used
    const remaining =
      allowance.remaining > 0 ? allowance.remaining - 1 : Math.max(0, (allowance.poolLimit ?? 0) - (allowance.poolUsed ?? 0) - 1)

    return NextResponse.json({
      reply,
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
