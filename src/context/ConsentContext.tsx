'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { readConsentFromStorage, writeConsentToStorage, type StoredConsentV1 } from '@/lib/consent-storage'

type ConsentContextValue = {
  /** Hydration finished; safe to show banner if still undecided. */
  hydrated: boolean
  /** User has accepted or rejected non-essential processing via the banner. */
  decided: boolean
  /** Non-essential analytics (e.g. aggregated click counts) allowed. */
  analyticsAllowed: boolean
  acceptAll: () => void
  rejectNonEssential: () => void
  setAnalytics: (allowed: boolean) => void
  openPreferences: () => void
  closePreferences: () => void
  preferencesOpen: boolean
}

const ConsentContext = createContext<ConsentContextValue | null>(null)

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false)
  const [consent, setConsent] = useState<StoredConsentV1 | null>(null)
  const [preferencesOpen, setPreferencesOpen] = useState(false)

  useEffect(() => {
    setConsent(readConsentFromStorage())
    setHydrated(true)
  }, [])

  const persist = useCallback((next: Omit<StoredConsentV1, 'version'>) => {
    writeConsentToStorage(next)
    setConsent({
      version: 1,
      decided: next.decided,
      analytics: next.analytics,
      updatedAt: next.updatedAt,
    })
  }, [])

  const acceptAll = useCallback(() => {
    persist({
      decided: true,
      analytics: true,
      updatedAt: new Date().toISOString(),
    })
    setPreferencesOpen(false)
  }, [persist])

  const rejectNonEssential = useCallback(() => {
    persist({
      decided: true,
      analytics: false,
      updatedAt: new Date().toISOString(),
    })
    setPreferencesOpen(false)
  }, [persist])

  const setAnalytics = useCallback(
    (allowed: boolean) => {
      persist({
        decided: true,
        analytics: allowed,
        updatedAt: new Date().toISOString(),
      })
    },
    [persist]
  )

  const value = useMemo<ConsentContextValue>(
    () => ({
      hydrated,
      decided: consent?.decided ?? false,
      analyticsAllowed: consent?.decided === true && consent.analytics === true,
      acceptAll,
      rejectNonEssential,
      setAnalytics,
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
      preferencesOpen,
    }),
    [hydrated, consent, acceptAll, rejectNonEssential, setAnalytics, preferencesOpen]
  )

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
}

export function useConsent() {
  const ctx = useContext(ConsentContext)
  if (!ctx) {
    throw new Error('useConsent must be used within ConsentProvider')
  }
  return ctx
}
