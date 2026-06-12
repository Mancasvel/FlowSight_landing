'use client'

import DashboardChat from '@/components/dashboard/DashboardChat'
import { buildProactiveInsights } from '@/lib/buildProactiveInsights'
import type {
  FlowStateData,
  ContextLoadData,
  PlanningData,
  MeetingsData,
  WorkflowData,
} from '@/lib/types/dashboard'

type Props = {
  displayName: string
  teamId: string
  flow: FlowStateData
  context: ContextLoadData
  planning: PlanningData
  meetings: MeetingsData
  workflow: WorkflowData
}

export default function ChatDashboard({
  displayName,
  teamId,
  flow,
  context,
  planning,
  meetings,
  workflow,
}: Props) {
  const insights = buildProactiveInsights({ flow, context, meetings, planning, workflow })

  return (
    <div className="relative -mx-4 min-h-[calc(100vh-3.5rem)] sm:-mx-6 lg:-mx-10 2xl:-mx-14">
      <div
        className="pointer-events-none absolute inset-0 bg-dashboard-grid [mask-image:radial-gradient(ellipse_80%_70%_at_50%_45%,#000_20%,transparent_100%)]"
        aria-hidden
      />
      <div className="relative z-10 flex min-h-[calc(100vh-3.5rem)] flex-col px-4 pb-2 pt-1 sm:px-6 lg:px-10 2xl:px-14">
        <div className="mx-auto flex h-[calc(100vh-3.5rem-0.5rem)] w-full max-w-[42rem] min-h-0 flex-col">
          <DashboardChat displayName={displayName} teamId={teamId} insights={insights} />
        </div>
      </div>
    </div>
  )
}
