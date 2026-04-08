import { absoluteUrl, siteConfig } from '@/lib/site'
import type { BlogPost } from '@/lib/blog/types'

export function BlogIndexJsonLd({ posts }: { posts: BlogPost[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${siteConfig.name} Blog`,
    description: 'Articles comparing FlowSight to alternatives and explaining privacy-first team visibility.',
    url: absoluteUrl('/blog'),
    isPartOf: { '@type': 'WebSite', name: siteConfig.name, url: siteConfig.url },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListElement: posts.map((post, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: post.title,
        url: absoluteUrl(`/blog/${post.slug}`),
      })),
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
