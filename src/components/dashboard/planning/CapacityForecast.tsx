'use client'

import { Card, CardBody, CardHeader } from '@/components/ui'
import DashboardFeaturePlaceholder from '@/components/dashboard/DashboardFeaturePlaceholder'
import type { MemberEstimation, SprintPlanningData } from '@/lib/types/dashboard'

type Props = {
  sprint: SprintPlanningData | null
  estimations?: MemberEstimation[]
  allSprints?: SprintPlanningData[]
}

export default function CapacityForecast(_props: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="text-sm font-medium text-zinc-800">Capacity Forecast</h3>
        <p className="mt-0.5 text-xs text-zinc-500">Sprint capacity projection</p>
      </CardHeader>
      <CardBody>
        <DashboardFeaturePlaceholder minHeight={260} variant="blocks" />
      </CardBody>
    </Card>
  )
}
