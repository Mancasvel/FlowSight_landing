import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getActiveTeamId } from '@/lib/getActiveTeamId'
import { getFlowStateData, getContextLoadData, getPlanningData, getMeetingsData } from '@/lib/dashboardData'
import OverviewDashboard from '@/components/dashboard/OverviewDashboard'

export default async function DashboardPage() {
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

  const now = new Date()
  const dayOfWeek = now.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() + mondayOffset)
  weekStart.setHours(0, 0, 0, 0)

  const [flowData, contextData, planningData, meetingsData] = await Promise.all([
    getFlowStateData(teamId, now),
    getContextLoadData(teamId, weekStart, now),
    getPlanningData(teamId, 4),
    getMeetingsData(teamId, weekStart, now),
  ])

  return (
    <OverviewDashboard
      flow={flowData}
      context={contextData}
      planning={planningData}
      meetings={meetingsData}
    />
  )
}
