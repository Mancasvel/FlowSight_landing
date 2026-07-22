import Link from 'next/link'
import { Lock } from 'lucide-react'

export default function CareersPage() {
  const positions = [
    {
      title: 'Senior AI Engineer',
      type: 'Full-time',
      location: 'Remote',
      description: 'Ship local on device AI that protects cognitive health while automating proof of work. FlowSight code stays open to inspect.',
    },
    {
      title: 'Product Designer',
      type: 'Full-time',
      location: 'Remote',
      description: 'Craft humane interfaces for focus analytics and client ready narratives.',
    },
    {
      title: 'DevOps Engineer',
      type: 'Full-time',
      location: 'Remote',
      description: 'Harden local model delivery, update rails, and secure optional sync paths.',
    },
  ]

  const perks = [
    {
      title: 'Cutting-Edge Technology',
      desc: 'Work with the latest AI and machine learning technologies shaping the future of productivity tools.',
      gradient: 'from-cyan-500/20 to-teal-500/20',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      ),
    },
    {
      title: 'Amazing Team',
      desc: 'Join a passionate team of engineers, designers, and product experts building something meaningful.',
      gradient: 'from-blue-500/20 to-indigo-500/20',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      ),
    },
    {
      title: 'Global Impact',
      desc: 'Your work will directly impact millions of professionals worldwide, improving their daily workflow.',
      gradient: 'from-purple-500/20 to-pink-500/20',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
    },
  ]

  return (
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
            Join Our
            <span className="block bg-gradient-to-r from-primary-cyan to-primary-teal bg-clip-text text-transparent pt-2 pb-3">
              Mission
            </span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto">
            Help us replace surveillance economics with worker-owned intelligence: local models, ethical telemetry, happier clients.
          </p>
        </div>
      </section>

      {/* Open Positions */}
      <section className="pb-24">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-center text-secondary-navy mb-16">
            Open Positions
          </h2>

          <div className="space-y-6 max-w-4xl mx-auto">
            {positions.map((position, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-secondary-navy mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-primary-teal/10 text-primary-teal rounded-full text-sm font-medium">{position.type}</span>
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full text-sm font-medium">{position.location}</span>
                    </div>
                    <p className="text-slate-500 leading-relaxed">{position.description}</p>
                  </div>
                  <button className="rounded-full bg-gradient-to-r from-primary-cyan to-primary-teal px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-24 bg-slate-50">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-center text-secondary-navy mb-16">
            Why Join FlowSight?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {perks.map((perk) => (
              <div key={perk.title} className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${perk.gradient} p-8 shadow-lg text-center`}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-6 bg-white/80 shadow-sm">
                  <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {perk.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-secondary-navy mb-4">{perk.title}</h3>
                <p className="text-slate-500 leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
