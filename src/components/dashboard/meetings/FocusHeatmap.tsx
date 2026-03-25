'use client'

import { Fragment, useMemo, type CSSProperties } from 'react'
import type { FlaggedWindow, FocusCell } from '@/lib/types/dashboard'
import { Card, CardBody, CardHeader, Tooltip } from '@/components/ui'

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17] as const

type Props = {
  heatmap: FocusCell[]
  flaggedWindows: FlaggedWindow[]
}

function cellKey(day: number, hour: number) {
  return `${day}-${hour}`
}

export default function FocusHeatmap({ heatmap, flaggedWindows }: Props) {
  const cellMap = useMemo(() => {
    const m = new Map<string, FocusCell>()
    for (const c of heatmap) {
      m.set(cellKey(c.day, c.hour), c)
    }
    return m
  }, [heatmap])

  const flaggedSet = useMemo(() => {
    const s = new Set<string>()
    for (const f of flaggedWindows) {
      s.add(cellKey(f.day, f.hour))
    }
    return s
  }, [flaggedWindows])

  const stripe =
    'repeating-linear-gradient(135deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 6px)'

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-zinc-800">
          Focus Heatmap vs Meetings · Team Average This Week
        </h2>
      </CardHeader>
      <CardBody className="overflow-x-auto">
        <div
          className="grid gap-1.5 min-w-[600px]"
          style={{
            gridTemplateColumns: `56px repeat(${HOURS.length}, minmax(0, 1fr))`,
            gridTemplateRows: `auto repeat(${DAY_NAMES.length}, 36px)`,
          }}
        >
          <div className="h-9" aria-hidden />

          {HOURS.map((h) => (
            <div
              key={h}
              className="flex h-9 items-end justify-center pb-1 text-xs text-zinc-500"
            >
              {h}:00
            </div>
          ))}

          {DAY_NAMES.map((dayLabel, dayIdx) => (
            <Fragment key={dayLabel}>
              <div className="flex h-9 items-center pr-2 text-xs font-medium text-zinc-500">
                {dayLabel}
              </div>
              {HOURS.map((hour) => {
                const cell = cellMap.get(cellKey(dayIdx, hour))
                const intensity = cell?.intensity ?? 0
                const hasMeeting = cell?.hasMeeting ?? false
                const isFlagged = flaggedSet.has(cellKey(dayIdx, hour))
                const alpha = Math.max(0.06, intensity)

                const bg = `rgba(67, 97, 238, ${alpha})`
                const style: CSSProperties = hasMeeting
                  ? {
                      backgroundImage: `${stripe}, linear-gradient(${bg}, ${bg})`,
                      backgroundColor: 'transparent',
                    }
                  : { backgroundColor: bg }

                const inner = (
                  <div
                    role="img"
                    aria-label={`${dayLabel} ${hour}:00, focus intensity ${Math.round(intensity * 100)}%${hasMeeting ? ', meeting' : ''}${isFlagged ? ', peak focus flagged' : ''}`}
                    className={`h-9 w-full rounded-md border ${
                      isFlagged
                        ? 'border-red-500 ring-2 ring-red-500 ring-offset-0'
                        : 'border-zinc-200'
                    }`}
                    style={style}
                  />
                )

                let content = inner
                if (hasMeeting && isFlagged) {
                  content = (
                    <Tooltip content="Meeting scheduled here · Peak focus time — consider moving this meeting">
                      {inner}
                    </Tooltip>
                  )
                } else if (hasMeeting) {
                  content = <Tooltip content="Meeting scheduled here">{inner}</Tooltip>
                } else if (isFlagged) {
                  content = (
                    <Tooltip content="Peak focus time — consider moving this meeting">{inner}</Tooltip>
                  )
                }

                return (
                  <div key={`${dayIdx}-${hour}`} className="flex h-9 items-center">
                    {content}
                  </div>
                )
              })}
            </Fragment>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
