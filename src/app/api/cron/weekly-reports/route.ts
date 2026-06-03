import { NextResponse } from 'next/server'
import {
  createServiceClient,
  getTeamPlan,
} from '@/lib/promptLimits'
import {
  buildWeeklyTeamReport,
  getPreviousWeekBounds,
} from '@/lib/buildWeeklyTeamReport'
import {
  getTeamNotificationSettings,
  encryptReportAudit,
} from '@/lib/teamNotifications'
import { sendEmail } from '@/lib/email/resend'
import {
  weeklyReportHtml,
  weeklyReportPlainText,
  weeklyReportSubject,
} from '@/lib/email/weeklyReportTemplate'
import { planAllowsWeeklyReport, planHasFullWeeklyReport } from '@/lib/plans'
import { encrypt } from '@/lib/crypto/encryption'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

const DAY_INDEX: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

function authorizeCron(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  if (!process.env.CRON_SECRET) return true
  return authHeader === `Bearer ${process.env.CRON_SECRET}`
}

function isDigestDueToday(
  digestDay: string,
  digestTime: string,
  timezone: string,
  now = new Date()
): boolean {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    const parts = formatter.formatToParts(now)
    const weekday = parts.find((p) => p.type === 'weekday')?.value?.toLowerCase() ?? ''
    const hour = parts.find((p) => p.type === 'hour')?.value ?? '00'
    const minute = parts.find((p) => p.type === 'minute')?.value ?? '00'
    const currentTime = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`
    const targetDay = digestDay.toLowerCase()
    const currentIndex = DAY_INDEX[weekday] ?? -1
    const targetIndex = DAY_INDEX[targetDay]

    if (targetIndex !== currentIndex) return false

    const [th, tm] = digestTime.split(':').map(Number)
    const [ch, cm] = currentTime.split(':').map(Number)
    const targetMins = th * 60 + tm
    const currentMins = ch * 60 + cm
    return currentMins >= targetMins && currentMins < targetMins + 60
  } catch {
    return digestDay.toLowerCase() === 'monday'
  }
}

export async function GET(request: Request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { weekStart, weekEnd } = getPreviousWeekBounds()
  const weekStartStr = weekStart.toISOString().slice(0, 10)

  const { data: settingsRows, error: settingsError } = await supabase
    .from('team_notification_settings')
    .select('team_id, weekly_report, digest_day, digest_time, digest_timezone, digest_recipients_enc')
    .eq('weekly_report', true)

  if (settingsError) {
    return NextResponse.json({ error: settingsError.message }, { status: 500 })
  }

  const results: { teamId: string; status: string; error?: string }[] = []

  for (const row of settingsRows ?? []) {
    const teamId = row.team_id

    try {
      const notif = await getTeamNotificationSettings(supabase, teamId)

      if (!isDigestDueToday(notif.digestDay, notif.digestTime, notif.digestTimezone)) {
        results.push({ teamId, status: 'skipped_not_due' })
        continue
      }

      const { data: existingLog } = await supabase
        .from('weekly_report_logs')
        .select('id')
        .eq('team_id', teamId)
        .eq('week_start', weekStartStr)
        .eq('status', 'sent')
        .maybeSingle()

      if (existingLog) {
        results.push({ teamId, status: 'skipped_already_sent' })
        continue
      }

      const { data: team } = await supabase
        .from('teams')
        .select('name, owner_id')
        .eq('id', teamId)
        .single()

      if (!team) {
        results.push({ teamId, status: 'skipped_no_team' })
        continue
      }

      const { planId } = await getTeamPlan(supabase, teamId)
      if (!planAllowsWeeklyReport(planId)) {
        results.push({ teamId, status: 'skipped_plan' })
        continue
      }

      const report = await buildWeeklyTeamReport({
        teamId,
        teamName: team.name,
        planId,
        weekStart,
        weekEnd,
        includeAiNarrative: planHasFullWeeklyReport(planId),
      })

      const { data: ownerAuth } = await supabase.auth.admin.getUserById(team.owner_id)
      const ownerEmail = ownerAuth?.user?.email

      const recipients = [
        ...(ownerEmail ? [ownerEmail] : []),
        ...notif.digestRecipients,
      ]

      if (recipients.length === 0) {
        results.push({ teamId, status: 'skipped_no_recipients' })
        continue
      }

      const subject = weeklyReportSubject(report)
      await sendEmail({
        to: recipients,
        subject,
        html: weeklyReportHtml(report),
        text: weeklyReportPlainText(report),
      })

      const auditEnc = encryptReportAudit({ recipients, subject })

      await supabase.from('weekly_report_logs').upsert(
        {
          team_id: teamId,
          week_start: weekStartStr,
          status: 'sent',
          audit_enc: auditEnc,
          sent_at: new Date().toISOString(),
          error_message: null,
        },
        { onConflict: 'team_id,week_start' }
      )

      results.push({ teamId, status: 'sent' })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      await supabase.from('weekly_report_logs').upsert(
        {
          team_id: teamId,
          week_start: weekStartStr,
          status: 'failed',
          error_message: encrypt(message.slice(0, 500)),
          sent_at: new Date().toISOString(),
        },
        { onConflict: 'team_id,week_start' }
      )
      results.push({ teamId, status: 'failed', error: message })
    }
  }

  return NextResponse.json({
    weekStart: weekStartStr,
    processed: results.length,
    results,
  })
}
