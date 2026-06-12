import type { DashboardWidgetId } from '@/lib/onboarding/types'
import type {
  ContextLoadData,
  FlowStateData,
  MeetingImpactSummary,
  MeetingsData,
  PlanningData,
  StandupHealthData,
  WorkflowData,
} from '@/lib/types/dashboard'
import type { WorkloadMember } from '@/components/dashboard/personalized/WidgetRenderer'

export type WidgetDataSlice = {
  flow: FlowStateData
  context: ContextLoadData
  meetings: MeetingsData
  planning: PlanningData
  workflow: WorkflowData
  workloadMembers: WorkloadMember[]
}

export const WIDGET_EMPTY_MESSAGES: Record<DashboardWidgetId, string> = {
  'flow-score': 'No focus data yet. Scores appear once work sessions are tracked today.',
  'flow-trend': 'No trend data yet. The chart fills in as sessions accumulate over time.',
  'flow-timeline': 'No timeline data yet. Hourly flow states appear after today’s sessions are tracked.',
  'kpi-cards': 'No focus KPIs yet. Metrics appear once the team has tracked activity today.',
  'workflow-feed': 'No activity recorded today. Live entries will show up as your team works.',
  'backlog-bars': 'No backlog activity yet. Bars appear when Jira work is tracked this week.',
  'context-switches': 'No context-switch data yet. Tracking starts with categorized activity reports.',
  'focus-streaks': 'No focus streaks yet. Streak history builds from deep-work sessions.',
  'burnout-index': 'No burnout signals yet. The index needs tracked workload and meeting data.',
  'meeting-impact': 'No meeting data yet. Impact metrics appear once meetings are tracked this week.',
  'focus-heatmap': 'No focus heatmap data yet. Patterns emerge as deep work and meetings are logged.',
  'standup-health': 'No standup data yet. Health metrics appear once standups are recorded.',
  'capacity-forecast':
    'No capacity forecast yet. Link Jira sprints or close tracked tickets, then log work sessions.',
  'estimation-chart':
    'No sprint comparison yet. Link Jira sprints or close tracked tickets to compare planned vs actual delivery.',
  'workload-balance': 'No workload tracked today. Member hours appear once sessions are logged.',
}

export function hasFlowScoreData(flow: FlowStateData): boolean {
  return (flow.teamFlowScoreBreakdown ?? []).some((m) => m.totalTrackedSeconds > 0)
}

export function hasFlowTrendData(flow: FlowStateData): boolean {
  return flow.trend30d.some((p) => p.score > 0)
}

export function hasFlowTimelineData(flow: FlowStateData): boolean {
  return flow.members.some((m) => m.timelineToday.some((s) => s.state !== null))
}

export function hasKpiData(flow: FlowStateData): boolean {
  return flow.members.some(
    (m) => m.recoveryTimeAvg > 0 || m.longestStreakMin > 0 || m.flowScoreToday > 0
  )
}

export function hasWorkflowFeedData(workflow: WorkflowData): boolean {
  return workflow.members.some((m) => m.entries.length > 0 || m.currentActivity != null)
}

export function hasBacklogData(context: ContextLoadData): boolean {
  return context.members.some((m) => m.activeBacklogs > 0)
}

export function hasContextSwitchData(context: ContextLoadData): boolean {
  return context.members.some((m) => m.contextSwitchesPerDay > 0)
}

export function hasFocusStreakData(context: ContextLoadData): boolean {
  return context.members.some((m) => m.focusStreakHistory.some((v) => v > 0))
}

export function hasBurnoutData(context: ContextLoadData): boolean {
  return context.members.some(
    (m) =>
      m.activeBacklogs > 0 || m.contextSwitchesPerDay > 0 || m.meetingRatio > 0
  )
}

export function hasMeetingImpactSummary(impact: MeetingImpactSummary): boolean {
  const { totalMeetingHours, meetingPct, avgRecoveryMin, wastedFragmentsHours } = impact
  return (
    totalMeetingHours > 0 ||
    meetingPct > 0 ||
    avgRecoveryMin > 0 ||
    wastedFragmentsHours > 0
  )
}

export function hasMeetingImpactData(meetings: MeetingsData): boolean {
  return hasMeetingImpactSummary(meetings.impact)
}

export function hasFocusHeatmapData(meetings: MeetingsData): boolean {
  return meetings.focusHeatmap.some((c) => c.intensity > 0)
}

export function hasStandupHealthData(health: StandupHealthData): boolean {
  return health.avgDurationMin > 0 || health.blockersRaised > 0
}

/**
 * Sprint rows in `sprint_commitments` alone are not enough — they may be seed/placeholder data.
 * Require a Jira sprint link or closed ticket snapshots before showing planning widgets.
 */
export function hasVerifiedSprintPlanning(planning: PlanningData): boolean {
  const hasJiraSprints = planning.sprints.some((s) => Boolean(s.sprintId))
  const hasTicketHistory = planning.estimations.some((e) => e.sampleSize > 0)
  return hasJiraSprints || hasTicketHistory
}

export function hasEstimationChartData(planning: PlanningData): boolean {
  if (!hasVerifiedSprintPlanning(planning)) return false
  return planning.sprints.some((s) => s.actualHours > 0)
}

export function hasCapacityForecastData(planning: PlanningData): boolean {
  if (!hasVerifiedSprintPlanning(planning)) return false
  const latest = planning.sprints[planning.sprints.length - 1]
  return Boolean(latest && latest.committedHours > 0 && latest.actualHours > 0)
}

export function hasWorkloadBalanceData(members: WorkloadMember[]): boolean {
  return members.some((m) => m.hours > 0)
}

export function hasWidgetData(widget: DashboardWidgetId, data: WidgetDataSlice): boolean {
  switch (widget) {
    case 'flow-score':
      return hasFlowScoreData(data.flow)
    case 'flow-trend':
      return hasFlowTrendData(data.flow)
    case 'flow-timeline':
      return hasFlowTimelineData(data.flow)
    case 'kpi-cards':
      return hasKpiData(data.flow)
    case 'workflow-feed':
      return hasWorkflowFeedData(data.workflow)
    case 'backlog-bars':
      return hasBacklogData(data.context)
    case 'context-switches':
      return hasContextSwitchData(data.context)
    case 'focus-streaks':
      return hasFocusStreakData(data.context)
    case 'burnout-index':
      return hasBurnoutData(data.context)
    case 'meeting-impact':
      return hasMeetingImpactData(data.meetings)
    case 'focus-heatmap':
      return hasFocusHeatmapData(data.meetings)
    case 'standup-health':
      return hasStandupHealthData(data.meetings.standupHealth)
    case 'capacity-forecast':
    case 'estimation-chart':
      return true
    case 'workload-balance':
      return hasWorkloadBalanceData(data.workloadMembers)
    default:
      return true
  }
}
