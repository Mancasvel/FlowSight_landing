import { groupWidgetsIntoSections } from './dashboardLayout'
import type {
  DashboardMode,
  DashboardPreferences,
  DashboardWidgetId,
  OnboardingAnswers,
} from './types'
import type { PlanId } from '@/lib/plans'

const WIDGET_LABELS: Record<DashboardWidgetId, string> = {
  'flow-score': 'Flow Score',
  'flow-trend': 'Flow Trend',
  'flow-timeline': 'Team Timeline',
  'kpi-cards': 'Focus KPIs',
  'workflow-feed': 'Live Activity',
  'context-switches': 'Context Switches',
  'burnout-index': 'Burnout Index',
  'focus-streaks': 'Focus Streaks',
  'backlog-bars': 'Backlog Load',
  'meeting-impact': 'Meeting Impact',
  'focus-heatmap': 'Focus Heatmap',
  'standup-health': 'Standup Health',
  'capacity-forecast': 'Capacity Forecast',
  'estimation-chart': 'Estimation vs Reality',
  'workload-balance': 'Workload Balance',
}

function uniqueWidgets(widgets: DashboardWidgetId[]): DashboardWidgetId[] {
  return Array.from(new Set(widgets))
}

function addIf(condition: boolean, widget: DashboardWidgetId, list: DashboardWidgetId[]) {
  if (condition) list.push(widget)
}

function includesAny(list: string[] | undefined, values: string[]): boolean {
  if (!list?.length) return false
  return values.some((v) => list.includes(v))
}

function buildIndividualWidgets(answers: OnboardingAnswers): DashboardWidgetId[] {
  const widgets: DashboardWidgetId[] = []
  const time = answers.timeAllocation ?? []
  const visibility = answers.visibilityNeeds ?? []
  const friction = answers.weeklyFriction
  const cadence = answers.reviewCadence ?? 'both'

  if (
    includesAny(time, ['status_meetings', 'stakeholder_comms']) ||
    includesAny(visibility, ['meeting_load']) ||
    friction === 'too_many_meetings'
  ) {
    widgets.push('meeting-impact', 'focus-heatmap', 'standup-health')
  }

  if (
    includesAny(time, ['deep_work', 'code_review']) ||
    includesAny(visibility, ['focus_quality']) ||
    friction === 'constant_interrupts' ||
    friction === 'context_switching'
  ) {
    widgets.push('flow-score', 'focus-streaks', 'context-switches')
    addIf(cadence !== 'daily_pulse', 'flow-trend', widgets)
  }

  if (
    includesAny(time, ['solving_blockers', 'incident_firefighting']) ||
    includesAny(visibility, ['workload_balance', 'activity_patterns'])
  ) {
    widgets.push('workflow-feed', 'backlog-bars')
  }

  if (
    includesAny(time, ['planning_estimation', 'reporting_updates']) ||
    includesAny(visibility, ['delivery_progress'])
  ) {
    widgets.push('estimation-chart', 'kpi-cards')
  }

  if (
    includesAny(visibility, ['burnout_signals']) ||
    friction === 'workload_spikes' ||
    friction === 'reporting_overhead'
  ) {
    widgets.push('burnout-index')
  }

  if (widgets.length < 4) {
    widgets.push('flow-score', 'workflow-feed', 'meeting-impact', 'focus-streaks')
    addIf(cadence !== 'daily_pulse', 'flow-trend', widgets)
  }

  return uniqueWidgets(widgets).slice(0, 8)
}

