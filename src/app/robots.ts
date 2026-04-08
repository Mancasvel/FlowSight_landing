import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/$/, '')
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/invite/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base.replace(/^https?:\/\//, ''),
  }
}
