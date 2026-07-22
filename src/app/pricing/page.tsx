import Link from 'next/link'
import { Lock } from 'lucide-react'
import { Pricing } from '@/components/Pricing'
import { ClosingCTA } from '@/components/redesign/ClosingCTA'
import { DownloadActionsProvider } from '@/context/DownloadActionsContext'
import { getLatestAgentRelease } from '@/lib/downloads.server'
export default async function PricingPage() {
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

        <Pricing />

        <section id="faq" className="py-24">
          <div className="container px-4 md:px-6 mx-auto max-w-3xl">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-center mb-16 text-secondary-navy">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h3 className="text-lg font-bold text-secondary-navy mb-3">Can I change plans anytime?</h3>
                <p className="text-slate-500">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h3 className="text-lg font-bold text-secondary-navy mb-3">Is there a free trial?</h3>
                <p className="text-slate-500">Yes, we offer a 14-day free trial for all paid plans with full access to all features.</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h3 className="text-lg font-bold text-secondary-navy mb-3">What payment methods do you accept?</h3>
                <p className="text-slate-500">We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h3 className="text-lg font-bold text-secondary-navy mb-3">Do you offer discounts for teams?</h3>
                <p className="text-slate-500">Yes, we offer volume discounts for teams of 10 or more. Contact our sales team for details.</p>
              </div>
            </div>
          </div>
        </section>

        <ClosingCTA />
      </main>
    </DownloadActionsProvider>
  )
}
