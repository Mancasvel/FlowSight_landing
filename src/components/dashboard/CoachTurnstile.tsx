'use client'

import Script from 'next/script'
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string
      size?: 'invisible' | 'normal' | 'compact'
      callback?: (token: string) => void
      'error-callback'?: () => void
    }
  ) => string
  execute: (widgetId: string) => void
  reset: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

type TurnstileContextValue = {
  getToken: () => Promise<string | undefined>
  enabled: boolean
}

const TurnstileContext = createContext<TurnstileContextValue>({
  getToken: async () => undefined,
  enabled: false,
})

export function useCoachTurnstile(): TurnstileContextValue {
  return useContext(TurnstileContext)
}

export function CoachTurnstileProvider({ children }: { children: ReactNode }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [ready, setReady] = useState(false)
  const resolveRef = useRef<((token: string | undefined) => void) | null>(null)

  const mountWidget = useCallback(() => {
    if (!siteKey || !containerRef.current || !window.turnstile || widgetIdRef.current) return
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      size: 'invisible',
      callback: (token: string) => {
        resolveRef.current?.(token)
        resolveRef.current = null
      },
      'error-callback': () => {
        resolveRef.current?.(undefined)
        resolveRef.current = null
      },
    })
    setReady(true)
  }, [siteKey])

  const getToken = useCallback(async () => {
    if (!siteKey || !ready || !window.turnstile || !widgetIdRef.current) return undefined

    return new Promise<string | undefined>((resolve) => {
      resolveRef.current = resolve
      window.turnstile!.execute(widgetIdRef.current!)
      window.setTimeout(() => {
        if (resolveRef.current) {
          resolveRef.current(undefined)
          resolveRef.current = null
        }
      }, 12_000)
    })
  }, [ready, siteKey])

  return (
    <TurnstileContext.Provider value={{ getToken, enabled: Boolean(siteKey) }}>
      {siteKey && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="lazyOnload"
            onLoad={mountWidget}
          />
          <div ref={containerRef} className="sr-only" aria-hidden />
        </>
      )}
      {children}
    </TurnstileContext.Provider>
  )
}
