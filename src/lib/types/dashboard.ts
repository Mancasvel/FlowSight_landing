export type FlowState = 'deep_work' | 'shallow' | 'meeting' | 'interrupted'
export type BurnoutLevel = 'healthy' | 'warning' | 'danger'
export type ConfidenceLevel = 'high' | 'medium' | 'low'

export type FocusCell = {
  day: number
  hour: number
  intensity: number
  hasMeeting: boolean
}

export type MemberBase = {
  userId: string
  displayName: string
  avatarUrl: string
}

export type TimelineSlot = {
  hour: number
  state: FlowState | null
}

export type MemberFlowState = MemberBase & {
  flowScoreToday: number
  timelineToday: TimelineSlot[]
  longestStreakMin: number
  recoveryTimeAvg: number
}

export type TrendPoint = {
  date: string
  score: number
}

/** Per-member inputs used to explain Team Flow Score in the UI (from work_sessions today). */
export type TeamFlowScorePart = {
  userId: string
  displayName: string
  scorePercent: number
  deepWorkSeconds: number
  totalTrackedSeconds: number
}

export type FlowStateData = {
  teamFlowScore: number
  trend30d: TrendPoint[]
  members: MemberFlowState[]
  /** Present when the server computed today’s scores; drives “how it’s calculated” tooltips. */
  teamFlowScoreBreakdown?: TeamFlowScorePart[]
}

export type MemberContextLoad = MemberBase & {
  activeBacklogs: number
  contextSwitchesPerDay: number
  focusStreakHistory: number[]
  burnoutIndex: number
  burnoutLevel: BurnoutLevel
  meetingRatio: number
  suggestion: string | null
}

export type ContextLoadData = {
  members: MemberContextLoad[]
}

export type SprintPlanningData = {
  label: string
  sprintId: string | null
  committedHours: number
  actualHours: number
  deepHours: number
  meetingHours: number
  interruptedHours: number
  efficiencyRatio: number
  expectedDelivery: number
}

export type MemberEstimation = MemberBase & {
  baseEstimateHours: number
  currentLoadFactor: number
  predictedHours: number
  sampleSize: number
  confidence: ConfidenceLevel
}

export type CostBreakdown = {
  meetingsCost: number
  interruptionCost: number
  contextCost: number
  total: number
}

export type MemberGap = MemberBase & {
  actualHours: number
  shareHours: number
  gapPercent: number
  likelyCause: string
}

export type PlanningData = {
  sprints: SprintPlanningData[]
  estimations: MemberEstimation[]
  costBreakdown: CostBreakdown
  perPersonGap: MemberGap[]
  costPerHour: number
}

export type MeetingImpactSummary = {
  totalMeetingHours: number
  meetingPct: number
  avgRecoveryMin: number
  wastedFragmentsHours: number
}

export type SuggestedWindow = {
  day: number
  dayName: string
  hour: number
  intensity: number
  reason: string
}

export type FlaggedWindow = {
  day: number
  dayName: string
  hour: number
  intensity: number
  hoursRecoverable: number
}

export type StandupHealthData = {
  avgDurationMin: number
  blockersRaised: number
  blockersResolved: number
}

export type MeetingsData = {
  impact: MeetingImpactSummary
  focusHeatmap: FocusCell[]
  suggestedWindows: SuggestedWindow[]
  flaggedWindows: FlaggedWindow[]
  standupHealth: StandupHealthData
}

export type RoleView = 'me' | 'team' | 'org'

export type WorkflowEntry = {
  category: string
  description: string
  jiraTicketId: string | null
  capturedAt: string
  durationSeconds: number
}

export type MemberWorkflow = MemberBase & {
  currentActivity: WorkflowEntry | null
  entries: WorkflowEntry[]
}

export type WorkflowData = {
  members: MemberWorkflow[]
}
