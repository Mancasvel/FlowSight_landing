import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { loadDashboardShellProps } from '@/lib/dashboard/loadShellProps'

export const dynamic = 'force-dynamic'

const ONBOARDING_PATH = '/account/onboarding'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = (await headers()).get('x-pathname') ?? ''
  const shell = await loadDashboardShellProps()

  if (!shell.userId) redirect('/login')

  if (pathname.startsWith(ONBOARDING_PATH)) {
    return <div className="min-h-screen font-sans antialiased">{children}</div>
  }

  return (
    <DashboardShell
      userId={shell.userId}
      displayName={shell.displayName}
      avatarUrl={shell.avatarUrl}
      role={shell.role}
      teams={shell.teams}
      activeTeamId={shell.activeTeamId}
      personalizedDashboardTitle={shell.personalizedDashboardTitle}
      hasPersonalizedDashboard={shell.hasPersonalizedDashboard}
    >
      {children}
    </DashboardShell>
  )
}
