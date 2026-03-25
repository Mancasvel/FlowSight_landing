'use client'

import { Card, CardHeader, CardBody, Avatar } from '@/components/ui'
import type { MemberFlowState, FlowState } from '@/lib/types/dashboard'

type Props = {
  members: MemberFlowState[]
  onMemberClick?: (userId: string) => void
}

const stateStyles: Record<FlowState, string> = {
  deep_work: 'bg-[#22c55e]/25 border border-[#22c55e]/50',
  shallow: 'bg-[#eab308]/20 border border-[#eab308]/40',
  meeting: 'bg-[#94a3b8]/40 border border-[#94a3b8]/25',
  interrupted: 'bg-[#ef4444]/25 border border-[#ef4444]/50',
}

const legend: { state: FlowState; label: string; color: string }[] = [
  { state: 'deep_work', label: 'Deep Work', color: '#22c55e' },
  { state: 'shallow', label: 'Shallow', color: '#eab308' },
  { state: 'meeting', label: 'Meeting', color: '#94a3b8' },
  { state: 'interrupted', label: 'Interrupted', color: '#ef4444' },
]

const hours = Array.from({ length: 10 }, (_, i) => i + 8)

export default function FlowTimeline({ members, onMemberClick }: Props) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-medium text-zinc-800">Flow Timeline · Today</h3>
      </CardHeader>
      <CardBody className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div
            className="grid gap-1 mb-2"
            style={{ gridTemplateColumns: '160px repeat(10, minmax(0, 1fr))' }}
          >
            <div />
            {hours.map((h) => (
              <div key={h} className="text-center text-[10px] text-zinc-500 font-mono">
                {h}:00
              </div>
            ))}
          </div>

          {members.map((m) => (
            <button
              key={m.userId}
              type="button"
              className="grid gap-1 mb-1 w-full text-left rounded-lg transition-colors hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
              style={{ gridTemplateColumns: '160px repeat(10, minmax(0, 1fr))' }}
              onClick={() => onMemberClick?.(m.userId)}
            >
              <div className="flex items-center gap-2 px-2 py-1 min-w-0 pointer-events-none">
                <Avatar src={m.avatarUrl} name={m.displayName} size="sm" />
                <span className="text-xs text-zinc-800 truncate">{m.displayName}</span>
              </div>
              {m.timelineToday.map((slot) => (
                <div
                  key={slot.hour}
                  className={`h-8 rounded-md min-w-0 ${
                    slot.state ? stateStyles[slot.state] : 'bg-transparent border border-transparent'
                  }`}
                />
              ))}
            </button>
          ))}

          <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-zinc-100">
            {legend.map((l) => (
              <div key={l.state} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: l.color, opacity: 0.5 }}
                />
                <span className="text-[10px] text-zinc-500">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
