import { createClient } from '@/lib/supabase/server'
import { planAllowsCoach, resolvePlanId } from '@/lib/plans'
import { getTeamPlan } from '@/lib/promptLimits'

/** True when the user or their active team has a non-expired paid plan with coach access. */
export async function userHasActivePaidLicense(
  userId: string,
  teamId?: string | null
): Promise<boolean> {
  const supabase = await createClient()

  if (teamId) {
    const { planId } = await getTeamPlan(supabase, teamId)
    if (planAllowsCoach(planId)) return true
  }

  const { data: license } = await supabase
    .from('licenses')
    .select('plan_id, plan_type, max_members, is_active, expires_at')
    .eq('owner_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!license) return false

  const expired = license.expires_at && new Date(license.expires_at) < new Date()
  if (expired) return false

  return planAllowsCoach(resolvePlanId(license))
}
