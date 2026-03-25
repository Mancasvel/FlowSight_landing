import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getActiveTeamId } from '@/lib/getActiveTeamId'
import { getContextLoadData } from '@/lib/dashboardData'
import BacklogBars from '@/components/dashboard/context-load/BacklogBars'
import ContextSwitches from '@/components/dashboard/context-load/ContextSwitches'
import FocusStreaks from '@/components/dashboard/context-load/FocusStreaks'
import BurnoutIndex from '@/components/dashboard/context-load/BurnoutIndex'

export default async function ContextLoadPage() {
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

  const now = new Date()
  const dayOfWeek = now.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() + mondayOffset)
  weekStart.setHours(0, 0, 0, 0)

  const data = await getContextLoadData(teamId, weekStart, now)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl 2xl:text-2xl font-semibold text-zinc-900 tracking-tight">Context & Load</h1>
        <p className="text-sm text-zinc-400 mt-0.5">
          Cognitive load, context switches and burnout signals · {data.members.length} members · This week
        </p>
      </div>

      <BacklogBars members={data.members} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ContextSwitches members={data.members} />
        <FocusStreaks members={data.members} />
      </div>

      <BurnoutIndex members={data.members} />
    </div>
  )
}
