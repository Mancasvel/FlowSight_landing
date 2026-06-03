import type {
  FlowStateData,
  ContextLoadData,
  MeetingsData,
  PlanningData,
  WorkflowData,
} from '@/lib/types/dashboard'

export type InsightKind = 'focus' | 'activity' | 'meeting' | 'planning' | 'suggestion' | 'team'

export type ProactiveInsight = {
  id: string
  kind: InsightKind
  title: string
  body: string
  timeLabel: string
  actionLabel?: string
  actionHref?: string
  memberName?: string
}

type Input = {
  flow: FlowStateData
  context: ContextLoadData
  meetings: MeetingsData
  planning: PlanningData
  workflow: WorkflowData
}

export function buildProactiveInsights({
  flow,
  context,
  meetings,
  planning,
  workflow,
}: Input): ProactiveInsight[] {
  const insights: ProactiveInsight[] = []
  const { teamFlowScore, members: flowMembers, trend30d } = flow
  const last7 = trend30d.slice(-7)
  const trendDiff = (last7[last7.length - 1]?.score ?? 0) - (last7[0]?.score ?? 0)

  if (trendDiff > 5) {
    insights.push({
      id: 'flow-improving',
      kind: 'focus',
      title: 'Team focus is climbing',
      body: `Flow score is up ${Math.round(trendDiff)} points over the last week. Deep work blocks are sticking — good moment to protect calendars.`,
      timeLabel: 'Just now',
      actionLabel: 'View flow trend',
      actionHref: '/dashboard/flow-state',
    })
  } else if (trendDiff < -5) {
    insights.push({
      id: 'flow-declining',
      kind: 'focus',
      title: 'Focus slipped this week',
      body: `Team flow is down ${Math.abs(Math.round(trendDiff))} points. Check meeting load and context switches before the sprint mid-point.`,
      timeLabel: 'Just now',
      actionLabel: 'Open flow state',
      actionHref: '/dashboard/flow-state',
    })
  }

  insights.push({
    id: 'team-flow-today',
    kind: 'focus',
    title: `Team flow at ${teamFlowScore}% today`,
    body:
      teamFlowScore >= 70
        ? 'Most of the team is in sustained deep work. Consider async updates instead of another sync.'
        : teamFlowScore >= 45
          ? 'Mixed focus day — a few members may need fewer interrupts this afternoon.'
          : 'Low collective focus. Meetings or context switching may be dominating the day.',
    timeLabel: 'Today',
    actionLabel: 'Team timeline',
    actionHref: '/dashboard/flow-state',
  })

  const activeNow = workflow.members.filter((m) => m.currentActivity)
  if (activeNow.length > 0) {
    const names = activeNow.slice(0, 3).map((m) => m.displayName.split(' ')[0])
    insights.push({
      id: 'live-activity',
      kind: 'activity',
      title: `${activeNow.length} teammate${activeNow.length > 1 ? 's' : ''} in flow right now`,
      body: `${names.join(', ')}${activeNow.length > 3 ? ' and others' : ''} are actively tracked. Ask FlowSight who needs help unblocking.`,
      timeLabel: 'Live',
      actionLabel: 'See activity',
      actionHref: '/dashboard/flow-state',
    })

    for (const m of activeNow.slice(0, 2)) {
      const act = m.currentActivity!
      insights.push({
        id: `activity-${m.userId}`,
        kind: 'activity',
        title: `${m.displayName} is on ${act.description}`,
        body: act.jiraTicketId
          ? `Ticket ${act.jiraTicketId} · tracked in the last hour.`
          : 'Currently in a tracked work block.',
        timeLabel: 'Now',
        memberName: m.displayName,
        actionHref: `/dashboard/member/${m.userId}`,
        actionLabel: 'Open profile',
      })
    }
  }

  const { impact, suggestedWindows } = meetings
  if (impact.meetingPct >= 30) {
    insights.push({
      id: 'meeting-heavy',
      kind: 'meeting',
      title: 'Meeting load is high',
      body: `${impact.meetingPct}% of tracked time is in meetings this week. Post-meeting recovery averages ${impact.avgRecoveryMin} min.`,
      timeLabel: 'This week',
      actionLabel: 'Meeting impact',
      actionHref: '/dashboard/meetings',
    })
  }

  const bestWindow = suggestedWindows[0]
  if (bestWindow) {
    insights.push({
      id: 'focus-window',
      kind: 'meeting',
      title: `Best focus window: ${bestWindow.dayName} ${bestWindow.hour}:00`,
      body: bestWindow.reason,
      timeLabel: 'Suggested',
      actionLabel: 'Scheduling',
      actionHref: '/dashboard/meetings',
    })
  }

  const latestSprint = planning.sprints[planning.sprints.length - 1]
  if (latestSprint) {
    const pct = Math.round(latestSprint.efficiencyRatio * 100)
    insights.push({
      id: 'sprint-pulse',
      kind: 'planning',
      title: `${latestSprint.label}: ${pct}% delivery efficiency`,
      body: `Committed ${latestSprint.committedHours}h · expected delivery ${latestSprint.expectedDelivery}h. Ask me to stress-test the rest of the sprint.`,
      timeLabel: 'Sprint',
      actionLabel: 'Planning',
      actionHref: '/dashboard/planning',
    })
  }

  for (const m of context.members) {
    if (m.suggestion) {
      insights.push({
        id: `suggestion-${m.userId}`,
        kind: 'suggestion',
        title: `Suggestion for ${m.displayName}`,
        body: m.suggestion,
        timeLabel: 'Proactive',
        memberName: m.displayName,
        actionLabel: 'Context load',
        actionHref: '/dashboard/context-load',
      })
    }
  }

  const lowFocus = flowMembers.filter((m) => m.flowScoreToday < 45)
  if (lowFocus.length > 0 && lowFocus.length <= 3) {
    insights.push({
      id: 'low-focus-members',
      kind: 'team',
      title: `${lowFocus.length} member${lowFocus.length > 1 ? 's need' : ' needs'} a focus reset`,
      body: `${lowFocus.map((m) => m.displayName).join(', ')} — below 45% flow today. A short 1:1 or async check-in may help.`,
      timeLabel: 'Today',
      actionLabel: 'Team view',
      actionHref: '/dashboard/team',
    })
  }

  return insights.slice(0, 12)
}
