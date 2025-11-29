import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function BlogPage() {
  const posts = [
    {
      title: 'The Future of AI-Powered Development Workflows',
      excerpt: 'How FlowSight is revolutionizing how developers track and manage their work.',
      date: 'November 29, 2025',
      readTime: '5 min read'
    },
    {
      title: 'Privacy-First Development Tools: A New Paradigm',
      excerpt: 'Why local processing and zero data collection are the future of developer tools.',
      date: 'November 25, 2025',
      readTime: '4 min read'
    },
    {
      title: 'Integrating FlowSight with Jira and GitHub',
      excerpt: 'Step-by-step guide to connecting FlowSight with your existing workflow.',
      date: 'November 20, 2025',
      readTime: '6 min read'
    }
  ]

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 sm:pb-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 container-max px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-12 md:mb-16">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                FlowSight
                <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                  Blog
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto px-4">
                Insights, updates, and thoughts on the future of development workflow management.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-16 sm:py-24">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 hover:border-teal-500/30 transition-all duration-300 group">
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-400 mb-3">
                      <span>{post.date}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  <a href="#" className="text-teal-400 hover:text-teal-300 font-medium text-sm">
                    Read more →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
