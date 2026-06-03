import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  getTeamNotificationSettings,
  upsertTeamNotificationSettings,
  type TeamNotificationSettings,
} from '@/lib/teamNotifications'

export const dynamic = 'force-dynamic'

async function assertTeamAccess(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  teamId: string
): Promise<boolean> {
  const { data: owned } = await supabase
    .from('teams')
    .select('id')
    .eq('id', teamId)
    .eq('owner_id', userId)
    .maybeSingle()

  if (owned) return true

  const { data: member } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', userId)
    .maybeSingle()

  return member?.role === 'admin'
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const teamId = req.nextUrl.searchParams.get('teamId')
    if (!teamId) return NextResponse.json({ error: 'teamId required' }, { status: 400 })

    const allowed = await assertTeamAccess(supabase, user.id, teamId)
    if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const settings = await getTeamNotificationSettings(supabase, teamId)
    return NextResponse.json({ settings })
  } catch (err) {
    console.error('Notifications GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = (await req.json()) as Partial<TeamNotificationSettings> & { teamId?: string }
    const teamId = body.teamId
    if (!teamId) return NextResponse.json({ error: 'teamId required' }, { status: 400 })

    const allowed = await assertTeamAccess(supabase, user.id, teamId)
    if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const settings = await upsertTeamNotificationSettings(supabase, {
      teamId,
      dailyEmail: body.dailyEmail,
      weeklyReport: body.weeklyReport,
      realTimeAlerts: body.realTimeAlerts,
      digestDay: body.digestDay,
      digestTime: body.digestTime,
      digestTimezone: body.digestTimezone,
      digestRecipients: body.digestRecipients,
    })

    return NextResponse.json({ settings })
  } catch (err) {
    console.error('Notifications PUT error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
