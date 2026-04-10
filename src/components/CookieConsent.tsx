'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useConsent } from '@/context/ConsentContext'
import { siteConfig } from '@/lib/site'

export function CookieConsent() {
  const {
    hydrated,
    decided,
    acceptAll,
    rejectNonEssential,
    analyticsAllowed,
    setAnalytics,
    preferencesOpen,
    openPreferences,
    closePreferences,
  } = useConsent()

  if (!hydrated) {
    return null
  }

  return (
    <>
      {!decided && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-consent-title"
          className="fixed inset-x-0 bottom-0 z-[100] border-t border-zinc-200 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md md:p-6"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-zinc-700 md:max-w-2xl">
              <h2 id="cookie-consent-title" className="mb-1 font-semibold text-zinc-900">
                Cookies and similar technologies
              </h2>
              <p className="leading-relaxed">
                We use essential technologies to run this site. With your permission, we also measure aggregated interactions
                (for example, download and navigation usage) to improve {siteConfig.name}. See our{' '}
                <Link href="/cookie-policy" className="text-teal-700 underline underline-offset-2 hover:text-teal-900">
                  Cookie Policy
                </Link>{' '}
                and{' '}
                <Link href="/privacy-policy" className="text-teal-700 underline underline-offset-2 hover:text-teal-900">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
              <button
                type="button"
                onClick={openPreferences}
                className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              >
                Preferences
              </button>
              <button
                type="button"
                onClick={rejectNonEssential}
                className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              >
                Reject non-essential
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-teal-700 hover:to-cyan-700"
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      )}

      {decided && (
        <button
          type="button"
          onClick={openPreferences}
          className="fixed bottom-4 left-4 z-[100] rounded-full border border-zinc-300 bg-white/95 px-4 py-2 text-xs font-medium text-zinc-700 shadow-md backdrop-blur hover:bg-zinc-50 md:text-sm"
        >
          Cookie preferences
        </button>
      )}

      {preferencesOpen && (
        <PreferencesModal
          initialAnalytics={analyticsAllowed}
          onSave={(analytics) => {
            setAnalytics(analytics)
            closePreferences()
          }}
          onClose={closePreferences}
        />
      )}
    </>
  )
}

function PreferencesModal({
  initialAnalytics,
  onSave,
  onClose,
}: {
  initialAnalytics: boolean
  onSave: (analytics: boolean) => void
  onClose: () => void
}) {
  const [analytics, setAnalyticsLocal] = useState(initialAnalytics)
  useEffect(() => {
    setAnalyticsLocal(initialAnalytics)
  }, [initialAnalytics])

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center p-4 sm:items-center">
      <button type="button" className="absolute inset-0 bg-zinc-900/50" aria-label="Close overlay" onClick={onClose} />
      <div
        role="dialog"
        aria-labelledby="prefs-title"
        className="relative z-10 w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
      >
        <h3 id="prefs-title" className="text-lg font-semibold text-zinc-900">
          Privacy preferences
        </h3>
        <p className="mt-2 text-sm text-zinc-600">
          Turn categories on or off. Essential technologies cannot be disabled.
        </p>
        <ul className="mt-4 space-y-4">
          <li className="flex items-start justify-between gap-4 rounded-lg border border-zinc-100 bg-zinc-50 p-3">
            <div>
              <p className="font-medium text-zinc-900">Essential</p>
              <p className="text-xs text-zinc-600">
                Required for security, load balancing, authentication where applicable, and storing your consent choice.
              </p>
            </div>
            <span className="text-xs font-semibold uppercase text-zinc-500">Always on</span>
          </li>
          <li className="flex items-start justify-between gap-4 rounded-lg border border-zinc-200 p-3">
            <div>
              <p className="font-medium text-zinc-900">Analytics (aggregated)</p>
              <p className="text-xs text-zinc-600">
                Helps us understand which pages and actions are used (aggregated counters). No advertising profiles.
              </p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalyticsLocal(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500"
                id="pref-analytics"
              />
            </label>
          </li>
        </ul>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(analytics)}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Save preferences
          </button>
        </div>
      </div>
    </div>
  )
}
