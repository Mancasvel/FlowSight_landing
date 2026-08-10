import type { SupabaseClient } from '@supabase/supabase-js'
import { buildProactiveInsights, type ProactiveInsight } from '@/lib/buildProactiveInsights'
import {
  getFlowStateData,
  getContextLoadData,
  getPlanningData,
  getMeetingsData,
  getWorkflowData,
} from '@/lib/dashboardData'
import { kimiChatPlain, WEEKLY_REPORT_SYSTEM_PROMPT } from '@/lib/kimi/client'
import { getPlan, planHasFullWeeklyReport, type PlanId } from '@/lib/plans'
import type {
  FlowStateData,
  ContextLoadData,
  PlanningData,
  MeetingsData,
  WorkflowData,
} from '@/lib/types/dashboard'

export type WeeklyReportSection = {
  title: string
  body: string
  bullets?: string[]
}

export type WeeklyTeamReport = {
  teamName: string
  weekLabel: string
  weekStart: string
  weekEnd: string
  planId: PlanId
  executiveSummary: string
  recommendations: string[]
  sections: WeeklyReportSection[]
  insights: ProactiveInsight[]
}

function formatWeekRange(weekStart: Date, weekEnd: Date): string {
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  return `${weekStart.toLocaleDateString('en-GB', opts)} – ${weekEnd.toLocaleDateString('en-GB', opts)}`
}

function insightSections(insights: ProactiveInsight[]): WeeklyReportSection[] {
  const groups: Record<string, ProactiveInsight[]> = {}
  for (const i of insights) {
    if (!groups[i.kind]) groups[i.kind] = []
    groups[i.kind].push(i)
  }

  const labels: Record<string, string> = {
    focus: 'Focus & flow',
    activity: 'Live activity',
    meeting: 'Meetings',
    planning: 'Sprint & planning',
    suggestion: 'Proactive suggestions',
    team: 'Team health',
  }

  return Object.entries(groups).map(([kind, items]) => ({
    title: labels[kind] ?? kind,
    body: items.map((i) => `${i.title}: ${i.body}`).join('\n\n'),
  }))
}

function parseRecommendations(aiText: string): { summary: string; bullets: string[] } {
  const lines = aiText.split('\n').map((l) => l.trim()).filter(Boolean)
  const bullets = lines.filter((l) => l.startsWith('•') || l.startsWith('-') || l.startsWith('*'))
  const summaryLines = lines.filter((l) => !l.startsWith('•') && !l.startsWith('-') && !l.startsWith('*'))
  return {
    summary: summaryLines.join('\n\n'),
    bullets: bullets.map((b) => b.replace(/^[-•*]\s*/, '')),
  }
}

export type WeeklyReportComposeInput = {
  teamName: string
  planId: PlanId
  weekStart: Date
  weekEnd: Date
  flow: FlowStateData
  context: ContextLoadData
  planning: PlanningData
  meetings: MeetingsData
  workflow: WorkflowData
  /** Raw AI narrative text, already fetched by the caller. Omit to use the deterministic (non-AI) summary — this is also the fallback used when the AI call fails. */
  aiNarrativeText?: string
}

/**
 * Pure composition of a {@link WeeklyTeamReport} from already-fetched team analytics
 * data. Contains no I/O (no Supabase reads, no LLM calls), which makes it safe to
 * exercise with hand-built or historical data — e.g. local report previews, or
 * regenerating a past week's report from cached data.
 *
 * `buildWeeklyTeamReport` below owns fetching the inputs (and the optional AI
 * narrative call) and simply delegates the assembly to this function.
 */
