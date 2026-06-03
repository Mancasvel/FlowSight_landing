/** Commercial plan definitions — single source of truth for pricing, limits and features. */

export type PlanId =
  | 'free'
  | 'individual_pro'
  | 'teams_simple'
  | 'teams_pro'
  | 'enterprise'

export type WeeklyReportLevel = 'none' | 'personal' | 'basic' | 'full' | 'whitelabel'

export type PlanConfig = {
  id: PlanId
  name: string
  priceEur: number
  stripePriceEnvKey: string | null
  /** Legacy licenses.plan_type value written on checkout */
  dbPlanType: 'starter' | 'professional' | 'enterprise'
  promptsPerUserMonth: number
  teamPromptPoolMonth: number
  coachAdminOnly: boolean
  weeklyReport: WeeklyReportLevel
  dataRetentionDays: number
  maxMembers: number
}

export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    priceEur: 0,
    stripePriceEnvKey: null,
    dbPlanType: 'starter',
    promptsPerUserMonth: 0,
    teamPromptPoolMonth: 0,
    coachAdminOnly: false,
    weeklyReport: 'none',
    dataRetentionDays: 7,
    maxMembers: 1,
  },
  individual_pro: {
    id: 'individual_pro',
    name: 'Pro Individual',
    priceEur: 12,
    stripePriceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_INDIVIDUAL_PRO',
    dbPlanType: 'starter',
    promptsPerUserMonth: 150,
    teamPromptPoolMonth: 0,
    coachAdminOnly: false,
    weeklyReport: 'personal',
    dataRetentionDays: 90,
    maxMembers: 1,
  },
  teams_simple: {
    id: 'teams_simple',
    name: 'Teams Simple',
    priceEur: 12,
    stripePriceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_TEAMS_SIMPLE',
    dbPlanType: 'starter',
    promptsPerUserMonth: 50,
    teamPromptPoolMonth: 0,
    coachAdminOnly: true,
    weeklyReport: 'basic',
    dataRetentionDays: 90,
    maxMembers: 10,
  },
  teams_pro: {
    id: 'teams_pro',
    name: 'Teams Pro',
    priceEur: 16,
    stripePriceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_TEAMS_PRO',
    dbPlanType: 'professional',
    promptsPerUserMonth: 250,
    teamPromptPoolMonth: 500,
    coachAdminOnly: false,
    weeklyReport: 'full',
    dataRetentionDays: 365,
    maxMembers: 50,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    priceEur: 50,
    stripePriceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE',
    dbPlanType: 'enterprise',
    promptsPerUserMonth: 500,
    teamPromptPoolMonth: 2000,
    coachAdminOnly: false,
    weeklyReport: 'whitelabel',
    dataRetentionDays: -1,
    maxMembers: -1,
  },
}

const LEGACY_PLAN_TYPE_MAP: Record<string, PlanId> = {
  starter: 'teams_simple',
  professional: 'teams_pro',
  enterprise: 'enterprise',
  basic: 'teams_simple',
  pro: 'teams_pro',
}

/** Resolve commercial plan from license row (plan_id preferred, legacy plan_type fallback). */
export function resolvePlanId(license: {
  plan_id?: string | null
  plan_type?: string | null
  is_active?: boolean
} | null): PlanId {
  if (!license?.is_active) return 'free'
  if (license.plan_id && license.plan_id in PLANS) {
    return license.plan_id as PlanId
  }
  if (license.plan_type && LEGACY_PLAN_TYPE_MAP[license.plan_type]) {
    return LEGACY_PLAN_TYPE_MAP[license.plan_type]
  }
  return 'free'
}

export function getPlan(planId: PlanId): PlanConfig {
  return PLANS[planId]
}

export function getStripePriceId(planId: PlanId): string | undefined {
  const plan = PLANS[planId]
  if (!plan.stripePriceEnvKey) return undefined
  return process.env[plan.stripePriceEnvKey]
}

export function checkoutPlanIds(): PlanId[] {
  return ['individual_pro', 'teams_simple', 'teams_pro', 'enterprise']
}

/** Plans eligible for AI coach chat */
export function planAllowsCoach(planId: PlanId): boolean {
  return PLANS[planId].promptsPerUserMonth > 0
}

/** Plans with weekly email report (basic or full) */
export function planAllowsWeeklyReport(planId: PlanId): boolean {
  const level = PLANS[planId].weeklyReport
  return level !== 'none'
}

export function planHasFullWeeklyReport(planId: PlanId): boolean {
  const level = PLANS[planId].weeklyReport
  return level === 'full' || level === 'whitelabel'
}
