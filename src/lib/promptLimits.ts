import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getPlan, planAllowsCoach, resolvePlanId, type PlanId } from '@/lib/plans'
import { isSchemaMismatchError } from '@/lib/supabase/schemaCompat'

export type PromptUsageResult = {
  allowed: boolean
  used: number
  limit: number
  remaining: number
  poolUsed?: number
  poolLimit?: number
  planId: PlanId
  reason?: string
}

export type PromptUsagePayload = {
  used: number
  limit: number
  remaining: number
  planId: PlanId
  poolUsed?: number
  poolLimit?: number
}

export function formatPromptUsagePayload(allowance: PromptUsageResult): PromptUsagePayload {
  return {
    used: allowance.used,
    limit: allowance.limit,
    remaining: allowance.remaining,
    planId: allowance.planId,
    poolUsed: allowance.poolUsed,
    poolLimit: allowance.poolLimit,
  }
}

function periodStart(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
}

export function createServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase service credentials not configured')
  return createClient(url, key)
}

export async function getTeamPlan(
  supabase: SupabaseClient,
  teamId: string
): Promise<{ planId: PlanId; licenseId: string | null }> {
  const { data: team } = await supabase
    .from('teams')
    .select('license_id')
    .eq('id', teamId)
    .single()

  if (!team?.license_id) return { planId: 'free', licenseId: null }

  const { data: license, error } = await supabase
    .from('licenses')
    .select('plan_id, plan_type, max_members, is_active, expires_at')
    .eq('id', team.license_id)
    .single()

  if (error || !license) return { planId: 'free', licenseId: team.license_id }

  const expired = license.expires_at && new Date(license.expires_at) < new Date()
  if (!license.is_active || expired) return { planId: 'free', licenseId: team.license_id }

  return { planId: resolvePlanId(license), licenseId: team.license_id }
}

async function getUserPromptCount(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
  period: string
): Promise<number | null> {
  const { data, error } = await supabase
    .from('prompt_usage')
    .select('user_prompt_count')
    .eq('user_id', userId)
    .eq('team_id', teamId)
    .eq('period_start', period)
    .maybeSingle()

  if (error && isSchemaMismatchError(error)) return null
  if (error) throw error
  return data?.user_prompt_count ?? 0
}

async function getTeamPoolCount(
  supabase: SupabaseClient,
  teamId: string,
  period: string
): Promise<number | null> {
  const { data, error } = await supabase
    .from('team_prompt_pool_usage')
    .select('pool_count')
    .eq('team_id', teamId)
    .eq('period_start', period)
    .maybeSingle()

  if (error && isSchemaMismatchError(error)) return null
  if (error) throw error
  return data?.pool_count ?? 0
}

function allowanceWithoutMetering(planId: PlanId): PromptUsageResult {
  const plan = getPlan(planId)
  return {
    allowed: true,
    used: 0,
    limit: plan.promptsPerUserMonth,
    remaining: plan.promptsPerUserMonth,
    planId,
  }
}

export async function checkPromptAllowance(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
  isAdmin: boolean
): Promise<PromptUsageResult> {
  const { planId } = await getTeamPlan(supabase, teamId)
  const plan = getPlan(planId)
  const period = periodStart()

  if (!planAllowsCoach(planId)) {
    return {
      allowed: false,
      used: 0,
      limit: 0,
      remaining: 0,
      planId,
      reason: 'Upgrade to a Pro plan to use the AI coach.',
    }
  }

  if (plan.coachAdminOnly && !isAdmin) {
    return {
      allowed: false,
      used: 0,
      limit: plan.promptsPerUserMonth,
      remaining: 0,
      planId,
      reason: 'AI coach on this plan is available to team admins only.',
    }
  }

  const userUsedRaw = await getUserPromptCount(supabase, userId, teamId, period)
  if (userUsedRaw === null) {
    if (process.env.NODE_ENV === 'production') {
      return {
        allowed: false,
        used: 0,
        limit: plan.promptsPerUserMonth,
        remaining: 0,
        planId,
        reason: 'Coach usage metering is unavailable. Contact support.',
      }
    }
    return allowanceWithoutMetering(planId)
  }

  const userUsed = userUsedRaw
  const userLimit = plan.promptsPerUserMonth

  if (userUsed < userLimit) {
    return {
      allowed: true,
      used: userUsed,
      limit: userLimit,
      remaining: userLimit - userUsed,
      planId,
    }
  }

  if (plan.teamPromptPoolMonth > 0) {
    const poolUsedRaw = await getTeamPoolCount(supabase, teamId, period)
    if (poolUsedRaw === null) {
      if (process.env.NODE_ENV === 'production') {
        return {
          allowed: false,
          used: userUsed,
          limit: userLimit,
          remaining: 0,
          planId,
          reason: 'Coach usage metering is unavailable. Contact support.',
        }
      }
      return allowanceWithoutMetering(planId)
    }
    const poolUsed = poolUsedRaw
    const poolLimit = plan.teamPromptPoolMonth
    if (poolUsed < poolLimit) {
      return {
        allowed: true,
        used: userUsed,
        limit: userLimit,
        remaining: 0,
        poolUsed,
        poolLimit,
        planId,
      }
    }
    return {
      allowed: false,
      used: userUsed,
      limit: userLimit,
      remaining: 0,
      poolUsed,
      poolLimit,
      planId,
      reason: 'Monthly coach limit reached. Resets on the 1st.',
    }
  }

  return {
    allowed: false,
    used: userUsed,
    limit: userLimit,
    remaining: 0,
    planId,
    reason: 'Monthly coach limit reached. Resets on the 1st.',
  }
}

export async function incrementPromptUsage(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
  planId: PlanId
): Promise<void> {
  const plan = getPlan(planId)
  const period = periodStart()

  const userUsedRaw = await getUserPromptCount(supabase, userId, teamId, period)
  if (userUsedRaw === null) return

  const userUsed = userUsedRaw

  if (userUsed < plan.promptsPerUserMonth) {
    const { error } = await supabase.from('prompt_usage').upsert(
      {
        user_id: userId,
        team_id: teamId,
        period_start: period,
        user_prompt_count: userUsed + 1,
      },
      { onConflict: 'user_id,team_id,period_start' }
    )
    if (error && !isSchemaMismatchError(error)) throw error
    return
  }

  if (plan.teamPromptPoolMonth > 0) {
    const poolUsedRaw = await getTeamPoolCount(supabase, teamId, period)
    if (poolUsedRaw === null) return
    const { error } = await supabase.from('team_prompt_pool_usage').upsert(
      {
        team_id: teamId,
        period_start: period,
        pool_count: poolUsedRaw + 1,
      },
      { onConflict: 'team_id,period_start' }
    )
    if (error && !isSchemaMismatchError(error)) throw error
  }
}

export async function isTeamAdmin(
  supabase: SupabaseClient,
  userId: string,
  teamId: string
): Promise<boolean> {
  const { data: team } = await supabase
    .from('teams')
    .select('owner_id')
    .eq('id', teamId)
    .single()

  if (team?.owner_id === userId) return true

  const { data: member } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', userId)
    .maybeSingle()

  return member?.role === 'admin'
}