export function composeWeeklyTeamReport(input: WeeklyReportComposeInput): WeeklyTeamReport {
  const { teamName, planId, weekStart, weekEnd, flow, context, planning, meetings, workflow, aiNarrativeText } =
    input

  const insights = buildProactiveInsights({ flow, context, planning, meetings, workflow })
  const sections = insightSections(insights)

  let executiveSummary: string
  let recommendations: string[]

  if (aiNarrativeText) {
    const parsed = parseRecommendations(aiNarrativeText)
    executiveSummary = parsed.summary || aiNarrativeText
    recommendations =
      parsed.bullets.length > 0
        ? parsed.bullets
        : [
            'Protect a shared focus block mid-week.',
            'Review meeting load for members with low flow scores.',
            'Check sprint delivery against committed hours.',
          ]
  } else {
    executiveSummary = insights[0]
      ? `${insights[0].title}. ${insights[0].body}`
      : `Team flow score: ${flow.teamFlowScore}%.`
    recommendations = insights.slice(0, 3).map((i) => i.title)
  }

  const plan = getPlan(planId)

  sections.unshift({
    title: 'Week at a glance',
    body: `Team flow score: ${flow.teamFlowScore}%. Meeting load: ${meetings.impact.meetingPct}% of tracked time. Plan: ${plan.name}.`,
  })

  return {
    teamName,
    weekLabel: formatWeekRange(weekStart, weekEnd),
    weekStart: weekStart.toISOString().slice(0, 10),
    weekEnd: weekEnd.toISOString().slice(0, 10),
    planId,
    executiveSummary,
    recommendations,
    sections,
    insights,
  }
}

export async function buildWeeklyTeamReport(params: {
  teamId: string
  teamName: string
  planId: PlanId
  weekStart: Date
  weekEnd: Date
  includeAiNarrative: boolean
  /**
   * Supabase client used to read team analytics data. The cron that triggers
   * this report has no user session, so callers MUST pass a service-role
   * client here — otherwise RLS policies (which key off `auth.uid()`) will
   * silently return empty data for every team.
   */
  supabase: SupabaseClient
}): Promise<WeeklyTeamReport> {
  const { teamId, teamName, planId, weekStart, weekEnd, includeAiNarrative, supabase } = params
  const now = weekEnd

  const [flow, context, planning, meetings, workflow] = await Promise.all([
    getFlowStateData(teamId, now, supabase),
    getContextLoadData(teamId, weekStart, now, supabase),
    getPlanningData(teamId, 4, supabase),
    getMeetingsData(teamId, weekStart, now, supabase),
    getWorkflowData(teamId, now, supabase),
  ])

  let aiNarrativeText: string | undefined

  if (includeAiNarrative && planHasFullWeeklyReport(planId)) {
    const insights = buildProactiveInsights({ flow, context, planning, meetings, workflow })
    const statsPayload = {
      teamName,
      week: formatWeekRange(weekStart, weekEnd),
      teamFlowScore: flow.teamFlowScore,
      flowTrend30d: flow.trend30d.slice(-7),
      meetingPct: meetings.impact.meetingPct,
      avgRecoveryMin: meetings.impact.avgRecoveryMin,
      suggestedFocusWindow: meetings.suggestedWindows[0] ?? null,
      latestSprint: planning.sprints[planning.sprints.length - 1] ?? null,
      burnoutFlags: context.members
        .filter((m) => m.burnoutIndex >= 70)
        .map((m) => ({ name: m.displayName, index: m.burnoutIndex })),
      lowFocusMembers: flow.members
        .filter((m) => m.flowScoreToday < 45)
        .map((m) => ({ name: m.displayName, score: m.flowScoreToday })),
      insights: insights.slice(0, 8).map((i) => ({ title: i.title, body: i.body })),
    }

    try {
      aiNarrativeText = await kimiChatPlain({
        system: WEEKLY_REPORT_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Team metrics JSON:\n${JSON.stringify(statsPayload, null, 2)}`,
          },
        ],
        maxTokens: 900,
      })
    } catch (err) {
      console.error(`FlowSight [buildWeeklyTeamReport]: AI narrative failed for team ${teamId}, falling back to deterministic summary.`, err)
      aiNarrativeText = undefined
    }
  }

  return composeWeeklyTeamReport({
    teamName,
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

export function getPreviousWeekBounds(reference = new Date()): { weekStart: Date; weekEnd: Date } {
  const end = new Date(reference)
  end.setHours(23, 59, 59, 999)
  const day = end.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const thisMonday = new Date(end)
  thisMonday.setDate(end.getDate() + mondayOffset)
  thisMonday.setHours(0, 0, 0, 0)

  const weekStart = new Date(thisMonday)
  weekStart.setDate(thisMonday.getDate() - 7)
  const weekEnd = new Date(thisMonday)
  weekEnd.setMilliseconds(-1)

  return { weekStart, weekEnd }
}
