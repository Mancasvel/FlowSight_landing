import Link from 'next/link'
import { Lock } from 'lucide-react'

export default function LegalSecurityPage() {
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
      <section className="pt-36 pb-16 md:pt-44 md:pb-24">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-secondary-navy mb-6">
            Security
            <span className="block bg-gradient-to-r from-primary-cyan to-primary-teal bg-clip-text text-transparent pt-2 pb-3">
              Overview
            </span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto">
            How FlowSight keeps cognitive analytics local, how optional sharing is governed, and how we talk about GDPR / SOC 2 readiness with straight answers.
          </p>
        </div>
      </section>

      {/* Security Overview */}
      <section className="pb-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Local-first cognitive context',
                desc: 'Screen-derived context is designed to stay on the worker device. Account, billing, and explicitly published proof of work payloads follow our privacy programme and DPA.',
                gradient: 'from-green-500/20 to-emerald-500/20',
              },
              {
                title: 'Local processing',
                desc: 'Core analysis is architected to run on your machine. Network features use encrypted connections where applicable.',
                gradient: 'from-blue-500/20 to-indigo-500/20',
              },
              {
                title: 'Risk-based security reviews',
                desc: 'We apply access controls, monitoring, vulnerability management, and vendor reviews proportionate to risk.',
                gradient: 'from-purple-500/20 to-pink-500/20',
              },
            ].map((item) => (
              <div key={item.title} className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${item.gradient} p-8 shadow-lg`}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-white/80 shadow-sm">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-secondary-navy mb-4">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-24 bg-slate-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-secondary-navy mb-4">
              GDPR & trust programme (SOC 2 aligned)
            </h2>
            <p className="text-slate-500 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
              We describe our practices accurately: compliance is an ongoing programme of controls, policies, and contracts, not a one-line badge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-primary-teal/20 bg-white p-8 shadow-lg">
              <div className="text-2xl font-bold text-primary-teal mb-4">GDPR</div>
              <p className="text-slate-500 leading-relaxed mb-4">
                We support EU/EEA/UK data protection requirements with transparent notices, lawful bases, data subject rights, subprocessors assessments, and international transfer safeguards (such as Standard Contractual Clauses where applicable).
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <Link href="/privacy-policy" className="text-primary-teal hover:text-cyan-600 underline underline-offset-2">Privacy Policy</Link>
                <Link href="/cookie-policy" className="text-primary-teal hover:text-cyan-600 underline underline-offset-2">Cookie Policy</Link>
                <Link href="/gdpr" className="text-primary-teal hover:text-cyan-600 underline underline-offset-2">GDPR overview</Link>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-500/20 bg-white p-8 shadow-lg">
              <div className="text-2xl font-bold text-blue-500 mb-4">SOC 2 readiness</div>
              <p className="text-slate-500 leading-relaxed mb-4">
                We align internal controls with the AICPA Trust Services Criteria (Security, and where applicable Availability and Confidentiality) as part of a roadmap toward independent assurance. A SOC 2 Type II report, when available, is typically provided to customers under confidentiality, it does not replace your own legal or compliance review.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Industry-specific regimes (for example HIPAA or ISO 27001 certification) require separate contractual and technical measures; contact us if your organisation needs a regulated deployment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="rounded-3xl bg-gradient-to-r from-secondary-navy to-slate-800 p-12 md:p-16 shadow-xl text-center">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6">
              Security Questions?
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-2xl mx-auto">
              Have questions about FlowSight's security practices or compliance? Our team is here to help.
            </p>
            <Link
              href="/contact"
              className="rounded-full bg-gradient-to-r from-primary-cyan to-primary-teal px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Contact Security Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
