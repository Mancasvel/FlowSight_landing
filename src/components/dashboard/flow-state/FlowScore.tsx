'use client'

import { Card, CardBody, CircularProgress, Chip, Tooltip } from '@/components/ui'
import type { TrendPoint } from '@/lib/types/dashboard'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

type Props = { score: number; trend: TrendPoint[] }

function scoreColor(score: number): 'success' | 'warning' | 'danger' {
  if (score >= 70) return 'success'
  if (score >= 45) return 'warning'
  return 'danger'
}

export default function FlowScore({ score, trend }: Props) {
  const color = scoreColor(score)

  const last7 = trend.slice(-7)
  const first = last7[0]?.score ?? 0
  const last = last7[last7.length - 1]?.score ?? 0
  const diff = last - first

  const trendLabel = diff > 5 ? 'Improving' : diff < -5 ? 'Declining' : 'Flat'
  const trendColor = diff > 5 ? 'success' : diff < -5 ? 'danger' : 'warning'
  const TrendIcon = diff > 5 ? TrendingUp : diff < -5 ? TrendingDown : Minus

  return (
    <Card className="flex flex-col items-center justify-center py-8">
      <CardBody className="flex flex-col items-center gap-4">
        <Tooltip content="Percentage of today's tracked time spent in uninterrupted deep work">
          <button
            type="button"
            className="cursor-default border-0 bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 rounded-full"
          >
            <CircularProgress value={score} maxValue={100} color={color} size="lg">
              <div className="text-center">
                <span className="text-3xl font-bold text-zinc-800">{score}</span>
                <span className="text-lg font-semibold text-zinc-500">%</span>
              </div>
            </CircularProgress>
          </button>
        </Tooltip>
        <p className="text-sm text-zinc-500">Team Flow Score · Today</p>
        <Chip color={trendColor}>
          <span className="flex items-center gap-1">
            <TrendIcon size={12} aria-hidden />
            {trendLabel}
          </span>
        </Chip>
      </CardBody>
    </Card>
  )
}
