import Link from 'next/link'
import { Lock } from 'lucide-react'
import { DownloadActionsProvider } from '@/context/DownloadActionsContext'
import { getLatestAgentRelease } from '@/lib/downloads.server'
import { ClosingCTA } from '@/components/redesign/ClosingCTA'

export default async function AboutPage() {
  const release = await getLatestAgentRelease()

  return (
    <DownloadActionsProvider release={release}>
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

        {/* Hero */}
        <section className="pt-36 pb-24 md:pt-44 md:pb-32">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-secondary-navy mb-6">
              About
              <span className="block bg-gradient-to-r from-primary-cyan to-primary-teal bg-clip-text text-transparent pt-2 pb-3">
                FlowSight
              </span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto">
              We are building cognitive health infrastructure for knowledge workers, with local AI that keeps screenshots on device while
              still answering the client question: "What did we get this week?"
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-center text-secondary-navy mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed text-center mb-16 max-w-3xl mx-auto">
                Surveillance trackers and blank timesheets both steal the same thing: uninterrupted cognition. FlowSight replaces them
                with a local agent that reads your screen where it already exists, runs AI on your hardware, and turns honest work
                signals into narratives clients can trust. FlowSight's codebase is open to inspect.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: 'Flow-state guardrails',
                    desc: 'Surface context switching and interruption debt before your calendar does.',
                    gradient: 'from-cyan-500/20 to-teal-500/20',
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    ),
                  },
                  {
                    title: 'Pixels stay yours',
                    desc: 'Screenshots never leave the worker laptop; exports are explicit and revocable.',
                    gradient: 'from-blue-500/20 to-indigo-500/20',
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    ),
                  },
                  {
                    title: 'Proof-of-work automation',
                    desc: 'On-device VL models translate messy days into client-grade summaries.',
                    gradient: 'from-purple-500/20 to-pink-500/20',
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    ),
                  },
                ].map((item) => (
                  <div key={item.title} className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${item.gradient} p-8 shadow-lg`}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-white/80 shadow-sm">
                      <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {item.icon}
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-secondary-navy mb-3">{item.title}</h3>
                    <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-24 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-center text-secondary-navy mb-16">
                Our Story
              </h2>

              <div className="space-y-8">
                {[
                  {
                    title: 'The Problem',
                    content: 'Knowledge workers oscillate between deep creation and administrative proof. Every "quick status ping" costs minutes of recovery time; every surveillance dashboard erodes trust. The market forces a false binary: spy on people, or fly blind.',
                  },
                  {
                    title: 'The Solution',
                    content: 'FlowSight is a Cognitive Health & Productivity platform: a local agent observes how work actually unfolds, flags overload patterns, and assembles professional proof of work for clients, without keystroke logging, without cloud screenshot libraries, and without asking people to become their own accountants.',
                  },
                  {
                    title: 'The Future',
                    content: 'Our go-to-market is individual-first: win freelancers and remote ICs, let them viralize polished reports to their clients, then partner with outsourcing platforms that need credible transparency plus worker wellbeing as a moat.',
                  },
                ].map((story) => (
                  <div key={story.title} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                    <h3 className="text-xl font-bold text-secondary-navy mb-4">{story.title}</h3>
                    <p className="text-slate-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: story.content }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="rounded-3xl bg-gradient-to-r from-secondary-navy to-slate-800 p-12 md:p-16 shadow-xl text-center">
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6">
                Join Our Mission
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-2xl mx-auto">
                Help us prove that ethical telemetry can exist: protecting brains first, receipts second.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/careers"
                  className="rounded-full bg-gradient-to-r from-primary-cyan to-primary-teal px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  View Careers
                </Link>
                <Link
                  href="/team"
                  className="rounded-full border border-slate-500 px-8 py-4 text-base font-semibold text-slate-200 transition-all hover:-translate-y-0.5 hover:border-primary-teal hover:text-primary-teal"
                >
                  Meet the Team
                </Link>
              </div>
            </div>
          </div>
        </section>

        <ClosingCTA />
      </main>
    </DownloadActionsProvider>
  )
}
