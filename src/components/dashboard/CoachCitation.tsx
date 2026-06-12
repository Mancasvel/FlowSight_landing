'use client'

import { Tooltip } from '@/components/ui'
import type { CoachCitation } from '@/lib/coachChat/citations'
import { resolveCitation, type CoachCitationIndex } from '@/lib/coachChat/citations'

type Props = {
  citeKey: string
  display: string
  citations?: CoachCitationIndex
}

export default function CoachCitation({ citeKey, display, citations }: Props) {
  const citation = resolveCitation(citeKey, citations)

  const tooltip = citation ? (
    <div className="space-y-1.5">
      <div className="font-medium text-zinc-100">{citation.label}</div>
      {citation.value && (
        <div className="text-[12px] text-zinc-200">{citation.value}</div>
      )}
      <div className="text-[11px] leading-relaxed text-zinc-300">{citation.detail}</div>
    </div>
  ) : (
    <div className="text-[11px] text-zinc-300">Source metadata not available for this cite.</div>
  )

  return (
    <Tooltip content={tooltip} wide>
      <span className="cursor-help rounded-sm bg-zinc-200/70 px-1 py-px text-[15px] font-medium text-zinc-800 transition-colors hover:bg-zinc-200">
        {display}
      </span>
    </Tooltip>
  )
}
