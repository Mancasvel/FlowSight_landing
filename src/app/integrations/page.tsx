import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function IntegrationsPage() {
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
                Seamless
                <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                  Integrations
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto px-4">
                Connect FlowSight with your favorite tools and platforms.
                Workflows that adapt to your environment.
              </p>
            </div>
          </div>
        </section>

        {/* Integration Categories */}
        <section className="py-16 sm:py-24">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* Project Management */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 sm:p-8 border border-slate-700/50">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm-4.286.428h1.715v5.143H7.285zM20 12c0 4.418-4.03 8-9 8-4.97 0-9-3.582-9-8s4.03-8 9-8c4.97 0 9 3.582 9 8zm-9 6c3.859 0 7-2.56 7-6s-3.141-6-7-6-7 2.56-7 6 3.141 6 7 6z"/>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Jira</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Automatic task linking, status updates, and time tracking synchronization
                  with Jira tickets and epics.
                </p>
                <div className="flex items-center text-sm text-green-400">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Available Now
                </div>
              </div>

              {/* Version Control */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 sm:p-8 border border-slate-700/50">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">GitHub</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Link commits to tasks, track pull requests, and maintain
                  development context across your GitHub repositories.
                </p>
                <div className="flex items-center text-sm text-green-400">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Available Now
                </div>
              </div>

              {/* Communication */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 sm:p-8 border border-slate-700/50">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Slack</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Get notifications about task updates and receive summaries
                  directly in your Slack channels and DMs.
                </p>
                <div className="flex items-center text-sm text-yellow-400">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Coming Soon
                </div>
              </div>

              {/* IDEs */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 sm:p-8 border border-slate-700/50">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-teal-500/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-teal-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 12.5C2 7.262 6.477 3 11.5 3S21 7.262 21 12.5 16.523 22 11.5 22a9.5 9.5 0 01-4.975-1.405L2 22l2.105-4.895A9.443 9.443 0 012 12.5z"/>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">VS Code</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Native integration with Visual Studio Code for seamless
                  task tracking within your development environment.
                </p>
                <div className="flex items-center text-sm text-green-400">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Available Now
                </div>
              </div>

              {/* CI/CD */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 sm:p-8 border border-slate-700/50">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">GitLab CI</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Integrate with GitLab CI/CD pipelines for automated
                  deployment tracking and quality gate management.
                </p>
                <div className="flex items-center text-sm text-yellow-400">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Coming Soon
                </div>
              </div>

              {/* Time Tracking */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 sm:p-8 border border-slate-700/50">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Toggl Track</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Sync time entries automatically with Toggl Track
                  for comprehensive time tracking across all your tools.
                </p>
                <div className="flex items-center text-sm text-yellow-400">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* API Integration */}
        <section className="py-16 sm:py-24 bg-slate-900/50">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
                REST API & Webhooks
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Build custom integrations with our comprehensive API
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* API Features */}
              <div className="space-y-6">
                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">REST API</h3>
                  <p className="text-gray-400">
                    Full REST API access to tasks, projects, and time tracking data.
                    Programmatic access to all FlowSight features.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Webhooks</h3>
                  <p className="text-gray-400">
                    Real-time notifications for task updates, status changes,
                    and project events delivered to your endpoints.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">OAuth 2.0</h3>
                  <p className="text-gray-400">
                    Secure authentication with OAuth 2.0 support for third-party
                    applications and integrations.
                  </p>
                </div>
              </div>

              {/* Code Example */}
              <div className="bg-slate-800/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">API Example</h3>
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
                  <div className="text-teal-400"># Get project tasks</div>
                  <div className="text-blue-400">GET</div>
                  <div className="text-gray-400"> /api/v1/projects/123/tasks</div>
                  <br />
                  <div className="text-purple-400">Authorization:</div>
                  <div className="text-gray-400"> Bearer your-api-token</div>
                  <br />
                  <div className="text-green-400">Response:</div>
                  <div className="text-gray-400"> [</div>
                  <div className="text-gray-400">   {"{ "}"id": "task-456", "status": "completed"{" }"}</div>
                  <div className="text-gray-400"> ]</div>
                </div>
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
                  Ready to Integrate?
                </h2>
                <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                  Connect FlowSight with your existing tools and workflows.
                  Start building the development experience you deserve.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-teal-500/25 transform hover:-translate-y-1">
                    View API Docs
                  </button>
                  <button className="border-2 border-slate-600 text-gray-300 hover:border-teal-500 hover:text-teal-400 font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1">
                    Request Integration
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

