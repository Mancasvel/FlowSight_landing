import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OnboardingWizard from '@/components/onboarding/OnboardingWizard'
import { resolvePlanId, getPlan } from '@/lib/plans'
import { resolveModeFromPlan } from '@/lib/onboarding/questions'
import { getActiveTeamId } from '@/lib/getActiveTeamId'
import { teamHasDashboardPreferences } from '@/lib/onboarding/hasDashboardPreferences'

export default async function AccountOnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const teamId = await getActiveTeamId(user.id)
  if (!teamId) redirect('/dashboard/onboarding')

  const hasPreferences = await teamHasDashboardPreferences(teamId)
  if (hasPreferences) redirect('/account/my-dashboard')

  const { data: team } = await supabase
    .from('teams')
    .select('name, license_id')
    .eq('id', teamId)
    .single()

  const { data: license } = team?.license_id
    ? await supabase.from('licenses').select('*').eq('id', team.license_id).single()
    : { data: null }

  const planId = resolvePlanId(license)
  const plan = getPlan(planId)
  const maxMembers = license?.max_members ?? 1
  const defaultMode = resolveModeFromPlan(planId, maxMembers)

  return (
    <OnboardingWizard
      variant="preferences-only"
      workspaceName={team?.name ?? 'Workspace'}
      planName={plan.name}
      planId={planId}
      maxMembers={maxMembers}
      defaultMode={defaultMode}
      showSuccess={false}
      teamId={teamId}
    />
  )
}
