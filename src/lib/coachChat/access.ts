import type { SupabaseClient } from '@supabase/supabase-js'

export async function assertTeamAccess(
  supabase: SupabaseClient,
  userId: string,
  teamId: string
): Promise<boolean> {
  const { data: membership } = await supabase
    .from('team_members')
    .select('user_id')
    .eq('team_id', teamId)
    .eq('user_id', userId)
    .maybeSingle()

  if (membership) return true

  const { data: ownedTeam } = await supabase
    .from('teams')
    .select('id')
    .eq('id', teamId)
    .eq('owner_id', userId)
    .maybeSingle()

  return Boolean(ownedTeam)
}
