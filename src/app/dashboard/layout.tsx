import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getActiveTeamId, getUserTeams } from '@/lib/getActiveTeamId'
import DashboardSidebar from '@/components/dashboard/AnalyticsSidebar'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headerStore = await headers()
  const userId = headerStore.get('x-user-id')

  if (!userId) {
    redirect('/login')
  }

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

    if (insertError) {
      console.error('Failed to create profile:', insertError)
      redirect('/login?error=profile_creation_failed')
    }
  }

  const [teams, activeTeamId] = await Promise.all([
    getUserTeams(userId),
    getActiveTeamId(userId),
  ])

  return (
    <div id="dashboard-shell" className="min-h-screen bg-[#FAFAFA]">
      <DashboardSidebar
        displayName={profile?.display_name ?? 'User'}
        avatarUrl={profile?.avatar_url ?? null}
        role={profile?.role ?? 'pm'}
        teams={teams}
        activeTeamId={activeTeamId}
      />
      <main className="min-h-screen lg:pl-[240px] overflow-auto dark-scrollbar">
        <div className="px-4 pt-16 pb-6 sm:px-6 lg:px-10 lg:pt-8 lg:pb-8 2xl:px-14 2xl:pb-10">
          {children}
        </div>
      </main>
    </div>
  )
}
