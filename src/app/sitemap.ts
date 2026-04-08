import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site'
import { getBlogSlugs } from '@/lib/blog/posts'

const staticPaths = [
  '/',
  '/about',
  '/blog',
  '/pricing',
  '/contact',
  '/features',
  '/integrations',
  '/documentation',
  '/security',
  '/gdpr',
  '/legal-security',
  '/privacy-policy',
  '/terms-of-service',
  '/support',
  '/careers',
  '/api-reference',
  '/team',
  '/login',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, '')
  const lastMod = new Date()

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified: lastMod,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path === '/blog' ? 0.9 : 0.7,
  }))

  for (const slug of getBlogSlugs()) {
    entries.push({
      url: `${base}/blog/${slug}`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.75,
    })
  }

  return entries
}
