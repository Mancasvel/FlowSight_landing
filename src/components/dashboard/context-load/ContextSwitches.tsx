'use client'

import { Card, CardHeader, CardBody, Avatar, Progress, Tooltip } from '@/components/ui'
import type { MemberContextLoad } from '@/lib/types/dashboard'

type Props = { members: MemberContextLoad[] }

function switchColor(n: number): 'success' | 'warning' | 'danger' {
  if (n <= 3) return 'success'
  if (n <= 6) return 'warning'
  return 'danger'
}

export default function ContextSwitches({ members }: Props) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-zinc-800">Context Switches / Day</h2>
      </CardHeader>
      <CardBody className="space-y-4">
        {members.length === 0 ? (
          <p className="text-sm text-zinc-500">No team members to show.</p>
        ) : (
          members.map((m) => {
            const color = switchColor(m.contextSwitchesPerDay)
            const label = `${m.contextSwitchesPerDay} switches/day`
            return (
              <div key={m.userId} className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 min-w-0 sm:w-48 shrink-0">
                  <Avatar src={m.avatarUrl || undefined} name={m.displayName} size="sm" />
                  <span className="text-sm font-medium text-zinc-800 truncate">{m.displayName}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <Tooltip content="How many times this person switched between task types in a day">
                    <div className="cursor-default">
                      <Progress
                        value={m.contextSwitchesPerDay}
                        maxValue={12}
                        color={color}
                        size="sm"
                        label={label}
                      />
                    </div>
                  </Tooltip>
                </div>
              </div>
            )
          })
        )}
      </CardBody>
    </Card>
  )
}
