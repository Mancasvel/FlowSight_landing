import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function SupportPage() {
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
                Support
                <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                  Center
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto px-4">
                Get help with FlowSight. Find answers to common questions and get in touch with our team.
              </p>
            </div>
          </div>
        </section>

        {/* Support Options */}
        <section className="py-16 sm:py-24">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 hover:border-teal-500/30 transition-all duration-300">
                <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Live Chat</h3>
                <p className="text-gray-400 mb-4">
                  Get instant help from our support team during business hours.
                </p>
                <div className="text-sm text-green-400 mb-4">● Available now</div>
                <button className="w-full bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 font-semibold py-2 px-4 rounded-lg transition-colors">
                  Start Chat
                </button>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Email Support</h3>
                <p className="text-gray-400 mb-4">
                  Send us a detailed message and we'll respond within 24 hours.
                </p>
                <div className="text-sm text-gray-400 mb-4">Response time: &lt; 24h</div>
                <a href="/contact" className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-semibold py-2 px-4 rounded-lg transition-colors text-center block">
                  Send Email
                </a>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Documentation</h3>
                <p className="text-gray-400 mb-4">
                  Find answers in our comprehensive documentation and guides.
                </p>
                <div className="text-sm text-gray-400 mb-4">Self-service help</div>
                <a href="/documentation" className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 font-semibold py-2 px-4 rounded-lg transition-colors text-center block">
                  View Docs
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-24 bg-slate-900/50">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>

              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">How do I get started with FlowSight?</h3>
                  <p className="text-gray-400">Check out our <a href="/documentation" className="text-teal-400 hover:text-teal-300">documentation</a> for installation and setup guides.</p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Is my code data stored on FlowSight servers?</h3>
                  <p className="text-gray-400">No, FlowSight processes everything locally on your machine. Your code never leaves your environment.</p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">How do I integrate with Jira?</h3>
                  <p className="text-gray-400">Visit our <a href="/integrations" className="text-teal-400 hover:text-teal-300">integrations page</a> for step-by-step setup instructions.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

