import { siteConfig, absoluteUrl } from '@/lib/site'
import type { BlogPost } from '@/lib/blog/types'

type Props = { post: BlogPost; url: string }

export function ArticleJsonLd({ post, url }: Props) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(siteConfig.defaultOgImage),
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: [absoluteUrl(siteConfig.defaultOgImage)],
    keywords: post.keywords.join(', '),
    articleSection: post.category,
    inLanguage: 'en-US',
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
