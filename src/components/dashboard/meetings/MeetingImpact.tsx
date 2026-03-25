'use client'

import type { MeetingImpactSummary } from '@/lib/types/dashboard'
import { Card, CardBody, CardHeader, Chip, Tooltip } from '@/components/ui'

type Props = {
  impact: MeetingImpactSummary
}

function meetingPctChipColor(pct: number): 'success' | 'warning' | 'danger' {
  if (pct < 20) return 'success'
  if (pct < 35) return 'warning'
  return 'danger'
}

function recoveryChipColor(min: number): 'success' | 'warning' | 'danger' {
  if (min < 15) return 'success'
  if (min < 25) return 'warning'
  return 'danger'
}

export default function MeetingImpact({ impact }: Props) {
  const { totalMeetingHours, meetingPct, avgRecoveryMin, wastedFragmentsHours } = impact

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <h3 className="text-sm font-medium text-zinc-500">Total meeting time</h3>
        </CardHeader>
        <CardBody className="space-y-2">
          <p className="text-lg font-semibold text-zinc-800">
            {totalMeetingHours}h · {meetingPct}% of work time
          </p>
          <Chip color={meetingPctChipColor(meetingPct)}>
            {meetingPct < 20 ? 'Healthy load' : meetingPct < 35 ? 'Elevated' : 'High meeting load'}
          </Chip>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-sm font-medium text-zinc-500">Avg recovery</h3>
        </CardHeader>
        <CardBody>
          <Tooltip content="Average minutes until deep work resumes after a meeting ends">
            <div className="flex flex-wrap items-center gap-2 cursor-help">
              <p className="text-lg font-semibold text-zinc-800">{avgRecoveryMin} min</p>
              <Chip color={recoveryChipColor(avgRecoveryMin)}>
                {avgRecoveryMin < 15 ? 'Fast' : avgRecoveryMin < 25 ? 'Moderate' : 'Slow'}
              </Chip>
            </div>
          </Tooltip>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-sm font-medium text-zinc-500">Wasted fragments</h3>
        </CardHeader>
        <CardBody>
          <Tooltip content="Time between meetings too short (<15 min) to start deep work">
            <p className="text-lg font-semibold text-zinc-800 cursor-help">
              {wastedFragmentsHours}h in unusable gaps
            </p>
          </Tooltip>
        </CardBody>
      </Card>
    </div>
  )
}
