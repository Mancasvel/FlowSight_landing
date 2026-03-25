import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

const COOKIE_NAME = 'flowsight_active_team'

/**
 * Returns the team_id the PM should see.
 * Priority: cookie → most recent owned team → most recent membership.
 */
export async function getActiveTeamId(userId: string): Promise<string | null> {
  const cookieStore = await cookies()
  const cookieTeamId = cookieStore.get(COOKIE_NAME)?.value

  const supabase = await createClient()

  if (cookieTeamId) {
    const { data: valid } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', userId)
      .eq('team_id', cookieTeamId)
      .limit(1)
      .maybeSingle()

    if (valid) return cookieTeamId
  }

  const { data: ownedTeam } = await supabase
    .from('teams')
    .select('id')
    .eq('owner_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (ownedTeam) return ownedTeam.id

  const { data: membership } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', userId)
    .order('joined_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return membership?.team_id ?? null
}

export async function getUserTeams(userId: string): Promise<{ id: string; name: string }[]> {
  const supabase = await createClient()

  const { data: memberTeams } = await supabase
    .from('team_members')
    .select('team_id, teams!team_members_team_id_fkey(id, name, is_active)')
    .eq('user_id', userId)

  if (!memberTeams) return []

  return (memberTeams as unknown as Array<{
    team_id: string
    teams: { id: string; name: string; is_active: boolean }
  }>)
    .filter((m) => m.teams?.is_active)
    .map((m) => ({ id: m.teams.id, name: m.teams.name }))
}
