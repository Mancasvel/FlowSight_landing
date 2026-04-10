/** Canonical marketing site config — SEO, GEO signals, and structured data. */
export const siteConfig = {
  name: 'FlowSight',
  legalName: 'FlowSight Inc.',
  url: 'https://flowsight.site',
  /** Used when NEXT_PUBLIC_SITE_URL is not set (e.g. local dev). */
  defaultOgImage: '/flowsight_sinfondo.png',
  description:
    'FlowSight gives engineering and product teams task visibility without employee surveillance: local-first context, AI understanding, Jira-ready traceability, and privacy-by-design—alternatives to screenshot-based time trackers and invasive monitoring.',
  keywords: [
    'FlowSight',
    'workforce visibility',
    'task traceability',
    'privacy-first monitoring',
    'engineering analytics',
    'PM dashboard',
    'Jira integration',
    'GDPR friendly workforce software',
    'alternative to Hubstaff',
    'alternative to Time Doctor',
    'non-surveillance productivity',
    'AI work context',
    'deep work analytics',
  ],
  twitterHandle: '@flowsight',
  locale: 'en_US',
  /** International / GEO: regions served (schema.org + hreflang baseline). */
  areaServed: ['US', 'GB', 'AT', 'BE', 'DE', 'ES', 'FR', 'IE', 'IT', 'NL', 'PT', 'EU'] as const,
  /** Add real profile URLs when available — empty avoids placeholder links in schema. */
  sameAs: [] as string[],
  /**
   * GDPR Art. 13/14 — contact for privacy requests. Replace with counsel-approved addresses.
   */
  privacyEmail: 'privacy@flowsight.com',
  /**
   * EU GDPR Art. 27 — EU representative (if applicable). Set when you appoint one; leave empty otherwise.
   */
  euRepresentativeContactEmail: null as string | null,
  /**
   * Controller identity — add full postal address with your legal team (Art. 13(1)(a)).
   */
  controllerPostalSummary:
    'FlowSight Inc., United States. A complete postal address is available on request to privacy@flowsight.com.',
}

export function absoluteUrl(path: string): string {
  const base = siteConfig.url.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}
