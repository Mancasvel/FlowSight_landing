import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getActiveTeamId, getUserTeams } from '@/lib/getActiveTeamId'
import { getStoredDashboardPreferences } from '@/lib/onboarding/getDashboardPreferences'
import { teamHasDashboardPreferences } from '@/lib/onboarding/hasDashboardPreferences'

export type DashboardShellProps = {
  userId: string
  displayName: string
  avatarUrl: string | null
  role: 'pm' | 'worker'
  teams: { id: string; name: string }[]
  activeTeamId: string | null
  personalizedDashboardTitle: string | null
  hasPersonalizedDashboard: boolean
}

export async function loadDashboardShellProps(): Promise<DashboardShellProps> {
  const headerStore = await headers()
  const userId = headerStore.get('x-user-id')

  if (!userId) redirect('/login')

  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar_url, role')
    .eq('id', userId)
    .single()

  if (!profile) {
    const userName = headerStore.get('x-user-name') || ''
    const userAvatar = headerStore.get('x-user-avatar') || null

    const { error: insertError } = await supabase.from('profiles').insert({
      id: userId,
      display_name: userName,
      avatar_url: userAvatar,
      role: 'pm',
    })

    if (insertError) redirect('/login?error=profile_creation_failed')
  }

  const [teams, activeTeamId] = await Promise.all([
    getUserTeams(userId),
    getActiveTeamId(userId),
  ])

  const hasPersonalizedDashboard = activeTeamId
    ? await teamHasDashboardPreferences(activeTeamId)
    : false

  const stored = activeTeamId ? await getStoredDashboardPreferences(activeTeamId) : null

  return {
    userId,
    displayName: profile?.display_name ?? headerStore.get('x-user-name') ?? 'User',
    avatarUrl: profile?.avatar_url ?? null,
    role: profile?.role ?? 'pm',
    teams,
    activeTeamId,
    personalizedDashboardTitle: stored?.title ?? null,
    hasPersonalizedDashboard,
  }
}
