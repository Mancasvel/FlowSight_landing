import type { DashboardWidgetId } from '@/lib/onboarding/types'
import type {
  FlowStateData,
  ContextLoadData,
  MeetingsData,
  PlanningData,
  WorkflowData,
} from '@/lib/types/dashboard'
import FlowScore from '@/components/dashboard/flow-state/FlowScore'
import FlowTrend from '@/components/dashboard/flow-state/FlowTrend'
import FlowTimeline from '@/components/dashboard/flow-state/FlowTimeline'
import KPICards from '@/components/dashboard/flow-state/KPICards'
import WorkflowFeed from '@/components/dashboard/flow-state/WorkflowFeed'
import BacklogBars from '@/components/dashboard/context-load/BacklogBars'
import ContextSwitches from '@/components/dashboard/context-load/ContextSwitches'
import FocusStreaks from '@/components/dashboard/context-load/FocusStreaks'
import BurnoutIndex from '@/components/dashboard/context-load/BurnoutIndex'
import MeetingImpact from '@/components/dashboard/meetings/MeetingImpact'
import FocusHeatmap from '@/components/dashboard/meetings/FocusHeatmap'
import StandupHealth from '@/components/dashboard/meetings/StandupHealth'
import CapacityForecast from '@/components/dashboard/planning/CapacityForecast'
import EstimationChart from '@/components/dashboard/planning/EstimationChart'
import WorkloadBalance from '@/components/dashboard/WorkloadBalance'
import DashboardWidgetEmpty from '@/components/dashboard/DashboardWidgetEmpty'
import { Card, CardBody } from '@/components/ui'
import {
  hasWidgetData,
  WIDGET_EMPTY_MESSAGES,
} from '@/lib/dashboard/widgetDataAvailability'

export type WorkloadMember = {
  id: string
  name: string
  avatar_url: string | null
  isOnline: boolean
  hours: number
  currentActivity: string | null
}

export type WidgetData = {
  flow: FlowStateData
  context: ContextLoadData
  meetings: MeetingsData
  planning: PlanningData
  workflow: WorkflowData
  workloadMembers: WorkloadMember[]
}

type Props = WidgetData & { widget: DashboardWidgetId }

export default function WidgetRenderer({
  widget,
  flow,
  context,
  meetings,
  planning,
  workflow,
  workloadMembers,
}: Props) {
  const data = { flow, context, meetings, planning, workflow, workloadMembers }
  const latestSprint = planning.sprints[planning.sprints.length - 1] ?? null

  if (!hasWidgetData(widget, data)) {
    return <DashboardWidgetEmpty message={WIDGET_EMPTY_MESSAGES[widget]} />
  }

  switch (widget) {
    case 'flow-score':
      return (
        <FlowScore
          score={flow.teamFlowScore}
          trend={flow.trend30d}
          teamFlowScoreBreakdown={flow.teamFlowScoreBreakdown}
        />
      )
    case 'flow-trend':
      return <FlowTrend trend={flow.trend30d} />
    case 'flow-timeline':
      return <FlowTimeline members={flow.members} />
    case 'kpi-cards':
      return <KPICards members={flow.members} isLoaded />
    case 'workflow-feed':
      return <WorkflowFeed members={workflow.members} />
    case 'backlog-bars':
      return <BacklogBars members={context.members} />
    case 'context-switches':
      return <ContextSwitches members={context.members} />
    case 'focus-streaks':
      return <FocusStreaks members={context.members} />
    case 'burnout-index':
      return <BurnoutIndex members={context.members} />
    case 'meeting-impact':
      return <MeetingImpact impact={meetings.impact} />
    case 'focus-heatmap':
      return (
        <FocusHeatmap
          heatmap={meetings.focusHeatmap}
          flaggedWindows={meetings.flaggedWindows}
        />
      )
    case 'standup-health':
      return <StandupHealth health={meetings.standupHealth} />
    case 'capacity-forecast':
      return (
        <CapacityForecast
          sprint={latestSprint}
          estimations={planning.estimations}
          allSprints={planning.sprints}
        />
      )
    case 'estimation-chart':
      return <EstimationChart sprints={planning.sprints} estimations={planning.estimations} />
    case 'workload-balance':
      return (
        <Card>
          <CardBody>
            <WorkloadBalance
              members={workloadMembers.map((m) => ({
                id: m.id,
                name: m.name,
                avatar_url: m.avatar_url,
                hours: m.hours,
                isOnline: m.isOnline,
              }))}
            />
          </CardBody>
        </Card>
      )
    default:
      return null
  }
}
