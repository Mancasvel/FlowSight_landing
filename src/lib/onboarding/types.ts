export type DashboardMode = 'individual' | 'team'

export type DashboardSectionId =
  | 'overview'
  | 'focus'
  | 'meetings'
  | 'workload'
  | 'delivery'
  | 'wellbeing'

export type DashboardWidgetId =
  | 'flow-score'
  | 'flow-trend'
  | 'flow-timeline'
  | 'kpi-cards'
  | 'workflow-feed'
  | 'context-switches'
  | 'burnout-index'
  | 'focus-streaks'
  | 'backlog-bars'
  | 'meeting-impact'
  | 'focus-heatmap'
  | 'standup-health'
  | 'capacity-forecast'
  | 'estimation-chart'
  | 'workload-balance'

export type OnboardingAnswers = {
  mode: DashboardMode
  /** Individual: where time goes */
  timeAllocation?: string[]
  /** Individual: main weekly friction */
  weeklyFriction?: string
  /** Individual: visibility needs */
  visibilityNeeds?: string[]
  /** Individual: review cadence */
  reviewCadence?: string
  /** Team: role */
  teamRole?: string
  /** Team: where the team loses time */
  timeDrainAreas?: string[]
  /** Team: decisions the dashboard should support */
  decisionsSupported?: string[]
  /** Team: size band */
  teamSize?: string
  /** Team: alert signals */
  alertSignals?: string[]
}

export type DashboardSectionLayout = {
  id: DashboardSectionId
  title: string
  description: string
  widgets: DashboardWidgetId[]
}

export type DashboardPreferences = {
  mode: DashboardMode
  title: string
  widgets: DashboardWidgetId[]
  sections: DashboardSectionLayout[]
  answers: OnboardingAnswers
  completedAt: string
}

export type OnboardingQuestionOption = {
  value: string
  label: string
  description?: string
}

export type OnboardingQuestion = {
  id: keyof OnboardingAnswers
  title: string
  subtitle?: string
  type: 'single' | 'multi'
  options: OnboardingQuestionOption[]
}

export type OnboardingVariant = 'full' | 'preferences-only'
