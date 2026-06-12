import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OnboardingWizard from '@/components/onboarding/OnboardingWizard'
import { resolvePlanId, getPlan } from '@/lib/plans'
import { resolveModeFromPlan } from '@/lib/onboarding/questions'

type SearchParams = Promise<{ success?: string }>

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: teams } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)

  if (teams && teams.length > 0) {
    redirect('/dashboard')
  }

  const { data: license } = await supabase
    .from('licenses')
    .select('*')
    .eq('owner_id', user.id)
    .eq('is_active', true)
    .single()

  if (!license) {
    redirect('/dashboard/pricing')
  }

  const planId = resolvePlanId(license)
  const plan = getPlan(planId)
  const defaultMode = resolveModeFromPlan(planId, license.max_members)

  return (
    <OnboardingWizard
      planName={plan.name}
      planId={planId}
      maxMembers={license.max_members}
      defaultMode={defaultMode}
      showSuccess={params.success === 'true'}
    />
  )
}
