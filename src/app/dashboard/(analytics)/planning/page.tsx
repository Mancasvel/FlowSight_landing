import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getActiveTeamId } from '@/lib/getActiveTeamId'
import { getPlanningData } from '@/lib/dashboardData'
import EstimationChart from '@/components/dashboard/planning/EstimationChart'
import CapacityForecast from '@/components/dashboard/planning/CapacityForecast'
import CostBreakdown from '@/components/dashboard/planning/CostBreakdown'
import EstimationEngine from '@/components/dashboard/planning/EstimationEngine'

export default async function PlanningPage() {
  const headerStore = await headers()
  const userId = headerStore.get('x-user-id')
  if (!userId) redirect('/login')

  const teamId = await getActiveTeamId(userId)

  if (!teamId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-zinc-500">No team found. Join or create a team in Settings.</p>
      </div>
    )
  }

  const data = await getPlanningData(teamId, 4)
  const latestSprint = data.sprints[data.sprints.length - 1] ?? null

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl 2xl:text-2xl font-semibold text-zinc-900 tracking-tight">Planning</h1>
        <p className="text-sm text-zinc-400 mt-0.5">
          Sprint estimation, capacity and cost analysis · {data.estimations.length} members · Last {data.sprints.length} sprints
        </p>
      </div>

      <EstimationChart sprints={data.sprints} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <CapacityForecast sprint={latestSprint} />
        <CostBreakdown
          costBreakdown={data.costBreakdown}
          perPersonGap={data.perPersonGap}
          costPerHour={data.costPerHour}
        />
      </div>

      <EstimationEngine estimations={data.estimations} />
    </div>
  )
}
