import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { loadDashboardShellProps } from '@/lib/dashboard/loadShellProps'
import { userNeedsDashboardOnboarding } from '@/lib/onboarding/hasDashboardPreferences'

export const dynamic = 'force-dynamic'

const ONBOARDING_PATH = '/dashboard/onboarding'
const PRICING_PATH = '/dashboard/pricing'
const ACCOUNT_ONBOARDING_PATH = '/account/onboarding'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headerStore = await headers()
  const pathname = headerStore.get('x-pathname') ?? ''
  const shell = await loadDashboardShellProps()

  const isOnboarding = pathname.startsWith(ONBOARDING_PATH)
  const isPricing = pathname.startsWith(PRICING_PATH)

  if (shell.teams.length === 0 && !isOnboarding && !isPricing) {
    const supabase = await createClient()
    const { data: license } = await supabase
      .from('licenses')
      .select('id')
      .eq('owner_id', shell.userId)
      .eq('is_active', true)
      .maybeSingle()

    if (license) {
      redirect(ONBOARDING_PATH)
    }
  }

  const needsPreferences =
    shell.activeTeamId &&
    !isOnboarding &&
    !isPricing &&
    !pathname.startsWith('/account') &&
    (await userNeedsDashboardOnboarding(shell.userId, shell.activeTeamId))

  if (needsPreferences && pathname === '/dashboard') {
    redirect(ACCOUNT_ONBOARDING_PATH)
  }

  if (isOnboarding) {
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
