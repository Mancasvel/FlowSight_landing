'use client'

import { Card, CardHeader, CardBody } from '@/components/ui'
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
        <h3 className="text-sm font-medium text-zinc-800">30-Day Trend</h3>
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
