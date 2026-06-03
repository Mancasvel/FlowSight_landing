import type { SupabaseClient } from '@supabase/supabase-js'
import {
  decryptEmails,
  encryptEmails,
  encryptJson,
  decryptJson,
  isEncrypted,
} from '@/lib/crypto/encryption'
import { isSchemaMismatchError } from '@/lib/supabase/schemaCompat'

export type TeamNotificationSettings = {
  teamId: string
  dailyEmail: boolean
  weeklyReport: boolean
  realTimeAlerts: boolean
  digestDay: string
  digestTime: string
  digestTimezone: string
  digestRecipients: string[]
}

const DEFAULTS: Omit<TeamNotificationSettings, 'teamId'> = {
  dailyEmail: false,
  weeklyReport: true,
  realTimeAlerts: false,
  digestDay: 'monday',
  digestTime: '09:00',
  digestTimezone: 'Europe/Madrid',
  digestRecipients: [],
}

type DbRow = {
  team_id: string
  daily_email: boolean
  weekly_report: boolean
  real_time_alerts: boolean
  digest_day: string
  digest_time: string
  digest_timezone: string
  digest_recipients_enc: string | null
}

export function rowToSettings(row: DbRow): TeamNotificationSettings {
  return {
    teamId: row.team_id,
    dailyEmail: row.daily_email,
    weeklyReport: row.weekly_report,
    realTimeAlerts: row.real_time_alerts,
    digestDay: row.digest_day,
    digestTime: row.digest_time?.slice(0, 5) ?? '09:00',
    digestTimezone: row.digest_timezone,
    digestRecipients: decryptEmails(row.digest_recipients_enc),
  }
}

export function settingsToDbPayload(
  settings: Partial<TeamNotificationSettings> & { teamId: string }
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    team_id: settings.teamId,
    updated_at: new Date().toISOString(),
  }

  if (settings.dailyEmail !== undefined) payload.daily_email = settings.dailyEmail
  if (settings.weeklyReport !== undefined) payload.weekly_report = settings.weeklyReport
  if (settings.realTimeAlerts !== undefined) payload.real_time_alerts = settings.realTimeAlerts
  if (settings.digestDay !== undefined) payload.digest_day = settings.digestDay
  if (settings.digestTime !== undefined) payload.digest_time = settings.digestTime
  if (settings.digestTimezone !== undefined) payload.digest_timezone = settings.digestTimezone
  if (settings.digestRecipients !== undefined) {
    payload.digest_recipients_enc = encryptEmails(settings.digestRecipients)
  }

  return payload
}

export async function getTeamNotificationSettings(
  supabase: SupabaseClient,
  teamId: string
): Promise<TeamNotificationSettings> {
  const { data, error } = await supabase
    .from('team_notification_settings')
    .select('*')
    .eq('team_id', teamId)
    .maybeSingle()

  if (error) {
    if (isSchemaMismatchError(error)) return { teamId, ...DEFAULTS }
    throw error
  }
  if (!data) return { teamId, ...DEFAULTS }
  return rowToSettings(data as DbRow)
}

export async function upsertTeamNotificationSettings(
  supabase: SupabaseClient,
  settings: Partial<TeamNotificationSettings> & { teamId: string }
): Promise<TeamNotificationSettings> {
  const merged: TeamNotificationSettings = {
    ...(await getTeamNotificationSettings(supabase, settings.teamId)),
    ...settings,
    teamId: settings.teamId,
  }

  const payload = settingsToDbPayload(settings)
  const { data, error } = await supabase
    .from('team_notification_settings')
    .upsert(payload, { onConflict: 'team_id' })
    .select('*')
    .single()

  if (error) {
    if (isSchemaMismatchError(error)) return merged
    throw error
  }
  return rowToSettings(data as DbRow)
}

/** Encrypt arbitrary report metadata for audit logs (recipients list, subject snippet). */
export function encryptReportAudit(meta: { recipients: string[]; subject: string }): string {
  return encryptJson(meta)
}

export function decryptReportAudit(ciphertext: string): { recipients: string[]; subject: string } {
  if (!ciphertext || !isEncrypted(ciphertext)) {
    return { recipients: [], subject: '' }
  }
  return decryptJson(ciphertext)
}
