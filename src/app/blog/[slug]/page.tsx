import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
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
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-24">
        <article className="relative pt-24 pb-8">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 container-max px-4 sm:px-6 lg:px-12 max-w-3xl mx-auto">
            <nav className="text-xs text-gray-500 mb-8" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-teal-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/blog" className="hover:text-teal-400 transition-colors">
                    Blog
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-gray-400 truncate max-w-[12rem] sm:max-w-none">{post.title}</li>
              </ol>
            </nav>

            <p className="text-teal-400 text-xs font-semibold uppercase tracking-wide mb-3">{categoryLabel(post.category)}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">{post.title}</h1>
            <p className="text-gray-400 text-sm mb-8">
              <time dateTime={post.publishedAt}>{post.publishedAt}</time>
              <span className="mx-2">·</span>
              {post.readTimeMin} min read
            </p>

            <p className="text-lg text-gray-300 leading-relaxed mb-12 border-l-2 border-teal-500/50 pl-4">{post.excerpt}</p>

            <div className="prose prose-invert prose-headings:text-white prose-p:text-gray-300 prose-p:leading-relaxed max-w-none">
              {post.sections.map((section) => (
                <section key={section.heading} className="mb-10">
                  <h2 className="text-xl font-semibold text-white mb-4">{section.heading}</h2>
                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="mb-4 text-gray-300 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </section>
              ))}
            </div>

            <div className="mt-14 pt-8 border-t border-slate-700">
              <p className="text-sm text-gray-400 mb-4">Explore more on the blog</p>
              <Link href="/blog" className="text-teal-400 hover:text-teal-300 font-medium text-sm">
                ← All posts
              </Link>
            </div>
          </div>
        </article>
      </main>
    </>
  )
}
