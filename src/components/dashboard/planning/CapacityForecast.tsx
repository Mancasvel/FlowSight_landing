'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card, CardHeader, CardBody, Progress, Button, ButtonGroup } from '@/components/ui'
import type { SprintPlanningData } from '@/lib/types/dashboard'

type Props = { sprint: SprintPlanningData | null }

function contextSwitchingHours(s: SprintPlanningData): number {
  const raw = s.actualHours - s.deepHours - s.meetingHours - s.interruptedHours
  return Math.max(0, Math.round(raw * 10) / 10)
}

export default function CapacityForecast({ sprint }: Props) {
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(t)
  }, [toast])

  const showToast = useCallback((message: string) => {
    setToast(message)
  }, [])

  const copyExport = useCallback(() => {
    if (!sprint) return
    const ctx = contextSwitchingHours(sprint)
    const text = [
      `FlowSight — Sprint capacity forecast`,
      `Sprint: ${sprint.label}`,
      `Committed: ${sprint.committedHours}h`,
      `Expected delivery: ${sprint.expectedDelivery}h`,
      `Efficiency: ${Math.round(sprint.efficiencyRatio * 100)}%`,
      `Loss — meetings: ${sprint.meetingHours}h, interruptions: ${sprint.interruptedHours}h, context: ${ctx}h`,
    ].join('\n')
    void navigator.clipboard.writeText(text).then(() => showToast('Forecast copied to clipboard'))
  }, [sprint, showToast])

  const copyShare = useCallback(() => {
    if (!sprint) return
    const text = `Next sprint (${sprint.label}): we committed ${sprint.committedHours}h; FlowSight forecasts ~${sprint.expectedDelivery}h of effective delivery (${Math.round(sprint.efficiencyRatio * 100)}% efficiency).`
    void navigator.clipboard.writeText(text).then(() => showToast('Summary copied — ready to share'))
  }, [sprint, showToast])

  if (!sprint) {
    return (
      <Card className="h-full">
        <CardHeader>
          <h3 className="text-sm font-medium text-zinc-800">Capacity Forecast</h3>
          <p className="text-xs text-zinc-500 mt-1">Next Sprint</p>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-zinc-500">No sprint commitment data yet.</p>
        </CardBody>
      </Card>
    )
  }

  const committedMax = Math.max(sprint.committedHours, 1)
  const actualMax = Math.max(sprint.actualHours, 1)
  const ctxHours = contextSwitchingHours(sprint)
  const meterColor =
    sprint.efficiencyRatio >= 0.75 ? 'success' : sprint.efficiencyRatio >= 0.5 ? 'warning' : 'danger'

  return (
    <Card className="h-full relative">
      {toast && (
        <div
          role="status"
          className="absolute top-4 right-4 z-10 px-3 py-2 rounded-xl text-xs font-medium
            bg-white shadow-lg text-zinc-700 border border-indigo-200 max-w-[220px]"
        >
          {toast}
        </div>
      )}
      <CardHeader>
        <h3 className="text-sm font-medium text-zinc-800">Next Sprint</h3>
        <p className="text-xs text-zinc-500 mt-0.5">{sprint.label}</p>
      </CardHeader>
      <CardBody className="space-y-4">
        <div>
          <p className="text-xs text-zinc-500 mb-1">Committed hours</p>
          <p className="text-3xl font-bold text-zinc-800 tabular-nums">
            {sprint.committedHours}
            <span className="text-lg font-semibold text-zinc-500 ml-1">h</span>
          </p>
        </div>

        <div>
          <div className="flex justify-between text-xs text-zinc-500 mb-1">
            <span>Expected delivery</span>
            <span className="tabular-nums">
              {sprint.expectedDelivery}h / {sprint.committedHours}h
            </span>
          </div>
          <Progress
            value={sprint.expectedDelivery}
            maxValue={committedMax}
            color={meterColor}
          />
        </div>

        <div className="space-y-3 pt-1">
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Loss breakdown</p>
          <div className="space-y-2">
            <Progress
              label={`Meetings · ${sprint.meetingHours}h`}
              value={sprint.meetingHours}
              maxValue={actualMax}
              color="warning"
              size="sm"
            />
            <Progress
              label={`Interruptions · ${sprint.interruptedHours}h`}
              value={sprint.interruptedHours}
              maxValue={actualMax}
              color="danger"
              size="sm"
            />
            <Progress
              label={`Context switching · ${ctxHours}h`}
              value={ctxHours}
              maxValue={actualMax}
              color="primary"
              size="sm"
            />
          </div>
        </div>

        <ButtonGroup className="pt-2 flex-wrap">
          <Button type="button" variant="flat" onClick={copyExport}>
            Export forecast
          </Button>
          <Button type="button" variant="flat" onClick={copyShare}>
            Share with stakeholders
          </Button>
        </ButtonGroup>
      </CardBody>
    </Card>
  )
}
