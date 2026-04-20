'use client'

import { Card, CardHeader, CardBody } from '@/components/ui'
import MemberActivityFeed from '@/components/dashboard/MemberActivityFeed'
import type { MemberWorkflow } from '@/lib/types/dashboard'

type Props = {
  members: MemberWorkflow[]
}

export default function WorkflowFeed({ members }: Props) {
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
        ) : (
          members.map((m) => <MemberActivityFeed key={m.userId} member={m} />)
        )}
      </CardBody>
    </Card>
  )
}
