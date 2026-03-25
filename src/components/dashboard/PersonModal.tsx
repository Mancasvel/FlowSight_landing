'use client'

import { Modal, ModalHeader, ModalBody, Avatar, Chip } from '@/components/ui'
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts'
import type { MemberFlowState, TrendPoint, FlowState } from '@/lib/types/dashboard'

type PersonModalProps = {
  isOpen: boolean
  onClose: () => void
  member: MemberFlowState | null
  trend7d: TrendPoint[]
}

const stateColors: Record<FlowState, { bg: string; label: string }> = {
  deep_work: { bg: 'bg-emerald-100', label: 'Deep Work' },
  shallow: { bg: 'bg-amber-100', label: 'Shallow' },
  meeting: { bg: 'bg-zinc-200', label: 'Meeting' },
  interrupted: { bg: 'bg-red-100', label: 'Interrupted' },
}

export default function PersonModal({ isOpen, onClose, member, trend7d }: PersonModalProps) {
  if (!member) return null

  const scoreColor = member.flowScoreToday >= 70 ? 'success' : member.flowScoreToday >= 45 ? 'warning' : 'danger'

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <div className="flex items-center gap-4">
          <Avatar src={member.avatarUrl} name={member.displayName} size="lg" />
          <div>
            <h3 className="text-lg font-semibold text-zinc-800">{member.displayName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Chip color={scoreColor}>{member.flowScoreToday}% Flow</Chip>
              <span className="text-xs text-zinc-500">
                {member.longestStreakMin}min best streak · {member.recoveryTimeAvg}min recovery
              </span>
            </div>
          </div>
        </div>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-zinc-500 mb-3">7-Day Flow Score Trend</h4>
            <div className="h-[100px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend7d}>
                  <YAxis domain={[0, 100]} hide />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#4361ee"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-zinc-500 mb-3">Today&apos;s Timeline</h4>
            <div className="flex gap-1">
              {member.timelineToday.map((slot) => (
                <div key={slot.hour} className="flex-1 text-center">
                  <div className="text-[10px] text-zinc-400 mb-1">{slot.hour}h</div>
                  <div
                    className={`h-8 rounded-md border transition-colors ${
                      slot.state
                        ? `${stateColors[slot.state].bg} border-transparent`
                        : 'bg-zinc-50 border-zinc-200'
                    }`}
                    title={slot.state ? stateColors[slot.state].label : 'No data'}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-3 justify-center flex-wrap">
              {Object.entries(stateColors).map(([key, val]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-sm ${val.bg}`} />
                  <span className="text-[10px] text-zinc-500">{val.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}
