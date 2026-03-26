import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getActiveTeamId } from '@/lib/getActiveTeamId'
import { getFlowStateData, getWorkflowData } from '@/lib/dashboardData'
import FlowScore from '@/components/dashboard/flow-state/FlowScore'
import FlowTrend from '@/components/dashboard/flow-state/FlowTrend'
import FlowTimeline from '@/components/dashboard/flow-state/FlowTimeline'
import KPICards from '@/components/dashboard/flow-state/KPICards'
import WorkflowFeed from '@/components/dashboard/flow-state/WorkflowFeed'

export default async function FlowStatePage() {
  const headerStore = await headers()
  const userId = headerStore.get('x-user-id')
  if (!userId) redirect('/login')

  const teamId = await getActiveTeamId(userId)

  if (!teamId) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-zinc-500">No team found. Join or create a team in Settings.</p>
      </div>
    )
  }

  const today = new Date()
  const [data, workflow] = await Promise.all([
    getFlowStateData(teamId, today),
    getWorkflowData(teamId, today),
  ])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl 2xl:text-2xl font-semibold text-zinc-900 tracking-tight">Flow State</h1>
        <p className="text-sm text-zinc-400 mt-0.5">
          Deep work patterns and focus quality · {data.members.length} members · Today
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <FlowScore score={data.teamFlowScore} trend={data.trend30d} />
        </div>
        <div className="xl:col-span-3">
          <FlowTrend trend={data.trend30d} />
        </div>
      </div>

      <FlowTimeline members={data.members} />

      <KPICards members={data.members} isLoaded />

      <WorkflowFeed members={workflow.members} />
    </div>
  )
}
