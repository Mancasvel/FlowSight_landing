'use client'

import type { StandupHealthData } from '@/lib/types/dashboard'
import { Alert, Card, CardBody, CardHeader, Divider, Progress } from '@/components/ui'

type Props = {
  health: StandupHealthData
}

export default function StandupHealth({ health }: Props) {
  const { avgDurationMin, blockersRaised, blockersResolved } = health
  const ratio = blockersRaised > 0 ? blockersResolved / blockersRaised : 1

  let progressColor: 'success' | 'warning' | 'danger' = 'danger'
  if (ratio > 0.6) progressColor = 'success'
  else if (ratio > 0.3) progressColor = 'warning'

  const progressMax = Math.max(blockersRaised, 1)

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-zinc-800">Daily Standup Health</h2>
      </CardHeader>
      <CardBody className="space-y-4">
        <div>
          <p className="text-sm text-zinc-500">Avg duration</p>
          <p className="mt-1 text-base font-medium text-zinc-800">{avgDurationMin} min</p>
        </div>

        <Divider />

        <div>
          <p className="text-sm text-zinc-500">Blockers raised</p>
          <p className="mt-1 text-base font-medium text-zinc-800">{blockersRaised} this week</p>
        </div>

        <Divider />

        <div className="space-y-2">
          <p className="text-sm text-zinc-500">Resolved {'<'} 24h</p>
          <Progress
            value={blockersResolved}
            maxValue={progressMax}
            color={progressColor}
            showValueLabel
            label={
              blockersRaised > 0
                ? `${blockersResolved} of ${blockersRaised} blockers`
                : 'No blockers this week'
            }
          />
        </div>

        {ratio < 0.5 ? (
          <Alert color="warning" dismissible={false}>
            Standups are surfacing blockers but not resolving them fast enough. Consider async blocker
            tracking.
          </Alert>
        ) : (
          <Alert color="success" dismissible={false}>
            Standups are effectively resolving blockers this week.
          </Alert>
        )}
      </CardBody>
    </Card>
  )
}
