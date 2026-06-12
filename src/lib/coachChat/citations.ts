import type { ContextChunkMatch } from '@/lib/coachChat/contextVectorServer'
import type { RagMatch } from '@/lib/coachChat/server'
import type {
  ContextLoadData,
  FlowStateData,
  MeetingsData,
  PlanningData,
  WorkflowData,
} from '@/lib/types/dashboard'

export type CoachCitation = {
  key: string
  label: string
  value: string
  /** Short, specific label shown in Sources chips and inline tooltips */
  source: string
  detail: string
}

export type CoachCitationIndex = Record<string, CoachCitation>

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 40)
}

function makeCitation(
  key: string,
  label: string,
  value: string,
  detail: string
): CoachCitation {
  return {
    key,
    label,
    value,
    source: `${label} · ${value}`,
    detail,
  }
}

export function buildCoachCitationIndex(params: {
  flow: FlowStateData
  context: ContextLoadData
  planning: PlanningData
  meetings: MeetingsData
  workflow: WorkflowData
  vectorMatches?: ContextChunkMatch[]
  sessionDocuments?: { fileName: string }[]
  ragMatches?: RagMatch[]
}): CoachCitationIndex {
  const index: CoachCitationIndex = {}

  if (params.flow.teamFlowScore >= 0) {
    index.team_flow_score = makeCitation(
      'team_flow_score',
      'Team flow score today',
      `${params.flow.teamFlowScore}%`,
      'Team average deep-work share today, from work_sessions category breakdown (Flow State).'
    )
  }

  const trend = params.flow.trend30d.slice(-7)
  if (trend.length > 0) {
    const last = trend[trend.length - 1]
    index.flow_trend_7d = makeCitation(
      'flow_trend_7d',
      `7-day flow trend (${last.date})`,
      `${last.score}%`,
      'Rolling team flow score for that day, aggregated from daily work_sessions (Flow State).'
    )
  }

  for (const member of params.flow.members) {
    if (member.flowScoreToday < 0) continue
    const key = `member_flow_${slugify(member.displayName)}`
    index[key] = makeCitation(
      key,
      `${member.displayName} flow today`,
      `${member.flowScoreToday}%`,
      `Personal deep-work share today for ${member.displayName}, from their work_sessions (Flow State).`
    )

    if (member.longestStreakMin > 0) {
      const streakKey = `member_streak_${slugify(member.displayName)}`
      index[streakKey] = makeCitation(
        streakKey,
        `${member.displayName} longest deep-work streak`,
        `${member.longestStreakMin} min`,
        `Longest uninterrupted deep-work block today for ${member.displayName} (Flow State).`
      )
    }

    if (member.recoveryTimeAvg > 0) {
      const recoveryKey = `member_recovery_${slugify(member.displayName)}`
      index[recoveryKey] = makeCitation(
        recoveryKey,
        `${member.displayName} avg recovery time`,
        `${member.recoveryTimeAvg} min`,
        `Average minutes to return to deep work after interruptions for ${member.displayName} (Flow State).`
      )
    }
  }

  if (params.meetings.impact.meetingPct >= 0) {
    index.meeting_load_pct = makeCitation(
      'meeting_load_pct',
      'Meeting load this week',
      `${params.meetings.impact.meetingPct}% of tracked time`,
      'Share of team tracked work time spent in meetings (Meetings + work_sessions).'
    )
  }

  if (params.meetings.impact.avgRecoveryMin > 0) {
    index.avg_recovery_min = makeCitation(
      'avg_recovery_min',
      'Post-meeting recovery (team avg)',
      `${params.meetings.impact.avgRecoveryMin} min`,
      'Average minutes until deep work resumes after a meeting block ends (Meetings).'
    )
  }

  if (params.meetings.impact.totalMeetingHours > 0) {
    index.meeting_hours_week = makeCitation(
      'meeting_hours_week',
      'Meeting hours this week',
      `${params.meetings.impact.totalMeetingHours}h`,
      'Total meeting time logged by the team during the current week (Meetings).'
    )
  }

  if (params.meetings.impact.wastedFragmentsHours > 0) {
    index.meeting_fragments_week = makeCitation(
      'meeting_fragments_week',
      'Fragmented meeting time',
      `${params.meetings.impact.wastedFragmentsHours}h`,
      'Short meeting fragments that break focus blocks this week (Meetings).'
    )
  }

  const latestSprint = params.planning.sprints[params.planning.sprints.length - 1]
  if (latestSprint) {
    const sprint = latestSprint.label

    if (latestSprint.committedHours > 0) {
      index.sprint_committed_hours = makeCitation(
        'sprint_committed_hours',
        `${sprint} committed hours`,
        `${latestSprint.committedHours}h`,
        `Hours committed for ${sprint} from sprint planning (Planning).`
      )
    }

    if (latestSprint.actualHours > 0) {
      index.sprint_actual_hours = makeCitation(
        'sprint_actual_hours',
        `${sprint} logged hours`,
        `${latestSprint.actualHours}h`,
        `Total tracked hours during ${sprint}, from work_sessions (Planning).`
      )
    }

    if (latestSprint.deepHours > 0) {
      index.sprint_deep_hours = makeCitation(
        'sprint_deep_hours',
        `${sprint} deep-work hours`,
        `${latestSprint.deepHours}h`,
        `Deep-work hours during ${sprint}, from work_sessions category breakdown (Planning).`
      )
    }

    if (latestSprint.meetingHours > 0) {
      index.sprint_meeting_hours = makeCitation(
        'sprint_meeting_hours',
        `${sprint} meeting hours`,
        `${latestSprint.meetingHours}h`,
        `Meeting hours during ${sprint}, from work_sessions (Planning).`
      )
    }

    if (latestSprint.interruptedHours > 0) {
      index.sprint_interrupted_hours = makeCitation(
        'sprint_interrupted_hours',
        `${sprint} interrupted hours`,
        `${latestSprint.interruptedHours}h`,
        `Interrupted work time during ${sprint}, from work_sessions (Planning).`
      )
    }

    if (latestSprint.committedHours > 0) {
      index.sprint_efficiency = makeCitation(
        'sprint_efficiency',
        `${sprint} delivery efficiency`,
        `${Math.round(latestSprint.efficiencyRatio * 100)}%`,
        `Deep-work share of logged hours in ${sprint} — delivered vs committed context (Planning).`
      )
    }

    if (latestSprint.expectedDelivery > 0) {
      index.sprint_expected_delivery = makeCitation(
        'sprint_expected_delivery',
        `${sprint} expected delivery`,
        `${latestSprint.expectedDelivery}h`,
        `Projected deliverable hours for ${sprint} based on current efficiency (Planning).`
      )
    }
  }

  const cost = params.planning.costBreakdown
  if (cost.total > 0) {
    index.sprint_focus_cost = makeCitation(
      'sprint_focus_cost',
      'Focus leakage cost (sprint)',
      `$${cost.total}`,
      `Estimated cost of meetings, interruptions, and context switching in the active sprint (Planning).`
    )
  }

  for (const member of params.context.members) {
    if (member.contextSwitchesPerDay > 0) {
      const key = `context_switches_${slugify(member.displayName)}`
      index[key] = makeCitation(
        key,
        `${member.displayName} context switches/day`,
        `${member.contextSwitchesPerDay}`,
        `Daily context switches for ${member.displayName}, from activity patterns (Context load).`
      )
    }

    if (member.meetingRatio > 0) {
      const key = `meeting_ratio_${slugify(member.displayName)}`
      index[key] = makeCitation(
        key,
        `${member.displayName} meeting ratio`,
        `${Math.round(member.meetingRatio * 100)}%`,
        `Share of ${member.displayName}'s tracked time in meetings this week (Context load).`
      )
    }

    if (member.burnoutIndex >= 50) {
      const key = `burnout_${slugify(member.displayName)}`
      index[key] = makeCitation(
        key,
        `${member.displayName} burnout index`,
        `${member.burnoutIndex}`,
        `Burnout risk for ${member.displayName} from context switches, meetings, and backlog load (Context load).`
      )
    }

    if (member.activeBacklogs > 0) {
      const key = `backlogs_${slugify(member.displayName)}`
      index[key] = makeCitation(
        key,
        `${member.displayName} active backlogs`,
        `${member.activeBacklogs}`,
        `Number of active Jira backlogs ${member.displayName} is contributing to (Context load).`
      )
    }
  }

  for (const gap of params.planning.perPersonGap) {
    if (gap.actualHours <= 0) continue
    const key = `gap_${slugify(gap.displayName)}`
    index[key] = makeCitation(
      key,
      `${gap.displayName} sprint share vs actual`,
      `${gap.gapPercent}% gap`,
      `${gap.displayName}: ${gap.actualHours}h logged vs expected share. Likely cause: ${gap.likelyCause} (Planning).`
    )
  }

  for (const member of params.workflow.members) {
    if (!member.currentActivity) continue
    const key = `active_now_${slugify(member.displayName)}`
    index[key] = makeCitation(
      key,
      `${member.displayName} current activity`,
      member.currentActivity.description.slice(0, 60) + (member.currentActivity.description.length > 60 ? '…' : ''),
      `Latest tracked activity for ${member.displayName} from activity_reports (Workflow).`
    )
  }

  params.vectorMatches?.forEach((match, i) => {
    const key = `doc_${slugify(match.sourceName) || i}`
    const excerpt =
      match.excerpt.slice(0, 50) + (match.excerpt.length > 50 ? '…' : '')
    index[key] = makeCitation(
      key,
      `Document · ${match.sourceName}`,
      excerpt,
      `Semantic match (${Math.round(match.similarity * 100)}% similarity) from uploaded file "${match.sourceName}".`
    )
  })

  params.sessionDocuments?.forEach((doc, i) => {
    const key = `session_doc_${slugify(doc.fileName) || i}`
    if (index[key]) return
    index[key] = makeCitation(
      key,
      `Attached document`,
      doc.fileName,
      'Text extracted from a file attached in this chat session (not stored as a full file).'
    )
  })

  params.ragMatches?.forEach((match, i) => {
    const key = `past_chat_${i + 1}`
    const snippet =
      match.content.slice(0, 40) + (match.content.length > 40 ? '…' : '')
    index[key] = makeCitation(
      key,
      `Past coach chat (${match.role})`,
      snippet,
      `Relevant excerpt from a previous coach conversation (${match.role} message).`
    )
  })

  return index
}

