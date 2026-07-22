'use client'

import Link from 'next/link'
import { Lock } from 'lucide-react'

export default function SecurityPage() {
  const features = [
    {
      title: '100% local inference path',
      desc: 'Vision-language workloads execute on device. Sensitive pixels are not streamed to FlowSight as a default surveillance feed.',
      gradient: 'from-green-500/20 to-emerald-500/20',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
    },
    {
      title: 'Minimal telemetry by design',
      desc: 'We avoid collecting raw work artifacts. Optional account metadata exists only to operate billing and explicit sharing features you turn on.',
      gradient: 'from-blue-500/20 to-indigo-500/20',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      ),
    },
    {
      title: 'Code you can read',
      desc: 'FlowSight publishes source you can audit yourself, not a black box agent. Pair that with on device inference so security teams can align behavior with the code they reviewed.',
      gradient: 'from-purple-500/20 to-pink-500/20',
      icon: (
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      ),
    },
    {
      title: 'End-to-End Encryption',
      desc: 'All data transfers are encrypted end-to-end using industry-standard encryption protocols and secure key management.',
      gradient: 'from-teal-500/20 to-cyan-500/20',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      ),
    },
    {
      title: 'No External Dependencies',
      desc: 'FlowSight operates entirely offline. No internet connection required for core functionality, eliminating external attack vectors.',
      gradient: 'from-orange-500/20 to-amber-500/20',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      ),
    },
    {
      title: 'Regular Security Audits',
      desc: 'We conduct regular security audits and penetration testing to ensure the highest standards of security and data protection.',
      gradient: 'from-red-500/20 to-rose-500/20',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
      <section className="pt-36 pb-16 md:pt-44 md:pb-24">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-secondary-navy mb-6">
            Security First
            <span className="block bg-gradient-to-r from-primary-cyan to-primary-teal bg-clip-text text-transparent pt-2 pb-3">
              Architecture
            </span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto">
            FlowSight treats your desktop as a sovereign zone: local AI runs on your device, screenshots stay off the wire, FlowSight's code is open to inspect, and optional sync is
            encrypted end-to-end when you enable it.
          </p>
        </div>
      </section>

      {/* Security Features */}
      <section className="pb-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${f.gradient} p-8 shadow-lg`}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-white/80 shadow-sm">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {f.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-secondary-navy mb-4">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-24 bg-slate-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-secondary-navy mb-6">
              Compliance & Certifications
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Meeting the highest standards for data protection and privacy
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { abbr: 'GDPR', label: 'GDPR Compliant', desc: 'Full compliance with EU data protection regulations' },
              { abbr: 'SOC2', label: 'SOC 2 Type II', desc: 'Security, availability, and confidentiality standards' },
              { abbr: 'ISO', label: 'ISO 27001', desc: 'Information security management systems' },
              { abbr: 'HIPAA', label: 'HIPAA Ready', desc: 'Healthcare data protection standards' },
            ].map((c) => (
              <div key={c.abbr} className="text-center">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-200">
                  <span className="text-lg font-bold text-primary-teal">{c.abbr}</span>
                </div>
                <h3 className="text-lg font-semibold text-secondary-navy mb-2">{c.label}</h3>
                <p className="text-sm text-slate-500">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="rounded-3xl bg-gradient-to-r from-secondary-navy to-slate-800 p-12 md:p-16 shadow-xl text-center">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6">
              Security You Can Trust
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-2xl mx-auto">
              Experience enterprise-grade security with the privacy and convenience of local processing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="rounded-full bg-gradient-to-r from-primary-cyan to-primary-teal px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Start Secure Today
              </Link>
              <Link
                href="/documentation"
                className="rounded-full border border-slate-500 px-8 py-4 text-base font-semibold text-slate-200 transition-all hover:-translate-y-0.5 hover:border-primary-teal hover:text-primary-teal"
              >
                View Security Docs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
