'use client'

import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Progress,
  Chip,
  Tooltip,
} from '@/components/ui'
import type { MemberContextLoad } from '@/lib/types/dashboard'

type Props = { members: MemberContextLoad[] }

function backlogProgressColor(n: number): 'success' | 'warning' | 'danger' {
  if (n <= 2) return 'success'
  if (n <= 3) return 'warning'
  return 'danger'
}

function backlogChipLabel(n: number): { label: string; color: 'success' | 'warning' | 'danger' } {
  if (n <= 2) return { label: 'Healthy', color: 'success' }
  if (n <= 3) return { label: 'At limit', color: 'warning' }
  return { label: 'Overloaded', color: 'danger' }
}

export default function BacklogBars({ members }: Props) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-zinc-800">Active Backlogs · This Week</h2>
        <p className="text-sm text-zinc-500 mt-1">Healthy limit: ≤ 2 concurrent projects</p>
      </CardHeader>
      <CardBody className="space-y-4">
        {members.length === 0 ? (
          <p className="text-sm text-zinc-500">No team members to show.</p>
        ) : (
          members.map((m) => {
            const chip = backlogChipLabel(m.activeBacklogs)
            const color = backlogProgressColor(m.activeBacklogs)
            return (
              <div key={m.userId} className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 min-w-0 sm:w-48 shrink-0">
                  <Avatar src={m.avatarUrl || undefined} name={m.displayName} size="sm" />
                  <span className="text-sm font-medium text-zinc-800 truncate">{m.displayName}</span>
                </div>
                <div className="flex-1 flex items-center gap-3 min-w-0">
                  <Tooltip content="Distinct Jira projects this person worked on this week">
                    <div className="flex-1 min-w-0 cursor-default">
                      <Progress
                        value={m.activeBacklogs}
                        maxValue={5}
                        color={color}
                        size="sm"
                      />
                    </div>
                  </Tooltip>
                  <Chip color={chip.color} className="shrink-0">
                    {chip.label}
                  </Chip>
                </div>
              </div>
            )
          })
        )}
      </CardBody>
    </Card>
  )
}
