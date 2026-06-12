import { createClient } from '@/lib/supabase/server'
import { isSchemaMismatchError } from '@/lib/supabase/schemaCompat'
import { parseDashboardPreferences } from './buildDashboard'

/** True when the team has user-saved preferences (not inferred defaults). */
export async function teamHasDashboardPreferences(teamId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('teams')
    .select('dashboard_preferences')
    .eq('id', teamId)
    .single()

  if (error) {
    if (isSchemaMismatchError(error)) return false
    return false
  }

  return parseDashboardPreferences(data?.dashboard_preferences) !== null
}

export async function userNeedsDashboardOnboarding(
  userId: string,
  teamId: string | null
): Promise<boolean> {
  if (!teamId) return false
  return !(await teamHasDashboardPreferences(teamId))
}
