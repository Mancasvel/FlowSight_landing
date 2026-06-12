import { redirect } from 'next/navigation'
import { getActiveTeamId } from '@/lib/getActiveTeamId'
import { loadDashboardShellProps } from '@/lib/dashboard/loadShellProps'
import {
  getFlowStateData,
  getContextLoadData,
  getPlanningData,
  getMeetingsData,
  getWorkflowData,
} from '@/lib/dashboardData'
import { getStoredDashboardPreferences } from '@/lib/onboarding/getDashboardPreferences'
import { getWorkloadMembersForTeam } from '@/lib/onboarding/getWorkloadMembers'
import PersonalizedDashboardView from '@/components/dashboard/personalized/PersonalizedDashboardView'

export default async function MyDashboardPage() {
  const shell = await loadDashboardShellProps()
  const teamId = shell.activeTeamId ?? (await getActiveTeamId(shell.userId))

  if (!teamId) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-zinc-500">No workspace found. Complete setup to continue.</p>
      </div>
    )
  }

  const preferences = await getStoredDashboardPreferences(teamId)
  if (!preferences) {
    redirect('/account/onboarding')
  }

  const now = new Date()
  const dayOfWeek = now.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() + mondayOffset)
  weekStart.setHours(0, 0, 0, 0)

  const [flow, context, planning, meetings, workflow, workloadMembers] = await Promise.all([
    getFlowStateData(teamId, now),
    getContextLoadData(teamId, weekStart, now),
    getPlanningData(teamId, 4),
    getMeetingsData(teamId, weekStart, now),
    getWorkflowData(teamId, now),
    getWorkloadMembersForTeam(teamId),
  ])

  return (
    <PersonalizedDashboardView
      preferences={preferences}
      memberCount={flow.members.length}
      flow={flow}
      context={context}
      meetings={meetings}
      planning={planning}
      workflow={workflow}
      workloadMembers={workloadMembers}
    />
  )
}
