import { PLANS, type PlanId } from '@/lib/plans'

export const CHECKOUT_PLAN_IDS: PlanId[] = [
  'individual_pro',
  'teams_simple',
  'teams_pro',
  'enterprise',
]

/** Map checkout planType string → DB plan_id + legacy plan_type */
export function mapCheckoutPlan(planType: string): {
  planId: PlanId
  dbPlanType: 'starter' | 'professional' | 'enterprise'
  maxMembers: number
  priceCents: number
  name: string
} {
  const aliases: Record<string, PlanId> = {
    individual_pro: 'individual_pro',
    'individual-pro': 'individual_pro',
    teams_simple: 'teams_simple',
    'teams-simple': 'teams_simple',
    teams_pro: 'teams_pro',
    'teams-pro': 'teams_pro',
    enterprise: 'enterprise',
    basic: 'teams_simple',
    pro: 'teams_pro',
    starter: 'teams_simple',
    professional: 'teams_pro',
  }

  const planId = aliases[planType] ?? 'teams_pro'
  const plan = PLANS[planId]

  return {
    planId,
    dbPlanType: plan.dbPlanType,
    maxMembers: plan.maxMembers,
    priceCents: plan.priceEur * 100,
    name: plan.name,
  }
}
