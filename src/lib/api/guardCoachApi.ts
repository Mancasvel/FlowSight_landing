import type { NextRequest } from 'next/server'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { assertTeamAccess } from '@/lib/coachChat/access'
import {
  checkPromptAllowance,
  formatPromptUsagePayload,
  isTeamAdmin,
  type PromptUsageResult,
} from '@/lib/promptLimits'
import {
  assertCoachBrowserRequest,
  assertCoachClientHeader,
  assertCoachRateLimit,
  CoachApiSecurityError,
  verifyTurnstileToken,
} from '@/lib/api/coachApiSecurity'

export type GuardCoachApiOptions = {
  teamId: string
  /** `ai` enforces subscription + prompt credits + Turnstile (if configured). */
  mode?: 'standard' | 'ai'
  rateScope?: 'chat' | 'upload' | 'api'
  turnstileToken?: string
}

export type GuardCoachApiResult = {
  supabase: SupabaseClient
  user: User
  admin: boolean
  allowance: PromptUsageResult | null
}

export class CoachApiSecurityErrorWithUsage extends CoachApiSecurityError {
  usage: ReturnType<typeof formatPromptUsagePayload>

  constructor(message: string, status: number, allowance: PromptUsageResult) {
    super(message, status)
    this.name = 'CoachApiSecurityErrorWithUsage'
    this.usage = formatPromptUsagePayload(allowance)
  }
}

export async function guardCoachApi(
  req: NextRequest,
  options: GuardCoachApiOptions
): Promise<GuardCoachApiResult> {
  const { teamId, mode = 'standard', rateScope = 'api', turnstileToken } = options

  assertCoachBrowserRequest(req)
  assertCoachClientHeader(req)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new CoachApiSecurityError('Unauthorized', 401)
  }

  assertCoachRateLimit(req, user.id, rateScope)

  if (!teamId) {
    throw new CoachApiSecurityError('teamId is required', 400)
  }

  if (!(await assertTeamAccess(supabase, user.id, teamId))) {
    throw new CoachApiSecurityError('Forbidden', 403)
  }

  const admin = await isTeamAdmin(supabase, user.id, teamId)
  let allowance: PromptUsageResult | null = null

  if (mode === 'ai') {
    await verifyTurnstileToken(turnstileToken, req)
    allowance = await checkPromptAllowance(supabase, user.id, teamId, admin)
    if (!allowance.allowed) {
      throw new CoachApiSecurityErrorWithUsage(
        allowance.reason ?? 'Prompt limit reached',
        429,
        allowance
      )
    }
  }

  return { supabase, user, admin, allowance }
}

export function coachSecurityErrorResponse(err: unknown): Response | null {
  if (err instanceof CoachApiSecurityErrorWithUsage) {
    return Response.json(
      { error: err.message, usage: err.usage },
      { status: err.status }
    )
  }
  if (err instanceof CoachApiSecurityError) {
    return Response.json({ error: err.message }, { status: err.status })
  }
  return null
}
