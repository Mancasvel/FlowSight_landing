import type { DashboardPreferences } from '@/lib/onboarding/types'
import type { WidgetData } from './WidgetRenderer'
import PersonalizedDashboardGrid from './PersonalizedDashboardGrid'

type Props = WidgetData & {
  preferences: DashboardPreferences
  memberCount: number
}

export default function PersonalizedDashboardView(props: Props) {
  return <PersonalizedDashboardGrid {...props} />
}
