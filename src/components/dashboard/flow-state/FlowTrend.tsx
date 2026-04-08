'use client'

import { Card, CardHeader, CardBody, Tooltip } from '@/components/ui'
import {
  LineChart,
  Line,
  Area,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts'
import type { TrendPoint } from '@/lib/types/dashboard'

type Props = { trend: TrendPoint[] }

export default function FlowTrend({ trend }: Props) {
  const lastIndex = Math.max(0, trend.length - 1)

  return (
    <Card className="h-full">
      <CardHeader>
        <Tooltip
          wide
          content={
            <div className="space-y-2 text-left leading-snug">
              <p className="font-semibold text-white text-[11px] uppercase tracking-wide">30-day line — each point</p>
              <p className="text-[11px] text-zinc-200">
                For each calendar day: every <code className="rounded bg-zinc-700/80 px-1 text-indigo-200">work_session</code> on that date gets one score = (deep-work seconds ÷ total seconds in its{' '}
                <code className="text-indigo-200">category_breakdown</code>) × 100, using the same category→bucket mapping as the main score.
              </p>
              <p className="text-[11px] text-zinc-200">
                The plotted point = <span className="font-medium text-zinc-50">average of those session scores</span> for that day (all members’ sessions together), rounded. This is slightly different from first averaging per person then averaging people (the big ring uses the latter for “today”).
              </p>
              <p className="text-[11px] text-zinc-300 border-t border-zinc-600 pt-2">
                The dot marks the latest day. The trend chip beside the ring compares the first vs last of the last 7 daily points on this line.
              </p>
            </div>
          }
        >
          <h3 className="text-sm font-medium text-zinc-800 cursor-help border-b border-dotted border-zinc-300 inline-block">
            30-Day Trend
          </h3>
        </Tooltip>
      </CardHeader>
      <CardBody className="min-h-[160px]">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trend} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
            <defs>
              <linearGradient id="flowTrendArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4361ee" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#4361ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
            <XAxis hide dataKey="date" />
            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="none"
              fill="url(#flowTrendArea)"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#4361ee"
              strokeWidth={2}
              dot={(dotProps) => {
                const { cx, cy, index } = dotProps
                if (index !== lastIndex || cx == null || cy == null) return null
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="#4361ee"
                    stroke="white"
                    strokeWidth={2}
                  />
                )
              }}
              activeDot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  )
}
