import { createClient } from '@/lib/supabase/server'
import { getTicket, getTicketChangelog } from '@/lib/jira'
import type {
  FlowState,
  FlowStateData,
  MemberFlowState,
  TrendPoint,
  TimelineSlot,
  ContextLoadData,
  MemberContextLoad,
  BurnoutLevel,
  PlanningData,
  SprintPlanningData,
  MemberEstimation,
  CostBreakdown,
  MemberGap,
  ConfidenceLevel,
  MeetingsData,
  FocusCell,
  SuggestedWindow,
  FlaggedWindow,
  StandupHealthData,
  MemberBase,
  WorkflowData,
  WorkflowEntry,
  MemberWorkflow,
} from '@/lib/types/dashboard'
import type { TicketSnapshot } from '@/lib/supabase/database.types'

// ============ THRESHOLDS (all configurable, zero hardcoded values) ============

/** Burnout index weight for each active backlog beyond 1 */
const BURNOUT_BACKLOG_WEIGHT = 15
/** Burnout index weight for each context switch per day */
const BURNOUT_SWITCH_WEIGHT = 5
/** Burnout index weight for meeting ratio (0–1 scaled to 0–30) */
const BURNOUT_MEETING_WEIGHT = 30
/** Below this burnout index → healthy */
const BURNOUT_HEALTHY_THRESHOLD = 40
/** Below this burnout index → warning, above → danger */
const BURNOUT_WARNING_THRESHOLD = 70
/** Weekly hours recovered per reduced backlog */
const BURNOUT_RECOVERY_PER_BACKLOG = 1.5

/** Max backlogs considered healthy */
const BACKLOG_HEALTHY_LIMIT = 2
/** Max backlogs before warning */
const BACKLOG_WARNING_LIMIT = 3

/** Context switches per day considered healthy */
const SWITCHES_HEALTHY_LIMIT = 3
/** Context switches per day considered warning */
const SWITCHES_WARNING_LIMIT = 6

/** Each report represents 30 seconds of activity */
const REPORT_INTERVAL_SECONDS = 30

/** Minimum gap (minutes) to be considered a "usable fragment" between meetings */
const MIN_USABLE_GAP_MINUTES = 15

/** Load factor weights for estimation */
const ESTIMATION_BACKLOG_WEIGHT = 0.2
const ESTIMATION_SWITCH_WEIGHT = 0.05

/** Confidence thresholds by sample size */
const CONFIDENCE_HIGH_THRESHOLD = 10
const CONFIDENCE_MEDIUM_THRESHOLD = 4

/** Jira ticket key format validation */
const JIRA_KEY_REGEX = /^[A-Z]+-\d+$/

// ============ HELPERS ============

type CategoryBreakdown = {
  deep_work?: number
  meeting?: number
  shallow?: number
  interrupted?: number
}

function parseCategoryBreakdown(raw: unknown): CategoryBreakdown {
  if (typeof raw !== 'object' || raw === null) return {}
  const obj = raw as Record<string, unknown>
  const result: CategoryBreakdown = { deep_work: 0, meeting: 0, shallow: 0, interrupted: 0 }
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val !== 'number') continue
    const state = mapFlowState(key)
    result[state] = (result[state] ?? 0) + val
  }
  return result
}

function parseJiraBreakdown(raw: unknown): Record<string, number> {
  if (typeof raw !== 'object' || raw === null) return {}
  const obj = raw as Record<string, unknown>
  const result: Record<string, number> = {}
  for (const [key, val] of Object.entries(obj)) {
    if (JIRA_KEY_REGEX.test(key) && typeof val === 'number') {
      result[key] = val
    }
  }
  return result
}

function sumBreakdown(b: CategoryBreakdown): number {
  return (b.deep_work ?? 0) + (b.meeting ?? 0) + (b.shallow ?? 0) + (b.interrupted ?? 0)
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0]
}

const DEEP_WORK_CATEGORIES = new Set([
  'coding', 'debugging', 'testing', 'devops', 'database', 'design',
  'prototyping', 'uxdesign', 'writing', 'editing', 'contentcreation',
  'copywriting', 'campaignmanagement', 'seo', 'socialmedia', 'crm',
  'proposals', 'prospecting', 'documentation', 'sales', 'general',
  'deep_work', 'deep work', 'focus work',
])

const MEETING_CATEGORIES = new Set([
  'meeting', 'meetings', 'clientcalls',
])

const INTERRUPTED_CATEGORIES = new Set([
  'interrupted',
])

function mapFlowState(category: string): FlowState {
  const lower = category.toLowerCase()
  if (DEEP_WORK_CATEGORIES.has(lower)) return 'deep_work'
  if (MEETING_CATEGORIES.has(lower)) return 'meeting'
  if (INTERRUPTED_CATEGORIES.has(lower)) return 'interrupted'
  return 'shallow'
}

function buildMemberBase(profile: { id: string; display_name: string | null; avatar_url: string | null }): MemberBase {
  return {
    userId: profile.id,
    displayName: profile.display_name ?? 'Unknown',
    avatarUrl: profile.avatar_url ?? '',
  }
}

// ============ getFlowStateData ============

