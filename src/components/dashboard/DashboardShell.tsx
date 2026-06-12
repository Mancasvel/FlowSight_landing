import DashboardSidebar from '@/components/dashboard/AnalyticsSidebar'
import CoachChatProvider from '@/components/dashboard/CoachChatProvider'

type Props = {
  userId: string
  displayName: string
  avatarUrl: string | null
  role: 'pm' | 'worker'
  teams: { id: string; name: string }[]
  activeTeamId: string | null
  personalizedDashboardTitle?: string | null
  hasPersonalizedDashboard?: boolean
  children: React.ReactNode
  bare?: boolean
}

export default function DashboardShell({
  userId,
  displayName,
  avatarUrl,
  role,
  teams,
  activeTeamId,
  personalizedDashboardTitle,
  hasPersonalizedDashboard,
  children,
  bare = false,
}: Props) {
  if (bare) {
    return <div className="min-h-screen bg-[#FAFAFA] font-sans antialiased">{children}</div>
  }

  return (
    <CoachChatProvider userId={userId} teamId={activeTeamId}>
      <div id="dashboard-shell" className="min-h-screen bg-[#FAFAFA] font-sans antialiased">
        <DashboardSidebar
          displayName={displayName}
          avatarUrl={avatarUrl}
          role={role}
          teams={teams}
          activeTeamId={activeTeamId}
          personalizedDashboardTitle={personalizedDashboardTitle}
          hasPersonalizedDashboard={hasPersonalizedDashboard}
        />
        <main className="min-h-screen overflow-auto pt-14 dark-scrollbar">
          <div className="px-4 pb-6 sm:px-6 lg:px-10 lg:pb-8 2xl:px-14 2xl:pb-10">
            {children}
          </div>
        </main>
      </div>
    </CoachChatProvider>
  )
}
