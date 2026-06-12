'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isSchemaMismatchError } from '@/lib/supabase/schemaCompat'
import { parseDashboardPreferences } from '@/lib/onboarding/buildDashboard'
import type { DashboardPreferences } from '@/lib/onboarding/types'

export async function completeOnboarding(formData: FormData) {
  const name = formData.get('name') as string
  const jiraProjectKey = (formData.get('jiraProjectKey') as string | null)?.trim() || null
  const preferencesRaw = formData.get('preferences') as string

  if (!name || name.trim() === '') throw new Error('Workspace name is required')

  let preferences: DashboardPreferences | null = null
  if (preferencesRaw) {
    try {
      preferences = parseDashboardPreferences(JSON.parse(preferencesRaw))
    } catch {
      throw new Error('Invalid dashboard preferences')
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) throw new Error('Unauthorized')

  const { data: license, error: licenseError } = await supabase
    .from('licenses')
    .select('*')
    .eq('owner_id', user.id)
    .eq('is_active', true)
    .single()

  if (licenseError || !license) {
    throw new Error('No active license found. Please purchase a plan first.')
  }

  const isPersonal =
    preferences?.mode === 'individual' ||
    license.max_members <= 1

  const teamPayload: Record<string, unknown> = {
    name: name.trim(),
    owner_id: user.id,
    license_id: license.id,
    jira_project_key: jiraProjectKey,
    is_personal: isPersonal,
  }

  if (preferences) {
    teamPayload.dashboard_preferences = preferences
  }

  let teamResult = await supabase.from('teams').insert(teamPayload).select().single()

  if (teamResult.error && isSchemaMismatchError(teamResult.error) && preferences) {
    const { dashboard_preferences: _, ...withoutPrefs } = teamPayload
    teamResult = await supabase.from('teams').insert(withoutPrefs).select().single()
  }

  const { data: team, error: teamError } = teamResult

  if (teamError) {
    console.error('Error creating team:', teamError)
    throw new Error(`Failed to create workspace: ${teamError.message}`)
  }

  const { error: memberError } = await supabase.from('team_members').insert({
    team_id: team.id,
    user_id: user.id,
    role: 'admin',
  })

  if (memberError) {
    console.error('Error adding team member:', memberError)
    throw new Error(`Failed to add member to team: ${memberError.message}`)
  }

  redirect('/account/my-dashboard')
}

/** @deprecated Use completeOnboarding */
export async function createFirstTeam(formData: FormData) {
  return completeOnboarding(formData)
}
