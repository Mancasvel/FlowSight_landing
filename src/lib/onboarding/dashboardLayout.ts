import type { DashboardSectionId, DashboardSectionLayout, DashboardWidgetId } from './types'

export const SECTION_META: Record<
  DashboardSectionId,
  { title: string; description: string }
> = {
  overview: {
    title: 'Overview',
    description: 'A snapshot of current momentum and live activity.',
  },
  focus: {
    title: 'Focus & Flow',
    description: 'Deep work quality, trends, and concentration patterns.',
  },
  meetings: {
    title: 'Meetings & Calendar',
    description: 'How syncs and standups affect focus and delivery.',
  },
  workload: {
    title: 'Workload & Capacity',
    description: 'Distribution of effort, backlog pressure, and context load.',
  },
  delivery: {
    title: 'Planning & Delivery',
    description: 'Sprint commitments, estimation accuracy, and forecast.',
  },
  wellbeing: {
    title: 'Wellbeing & Sustainability',
    description: 'Burnout risk and signs of unsustainable pace.',
  },
}

export const WIDGET_SECTION: Record<DashboardWidgetId, DashboardSectionId> = {
  'flow-score': 'overview',
  'workflow-feed': 'overview',
  'flow-trend': 'focus',
  'flow-timeline': 'focus',
  'kpi-cards': 'focus',
  'focus-streaks': 'focus',
  'meeting-impact': 'meetings',
  'focus-heatmap': 'meetings',
  'standup-health': 'meetings',
  'workload-balance': 'workload',
  'backlog-bars': 'workload',
  'context-switches': 'workload',
  'estimation-chart': 'delivery',
  'capacity-forecast': 'delivery',
  'burnout-index': 'wellbeing',
}

const SECTION_ORDER: DashboardSectionId[] = [
  'overview',
  'focus',
  'meetings',
  'workload',
  'delivery',
  'wellbeing',
]

export type PanelSize = 'collapsed' | 'default'

const WIDGET_DEFAULT_SPAN: Record<DashboardWidgetId, string> = {
  'flow-score': 'col-span-12 lg:col-span-4',
  'flow-trend': 'col-span-12 lg:col-span-8',
  'flow-timeline': 'col-span-12',
  'workflow-feed': 'col-span-12',
  'kpi-cards': 'col-span-12',
  'focus-streaks': 'col-span-12 md:col-span-6',
  'meeting-impact': 'col-span-12',
  'focus-heatmap': 'col-span-12 lg:col-span-7',
  'standup-health': 'col-span-12 lg:col-span-5',
  'workload-balance': 'col-span-12',
  'backlog-bars': 'col-span-12 md:col-span-6',
  'context-switches': 'col-span-12 md:col-span-6',
  'estimation-chart': 'col-span-12',
  'capacity-forecast': 'col-span-12 md:col-span-6',
  'burnout-index': 'col-span-12',
}

export const WIDGET_DESCRIPTIONS: Record<DashboardWidgetId, string> = {
  'flow-score': 'Team-wide focus quality score',
  'flow-trend': '30-day flow score trend',
  'flow-timeline': 'Member activity across the day',
  'kpi-cards': 'Key focus metrics at a glance',
  'workflow-feed': 'Live chronological team activity',
  'context-switches': 'Task switching frequency',
  'burnout-index': 'Sustainability and burnout signals',
  'focus-streaks': 'Uninterrupted deep work streaks',
  'backlog-bars': 'Open work and backlog pressure',
  'meeting-impact': 'How meetings affect focus time',
  'focus-heatmap': 'Focus quality by time of day',
  'standup-health': 'Ceremony efficiency and participation',
  'capacity-forecast': 'Sprint capacity projection',
  'estimation-chart': 'Planned vs delivered work',
  'workload-balance': 'Hours and load across members',
}

/** 12-column grid span for personalized dashboard panels */
export function getWidgetGridClass(widget: DashboardWidgetId): string {
  return WIDGET_DEFAULT_SPAN[widget] ?? 'col-span-12'
}

/** @deprecated Use getWidgetGridClass — kept for legacy section grid */
export function widgetColumnSpan(widget: DashboardWidgetId): string {
  if (['flow-timeline', 'estimation-chart', 'burnout-index', 'workload-balance'].includes(widget)) {
    return 'xl:col-span-2'
  }
  return 'xl:col-span-1'
}

export function groupWidgetsIntoSections(widgets: DashboardWidgetId[]): DashboardSectionLayout[] {
  const buckets = new Map<DashboardSectionId, DashboardWidgetId[]>()

  for (const widget of widgets) {
    const section = WIDGET_SECTION[widget]
    const list = buckets.get(section) ?? []
    list.push(widget)
    buckets.set(section, list)
  }

  return SECTION_ORDER.filter((id) => buckets.has(id)).map((id) => ({
    id,
    title: SECTION_META[id].title,
    description: SECTION_META[id].description,
    widgets: buckets.get(id) ?? [],
  }))
}
