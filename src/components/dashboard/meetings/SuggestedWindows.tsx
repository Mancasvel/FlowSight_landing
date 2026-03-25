'use client'

import type { FlaggedWindow, SuggestedWindow } from '@/lib/types/dashboard'
import { Alert, Card, CardBody, CardHeader } from '@/components/ui'

type Props = {
  suggested: SuggestedWindow[]
  flagged: FlaggedWindow[]
}

export default function SuggestedWindows({ suggested, flagged }: Props) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-zinc-800">Suggested Meeting Windows</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Based on your team&apos;s last 30 days of focus patterns
        </p>
      </CardHeader>
      <CardBody className="space-y-3">
        {suggested.length === 0 && flagged.length === 0 ? (
          <p className="text-sm text-zinc-500">No suggestions for this period.</p>
        ) : null}
        {suggested.map((s, i) => (
          <Alert key={`suggested-${s.day}-${s.hour}-${i}`} color="success" dismissible={false}>
            {s.dayName} {s.hour}:00–{s.hour + 1}:00 · {s.reason}
          </Alert>
        ))}
        {flagged.map((f, i) => (
          <Alert key={`flagged-${f.day}-${f.hour}-${i}`} color="danger" dismissible={false}>
            Currently scheduled during peak focus · Moving this recovers ~{f.hoursRecoverable}h/week of
            deep work
          </Alert>
        ))}
      </CardBody>
    </Card>
  )
}
