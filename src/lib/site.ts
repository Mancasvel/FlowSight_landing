/** Canonical marketing site config: SEO, GEO signals, and structured data. */
export const siteConfig = {
  name: 'FlowSight',
  legalName: 'FlowSight Inc.',
  url: 'https://flowsight.site',
  /** Used when NEXT_PUBLIC_SITE_URL is not set (e.g. local dev). */
  defaultOgImage: '/flowsight_sinfondo.png',
  description:
    'FlowSight: local AI on your device for cognitive health and proof of work. No surveillance, no timesheet theater. Code you can read; exports only when you choose.',
  keywords: [
    'FlowSight',
    'cognitive health at work',
    'local AI productivity',
    'proof of work reports',
    'freelancer time tracking alternative',
    'inspectable productivity software',
    'on device AI agent',
    'no surveillance monitoring',
    'alternative to Hubstaff',
    'alternative to Time Doctor',
    'alternative to Toggl',
    'deep work analytics',
    'context switching detection',
    'burnout signals',
    'outsourcing platform transparency',
    'GDPR friendly productivity',
  ],
  twitterHandle: '@flowsight',
  locale: 'en_US',
  /** International / GEO: regions served (schema.org + hreflang baseline). */
  areaServed: ['US', 'GB', 'AT', 'BE', 'DE', 'ES', 'FR', 'IE', 'IT', 'NL', 'PT', 'EU'] as const,
  /** Add real profile URLs when available; empty avoids placeholder links in schema. */
  sameAs: [] as string[],
  /**
   * GDPR Art. 13/14: contact for privacy requests. Replace with counsel-approved addresses.
   */
  privacyEmail: 'privacy@flowsight.com',
  /**
   * EU GDPR Art. 27, EU representative (if applicable). Set when you appoint one; leave empty otherwise.
   */
  euRepresentativeContactEmail: null as string | null,
  /**
   * Controller identity: add full postal address with your legal team (Art. 13(1)(a)).
   */
  controllerPostalSummary:
    'FlowSight Inc., United States. A complete postal address is available on request to privacy@flowsight.com.',
}

export function absoluteUrl(path: string): string {
  const base = siteConfig.url.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}
