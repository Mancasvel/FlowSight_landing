import { createClient } from '@/lib/supabase/server'
import { isSchemaMismatchError } from '@/lib/supabase/schemaCompat'
import { resolvePlanId } from '@/lib/plans'
import {
  getDefaultDashboardPreferences,
  parseDashboardPreferences,
} from './buildDashboard'
import type { DashboardPreferences } from './types'

type LicenseRow = {
  plan_id?: string | null
  plan_type?: string | null
  max_members?: number
  is_active?: boolean
} | null

function defaultsFromLicense(license: LicenseRow): DashboardPreferences {
  const planId = resolvePlanId(license)
  const maxMembers = license?.max_members ?? 1
  return getDefaultDashboardPreferences(planId, maxMembers)
}

export async function getDashboardPreferencesForTeam(
  teamId: string
): Promise<DashboardPreferences | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('teams')
    .select('dashboard_preferences, license_id, licenses(plan_id, plan_type, max_members, is_active)')
    .eq('id', teamId)
    .single()

  if (error) {
    if (isSchemaMismatchError(error)) {
      const { data: fallback } = await supabase
        .from('teams')
        .select('license_id, licenses(plan_id, plan_type, max_members, is_active)')
        .eq('id', teamId)
        .single()

      if (!fallback) return null
      return defaultsFromLicense(fallback.licenses as LicenseRow)
    }
    console.error('getDashboardPreferencesForTeam:', error)
    return null
  }

  const parsed = parseDashboardPreferences(data?.dashboard_preferences)
  if (parsed) return parsed

  return defaultsFromLicense(data?.licenses as LicenseRow)
}

/** Returns stored preferences only — null if the user never completed dashboard onboarding. */
export async function getStoredDashboardPreferences(
  teamId: string
): Promise<DashboardPreferences | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('teams')
    .select('dashboard_preferences')
    .eq('id', teamId)
    .single()

  if (error) {
    if (isSchemaMismatchError(error)) return null
    return null
  }

  return parseDashboardPreferences(data?.dashboard_preferences)
}

export async function getDashboardPreferencesForUser(
  userId: string,
  teamId: string | null
): Promise<DashboardPreferences | null> {
  if (!teamId) return null
  return getDashboardPreferencesForTeam(teamId)
}
