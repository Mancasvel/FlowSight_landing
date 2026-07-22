import type { Metadata } from 'next'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { BlogIndexJsonLd } from '@/components/seo/BlogIndexJsonLd'
import { getAllBlogPosts } from '@/lib/blog/posts'
import { absoluteUrl, siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: `Blog | ${siteConfig.name} · cognitive health, local AI, and proof of work`,
  description:
    'FlowSight blog: local AI on your device, inspectable FlowSight code, protecting deep work from context switching, automatic client reports without bossware, and how freelancers stay GDPR-savvy.',
  keywords: [
    ...siteConfig.keywords,
    'FlowSight blog',
    'local AI productivity',
    'proof of work freelancing',
    'EU GDPR analytics',
  ],
  alternates: { canonical: absoluteUrl('/blog') },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/blog'),
    siteName: siteConfig.name,
    title: `Blog | ${siteConfig.name}`,
    description:
      'Guides for knowledge workers choosing FlowSight over surveillance trackers, manual timesheets, and "just log everything" PM theater.',
    locale: siteConfig.locale,
    images: [{ url: absoluteUrl(siteConfig.defaultOgImage), width: 512, height: 512, alt: siteConfig.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Blog | ${siteConfig.name}`,
    description: 'Guides for local-first cognitive health and ethical proof of work.',
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
      <main className="min-h-screen bg-white font-sans selection:bg-cyan-100 selection:text-cyan-900 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] [background-size:32px_32px]">
        <header className="fixed top-0 left-0 z-50 w-full border-b border-slate-200/60 bg-white/70 px-6 py-4 backdrop-blur-md">
          <div className="relative mx-auto flex max-w-7xl items-center justify-between">
            <Link href="/" className="text-lg font-bold tracking-tighter text-secondary-navy">
              Flow<span className="text-primary-teal">Sight</span>
            </Link>
            <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1.5 text-xs font-medium text-slate-400 md:flex">
              <Lock className="h-3 w-3" aria-hidden />
              <span>privacy-first, local, yours forever</span>
            </div>
            <Link
              href="/login"
              className="rounded-full bg-gradient-to-r from-primary-cyan to-primary-teal px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:from-primary-teal hover:to-primary-cyan hover:shadow-lg"
            >
              Sign in
            </Link>
          </div>
        </header>

        <section className="pt-36 pb-24 md:pt-44 md:pb-32">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-secondary-navy mb-6">
              FlowSight
              <span className="block bg-gradient-to-r from-primary-cyan to-primary-teal bg-clip-text text-transparent pt-2 pb-3">
                Blog
              </span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto">
              Deep dives on local AI, open code you can trust, cognitive ergonomics, and how to give clients confidence without
              turning workers into suspects, written for freelancers, remote ICs, and marketplace operators.
            </p>
          </div>
        </section>

        <section className="pb-24" aria-labelledby="blog-posts-heading">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 id="blog-posts-heading" className="sr-only">
              Blog posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col"
                >
                  <div className="mb-4 flex-1">
                    <div className="flex items-center text-sm text-slate-400 mb-3 flex-wrap gap-2">
                      <span className="text-primary-teal text-xs font-semibold uppercase tracking-wide">
                        {categoryLabel(post.category)}
                      </span>
                      <span aria-hidden>·</span>
                      <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                      <span aria-hidden>·</span>
                      <span>{post.readTimeMin} min read</span>
                    </div>
                    <h3 className="text-lg font-bold text-secondary-navy mb-3 group-hover:text-primary-teal transition-colors">
                      <Link href={`/blog/${post.slug}`} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal rounded">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-slate-500 leading-relaxed text-sm">{post.excerpt}</p>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary-teal hover:text-cyan-600 font-medium text-sm mt-auto inline-flex items-center gap-1"
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
