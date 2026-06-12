'use client'

import { Card, CardHeader, CardBody } from '@/components/ui'
import MemberActivityFeed from '@/components/dashboard/MemberActivityFeed'
import DashboardWidgetEmpty from '@/components/dashboard/DashboardWidgetEmpty'
import { hasWorkflowFeedData } from '@/lib/dashboard/widgetDataAvailability'
import type { WorkflowData } from '@/lib/types/dashboard'

type Props = {
  members: WorkflowData['members']
}

export default function WorkflowFeed({ members }: Props) {
  const workflow = { members }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-medium text-zinc-800">Team Activity · Today</h3>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          Chronological view of what each member has been working on
        </p>
      </CardHeader>
      <CardBody className="space-y-3">
        {members.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-4">No team members found.</p>
        ) : !hasWorkflowFeedData(workflow) ? (
          <DashboardWidgetEmpty message="No activity recorded today. Live entries will show up as your team works." />
        ) : (
          members
            .filter((m) => m.entries.length > 0 || m.currentActivity != null)
            .map((m) => <MemberActivityFeed key={m.userId} member={m} />)
        )}
      </CardBody>
    </Card>
  )
}
