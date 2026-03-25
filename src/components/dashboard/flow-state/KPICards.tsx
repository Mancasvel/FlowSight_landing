'use client'

import { Card, CardBody, Tooltip, Skeleton, Chip } from '@/components/ui'
import { Timer, Flame, AlertTriangle } from 'lucide-react'
import type { MemberFlowState } from '@/lib/types/dashboard'

type Props = {
  members: MemberFlowState[]
  /** When false, shows skeleton placeholders (e.g. while a parent Suspense boundary is resolving). */
  isLoaded?: boolean
}

export default function KPICards({ members, isLoaded = true }: Props) {
  const n = members.length
  const avgRecovery =
    n > 0 ? Math.round(members.reduce((s, m) => s + m.recoveryTimeAvg, 0) / n) : 0
  const avgStreak =
    n > 0
      ? Math.round((members.reduce((s, m) => s + m.longestStreakMin, 0) / n) * 10) / 10
      : 0

  const atRisk = members.filter((m) => m.flowScoreToday < 45).length

  let burnoutChip: 'success' | 'warning' | 'danger' = 'success'
  if (n > 0 && atRisk > 0) {
    const third = Math.max(1, Math.floor(n / 3))
    burnoutChip = atRisk <= third ? 'warning' : 'danger'
  }

  const burnoutTooltip =
    'Count of members with flow score under 45% today — a signal of shallow work, interruptions, or overload. Review workload and focus blocks.'

  const burnoutLabel =
    atRisk === 0 ? 'All clear' : atRisk === 1 ? '1 at risk' : `${atRisk} at risk`

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Skeleton isLoaded={isLoaded} className="min-h-[96px]">
        <Card className="h-full">
          <CardBody className="flex items-center gap-4 py-4">
            <div className="shrink-0 rounded-xl bg-zinc-100 p-2.5 text-[#4361ee]">
              <Timer size={20} aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <Tooltip content="Average minutes to return to deep work after an interruption">
                <p className="cursor-help text-xs text-zinc-500">Recovery Time</p>
              </Tooltip>
              <p className="mt-0.5 text-xl font-bold text-zinc-800">
                {n > 0 ? `${avgRecovery} min` : '—'}
              </p>
            </div>
          </CardBody>
        </Card>
      </Skeleton>

      <Skeleton isLoaded={isLoaded} className="min-h-[96px]">
        <Card className="h-full">
          <CardBody className="flex items-center gap-4 py-4">
            <div className="shrink-0 rounded-xl bg-zinc-100 p-2.5 text-[#4361ee]">
              <Flame size={20} aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <Tooltip content="Average longest uninterrupted deep work block today">
                <p className="cursor-help text-xs text-zinc-500">Longest Streak</p>
              </Tooltip>
              <p className="mt-0.5 text-xl font-bold text-zinc-800">
                {n > 0 ? `${avgStreak} min` : '—'}
              </p>
            </div>
          </CardBody>
        </Card>
      </Skeleton>

      <Skeleton isLoaded={isLoaded} className="min-h-[96px]">
        <Card className="h-full">
          <CardBody className="flex items-center gap-4 py-4">
            <div className="shrink-0 rounded-xl bg-zinc-100 p-2.5 text-[#4361ee]">
              <AlertTriangle size={20} aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <Tooltip content={burnoutTooltip}>
                <p className="cursor-help text-xs text-zinc-500">Burnout Risk</p>
              </Tooltip>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-xl font-bold text-zinc-800">{n > 0 ? atRisk : '—'}</span>
                {n > 0 && <Chip color={burnoutChip}>{burnoutLabel}</Chip>}
              </div>
            </div>
          </CardBody>
        </Card>
      </Skeleton>
    </div>
  )
}
