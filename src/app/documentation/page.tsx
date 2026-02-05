import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function DocumentationPage() {
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
                Documentation
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto px-4">
                Everything you need to get started with FlowSight and make the most of our platform.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="py-16 sm:py-24">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">Quick Start Guide</h2>

              <div className="space-y-6">
                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">1. Installation</h3>
                  <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-gray-300">
                    <div className="text-teal-400"># Install FlowSight</div>
                    <div>npm install -g flowsight</div>
                    <br />
                    <div className="text-teal-400"># Or using yarn</div>
                    <div>yarn global add flowsight</div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">2. Configuration</h3>
                  <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-gray-300">
                    <div className="text-teal-400"># Initialize FlowSight in your project</div>
                    <div>flowsight init</div>
                    <br />
                    <div className="text-teal-400"># Configure your integrations</div>
                    <div>flowsight config --jira-url https://yourcompany.atlassian.net</div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">3. Start Coding</h3>
                  <p className="text-gray-400 mb-4">
                    That's it! FlowSight will automatically start analyzing your code context
                    and updating your project management tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Links */}
        <section className="py-16 sm:py-24 bg-slate-900/50">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-3">User Guide</h3>
                <p className="text-gray-400 mb-4">Complete guide to using FlowSight features</p>
                <a href="#" className="text-teal-400 hover:text-teal-300 font-medium">Read Guide →</a>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-3">API Reference</h3>
                <p className="text-gray-400 mb-4">Technical documentation for integrations</p>
                <a href="/api-reference" className="text-teal-400 hover:text-teal-300 font-medium">View API →</a>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-3">Troubleshooting</h3>
                <p className="text-gray-400 mb-4">Common issues and solutions</p>
                <a href="#" className="text-teal-400 hover:text-teal-300 font-medium">Get Help →</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}