async function fetchFlowStateData(teamId: string, date: Date): Promise<FlowStateData> {
  const supabase = await createClient()
  const dateStr = toDateStr(date)

  const thirtyDaysAgo = new Date(date)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const thirtyDaysStr = toDateStr(thirtyDaysAgo)

  const [sessionsRes, reportsRes, trendSessionsRes, membersRes] = await Promise.all([
    supabase
      .from('work_sessions')
      .select('user_id, duration_seconds, category_breakdown')
      .eq('team_id', teamId)
      .eq('session_date', dateStr),
    supabase
      .from('activity_reports')
      .select('user_id, category, captured_at')
      .eq('team_id', teamId)
      .gte('captured_at', `${dateStr}T00:00:00`)
      .lt('captured_at', `${dateStr}T23:59:59`)
      .order('captured_at', { ascending: true }),
    supabase
      .from('work_sessions')
      .select('session_date, user_id, category_breakdown')
      .eq('team_id', teamId)
      .gte('session_date', thirtyDaysStr)
      .lte('session_date', dateStr),
    supabase
      .from('team_members')
      .select('user_id, profile:profiles!team_members_user_id_fkey(id, display_name, avatar_url)')
      .eq('team_id', teamId),
  ])

  if (sessionsRes.error) throw new Error(`FlowSight [getFlowStateData]: ${sessionsRes.error.message}`)
  if (reportsRes.error) throw new Error(`FlowSight [getFlowStateData]: ${reportsRes.error.message}`)
  if (trendSessionsRes.error) throw new Error(`FlowSight [getFlowStateData]: ${trendSessionsRes.error.message}`)
  if (membersRes.error) throw new Error(`FlowSight [getFlowStateData]: ${membersRes.error.message}`)

  const sessions = sessionsRes.data ?? []
  const reports = reportsRes.data ?? []
  const trendSessions = trendSessionsRes.data ?? []
  const members = (membersRes.data ?? []) as unknown as Array<{
    user_id: string
    profile: { id: string; display_name: string | null; avatar_url: string | null }
  }>

  // Flow score per user today: deep_work / total * 100
  const userFlowScores = new Map<string, number>()
  const userSessionMap = new Map<string, CategoryBreakdown[]>()
  for (const s of sessions) {
    const cb = parseCategoryBreakdown(s.category_breakdown)
    if (!userSessionMap.has(s.user_id)) userSessionMap.set(s.user_id, [])
    userSessionMap.get(s.user_id)!.push(cb)
  }

  for (const [uid, breakdowns] of Array.from(userSessionMap.entries())) {
    let totalDeep = 0
    let totalAll = 0
    for (const b of breakdowns) {
      totalDeep += b.deep_work ?? 0
      totalAll += sumBreakdown(b)
    }
    userFlowScores.set(uid, totalAll > 0 ? (totalDeep / totalAll) * 100 : 0)
  }

  const allScores = Array.from(userFlowScores.values())
  const teamFlowScore = allScores.length > 0
    ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
    : 0

  // 30-day trend: per day, mean of all members' flow scores
  const dayScores = new Map<string, number[]>()
  for (const s of trendSessions) {
    const cb = parseCategoryBreakdown(s.category_breakdown)
    const total = sumBreakdown(cb)
    const score = total > 0 ? ((cb.deep_work ?? 0) / total) * 100 : 0
    if (!dayScores.has(s.session_date)) dayScores.set(s.session_date, [])
    dayScores.get(s.session_date)!.push(score)
  }

  const trend30d: TrendPoint[] = []
  for (let i = 30; i >= 0; i--) {
    const d = new Date(date)
    d.setDate(d.getDate() - i)
    const ds = toDateStr(d)
    const scores = dayScores.get(ds)
    trend30d.push({
      date: ds,
      score: scores ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    })
  }

  // Per-user activity reports for timeline + streak + recovery
  const userReports = new Map<string, Array<{ category: string; captured_at: string }>>()
  for (const r of reports) {
    if (!userReports.has(r.user_id)) userReports.set(r.user_id, [])
    userReports.get(r.user_id)!.push(r)
  }

  const memberResults: MemberFlowState[] = members.map((m) => {
    const base = buildMemberBase(m.profile)
    const reps = userReports.get(m.user_id) ?? []

    // Timeline: bucket by hour (8–17), dominant category per hour
    const timelineToday: TimelineSlot[] = []
    for (let hour = 8; hour <= 17; hour++) {
      const hourReports = reps.filter((r) => new Date(r.captured_at).getHours() === hour)
      if (hourReports.length === 0) {
        timelineToday.push({ hour, state: null })
        continue
      }
      const counts: Record<string, number> = {}
      for (const r of hourReports) {
        const st = mapFlowState(r.category)
        counts[st] = (counts[st] || 0) + 1
      }
      const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as FlowState
      timelineToday.push({ hour, state: dominant })
    }

    // Longest consecutive deep_work streak in minutes
    let maxStreak = 0
    let currentStreak = 0
    for (const r of reps) {
      if (mapFlowState(r.category) === 'deep_work') {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    }
    const longestStreakMin = Math.round(maxStreak * (REPORT_INTERVAL_SECONDS / 60) * 10) / 10

    // Recovery time: gap from last interrupted → next deep_work
    const recoveryGaps: number[] = []
    for (let i = 0; i < reps.length - 1; i++) {
      if (mapFlowState(reps[i].category) === 'interrupted') {
        for (let j = i + 1; j < reps.length; j++) {
          if (mapFlowState(reps[j].category) === 'deep_work') {
            const gap = (new Date(reps[j].captured_at).getTime() - new Date(reps[i].captured_at).getTime()) / 60000
            recoveryGaps.push(gap)
            break
          }
        }
      }
    }
    const recoveryTimeAvg = recoveryGaps.length > 0
      ? Math.round(recoveryGaps.reduce((a, b) => a + b, 0) / recoveryGaps.length)
      : 0

    return {
      ...base,
      flowScoreToday: Math.round(userFlowScores.get(m.user_id) ?? 0),
      timelineToday,
      longestStreakMin,
      recoveryTimeAvg,
    }
  })

  return { teamFlowScore, trend30d, members: memberResults }
}

export async function getFlowStateData(teamId: string, date: Date): Promise<FlowStateData> {
  return fetchFlowStateData(teamId, date)
}

// ============ getContextLoadData ============

export async function getContextLoadData(
  teamId: string,
  weekStart: Date,
  weekEnd: Date
): Promise<ContextLoadData> {
  const supabase = await createClient()
  const startStr = toDateStr(weekStart)
  const endStr = toDateStr(weekEnd)

  const [sessionsRes, reportsRes, membersRes] = await Promise.all([
    supabase
      .from('work_sessions')
      .select('user_id, category_breakdown, jira_breakdown, session_date')
      .eq('team_id', teamId)
      .gte('session_date', startStr)
      .lte('session_date', endStr),
    supabase
      .from('activity_reports')
      .select('user_id, category, captured_at, jira_ticket_id')
      .eq('team_id', teamId)
      .gte('captured_at', `${startStr}T00:00:00`)
      .lte('captured_at', `${endStr}T23:59:59`)
      .order('user_id', { ascending: true })
      .order('captured_at', { ascending: true }),
    supabase
      .from('team_members')
      .select('user_id, profile:profiles!team_members_user_id_fkey(id, display_name, avatar_url)')
      .eq('team_id', teamId),
  ])

  if (sessionsRes.error) throw new Error(`FlowSight [getContextLoadData]: ${sessionsRes.error.message}`)
  if (reportsRes.error) throw new Error(`FlowSight [getContextLoadData]: ${reportsRes.error.message}`)
  if (membersRes.error) throw new Error(`FlowSight [getContextLoadData]: ${membersRes.error.message}`)

  const sessions = sessionsRes.data ?? []
  const reports = reportsRes.data ?? []
  const membersRaw = (membersRes.data ?? []) as unknown as Array<{
    user_id: string
    profile: { id: string; display_name: string | null; avatar_url: string | null }
  }>

  // Group sessions and reports by user
  const userSessions = new Map<string, typeof sessions>()
  for (const s of sessions) {
    if (!userSessions.has(s.user_id)) userSessions.set(s.user_id, [])
    userSessions.get(s.user_id)!.push(s)
  }

  const userReports = new Map<string, typeof reports>()
  for (const r of reports) {
    if (!userReports.has(r.user_id)) userReports.set(r.user_id, [])
    userReports.get(r.user_id)!.push(r)
  }

  // Compute focus streak history dates (last 5 work days ending at weekEnd)
  const streakDates: string[] = []
  const d = new Date(weekEnd)
  while (streakDates.length < 5) {
    const dow = d.getDay()
    if (dow >= 1 && dow <= 5) streakDates.unshift(toDateStr(d))
    d.setDate(d.getDate() - 1)
  }

  const members: MemberContextLoad[] = membersRaw.map((m) => {
    const base = buildMemberBase(m.profile)
    const uSessions = userSessions.get(m.user_id) ?? []
    const uReports = userReports.get(m.user_id) ?? []

    // Active backlogs: distinct Jira project prefixes from jira_breakdown keys
    const projectPrefixes = new Set<string>()
    for (const s of uSessions) {
      const jb = parseJiraBreakdown(s.jira_breakdown)
      for (const key of Object.keys(jb)) {
        projectPrefixes.add(key.split('-')[0])
      }
    }
    const activeBacklogs = projectPrefixes.size

    // Context switches per day: consecutive pairs where category changes
    const reportsByDay = new Map<string, string[]>()
    for (const r of uReports) {
      const day = toDateStr(new Date(r.captured_at))
      if (!reportsByDay.has(day)) reportsByDay.set(day, [])
      reportsByDay.get(day)!.push(r.category)
    }

    let totalSwitches = 0
    let dayCount = 0
    for (const categories of Array.from(reportsByDay.values())) {
      dayCount++
      for (let i = 1; i < categories.length; i++) {
        if (categories[i] !== categories[i - 1]) totalSwitches++
      }
    }
    const contextSwitchesPerDay = dayCount > 0 ? Math.round((totalSwitches / dayCount) * 10) / 10 : 0

    // Focus streak history: longest consecutive deep_work per day (last 5 days)
    const focusStreakHistory = streakDates.map((day) => {
      const dayReports = uReports.filter((r) => toDateStr(new Date(r.captured_at)) === day)
      let maxStreak = 0
      let cur = 0
      for (const r of dayReports) {
        if (mapFlowState(r.category) === 'deep_work') {
          cur++
          maxStreak = Math.max(maxStreak, cur)
        } else {
          cur = 0
        }
      }
      return Math.round(maxStreak * (REPORT_INTERVAL_SECONDS / 60) * 10) / 10
    })

    // Meeting ratio from sessions
    let totalMeetingSec = 0
    let totalSec = 0
    for (const s of uSessions) {
      const cb = parseCategoryBreakdown(s.category_breakdown)
      totalMeetingSec += cb.meeting ?? 0
      totalSec += sumBreakdown(cb)
    }
    const meetingRatio = totalSec > 0 ? totalMeetingSec / totalSec : 0

    // Burnout index: composite signal
    const rawBurnout =
      activeBacklogs * BURNOUT_BACKLOG_WEIGHT +
      contextSwitchesPerDay * BURNOUT_SWITCH_WEIGHT +
      meetingRatio * BURNOUT_MEETING_WEIGHT
    const burnoutIndex = clamp(Math.round(rawBurnout), 0, 100)

    let burnoutLevel: BurnoutLevel = 'healthy'
    if (burnoutIndex >= BURNOUT_WARNING_THRESHOLD) burnoutLevel = 'danger'
    else if (burnoutIndex >= BURNOUT_HEALTHY_THRESHOLD) burnoutLevel = 'warning'

    // Suggestion for high burnout
    let suggestion: string | null = null
    if (burnoutIndex > 60 && activeBacklogs > BACKLOG_HEALTHY_LIMIT) {
      const reduced = Math.max(activeBacklogs - 2, 1)
      const recovered = (activeBacklogs - reduced) * BURNOUT_RECOVERY_PER_BACKLOG
      suggestion = `Reducing active backlogs from ${activeBacklogs} → ${reduced} recovers ~${recovered.toFixed(1)}h/week`
    }

    return {
      ...base,
      activeBacklogs,
      contextSwitchesPerDay,
      focusStreakHistory,
      burnoutIndex,
      burnoutLevel,
      meetingRatio,
      suggestion,
    }
  })

  return { members }
}

// ============ getPlanningData ============

export async function getPlanningData(teamId: string, sprintCount = 4): Promise<PlanningData> {
  const supabase = await createClient()

  const [commitmentsRes, membersRes] = await Promise.all([
    supabase
      .from('sprint_commitments')
      .select('id, sprint_label, jira_sprint_id, committed_hours, starts_at, ends_at, cost_per_hour')
      .eq('team_id', teamId)
      .order('starts_at', { ascending: false })
      .limit(sprintCount),
    supabase
      .from('team_members')
      .select('user_id, profile:profiles!team_members_user_id_fkey(id, display_name, avatar_url)')
      .eq('team_id', teamId),
  ])

  // Gracefully handle missing sprint_commitments table (not yet migrated)
  if (commitmentsRes.error) {
    const isTableMissing = commitmentsRes.error.message.includes('schema cache') ||
      commitmentsRes.error.code === '42P01'
    if (isTableMissing) {
      return {
        sprints: [],
        estimations: [],
        costBreakdown: { meetingsCost: 0, interruptionCost: 0, contextCost: 0, total: 0 },
        perPersonGap: [],
        costPerHour: 50,
      }
    }
    throw new Error(`FlowSight [getPlanningData]: ${commitmentsRes.error.message}`)
  }
  if (membersRes.error) throw new Error(`FlowSight [getPlanningData]: ${membersRes.error.message}`)

  const commitments = commitmentsRes.data ?? []
  const membersRaw = (membersRes.data ?? []) as unknown as Array<{
    user_id: string
    profile: { id: string; display_name: string | null; avatar_url: string | null }
  }>

  if (commitments.length === 0) {
    return {
      sprints: [],
      estimations: [],
      costBreakdown: { meetingsCost: 0, interruptionCost: 0, contextCost: 0, total: 0 },
      perPersonGap: [],
      costPerHour: 50,
    }
  }

  // Date range covering all sprints
  const allStarts = commitments.map((c) => c.starts_at)
  const allEnds = commitments.map((c) => c.ends_at)
  const minDate = allStarts.sort()[0]
  const maxDate = allEnds.sort().reverse()[0]

  const [sessionsRes, snapshotsRes] = await Promise.all([
    supabase
      .from('work_sessions')
      .select('user_id, duration_seconds, category_breakdown, jira_breakdown, session_date')
      .eq('team_id', teamId)
      .gte('session_date', minDate)
      .lte('session_date', maxDate),
    supabase
      .from('ticket_snapshots')
      .select('user_id, total_seconds, adjusted_seconds, avg_load_factor, avg_active_backlogs, jira_project_key, closed_at')
      .eq('team_id', teamId)
      .gte('closed_at', `${minDate}T00:00:00`)
      .lte('closed_at', `${maxDate}T23:59:59`),
  ])

  if (sessionsRes.error) throw new Error(`FlowSight [getPlanningData]: ${sessionsRes.error.message}`)
  // ticket_snapshots table may not exist yet
  if (snapshotsRes.error) {
    const isTableMissing = snapshotsRes.error.message.includes('schema cache') ||
      snapshotsRes.error.code === '42P01'
    if (!isTableMissing) throw new Error(`FlowSight [getPlanningData]: ${snapshotsRes.error.message}`)
  }

  const allSessions = sessionsRes.data ?? []
  const allSnapshots = snapshotsRes.data ?? []

  const latestCostPerHour = commitments[0]?.cost_per_hour ?? 50

  // Build sprint data
  const sprints: SprintPlanningData[] = commitments.reverse().map((c) => {
    const sprintSessions = allSessions.filter(
      (s) => s.session_date >= c.starts_at && s.session_date <= c.ends_at
    )

    let totalSec = 0
    let deepSec = 0
    let meetingSec = 0
    let interruptedSec = 0

    for (const s of sprintSessions) {
      totalSec += s.duration_seconds
      const cb = parseCategoryBreakdown(s.category_breakdown)
      deepSec += cb.deep_work ?? 0
      meetingSec += cb.meeting ?? 0
      interruptedSec += cb.interrupted ?? 0
    }

    const actualHours = totalSec / 3600
    const deepHours = deepSec / 3600
    const meetingHours = meetingSec / 3600
    const interruptedHours = interruptedSec / 3600
    const efficiencyRatio = actualHours > 0 ? deepHours / actualHours : 0
    const expectedDelivery = c.committed_hours * efficiencyRatio

    return {
      label: c.sprint_label,
      sprintId: c.jira_sprint_id,
      committedHours: c.committed_hours,
      actualHours: Math.round(actualHours * 10) / 10,
      deepHours: Math.round(deepHours * 10) / 10,
      meetingHours: Math.round(meetingHours * 10) / 10,
      interruptedHours: Math.round(interruptedHours * 10) / 10,
      efficiencyRatio: Math.round(efficiencyRatio * 100) / 100,
      expectedDelivery: Math.round(expectedDelivery * 10) / 10,
    }
  })

  // Estimation per user from ticket_snapshots
  const userSnapshots = new Map<string, typeof allSnapshots>()
  for (const snap of allSnapshots) {
    if (!userSnapshots.has(snap.user_id)) userSnapshots.set(snap.user_id, [])
    userSnapshots.get(snap.user_id)!.push(snap)
  }

  // Context load data needed for load factor
  const userJiraProjects = new Map<string, Set<string>>()
  for (const s of allSessions) {
    const jb = parseJiraBreakdown(s.jira_breakdown)
    if (!userJiraProjects.has(s.user_id)) userJiraProjects.set(s.user_id, new Set())
    for (const key of Object.keys(jb)) {
      userJiraProjects.get(s.user_id)!.add(key.split('-')[0])
    }
  }

  const estimations: MemberEstimation[] = membersRaw.map((m) => {
    const base = buildMemberBase(m.profile)
    const snaps = userSnapshots.get(m.user_id) ?? []
    const sampleSize = snaps.length

    const avgAdjustedSec = sampleSize > 0
      ? snaps.reduce((sum, s) => sum + s.adjusted_seconds, 0) / sampleSize
      : 0

    const activeBacklogs = userJiraProjects.get(m.user_id)?.size ?? 0
    const currentLoadFactor = 1 + activeBacklogs * ESTIMATION_BACKLOG_WEIGHT
    const predictedHours = (avgAdjustedSec * currentLoadFactor) / 3600

    let confidence: ConfidenceLevel = 'low'
    if (sampleSize >= CONFIDENCE_HIGH_THRESHOLD) confidence = 'high'
    else if (sampleSize >= CONFIDENCE_MEDIUM_THRESHOLD) confidence = 'medium'

    return {
      ...base,
      baseEstimateHours: Math.round((avgAdjustedSec / 3600) * 10) / 10,
      currentLoadFactor: Math.round(currentLoadFactor * 100) / 100,
      predictedHours: Math.round(predictedHours * 10) / 10,
      sampleSize,
      confidence,
    }
  })

  // Cost breakdown for the latest sprint
  const latest = sprints[sprints.length - 1]
  const costPerHour = latestCostPerHour
  const meetingsCost = latest ? latest.meetingHours * costPerHour : 0
  const interruptionCost = latest ? latest.interruptedHours * costPerHour : 0
  const contextCost = latest
    ? (latest.actualHours - latest.deepHours - latest.meetingHours) * costPerHour
    : 0

  const costBreakdown: CostBreakdown = {
    meetingsCost: Math.round(meetingsCost),
    interruptionCost: Math.round(interruptionCost),
    contextCost: Math.max(0, Math.round(contextCost)),
    total: Math.round(meetingsCost + interruptionCost + Math.max(0, contextCost)),
  }

  // Per-person gap in latest sprint
  const latestCommitment = commitments[commitments.length - 1]
  const latestSessions = latestCommitment
    ? allSessions.filter(
        (s) => s.session_date >= latestCommitment.starts_at && s.session_date <= latestCommitment.ends_at
      )
    : []

  const userHours = new Map<string, { total: number; meetings: number; interrupted: number; backlogs: number }>()
  for (const s of latestSessions) {
    const cb = parseCategoryBreakdown(s.category_breakdown)
    const current = userHours.get(s.user_id) ?? { total: 0, meetings: 0, interrupted: 0, backlogs: 0 }
    current.total += s.duration_seconds / 3600
    current.meetings += (cb.meeting ?? 0) / 3600
    current.interrupted += (cb.interrupted ?? 0) / 3600
    userHours.set(s.user_id, current)
  }

  const memberCount = membersRaw.length || 1
  const shareHours = latestCommitment ? latestCommitment.committed_hours / memberCount : 0

  const perPersonGap: MemberGap[] = membersRaw.map((m) => {
    const base = buildMemberBase(m.profile)
    const hours = userHours.get(m.user_id) ?? { total: 0, meetings: 0, interrupted: 0, backlogs: 0 }
    const gapPercent = shareHours > 0 ? ((hours.total - shareHours) / shareHours) * 100 : 0

    // Determine likely cause of gap
    let likelyCause = 'Balanced workload'
    if (Math.abs(gapPercent) > 10) {
      const maxDriver = Math.max(hours.meetings, hours.interrupted)
      if (maxDriver === hours.meetings) likelyCause = 'High meeting load'
      else likelyCause = 'Frequent interruptions'
    }

    return {
      ...base,
      actualHours: Math.round(hours.total * 10) / 10,
      shareHours: Math.round(shareHours * 10) / 10,
      gapPercent: Math.round(gapPercent),
      likelyCause,
    }
  })

  return { sprints, estimations, costBreakdown, perPersonGap, costPerHour }
}

// ============ getMeetingsData ============

export async function getMeetingsData(
  teamId: string,
  weekStart: Date,
  weekEnd: Date
): Promise<MeetingsData> {
  const supabase = await createClient()
  const startStr = toDateStr(weekStart)
  const endStr = toDateStr(weekEnd)

  const [meetingReportsRes, allReportsRes, sessionsRes] = await Promise.all([
    supabase
      .from('activity_reports')
      .select('user_id, captured_at, duration_seconds')
      .eq('team_id', teamId)
      .eq('category', 'meeting')
      .gte('captured_at', `${startStr}T00:00:00`)
      .lte('captured_at', `${endStr}T23:59:59`)
      .order('captured_at', { ascending: true }),
    supabase
      .from('activity_reports')
      .select('user_id, category, captured_at, description')
      .eq('team_id', teamId)
      .gte('captured_at', `${startStr}T00:00:00`)
      .lte('captured_at', `${endStr}T23:59:59`)
      .order('user_id', { ascending: true })
      .order('captured_at', { ascending: true }),
    supabase
      .from('work_sessions')
      .select('user_id, category_breakdown, session_date')
      .eq('team_id', teamId)
      .gte('session_date', startStr)
      .lte('session_date', endStr),
  ])

  if (meetingReportsRes.error) throw new Error(`FlowSight [getMeetingsData]: ${meetingReportsRes.error.message}`)
  if (allReportsRes.error) throw new Error(`FlowSight [getMeetingsData]: ${allReportsRes.error.message}`)
  if (sessionsRes.error) throw new Error(`FlowSight [getMeetingsData]: ${sessionsRes.error.message}`)

  const meetingReports = meetingReportsRes.data ?? []
  const allReports = allReportsRes.data ?? []
  const allSessions = sessionsRes.data ?? []

  // Total meeting time and percentage
  let totalMeetingSec = 0
  let totalWorkSec = 0
  for (const s of allSessions) {
    const cb = parseCategoryBreakdown(s.category_breakdown)
    totalMeetingSec += cb.meeting ?? 0
    totalWorkSec += sumBreakdown(cb)
  }

  const totalMeetingHours = Math.round((totalMeetingSec / 3600) * 10) / 10
  const meetingPct = totalWorkSec > 0 ? Math.round((totalMeetingSec / totalWorkSec) * 100) : 0

  // Recovery after meeting: for each user, find meeting end → next deep_work start
  const userAllReports = new Map<string, typeof allReports>()
  for (const r of allReports) {
    if (!userAllReports.has(r.user_id)) userAllReports.set(r.user_id, [])
    userAllReports.get(r.user_id)!.push(r)
  }

  const recoveryMinutes: number[] = []
  for (const reps of Array.from(userAllReports.values())) {
    for (let i = 0; i < reps.length - 1; i++) {
      if (mapFlowState(reps[i].category) === 'meeting') {
        for (let j = i + 1; j < reps.length; j++) {
          if (mapFlowState(reps[j].category) === 'deep_work') {
            const gap = (new Date(reps[j].captured_at).getTime() - new Date(reps[i].captured_at).getTime()) / 60000
            recoveryMinutes.push(gap)
            break
          }
        }
      }
    }
  }
  const avgRecoveryMin = recoveryMinutes.length > 0
    ? Math.round(recoveryMinutes.reduce((a, b) => a + b, 0) / recoveryMinutes.length)
    : 0

  // Wasted fragments: gaps between consecutive meetings < 15 min
  let wastedSec = 0
  const sortedMeetings = [...meetingReports].sort(
    (a, b) => new Date(a.captured_at).getTime() - new Date(b.captured_at).getTime()
  )
  for (let i = 1; i < sortedMeetings.length; i++) {
    const gap = (new Date(sortedMeetings[i].captured_at).getTime() -
      new Date(sortedMeetings[i - 1].captured_at).getTime()) / 1000
    if (gap > 0 && gap < MIN_USABLE_GAP_MINUTES * 60) {
      wastedSec += gap
    }
  }
  const wastedFragmentsHours = Math.round((wastedSec / 3600) * 10) / 10

  // Focus heatmap: 5 days × 10 hours (8–17)
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const deepWorkCounts: Record<string, number> = {}
  const meetingFlags: Record<string, boolean> = {}
  let maxCount = 1

  for (const r of allReports) {
    const dt = new Date(r.captured_at)
    const dow = dt.getDay()
    if (dow < 1 || dow > 5) continue
    const hour = dt.getHours()
    if (hour < 8 || hour > 17) continue
    const day = dow - 1 // 0=Mon
    const key = `${day}-${hour}`

    if (mapFlowState(r.category) === 'deep_work') {
      deepWorkCounts[key] = (deepWorkCounts[key] || 0) + 1
      maxCount = Math.max(maxCount, deepWorkCounts[key])
    }
    if (mapFlowState(r.category) === 'meeting') {
      meetingFlags[key] = true
    }
  }

  const focusHeatmap: FocusCell[] = []
  for (let day = 0; day < 5; day++) {
    for (let hour = 8; hour <= 17; hour++) {
      const key = `${day}-${hour}`
      const count = deepWorkCounts[key] || 0
      focusHeatmap.push({
        day,
        hour,
        intensity: count / maxCount,
        hasMeeting: meetingFlags[key] ?? false,
      })
    }
  }

  // Suggested windows: low focus intensity, no meetings
  const suggestedWindows: SuggestedWindow[] = focusHeatmap
    .filter((c) => c.intensity < 0.3 && !c.hasMeeting)
    .sort((a, b) => a.intensity - b.intensity)
    .slice(0, 3)
    .map((c) => ({
      day: c.day,
      dayName: dayNames[c.day],
      hour: c.hour,
      intensity: c.intensity,
      reason: `Low focus activity (${Math.round(c.intensity * 100)}% intensity) — ideal for meetings`,
    }))

  // Flagged windows: high focus intensity with meetings
  const flaggedWindows: FlaggedWindow[] = focusHeatmap
    .filter((c) => c.intensity > 0.7 && c.hasMeeting)
    .sort((a, b) => b.intensity - a.intensity)
    .slice(0, 1)
    .map((c) => ({
      day: c.day,
      dayName: dayNames[c.day],
      hour: c.hour,
      intensity: c.intensity,
      hoursRecoverable: Math.round(c.intensity * 2 * 10) / 10,
    }))

  // Standup health
  const standupReports = allReports.filter(
    (r) => r.description && (/standup/i.test(r.description) || /daily/i.test(r.description))
  )
  const avgDurationMin = standupReports.length > 0
    ? Math.round(standupReports.length * (REPORT_INTERVAL_SECONDS / 60))
    : 0

  // Blockers: interrupted reports within 30min after standup
  let blockersRaised = 0
  let blockersResolved = 0
  for (const standup of standupReports) {
    const standupTime = new Date(standup.captured_at).getTime()
    const windowEnd = standupTime + 30 * 60 * 1000

    const blockers = allReports.filter(
      (r) =>
        r.user_id === standup.user_id &&
        mapFlowState(r.category) === 'interrupted' &&
        new Date(r.captured_at).getTime() > standupTime &&
        new Date(r.captured_at).getTime() <= windowEnd
    )
    blockersRaised += blockers.length

    // Check if those blockers led to deep_work within 24h
    for (const blocker of blockers) {
      const blockerTime = new Date(blocker.captured_at).getTime()
      const resolved = allReports.some(
        (r) =>
          r.user_id === blocker.user_id &&
          mapFlowState(r.category) === 'deep_work' &&
          new Date(r.captured_at).getTime() > blockerTime &&
          new Date(r.captured_at).getTime() <= blockerTime + 24 * 60 * 60 * 1000
      )
      if (resolved) blockersResolved++
    }
  }

  const standupHealth: StandupHealthData = {
    avgDurationMin,
    blockersRaised,
    blockersResolved,
  }

  return {
    impact: { totalMeetingHours, meetingPct, avgRecoveryMin, wastedFragmentsHours },
    focusHeatmap,
    suggestedWindows,
    flaggedWindows,
    standupHealth,
  }
}

// ============ getWorkflowData ============

export async function getWorkflowData(teamId: string, date: Date): Promise<WorkflowData> {
  const supabase = await createClient()
  const dateStr = toDateStr(date)

  const [reportsRes, membersRes] = await Promise.all([
    supabase
      .from('activity_reports')
      .select('user_id, description, category, jira_ticket_id, captured_at, duration_seconds')
      .eq('team_id', teamId)
      .gte('captured_at', `${dateStr}T00:00:00`)
      .lt('captured_at', `${dateStr}T23:59:59`)
      .order('captured_at', { ascending: false }),
    supabase
      .from('team_members')
      .select('user_id, profile:profiles!team_members_user_id_fkey(id, display_name, avatar_url)')
      .eq('team_id', teamId),
  ])

  if (reportsRes.error) throw new Error(`FlowSight [getWorkflowData]: ${reportsRes.error.message}`)
  if (membersRes.error) throw new Error(`FlowSight [getWorkflowData]: ${membersRes.error.message}`)

  const reports = reportsRes.data ?? []
  const membersRaw = (membersRes.data ?? []) as unknown as Array<{
    user_id: string
    profile: { id: string; display_name: string | null; avatar_url: string | null }
  }>

  const userReports = new Map<string, typeof reports>()
  for (const r of reports) {
    if (!userReports.has(r.user_id)) userReports.set(r.user_id, [])
    userReports.get(r.user_id)!.push(r)
  }

  const members: MemberWorkflow[] = membersRaw.map((m) => {
    const base = buildMemberBase(m.profile)
    const reps = userReports.get(m.user_id) ?? []

    const entries: WorkflowEntry[] = reps.map((r) => ({
      category: r.category,
      description: r.description,
      jiraTicketId: r.jira_ticket_id,
      capturedAt: r.captured_at,
      durationSeconds: r.duration_seconds,
    }))

    return {
      ...base,
      currentActivity: entries[0] ?? null,
      entries,
    }
  })

  return { members }
}

// ============ syncTicketSnapshot ============

export async function syncTicketSnapshot(ticketId: string, teamId: string): Promise<TicketSnapshot> {
  const supabase = await createClient()

  const [ticket, changelog] = await Promise.all([
    getTicket(ticketId),
    getTicketChangelog(ticketId),
  ])

  if (!ticket.assignee) {
    throw new Error(`FlowSight [syncTicketSnapshot]: Ticket ${ticketId} has no assignee`)
  }

  // TODO: Map Jira accountId → user_id via profiles.jira_account_id column
  // For now, attempt to find user by matching jira_cloud_id pattern
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('jira_cloud_id', ticket.assignee.accountId)
    .maybeSingle()

  if (profileError) throw new Error(`FlowSight [syncTicketSnapshot]: ${profileError.message}`)
  if (!profile) throw new Error(`FlowSight [syncTicketSnapshot]: No profile found for Jira account ${ticket.assignee.accountId}`)

  const userId = profile.id

  // Determine ticket lifespan from changelog
  const created = new Date(ticket.created)
  const closed = ticket.resolutionDate ? new Date(ticket.resolutionDate) : new Date()
  const startStr = toDateStr(created)
  const endStr = toDateStr(closed)

  // Fetch activity reports for this ticket
  const { data: ticketReports, error: reportsError } = await supabase
    .from('activity_reports')
    .select('category, duration_seconds')
    .eq('user_id', userId)
    .eq('team_id', teamId)
    .eq('jira_ticket_id', ticketId)
    .gte('captured_at', `${startStr}T00:00:00`)
    .lte('captured_at', `${endStr}T23:59:59`)

  if (reportsError) throw new Error(`FlowSight [syncTicketSnapshot]: ${reportsError.message}`)

  let deepWorkSeconds = 0
  let shallowSeconds = 0
  let interruptedSeconds = 0
  let meetingSeconds = 0
  let totalSeconds = 0

  for (const r of ticketReports ?? []) {
    totalSeconds += r.duration_seconds
    const state = mapFlowState(r.category)
    if (state === 'deep_work') deepWorkSeconds += r.duration_seconds
    else if (state === 'shallow') shallowSeconds += r.duration_seconds
    else if (state === 'interrupted') interruptedSeconds += r.duration_seconds
    else if (state === 'meeting') meetingSeconds += r.duration_seconds
  }

  // Fetch work sessions for context metrics during ticket lifespan
  const { data: contextSessions, error: sessionsError } = await supabase
    .from('work_sessions')
    .select('jira_breakdown, category_breakdown, session_date')
    .eq('user_id', userId)
    .eq('team_id', teamId)
    .gte('session_date', startStr)
    .lte('session_date', endStr)

  if (sessionsError) throw new Error(`FlowSight [syncTicketSnapshot]: ${sessionsError.message}`)

  // Compute avg active backlogs and context switches
  const dailyBacklogs: number[] = []
  const dailySwitches: number[] = []
  for (const s of contextSessions ?? []) {
    const jb = parseJiraBreakdown(s.jira_breakdown)
    const prefixes = new Set(Object.keys(jb).map((k) => k.split('-')[0]))
    dailyBacklogs.push(prefixes.size)
  }

  const avgActiveBacklogs = dailyBacklogs.length > 0
    ? dailyBacklogs.reduce((a, b) => a + b, 0) / dailyBacklogs.length
    : 1
  const avgContextSwitches = dailySwitches.length > 0
    ? dailySwitches.reduce((a, b) => a + b, 0) / dailySwitches.length
    : 0

  // Load factor: total / deep_work, clamped 1.0–4.0
  const loadFactor = deepWorkSeconds > 0
    ? clamp(totalSeconds / deepWorkSeconds, 1.0, 4.0)
    : 4.0

  const adjustedSeconds = Math.round(totalSeconds / loadFactor)

  // Upsert into ticket_snapshots
  const { data: snapshot, error: upsertError } = await supabase
    .from('ticket_snapshots')
    .upsert(
      {
        jira_ticket_id: ticketId,
        user_id: userId,
        team_id: teamId,
        total_seconds: totalSeconds,
        deep_work_seconds: deepWorkSeconds,
        shallow_seconds: shallowSeconds,
        interrupted_seconds: interruptedSeconds,
        meeting_seconds: meetingSeconds,
        avg_active_backlogs: Math.round(avgActiveBacklogs * 100) / 100,
        avg_context_switches: Math.round(avgContextSwitches * 100) / 100,
        avg_load_factor: Math.round(loadFactor * 100) / 100,
        adjusted_seconds: adjustedSeconds,
        jira_issue_type: ticket.issueType,
        jira_story_points: ticket.storyPoints,
        jira_project_key: ticket.projectKey,
        jira_sprint_id: ticket.sprintId,
        closed_at: closed.toISOString(),
      },
      { onConflict: 'jira_ticket_id,user_id' }
    )
    .select()
    .single()

  if (upsertError) throw new Error(`FlowSight [syncTicketSnapshot]: ${upsertError.message}`)
  return snapshot as TicketSnapshot
}
