/**
 * Local, offline preview generator for the weekly team report email.
 *
 * This does NOT touch Supabase, Resend, or Azure OpenAI — it feeds clearly-labeled
 * realistic sample data through the *real* production composition logic
 * (`buildProactiveInsights` + `composeWeeklyTeamReport`) and the *real* email
 * templates (`weeklyReportHtml` / `weeklyReportPlainText`), so what you see here
 * is exactly what a manager would receive, minus the DB/AI round-trip.
 *
 * Usage: pnpm preview:weekly-report
 * Output: test-weekly-report-preview.html (and .txt) at the repo root.
 */
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { composeWeeklyTeamReport } from '../src/lib/buildWeeklyTeamReport'
import {
  weeklyReportHtml,
  weeklyReportPlainText,
  weeklyReportSubject,
} from '../src/lib/email/weeklyReportTemplate'
import type {
  FlowStateData,
  ContextLoadData,
  PlanningData,
  MeetingsData,
  WorkflowData,
} from '../src/lib/types/dashboard'

// ---------------------------------------------------------------------------
// SAMPLE DATA — clearly-fake realistic data standing in for a Supabase read.
// Shapes match FlowStateData / ContextLoadData / PlanningData / MeetingsData /
// WorkflowData exactly, so this exercises the same downstream code paths
// (buildProactiveInsights, composeWeeklyTeamReport, templates) as production.
// ---------------------------------------------------------------------------

const SAMPLE_TEAM_NAME = 'Growth Engineering (sample data)'

const flow: FlowStateData = {
  teamFlowScore: 61,
  trend30d: Array.from({ length: 31 }, (_, i) => ({
    date: `2026-07-${String(10 + (i % 20)).padStart(2, '0')}`,
    score: 48 + Math.round(14 * Math.sin(i / 4)) + (i > 24 ? 8 : 0),
  })),
  members: [
    { userId: 'u-ana', displayName: 'Ana Torres', avatarUrl: '', flowScoreToday: 78, timelineToday: [], longestStreakMin: 95, recoveryTimeAvg: 12 },
    { userId: 'u-luis', displayName: 'Luis Fernández', avatarUrl: '', flowScoreToday: 41, timelineToday: [], longestStreakMin: 30, recoveryTimeAvg: 34 },
    { userId: 'u-mia', displayName: 'Mia Chen', avatarUrl: '', flowScoreToday: 66, timelineToday: [], longestStreakMin: 70, recoveryTimeAvg: 18 },
    { userId: 'u-jon', displayName: 'Jon Ibarra', avatarUrl: '', flowScoreToday: 38, timelineToday: [], longestStreakMin: 25, recoveryTimeAvg: 41 },
  ],
}

const context: ContextLoadData = {
  members: [
    { userId: 'u-ana', displayName: 'Ana Torres', avatarUrl: '', activeBacklogs: 2, contextSwitchesPerDay: 3.1, focusStreakHistory: [80, 65, 90, 70, 85], burnoutIndex: 28, burnoutLevel: 'healthy', meetingRatio: 0.12, suggestion: null },
    { userId: 'u-luis', displayName: 'Luis Fernández', avatarUrl: '', activeBacklogs: 4, contextSwitchesPerDay: 7.4, focusStreakHistory: [20, 15, 25, 10, 18], burnoutIndex: 74, burnoutLevel: 'danger', meetingRatio: 0.38, suggestion: 'Reducing active backlogs from 4 → 2 recovers ~3.0h/week' },
    { userId: 'u-mia', displayName: 'Mia Chen', avatarUrl: '', activeBacklogs: 2, contextSwitchesPerDay: 4.0, focusStreakHistory: [60, 55, 62, 58, 64], burnoutIndex: 45, burnoutLevel: 'warning', meetingRatio: 0.21, suggestion: null },
    { userId: 'u-jon', displayName: 'Jon Ibarra', avatarUrl: '', activeBacklogs: 3, contextSwitchesPerDay: 6.8, focusStreakHistory: [22, 18, 20, 15, 19], burnoutIndex: 71, burnoutLevel: 'danger', meetingRatio: 0.33, suggestion: 'Reducing active backlogs from 3 → 1 recovers ~3.0h/week' },
  ],
}

const planning: PlanningData = {
  sprints: [
    { label: 'Sprint 24', sprintId: 'GE-S24', committedHours: 160, actualHours: 148, deepHours: 92, meetingHours: 34, interruptedHours: 22, efficiencyRatio: 0.62, expectedDelivery: 99.2 },
    { label: 'Sprint 25', sprintId: 'GE-S25', committedHours: 160, actualHours: 152, deepHours: 88, meetingHours: 41, interruptedHours: 23, efficiencyRatio: 0.58, expectedDelivery: 92.8 },
  ],
  estimations: [],
  costBreakdown: { meetingsCost: 2050, interruptionCost: 1150, contextCost: 980, total: 4180 },
  perPersonGap: [
    { userId: 'u-luis', displayName: 'Luis Fernández', avatarUrl: '', actualHours: 31, shareHours: 40, gapPercent: -22, likelyCause: 'High meeting load' },
  ],
  costPerHour: 50,
}

