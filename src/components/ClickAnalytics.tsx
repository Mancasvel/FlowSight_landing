'use client'

import { useEffect } from 'react'

/**
 * Records every click (global counter) and optional labeled counts via data-track="my-label".
 */
export function ClickAnalytics() {
  useEffect(() => {
    const send = (key?: string) => {
      fetch('/api/analytics/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(key ? { key } : {}),
        keepalive: true,
      }).catch(() => {
        /* ignore network errors */
      })
    }

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const tracked = target?.closest?.('[data-track]') as HTMLElement | null
      const track = tracked?.getAttribute('data-track')?.trim()
      send(track || undefined)
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
