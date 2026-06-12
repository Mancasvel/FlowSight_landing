import { createClient } from '@/lib/supabase/server'
import { getTeamMembers, getTodayWorkSessions, secondsToHours } from '@/lib/supabase/queries'

export async function getWorkloadMembersForTeam(teamId: string) {
  const supabase = await createClient()
  const [teamMembers, sessions] = await Promise.all([
    getTeamMembers(supabase, teamId),
    getTodayWorkSessions(supabase, teamId),
  ])

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

  return teamMembers.map((member) => {
    const profile = member.profile
    const userSessions = sessions.filter((s) => s.user_id === member.user_id)
    const totalSeconds = userSessions.reduce((sum, s) => sum + s.duration_seconds, 0)
    const latestSession = userSessions[0]

    return {
      id: member.user_id,
      name: profile?.display_name ?? 'Unknown',
      avatar_url: profile?.avatar_url ?? null,
      isOnline: (profile?.last_seen_at ?? '') > fiveMinutesAgo,
      hours: secondsToHours(totalSeconds),
      currentActivity: latestSession?.summary ?? null,
    }
  })
}
