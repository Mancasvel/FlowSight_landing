'use client'

import { useEffect } from 'react'
import { useConsent } from '@/context/ConsentContext'

/**
 * Aggregated click counts (non-essential). Only runs after opt-in consent (GDPR / ePrivacy).
 */
export function ClickAnalytics() {
  const { hydrated, analyticsAllowed } = useConsent()

  useEffect(() => {
    if (!hydrated || !analyticsAllowed) return

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
  }, [hydrated, analyticsAllowed])

  return null
}
