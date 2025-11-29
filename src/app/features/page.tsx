import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'

export default function FeaturesPage() {
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
                Powerful Features for
                <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                  Seamless Development
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto px-4">
                Discover how FlowSight's intelligent features transform your development workflow
                with zero interruption and complete privacy.
              </p>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-16 sm:py-24">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* Feature 1: Automatic Task Detection */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 sm:p-8 border border-slate-700/50 hover:border-teal-500/30 transition-all duration-300 group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-teal-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500/30 transition-colors">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Automatic Task Detection</h3>
                <p className="text-gray-400 leading-relaxed">
                  AI-powered context understanding automatically identifies and tracks development tasks
                  as you work, eliminating manual time entry and status updates.
                </p>
              </div>

              {/* Feature 2: Privacy-First Architecture */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 sm:p-8 border border-slate-700/50 hover:border-teal-500/30 transition-all duration-300 group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Privacy-First Architecture</h3>
                <p className="text-gray-400 leading-relaxed">
                  All processing happens locally on your machine. No code leaves your environment,
                  ensuring complete data privacy and security.
                </p>
              </div>

              {/* Feature 3: Intelligent Context Analysis */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 sm:p-8 border border-slate-700/50 hover:border-teal-500/30 transition-all duration-300 group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Intelligent Context Analysis</h3>
                <p className="text-gray-400 leading-relaxed">
                  Advanced AI understands your code changes, comments, and development patterns
                  to provide accurate task tracking and progress updates.
                </p>
              </div>

              {/* Feature 4: Seamless Integration */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 sm:p-8 border border-slate-700/50 hover:border-teal-500/30 transition-all duration-300 group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition-colors">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Seamless Integration</h3>
                <p className="text-gray-400 leading-relaxed">
                  Works with your existing tools and workflows. No changes to your development
                  process required - just install and start coding naturally.
                </p>
              </div>

              {/* Feature 5: Real-time Progress Tracking */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 sm:p-8 border border-slate-700/50 hover:border-teal-500/30 transition-all duration-300 group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition-colors">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Real-time Progress Tracking</h3>
                <p className="text-gray-400 leading-relaxed">
                  Live updates of task progress and status as you work. Automatic time tracking
                  and completion detection for accurate project management.
                </p>
              </div>

              {/* Feature 6: Jira Integration */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 sm:p-8 border border-slate-700/50 hover:border-teal-500/30 transition-all duration-300 group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/30 transition-colors">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm-4.286.428h1.715v5.143H7.285zM20 12c0 4.418-4.03 8-9 8-4.97 0-9-3.582-9-8s4.03-8 9-8c4.97 0 9 3.582 9 8zm-9 6c3.859 0 7-2.56 7-6s-3.141-6-7-6-7 2.56-7 6 3.141 6 7 6z"/>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Jira Integration</h3>
                <p className="text-gray-400 leading-relaxed">
                  Automatic linking to Jira tickets and status updates. Keep your project management
                  tools in sync without manual intervention.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 sm:py-24 bg-slate-900/50">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
                How FlowSight Works
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Experience the future of development workflow management
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-teal-400">1</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Install & Connect</h3>
                <p className="text-gray-400">
                  Install FlowSight and connect it to your development environment.
                  No complex setup required.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-400">2</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Code Naturally</h3>
                <p className="text-gray-400">
                  Continue working as you always do. FlowSight analyzes your context
                  in the background.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-purple-400">3</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Automatic Updates</h3>
                <p className="text-gray-400">
                  Tasks are automatically tracked, updated, and synced with your
                  project management tools.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="bg-gradient-to-r from-teal-900/20 to-blue-900/20 rounded-3xl p-8 sm:p-12 md:p-16 border border-teal-500/20">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to Experience the Future?
                </h2>
                <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                  Join thousands of developers who have transformed their workflow with FlowSight.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-teal-500/25 transform hover:-translate-y-1">
                    Start Free Trial
                  </button>
                  <button className="border-2 border-slate-600 text-gray-300 hover:border-teal-500 hover:text-teal-400 font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1">
                    View Pricing
                  </button>
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
