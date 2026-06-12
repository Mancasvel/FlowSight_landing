'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

type Props = {
  reasoning: string
  defaultOpen?: boolean
}

function countSteps(reasoning: string): number {
  const bullets = reasoning.match(/^[\s]*[-•*]\s+/gm)
  const numbered = reasoning.match(/^[\s]*\d+\.\s+/gm)
  return Math.max(bullets?.length ?? 0, numbered?.length ?? 0, 1)
}

export default function CoachThinkingBlock({ reasoning, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const steps = countSteps(reasoning)

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 font-sans text-[13px] text-zinc-500 transition-colors hover:text-zinc-700"
      >
        <span>
          Completed {steps} {steps === 1 ? 'step' : 'steps'}
        </span>
        <ChevronRight
          className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-90' : ''}`}
          strokeWidth={2}
        />
      </button>
      {open && (
        <div className="mt-2 rounded-lg border border-zinc-200/80 bg-zinc-50/60 px-3.5 py-2.5 font-sans text-[12.5px] leading-relaxed text-zinc-600 whitespace-pre-wrap">
          {reasoning}
        </div>
      )}
    </div>
  )
}
