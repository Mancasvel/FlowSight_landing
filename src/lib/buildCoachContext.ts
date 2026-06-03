import type {
  FlowStateData,
  ContextLoadData,
  PlanningData,
  MeetingsData,
  WorkflowData,
} from '@/lib/types/dashboard'
import { buildProactiveInsights } from '@/lib/buildProactiveInsights'

/** Compact JSON context for Kimi — no PII beyond display names already in dashboard. */
export function buildCoachContext(params: {
  flow: FlowStateData
  context: ContextLoadData
  planning: PlanningData
  meetings: MeetingsData
  workflow: WorkflowData
  displayName: string
}): string {
  const insights = buildProactiveInsights({
    flow: params.flow,
    context: params.context,
    planning: params.planning,
    meetings: params.meetings,
    workflow: params.workflow,
  })

  const payload = {
    requestedBy: params.displayName,
    teamFlowScore: params.flow.teamFlowScore,
    flowTrend7d: params.flow.trend30d.slice(-7),
    members: params.flow.members.map((m) => ({
      name: m.displayName,
      flowScoreToday: m.flowScoreToday,
    })),
    meetingLoadPct: params.meetings.impact.meetingPct,
    avgRecoveryMin: params.meetings.impact.avgRecoveryMin,
    bestFocusWindow: params.meetings.suggestedWindows[0] ?? null,
    sprint: params.planning.sprints[params.planning.sprints.length - 1] ?? null,
    activeNow: params.workflow.members
      .filter((m) => m.currentActivity)
      .map((m) => ({
        name: m.displayName,
        activity: m.currentActivity?.description,
      })),
    burnoutAlerts: params.context.members
      .filter((m) => m.burnoutIndex >= 70)
      .map((m) => ({ name: m.displayName, index: m.burnoutIndex })),
    proactiveInsights: insights.slice(0, 10).map((i) => ({
      kind: i.kind,
      title: i.title,
      body: i.body,
    })),
  }

  return JSON.stringify(payload)
}
