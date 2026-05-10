'use client'

import { useEffect, useRef } from 'react'
import Clarity from '@microsoft/clarity'
import { useConsent } from '@/context/ConsentContext'

const clarityProjectId = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_PROJECT_ID

export function MicrosoftClarity() {
  const { hydrated, analyticsAllowed } = useConsent()
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!hydrated || !clarityProjectId) return

    if (!analyticsAllowed) {
      if (initializedRef.current) {
        Clarity.consent(false)
      }
      return
    }

    if (!initializedRef.current) {
      Clarity.init(clarityProjectId)
      initializedRef.current = true
    }

    Clarity.consent(true)
  }, [hydrated, analyticsAllowed])

  return null
}