const meetings: MeetingsData = {
  impact: { totalMeetingHours: 34, meetingPct: 27, avgRecoveryMin: 24, wastedFragmentsHours: 3.2 },
  focusHeatmap: [],
  suggestedWindows: [
    { day: 2, dayName: 'Wed', hour: 15, intensity: 0.12, reason: 'Low focus activity (12% intensity), ideal for meetings' },
  ],
  flaggedWindows: [
    { day: 1, dayName: 'Tue', hour: 10, intensity: 0.86, hoursRecoverable: 1.7 },
  ],
  standupHealth: { avgDurationMin: 12, blockersRaised: 5, blockersResolved: 4 },
}

const workflow: WorkflowData = {
  members: [
    { userId: 'u-ana', displayName: 'Ana Torres', avatarUrl: '', currentActivity: { category: 'coding', description: 'Implementing checkout retries', jiraTicketId: 'GE-482', capturedAt: new Date().toISOString(), durationSeconds: 1800 }, entries: [] },
    { userId: 'u-mia', displayName: 'Mia Chen', avatarUrl: '', currentActivity: { category: 'debugging', description: 'Investigating webhook latency', jiraTicketId: 'GE-490', capturedAt: new Date().toISOString(), durationSeconds: 900 }, entries: [] },
  ],
}

// ---------------------------------------------------------------------------
// REAL production logic from here on — no more sample data.
// ---------------------------------------------------------------------------

const weekEnd = new Date('2026-08-09T23:59:59.999Z') // previous Sunday
const weekStart = new Date('2026-08-03T00:00:00.000Z') // previous Monday

function buildVariant(planId: 'teams_simple' | 'teams_pro', aiNarrativeText?: string) {
  return composeWeeklyTeamReport({
    teamName: SAMPLE_TEAM_NAME,
    planId,
    weekStart,
    weekEnd,
    flow,
    context,
    planning,
    meetings,
    workflow,
    aiNarrativeText,
  })
}

// "basic" tier (Teams Simple plan) — deterministic summary, no AI narrative.
const basicReport = buildVariant('teams_simple')

// "full" tier (Teams Pro / Enterprise) — with a sample AI narrative in the exact
// format WEEKLY_REPORT_SYSTEM_PROMPT asks the model to produce (2 paragraphs +
// 3 "• " bullets), clearly labeled as sample text since no live Azure OpenAI
// call is made here.
const sampleAiNarrative = `This week Growth Engineering held a 61% team flow score, up from a rougher start to the sprint, but the average hides a real split: Ana and Mia are in solid deep-work rhythm while Luis and Jon are both flagged for burnout risk (74 and 71) driven by 4 and 3 concurrent backlogs and meeting ratios above 30%.

Meetings ate 27% of tracked time this week (34h), with Tuesday 10:00 standing out as a high-focus slot that's still getting booked over — that's the single most recoverable block on the calendar. Sprint 25 delivered at 58% efficiency against a 160h commitment, slightly down from Sprint 24's 62%, mostly explained by the added meeting load.

• Move recurring syncs out of the Tuesday 10:00 deep-work window; Wednesday 15:00 has near-zero focus activity and is a better fit.
• Pair with Luis and Jon this week to cut active backlogs from 4→2 and 3→1 respectively — modeled to recover ~3h/week each.
• Re-baseline Sprint 26's commitment slightly below 160h until meeting load trends back under 20%.`

const fullReport = buildVariant('teams_pro', sampleAiNarrative)

// ---------------------------------------------------------------------------
// Render + write preview files
// ---------------------------------------------------------------------------

function labelPreview(html: string, badge: string): string {
  const banner = `
  <div style="max-width:640px;margin:0 auto 12px;padding:10px 16px;background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;font-family:system-ui,sans-serif;font-size:13px;color:#92400e;">
    ⚠️ <strong>PREVIEW / TEST ARTIFACT</strong> — ${badge}. Built with clearly-fake sample data via <code>composeWeeklyTeamReport</code> (real production logic). Not a real email, never sent to any recipient.
  </div>`
  return html.replace('<body', `${banner}\n<body`)
}

const basicHtml = labelPreview(weeklyReportHtml(basicReport), 'Basic tier (Teams Simple plan) — deterministic summary, no AI narrative')
const fullHtml = labelPreview(weeklyReportHtml(fullReport), 'Full tier (Teams Pro / Enterprise plan) — with sample AI narrative text')

const combinedHtml = `${basicHtml}
<hr style="max-width:640px;margin:40px auto;border:none;border-top:2px dashed #d4d4d8;">
${fullHtml.replace(/^[\s\S]*?<body[^>]*>/, '<div>').replace('</body>\n</html>', '</div>')}`

const outHtmlPath = resolve(__dirname, '..', 'test-weekly-report-preview.html')
const outTextPath = resolve(__dirname, '..', 'test-weekly-report-preview.txt')

writeFileSync(outHtmlPath, combinedHtml, 'utf8')
writeFileSync(
  outTextPath,
  [
    '=== BASIC TIER (Teams Simple) — plain-text fallback ===',
    weeklyReportPlainText(basicReport),
    '',
    '=== FULL TIER (Teams Pro / Enterprise) — plain-text fallback ===',
    weeklyReportPlainText(fullReport),
  ].join('\n'),
  'utf8'
)

console.log('Generated weekly report preview:')
console.log(` - ${outHtmlPath}`)
console.log(` - ${outTextPath}`)
console.log('')
console.log(`Basic subject:  ${weeklyReportSubject(basicReport)}`)
console.log(`Full subject:   ${weeklyReportSubject(fullReport)}`)
console.log(`Basic insights generated: ${basicReport.insights.length}`)
console.log(`Full insights generated:  ${fullReport.insights.length}`)
