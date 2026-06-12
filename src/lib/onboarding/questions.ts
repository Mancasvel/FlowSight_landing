import type { DashboardMode, OnboardingQuestion } from './types'

const INDIVIDUAL_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 'timeAllocation',
    title: 'Where do you spend most of your working time?',
    subtitle: 'Select everything that regularly consumes meaningful hours each week.',
    type: 'multi',
    options: [
      { value: 'status_meetings', label: 'Status meetings & syncs', description: 'Standups, check-ins, all-hands' },
      { value: 'solving_blockers', label: 'Solving blockers', description: 'Unblocking yourself or others' },
      { value: 'reporting_updates', label: 'Reporting & status updates', description: 'Stakeholder updates, dashboards, written reports' },
      { value: 'deep_work', label: 'Deep work & building', description: 'Focused implementation or creative work' },
      { value: 'code_review', label: 'Code review & quality', description: 'PR reviews, pairing, QA' },
      { value: 'planning_estimation', label: 'Planning & estimation', description: 'Backlog grooming, sizing, roadmaps' },
      { value: 'stakeholder_comms', label: 'Stakeholder communication', description: 'Alignment, negotiation, expectation-setting' },
      { value: 'incident_firefighting', label: 'Incidents & firefighting', description: 'Production issues, urgent escalations' },
    ],
  },
  {
    id: 'weeklyFriction',
    title: 'What creates the most friction in your week?',
    type: 'single',
    options: [
      { value: 'too_many_meetings', label: 'Too many meetings', description: 'Calendar leaves little room for focus' },
      { value: 'constant_interrupts', label: 'Constant interruptions', description: 'Slack, ad-hoc asks, context breaks' },
      { value: 'unclear_priorities', label: 'Unclear priorities', description: 'Hard to know what matters most' },
      { value: 'context_switching', label: 'Context switching', description: 'Too many parallel threads' },
      { value: 'workload_spikes', label: 'Workload spikes', description: 'Unpredictable peaks and crunch' },
      { value: 'reporting_overhead', label: 'Reporting overhead', description: 'Too much time proving progress' },
    ],
  },
  {
    id: 'visibilityNeeds',
    title: 'What do you need clearer visibility into?',
    type: 'multi',
    options: [
      { value: 'focus_quality', label: 'Focus & deep work quality' },
      { value: 'meeting_load', label: 'Meeting load & calendar impact' },
      { value: 'delivery_progress', label: 'Delivery & sprint progress' },
      { value: 'workload_balance', label: 'Personal workload balance' },
      { value: 'burnout_signals', label: 'Burnout & sustainability signals' },
      { value: 'activity_patterns', label: 'Daily activity patterns' },
    ],
  },
  {
    id: 'reviewCadence',
    title: 'How do you prefer to review your performance?',
    type: 'single',
    options: [
      { value: 'daily_pulse', label: 'Daily pulse', description: 'Quick read on today' },
      { value: 'weekly_trends', label: 'Weekly trends', description: 'Patterns across the week' },
      { value: 'both', label: 'Both daily and weekly', description: 'Snapshot plus trend lines' },
    ],
  },
]

const TEAM_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 'teamRole',
    title: 'What is your role on the team?',
    subtitle: 'We shape the dashboard around the decisions you make.',
    type: 'single',
    options: [
      { value: 'manager', label: 'Engineering / Delivery Manager', description: 'Capacity, health, and outcomes' },
      { value: 'tech_lead', label: 'Tech Lead', description: 'Technical delivery and team balance' },
      { value: 'pm', label: 'Project / Product Manager', description: 'Planning, commitments, reporting' },
      { value: 'other', label: 'Other leadership role', description: 'Cross-functional oversight' },
    ],
  },
  {
    id: 'timeDrainAreas',
    title: 'Where does your team lose the most time?',
    subtitle: 'Select the areas that most often slow delivery or focus.',
    type: 'multi',
    options: [
      { value: 'status_meetings', label: 'Status meetings & ceremonies', description: 'Standups, sprint reviews, recurring syncs' },
      { value: 'blocker_resolution', label: 'Blocker resolution', description: 'Waiting on decisions, dependencies, or approvals' },
      { value: 'reporting_updates', label: 'Reporting & status updates', description: 'Manual progress reporting to stakeholders' },
      { value: 'rework_unplanned', label: 'Rework & unplanned work', description: 'Scope shifts, bugs, urgent inserts' },
      { value: 'estimation_gaps', label: 'Estimation gaps', description: 'Commitments vs actual capacity' },
      { value: 'handoffs_waiting', label: 'Handoffs & waiting', description: 'Queue time between teams or roles' },
      { value: 'on_call_incidents', label: 'On-call & incidents', description: 'Production firefighting' },
    ],
  },
  {
    id: 'decisionsSupported',
    title: 'What decisions should this dashboard help you make?',
    type: 'multi',
    options: [
      { value: 'staffing_capacity', label: 'Staffing & capacity planning' },
      { value: 'meeting_hygiene', label: 'Meeting hygiene & calendar design' },
      { value: 'sprint_commitments', label: 'Sprint commitments & forecasting' },
      { value: 'burnout_prevention', label: 'Burnout prevention & sustainable pace' },
      { value: 'workload_fairness', label: 'Fair workload distribution' },
      { value: 'delivery_forecast', label: 'Delivery risk & forecast' },
    ],
  },
  {
    id: 'teamSize',
    title: 'How large is your team?',
    type: 'single',
    options: [
      { value: 'small', label: 'Small (2–5 people)' },
      { value: 'medium', label: 'Medium (6–15 people)' },
      { value: 'large', label: 'Large (16+ people)' },
    ],
  },
  {
    id: 'alertSignals',
    title: 'Which signals do you want highlighted early?',
    type: 'multi',
    options: [
      { value: 'burnout', label: 'Burnout risk on the team' },
      { value: 'low_focus', label: 'Sustained low focus or activity' },
      { value: 'missed_sprints', label: 'Missed sprint commitments' },
      { value: 'meeting_overload', label: 'Meeting overload' },
      { value: 'uneven_workload', label: 'Uneven workload across members' },
    ],
  },
]

export function getQuestionsForMode(mode: DashboardMode): OnboardingQuestion[] {
  return mode === 'individual' ? INDIVIDUAL_QUESTIONS : TEAM_QUESTIONS
}

export function resolveModeFromPlan(planId: string, maxMembers: number): DashboardMode {
  if (planId === 'individual_pro' || maxMembers <= 1) return 'individual'
  return 'team'
}
