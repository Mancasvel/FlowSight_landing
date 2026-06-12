'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getActiveTeamId } from '@/lib/getActiveTeamId'
import { parseDashboardPreferences } from '@/lib/onboarding/buildDashboard'
import type { DashboardPreferences } from '@/lib/onboarding/types'

export async function saveDashboardPreferences(formData: FormData) {
  const preferencesRaw = formData.get('preferences') as string
  const teamIdOverride = formData.get('teamId') as string | null

  if (!preferencesRaw) throw new Error('Dashboard preferences are required')

  let preferences: DashboardPreferences
  try {
    const parsed = parseDashboardPreferences(JSON.parse(preferencesRaw))
    if (!parsed) throw new Error('Invalid shape')
    preferences = parsed
  } catch {
    throw new Error('Invalid dashboard preferences')
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) throw new Error('Unauthorized')

  const teamId = teamIdOverride || (await getActiveTeamId(user.id))
  if (!teamId) throw new Error('No workspace found')

  const { data: team } = await supabase
    .from('teams')
    .select('id, owner_id')
    .eq('id', teamId)
    .single()

  if (!team) throw new Error('Workspace not found')

  const { data: membership } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .maybeSingle()

  const isOwner = team.owner_id === user.id
  const isAdmin = membership?.role === 'admin'

  if (!isOwner && !isAdmin) {
    throw new Error('Only workspace owners or admins can update dashboard preferences')
  }

  const { error } = await supabase
    .from('teams')
    .update({
      dashboard_preferences: preferences,
      is_personal: preferences.mode === 'individual',
    })
    .eq('id', teamId)

  if (error) throw new Error(`Failed to save preferences: ${error.message}`)

  redirect('/account/my-dashboard')
}
