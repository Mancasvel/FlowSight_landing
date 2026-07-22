import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Lock } from 'lucide-react'
import { getBlogPostBySlug, getBlogSlugs } from '@/lib/blog/posts'
import { siteConfig, absoluteUrl } from '@/lib/site'
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) return { title: 'Post not found' }

  const url = absoluteUrl(`/blog/${post.slug}`)

  return {
    title: `${post.title} | ${siteConfig.name} Blog`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      siteName: siteConfig.name,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      locale: siteConfig.locale,
      images: [{ url: absoluteUrl(siteConfig.defaultOgImage), width: 512, height: 512, alt: siteConfig.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    robots: { index: true, follow: true },
  }
}

function categoryLabel(c: string) {
  if (c === 'compare') return 'Comparisons'
  if (c === 'privacy') return 'Privacy & compliance'
  return 'Product'
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) notFound()

  const url = absoluteUrl(`/blog/${post.slug}`)

  return (
    <>
      <ArticleJsonLd post={post} url={url} />
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

        <article className="pt-32 pb-24">
          <div className="container px-4 md:px-6 mx-auto max-w-3xl">
            <nav className="text-xs text-slate-400 mb-8" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-primary-teal transition-colors text-slate-500">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/blog" className="hover:text-primary-teal transition-colors text-slate-500">
                    Blog
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-slate-400 truncate max-w-[12rem] sm:max-w-none">{post.title}</li>
              </ol>
            </nav>

            <p className="text-primary-teal text-xs font-semibold uppercase tracking-wide mb-3">{categoryLabel(post.category)}</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-secondary-navy mb-6">{post.title}</h1>
            <p className="text-slate-400 text-sm mb-8">
              <time dateTime={post.publishedAt}>{post.publishedAt}</time>
              <span className="mx-2">·</span>
              {post.readTimeMin} min read
            </p>

            <p className="text-lg text-slate-500 leading-relaxed mb-12 border-l-2 border-primary-teal/50 pl-4">{post.excerpt}</p>

            <div className="prose prose-slate max-w-none">
              {post.sections.map((section) => (
                <section key={section.heading} className="mb-10">
                  <h2 className="text-xl font-bold text-secondary-navy mb-4">{section.heading}</h2>
                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="mb-4 text-slate-500 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </section>
              ))}
            </div>

            <div className="mt-14 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-400 mb-4">Explore more on the blog</p>
              <Link href="/blog" className="text-primary-teal hover:text-cyan-600 font-medium text-sm">
                ← All posts
              </Link>
            </div>
          </div>
        </article>
      </main>
    </>
  )
}
