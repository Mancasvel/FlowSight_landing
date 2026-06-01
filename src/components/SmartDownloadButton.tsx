'use client'

import { Download } from 'lucide-react'
import { useDownloadActions } from '@/context/DownloadActionsContext'

type Props = {
  /** Value for `data-track` analytics (optional). */
  trackKey?: string
  className?: string
}

export function SmartDownloadButton({ trackKey, className }: Props) {
  const { downloadForPlatform, downloadLabel } = useDownloadActions()

  return (
    <button
      type="button"
      onClick={downloadForPlatform}
      data-track={trackKey}
      className={
        className ??
        'group inline-flex items-center gap-2 rounded-full bg-secondary-navy px-7 py-3.5 text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/15'
      }
    >
      <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
      {downloadLabel}
    </button>
  )
}
