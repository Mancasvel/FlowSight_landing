import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'

export default function AboutPage() {
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
                About
                <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                  FlowSight
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto px-4">
                We are building cognitive health infrastructure for knowledge workers, with local AI that keeps screenshots on device while
                still answering the client question: “What did we get this week?”
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 sm:py-24">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8">
                Our Mission
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-12">
                Surveillance trackers and blank timesheets both steal the same thing: uninterrupted cognition. FlowSight replaces them
                with a local agent that reads your screen where it already exists, runs AI on your hardware, and turns honest work
                signals into narratives clients can trust. FlowSight’s codebase is open to inspect.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
                  <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">Flow-state guardrails</h3>
                  <p className="text-gray-400">Surface context switching and interruption debt before your calendar does.</p>
                </div>

                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">Pixels stay yours</h3>
                  <p className="text-gray-400">Screenshots never leave the worker laptop; exports are explicit and revocable.</p>
                </div>

                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">Proof-of-work automation</h3>
                  <p className="text-gray-400">On-device VL models translate messy days into client-grade summaries.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 sm:py-24 bg-slate-900/50">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8 text-center">
                Our Story
              </h2>

              <div className="space-y-8">
                <div className="bg-slate-800/50 rounded-xl p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-white mb-4">The Problem</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Knowledge workers oscillate between deep creation and administrative proof. Every “quick status ping” costs minutes of
                    recovery time; every surveillance dashboard erodes trust. The market forces a false binary: spy on people, or fly blind.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-white mb-4">The Solution</h3>
                  <p className="text-gray-400 leading-relaxed">
                    FlowSight is a Cognitive Health &amp; Productivity platform: a local agent observes how work actually unfolds, flags
                    overload patterns, and assembles professional proof of work for clients, without keystroke logging, without cloud screenshot
                    libraries, and without asking people to become their own accountants.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-white mb-4">The Future</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Our go-to-market is individual-first: win freelancers and remote ICs, let them viralize polished reports to their clients,
                    then partner with outsourcing platforms that need credible transparency plus worker wellbeing as a moat.
                  </p>
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
                  Join Our Mission
                </h2>
                <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                  Help us prove that ethical telemetry can exist: protecting brains first, receipts second.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-teal-500/25 transform hover:-translate-y-1">
                    View Careers
                  </button>
                  <button className="border-2 border-slate-600 text-gray-300 hover:border-teal-500 hover:text-teal-400 font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1">
                    Meet the Team
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