export function buildCitationPromptBlock(index: CoachCitationIndex): string {
  const keys = Object.values(index)
  if (keys.length === 0) {
    return 'Citation index: (empty — do not invent metrics; say what is unavailable).'
  }

  const lines = keys.map(
    (c) =>
      `- ${c.key}: value="${c.value}" · cite as [[cite:${c.key}|${c.value}]] or [[cite:${c.key}|short phrase]] · ${c.detail}`
  )

  return `Citation index — cite each specific metric with its key (never invent keys):\n${lines.join('\n')}`
}

/** Generic fallback when citation map was not stored with the message. */
export const CITATION_SOURCE_HINTS: Record<string, Pick<CoachCitation, 'label' | 'source' | 'detail'>> = {
  team_flow_score: {
    label: 'Team flow score today',
    source: 'Team flow score today',
    detail: 'Team flow score from work_sessions today (Flow State).',
  },
  meeting_load_pct: {
    label: 'Meeting load this week',
    source: 'Meeting load this week',
    detail: 'Meeting share of tracked work time this week.',
  },
  avg_recovery_min: {
    label: 'Post-meeting recovery',
    source: 'Post-meeting recovery',
    detail: 'Average recovery time after meetings.',
  },
  sprint_efficiency: {
    label: 'Sprint delivery efficiency',
    source: 'Sprint delivery efficiency',
    detail: 'Deep-work efficiency for the active sprint.',
  },
  sprint_deep_hours: {
    label: 'Sprint deep-work hours',
    source: 'Sprint deep-work hours',
    detail: 'Deep-work hours logged in the active sprint.',
  },
  sprint_committed_hours: {
    label: 'Sprint committed hours',
    source: 'Sprint committed hours',
    detail: 'Hours committed for the active sprint.',
  },
}

