'use client'

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Card, CardHeader, CardBody, Avatar, Tooltip } from '@/components/ui'
import type { MemberContextLoad } from '@/lib/types/dashboard'

type Props = { members: MemberContextLoad[] }

function avgStreak(values: number[]): number {
  if (values.length === 0) return 0
  const sum = values.reduce((a, b) => a + b, 0)
  return Math.round((sum / values.length) * 10) / 10
}

export default function FocusStreaks({ members }: Props) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-zinc-800">Focus Streaks</h2>
      </CardHeader>
      <CardBody className="space-y-4">
        {members.length === 0 ? (
          <p className="text-sm text-zinc-500">No team members to show.</p>
        ) : (
          members.map((m) => <FocusStreakRow key={m.userId} member={m} />)
        )}
      </CardBody>
    </Card>
  )
}

function FocusStreakRow({ member }: { member: MemberContextLoad }) {
  const data = member.focusStreakHistory.map((value, index) => ({ index, value }))
  const avg = avgStreak(member.focusStreakHistory)

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex items-center gap-3 min-w-0 sm:w-48 shrink-0">
        <Avatar src={member.avatarUrl || undefined} name={member.displayName} size="sm" />
        <span className="text-sm font-medium text-zinc-800 truncate">{member.displayName}</span>
      </div>
      <div className="flex-1 flex items-center gap-3 min-w-0 justify-between sm:justify-start">
        <Tooltip content="Longest uninterrupted deep work block per day, last 5 days">
          <div className="w-[120px] h-8 shrink-0 cursor-default" aria-hidden>
            <ResponsiveContainer width={120} height={32}>
              <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                <XAxis hide />
                <YAxis hide />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4361ee"
                  strokeWidth={1}
                  fill="#4361ee"
                  fillOpacity={0.3}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Tooltip>
        <span className="text-xs text-zinc-500 tabular-nums shrink-0">avg {avg}min</span>
      </div>
    </div>
  )
}