function buildTeamWidgets(answers: OnboardingAnswers): DashboardWidgetId[] {
  const widgets: DashboardWidgetId[] = []
  const drains = answers.timeDrainAreas ?? []
  const decisions = answers.decisionsSupported ?? []
  const alerts = answers.alertSignals ?? []

  if (
    includesAny(drains, ['status_meetings', 'reporting_updates']) ||
    includesAny(decisions, ['meeting_hygiene']) ||
    alerts.includes('meeting_overload')
  ) {
    widgets.push('meeting-impact', 'focus-heatmap', 'standup-health')
  }

  if (
    includesAny(drains, ['blocker_resolution', 'handoffs_waiting', 'rework_unplanned']) ||
    includesAny(decisions, ['delivery_forecast', 'staffing_capacity'])
  ) {
    widgets.push('workflow-feed', 'flow-timeline')
  }

  if (
    includesAny(drains, ['estimation_gaps']) ||
    includesAny(decisions, ['sprint_commitments', 'delivery_forecast'])
  ) {
    widgets.push('estimation-chart', 'capacity-forecast')
  }

  if (
    includesAny(decisions, ['workload_fairness', 'staffing_capacity']) ||
    alerts.includes('uneven_workload') ||
    answers.teamSize === 'large'
  ) {
    widgets.push('workload-balance', 'backlog-bars')
  }

  if (
    includesAny(decisions, ['burnout_prevention']) ||
    alerts.includes('burnout') ||
    alerts.includes('low_focus')
  ) {
    widgets.push('burnout-index', 'context-switches', 'focus-streaks')
  }

  if (includesAny(decisions, ['staffing_capacity', 'delivery_forecast'])) {
    widgets.push('flow-score', 'flow-trend', 'kpi-cards')
  }

  if (alerts.includes('missed_sprints')) {
    widgets.push('capacity-forecast', 'estimation-chart')
  }

  if (widgets.length < 5) {
    widgets.push('flow-score', 'workload-balance', 'meeting-impact', 'workflow-feed', 'flow-trend')
  }

  return uniqueWidgets(widgets).slice(0, 10)
}

function buildTitle(mode: DashboardMode, answers: OnboardingAnswers): string {
  if (mode === 'individual') {
    const frictionTitles: Record<string, string> = {
      too_many_meetings: 'Meetings & Focus',
      constant_interrupts: 'Focus Protection',
      unclear_priorities: 'Priority Clarity',
      context_switching: 'Context & Flow',
      workload_spikes: 'Workload View',
      reporting_overhead: 'Delivery Visibility',
    }
    if (answers.weeklyFriction && frictionTitles[answers.weeklyFriction]) {
      return frictionTitles[answers.weeklyFriction]
    }
    return 'My Dashboard'
  }

  const roleTitles: Record<string, string> = {
    manager: 'Team Operations',
    tech_lead: 'Delivery & Balance',
    pm: 'Planning & Delivery',
    other: 'Team Dashboard',
  }
  return roleTitles[answers.teamRole ?? ''] ?? 'Team Dashboard'
}

export function buildDashboardFromAnswers(answers: OnboardingAnswers): DashboardPreferences {
  const mode = answers.mode
  const widgets =
    mode === 'individual' ? buildIndividualWidgets(answers) : buildTeamWidgets(answers)

  return {
    mode,
    title: buildTitle(mode, answers),
    widgets,
    sections: groupWidgetsIntoSections(widgets),
    answers,
    completedAt: new Date().toISOString(),
  }
}

export function getDefaultDashboardPreferences(
  planId: PlanId,
  maxMembers: number
): DashboardPreferences {
  const mode: DashboardMode =
    planId === 'individual_pro' || maxMembers <= 1 ? 'individual' : 'team'

  return buildDashboardFromAnswers({
    mode,
    timeAllocation: ['deep_work', 'status_meetings'],
    weeklyFriction: 'context_switching',
    visibilityNeeds: ['focus_quality', 'meeting_load'],
    reviewCadence: 'both',
    teamRole: 'manager',
    timeDrainAreas: ['status_meetings', 'blocker_resolution'],
    decisionsSupported: ['meeting_hygiene', 'workload_fairness'],
    teamSize: 'medium',
    alertSignals: ['burnout', 'meeting_overload'],
  })
}

export function getWidgetLabel(widget: DashboardWidgetId): string {
  return WIDGET_LABELS[widget]
}

export function parseDashboardPreferences(raw: unknown): DashboardPreferences | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as Record<string, unknown>
  if (
    typeof obj.mode !== 'string' ||
    typeof obj.title !== 'string' ||
    !Array.isArray(obj.widgets) ||
    typeof obj.completedAt !== 'string'
  ) {
    return null
  }

  const widgets = obj.widgets as DashboardWidgetId[]
  const sections = Array.isArray(obj.sections)
    ? (obj.sections as DashboardPreferences['sections'])
    : groupWidgetsIntoSections(widgets)

  return {
    ...(obj as DashboardPreferences),
    sections,
  }
}
