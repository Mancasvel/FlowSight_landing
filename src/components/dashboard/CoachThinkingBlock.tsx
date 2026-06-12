'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Brain } from 'lucide-react'

type Props = {
  reasoning: string
  defaultOpen?: boolean
}

export default function CoachThinkingBlock({ reasoning, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="mb-2 rounded-lg border border-zinc-200/80 bg-white/70">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-zinc-500 hover:text-zinc-700"
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
        )}
        <Brain className="h-3.5 w-3.5 shrink-0 text-violet-500" strokeWidth={1.75} />
        <span>Thinking</span>
      </button>
      {open && (
        <div className="border-t border-zinc-100 px-3 py-2.5 text-[12px] leading-relaxed text-zinc-500 whitespace-pre-wrap">
          {reasoning}
        </div>
      )}
    </div>
  )
}
