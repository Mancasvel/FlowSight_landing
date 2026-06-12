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

export async function buildWeeklyTeamReport(params: {
  teamId: string
  teamName: string
  planId: PlanId
  weekStart: Date
  weekEnd: Date
  includeAiNarrative: boolean
}): Promise<WeeklyTeamReport> {
  const { teamId, teamName, planId, weekStart, weekEnd, includeAiNarrative } = params
  const now = weekEnd

  const [flow, context, planning, meetings, workflow] = await Promise.all([
    getFlowStateData(teamId, now),
    getContextLoadData(teamId, weekStart, now),
    getPlanningData(teamId, 4),
    getMeetingsData(teamId, weekStart, now),
    getWorkflowData(teamId, now),
  ])

  const insights = buildProactiveInsights({ flow, context, planning, meetings, workflow })
  const sections = insightSections(insights)

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

  let executiveSummary = 'Weekly cognitive health summary for your team.'
  let recommendations: string[] = []

  if (includeAiNarrative && planHasFullWeeklyReport(planId)) {
    try {
      const aiText = await kimiChatPlain({
        system: WEEKLY_REPORT_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Team metrics JSON:\n${JSON.stringify(statsPayload, null, 2)}`,
          },
        ],
        maxTokens: 900,
      })
      const parsed = parseRecommendations(aiText)
      executiveSummary = parsed.summary || aiText
      recommendations =
        parsed.bullets.length > 0
          ? parsed.bullets
          : [
              'Protect a shared focus block mid-week.',
              'Review meeting load for members with low flow scores.',
              'Check sprint delivery against committed hours.',
            ]
    } catch {
      executiveSummary = insights[0]
        ? `${insights[0].title}. ${insights[0].body}`
        : `Team flow score is ${flow.teamFlowScore}% today.`
      recommendations = insights.slice(0, 3).map((i) => i.title)
    }
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
