import type { PlanId } from '@/lib/plans'
import { mapCheckoutPlan } from '@/lib/plansCheckout'

export type LicenseActivationUpdate = {
  plan_id: PlanId
  plan_type: 'starter' | 'professional' | 'enterprise'
  max_members: number
  is_active: boolean
}

export function buildLicenseActivation(
  planType: string | null | undefined,
  maxMembersOverride?: number
): LicenseActivationUpdate {
  const mapped = mapCheckoutPlan(planType ?? 'teams_pro')
  const maxMembers = maxMembersOverride ?? mapped.maxMembers

  return {
    plan_id: mapped.planId,
    plan_type: mapped.dbPlanType,
    max_members: maxMembers === -1 ? 9999 : maxMembers,
    is_active: true,
  }
}

/** Placeholder license row before Stripe payment completes — must stay inactive/free. */
export function buildPendingLicenseInsert() {
  return {
    plan_id: null,
    plan_type: 'starter' as const,
    max_members: 1,
    is_active: false,
  }
}
