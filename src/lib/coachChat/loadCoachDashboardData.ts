import {
  getContextLoadData,
  getFlowStateData,
  getMeetingsData,
  getPlanningData,
  getWorkflowData,
} from '@/lib/dashboardData'
import type {
  ContextLoadData,
  FlowStateData,
  MeetingsData,
  PlanningData,
  WorkflowData,
} from '@/lib/types/dashboard'

export type CoachDashboardData = {
  flow: FlowStateData
  context: ContextLoadData
  planning: PlanningData
  meetings: MeetingsData
  workflow: WorkflowData
  unavailable: string[]
}

const emptyFlow: FlowStateData = {
  teamFlowScore: 0,
  trend30d: [],
  members: [],
}

const emptyContext: ContextLoadData = { members: [] }

const emptyPlanning: PlanningData = {
  sprints: [],
  estimations: [],
  costBreakdown: { meetingsCost: 0, interruptionCost: 0, contextCost: 0, total: 0 },
  perPersonGap: [],
  costPerHour: 50,
}

const emptyMeetings: MeetingsData = {
  impact: {
    totalMeetingHours: 0,
    meetingPct: 0,
    avgRecoveryMin: 0,
    wastedFragmentsHours: 0,
  },
  focusHeatmap: [],
  suggestedWindows: [],
  flaggedWindows: [],
  standupHealth: { avgDurationMin: 0, blockersRaised: 0, blockersResolved: 0 },
}

const emptyWorkflow: WorkflowData = { members: [] }

async function loadSection<T>(
  label: string,
  loader: () => Promise<T>,
  fallback: T,
  unavailable: string[]
): Promise<T> {
  try {
    return await loader()
  } catch (err) {
    console.error(`Coach dashboard data [${label}] unavailable:`, err)
    unavailable.push(label)
    return fallback
  }
}

export async function loadCoachDashboardData(
  teamId: string,
  weekStart: Date,
  now: Date
): Promise<CoachDashboardData> {
  const unavailable: string[] = []

  const [flow, context, planning, meetings, workflow] = await Promise.all([
    loadSection('flow', () => getFlowStateData(teamId, now), emptyFlow, unavailable),
    loadSection(
      'context',
      () => getContextLoadData(teamId, weekStart, now),
      emptyContext,
      unavailable
    ),
    loadSection('planning', () => getPlanningData(teamId, 4), emptyPlanning, unavailable),
    loadSection(
      'meetings',
      () => getMeetingsData(teamId, weekStart, now),
      emptyMeetings,
      unavailable
    ),
    loadSection('workflow', () => getWorkflowData(teamId, now), emptyWorkflow, unavailable),
  ])

  return { flow, context, planning, meetings, workflow, unavailable }
}
