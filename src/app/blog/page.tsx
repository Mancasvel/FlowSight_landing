import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { BlogIndexJsonLd } from '@/components/seo/BlogIndexJsonLd'
import { getAllBlogPosts } from '@/lib/blog/posts'
import { absoluteUrl, siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: `Blog | ${siteConfig.name} — comparisons, privacy, and product`,
  description:
    'FlowSight blog: how we compare to time trackers and surveillance-style monitoring, GDPR-friendly visibility for EU teams, and why AI context beats screenshot-heavy tools for PMs.',
  keywords: [
    ...siteConfig.keywords,
    'FlowSight blog',
    'workforce visibility comparisons',
    'EU GDPR analytics',
  ],
  alternates: { canonical: absoluteUrl('/blog') },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/blog'),
    siteName: siteConfig.name,
    title: `Blog | ${siteConfig.name}`,
    description:
      'Comparisons, privacy, and product thinking—why teams choose FlowSight over classic time trackers and invasive monitoring.',
    locale: siteConfig.locale,
    images: [{ url: absoluteUrl(siteConfig.defaultOgImage), width: 512, height: 512, alt: siteConfig.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Blog | ${siteConfig.name}`,
    description: 'Comparisons and guides for privacy-first team visibility.',
  },
  robots: { index: true, follow: true },
}

function categoryLabel(c: string) {
  if (c === 'compare') return 'Comparisons'
  if (c === 'privacy') return 'Privacy & compliance'
  return 'Product'
}

export default function BlogPage() {
  const posts = getAllBlogPosts()

  return (
    <>
      <BlogIndexJsonLd posts={posts} />
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <section className="relative pt-20 pb-16 sm:pb-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 container-max px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-12 md:mb-16">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                FlowSight
                <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">Blog</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto px-4">
                Guides for buyers comparing FlowSight to time trackers, monitoring tools, and manual PM workflows—plus
                privacy-first visibility for US and European teams.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24" aria-labelledby="blog-posts-heading">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <h2 id="blog-posts-heading" className="sr-only">
              Blog posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 hover:border-teal-500/30 transition-all duration-300 group flex flex-col"
                >
                  <div className="mb-4 flex-1">
                    <div className="flex items-center text-sm text-gray-400 mb-3 flex-wrap gap-2">
                      <span className="text-teal-400/90 text-xs font-semibold uppercase tracking-wide">
                        {categoryLabel(post.category)}
                      </span>
                      <span aria-hidden>·</span>
                      <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                      <span aria-hidden>·</span>
                      <span>{post.readTimeMin} min read</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">
                      <Link href={`/blog/${post.slug}`} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-sm">{post.excerpt}</p>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-teal-400 hover:text-teal-300 font-medium text-sm mt-auto inline-flex items-center gap-1"
                  >
                    Read article →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
