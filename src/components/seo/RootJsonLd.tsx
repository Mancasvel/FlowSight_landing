import { siteConfig, absoluteUrl } from '@/lib/site'

export function RootJsonLd() {
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.defaultOgImage),
    description: siteConfig.description,
    areaServed: siteConfig.areaServed.map((code) => ({
      '@type': 'AdministrativeArea',
      name: code,
    })),
    ...(siteConfig.sameAs.length > 0 ? { sameAs: siteConfig.sameAs } : {}),
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: ['en-US', 'en-GB'],
    publisher: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  )
}
