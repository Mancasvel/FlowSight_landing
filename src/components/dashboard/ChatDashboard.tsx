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
      {/* Grid background — full chat viewport */}
      <div
        className="pointer-events-none absolute inset-0 bg-dashboard-grid [mask-image:radial-gradient(ellipse_80%_70%_at_50%_45%,#000_20%,transparent_100%)]"
        aria-hidden
      />
      <div className="relative z-10 flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 pb-6 font-sans sm:px-6 lg:px-10 lg:pb-8 2xl:px-14 2xl:pb-10">
        <div className="w-full max-w-2xl">
          <DashboardChat displayName={displayName} teamId={teamId} insights={insights} />
        </div>
      </div>
    </div>
  )
}