export function resolveCitation(
  key: string,
  index?: CoachCitationIndex
): CoachCitation | null {
  if (index?.[key]) return index[key]
  const hint = CITATION_SOURCE_HINTS[key]
  if (hint) {
    return { key, value: '', ...hint }
  }
  if (key.startsWith('member_flow_')) {
    const name = key.replace('member_flow_', '').replace(/_/g, ' ')
    return {
      key,
      label: `${name} flow today`,
      value: '',
      source: `${name} flow today`,
      detail: 'Individual flow score from work_sessions today (Flow State).',
    }
  }
  if (key.startsWith('sprint_')) {
    const metric = key.replace('sprint_', '').replace(/_/g, ' ')
    return {
      key,
      label: `Sprint ${metric}`,
      value: '',
      source: `Sprint ${metric}`,
      detail: 'Sprint metric from Planning dashboard.',
    }
  }
  if (key.startsWith('doc_') || key.startsWith('session_doc_')) {
    return {
      key,
      label: 'Uploaded document',
      value: '',
      source: 'Uploaded document',
      detail: 'Excerpt from a document attached to the coach.',
    }
  }
  if (key.startsWith('past_chat_')) {
    return {
      key,
      label: 'Past coach chat',
      value: '',
      source: 'Past coach chat',
      detail: 'Snippet from a previous coach conversation.',
    }
  }
  return null
}
