/** Stored consent for ePrivacy / GDPR (analytics is opt-in). */
export const CONSENT_STORAGE_KEY = 'flowsight_consent_v1'

export type StoredConsentV1 = {
  version: 1
  /** User completed the banner (accept or reject non-essential). */
  decided: boolean
  /** Aggregated usage / click analytics (non-essential). */
  analytics: boolean
  /** ISO timestamp when preferences were saved. */
  updatedAt: string
}

export function parseConsent(raw: string | null): StoredConsentV1 | null {
  if (!raw) return null
  try {
    const p = JSON.parse(raw) as Partial<StoredConsentV1>
    if (p.version !== 1 || typeof p.decided !== 'boolean') return null
    return {
      version: 1,
      decided: p.decided,
      analytics: Boolean(p.analytics),
      updatedAt: typeof p.updatedAt === 'string' ? p.updatedAt : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function readConsentFromStorage(): StoredConsentV1 | null {
  if (typeof window === 'undefined') return null
  return parseConsent(localStorage.getItem(CONSENT_STORAGE_KEY))
}

export function writeConsentToStorage(consent: Omit<StoredConsentV1, 'version' | 'updatedAt'> & { updatedAt?: string }): void {
  const payload: StoredConsentV1 = {
    version: 1,
    decided: consent.decided,
    analytics: consent.analytics,
    updatedAt: consent.updatedAt ?? new Date().toISOString(),
  }
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload))
}
