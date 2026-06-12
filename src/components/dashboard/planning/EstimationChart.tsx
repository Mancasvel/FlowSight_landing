'use client'

import { Card, CardBody, CardHeader } from '@/components/ui'
import DashboardFeaturePlaceholder from '@/components/dashboard/DashboardFeaturePlaceholder'
import type { MemberEstimation, SprintPlanningData } from '@/lib/types/dashboard'

type Props = {
  sprints: SprintPlanningData[]
  estimations?: MemberEstimation[]
}

export default function EstimationChart(_props: Props) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-medium text-zinc-800">Estimation vs Reality</h3>
        <p className="mt-1 text-xs text-zinc-500">
          Planned vs delivered work across recent sprints
        </p>
      </CardHeader>
      <CardBody>
        <DashboardFeaturePlaceholder minHeight={300} />
      </CardBody>
    </Card>
  )
}
