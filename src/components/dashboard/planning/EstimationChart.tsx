'use client'

import { Card, CardHeader, CardBody } from '@/components/ui'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { SprintPlanningData } from '@/lib/types/dashboard'

type Props = { sprints: SprintPlanningData[] }

const axisTick = { fill: '#71717a', fontSize: 12 }

export default function EstimationChart({ sprints }: Props) {
  const n = sprints.length
  const data = sprints.map((s) => ({
    name: s.label,
    Committed: s.committedHours,
    Actual: s.actualHours,
  }))

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-medium text-zinc-800">
          Estimation vs Reality · Last {n} Sprints
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          Gap narrowing over time = FlowSight calibrating to your team&apos;s real capacity
        </p>
      </CardHeader>
      <CardBody>
        {n > 0 ? (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 28 }} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
              <XAxis
                dataKey="name"
                tick={axisTick}
                axisLine={{ stroke: '#e4e4e7' }}
                tickLine={{ stroke: '#e4e4e7' }}
              />
              <YAxis
                tick={axisTick}
                axisLine={{ stroke: '#e4e4e7' }}
                tickLine={{ stroke: '#e4e4e7' }}
                tickFormatter={(v) => `${v}h`}
                width={48}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e4e4e7',
                  borderRadius: 12,
                  color: '#3f3f46',
                }}
                formatter={(value, name) => [`${Number(value ?? 0)}h`, String(name)]}
                labelStyle={{ color: '#71717a' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{
                  color: '#71717a',
                  fontSize: 12,
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                  paddingTop: 16,
                }}
              />
              <Bar
                dataKey="Committed"
                name="Committed"
                fill="transparent"
                stroke="#4361ee"
                strokeWidth={2}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Actual"
                name="Actual"
                fill="#4361ee"
                fillOpacity={0.7}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-zinc-500 py-12 text-sm">No sprint data yet</div>
        )}
      </CardBody>
    </Card>
  )
}
