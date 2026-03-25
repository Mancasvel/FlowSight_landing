import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getActiveTeamId } from '@/lib/getActiveTeamId'
import { getMeetingsData } from '@/lib/dashboardData'
import MeetingImpact from '@/components/dashboard/meetings/MeetingImpact'
import FocusHeatmap from '@/components/dashboard/meetings/FocusHeatmap'
import SuggestedWindows from '@/components/dashboard/meetings/SuggestedWindows'
import StandupHealth from '@/components/dashboard/meetings/StandupHealth'

export default async function MeetingsPage() {
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

  const data = await getMeetingsData(teamId, weekStart, now)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl 2xl:text-2xl font-semibold text-zinc-900 tracking-tight">Meetings</h1>
        <p className="text-sm text-zinc-400 mt-0.5">
          Meeting impact, focus heatmap and scheduling insights · This week
        </p>
      </div>

      <MeetingImpact impact={data.impact} />
      <FocusHeatmap heatmap={data.focusHeatmap} flaggedWindows={data.flaggedWindows} />
      <SuggestedWindows suggested={data.suggestedWindows} flagged={data.flaggedWindows} />
      <StandupHealth health={data.standupHealth} />
    </div>
  )
}
