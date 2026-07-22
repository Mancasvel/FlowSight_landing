import Link from 'next/link'
import { Lock } from 'lucide-react'

export default function TermsOfServicePage() {
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

      <section className="pt-36 pb-16 md:pt-44 md:pb-24">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-secondary-navy mb-6">
            Terms of
            <span className="block bg-gradient-to-r from-primary-cyan to-primary-teal bg-clip-text text-transparent pt-2 pb-3">
              Service
            </span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto">
            Please read these terms carefully before using FlowSight.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">Acceptance of Terms</h2>
                <p className="text-slate-500 leading-relaxed mb-0">
                  By accessing and using FlowSight, you accept and agree to be bound by the terms
                  and provision of this agreement.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">Use License</h2>
                <p className="text-slate-500 leading-relaxed mb-0">
                  Permission is granted to temporarily use FlowSight for personal and commercial
                  purposes. This license shall automatically terminate if you violate any of these restrictions.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">Disclaimer</h2>
                <p className="text-slate-500 leading-relaxed mb-0">
                  The materials on FlowSight are provided on an 'as is' basis. FlowSight makes no
                  warranties, expressed or implied, and hereby disclaims and negates all other warranties.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">Limitations</h2>
                <p className="text-slate-500 leading-relaxed mb-0">
                  In no event shall FlowSight or its suppliers be liable for any damages arising out of
                  the use or inability to use FlowSight, even if FlowSight has been notified of the possibility of such damage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
