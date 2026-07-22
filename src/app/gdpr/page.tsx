import type { Metadata } from 'next'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Data protection (GDPR)',
  description: `How to exercise GDPR rights and how ${siteConfig.legalName} supports EU data protection standards.`,
}

export default function GdprPage() {
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

      <section className="pt-36 pb-12 md:pt-44 md:pb-16">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-secondary-navy mb-6">
            Data protection &
            <span className="block bg-gradient-to-r from-primary-cyan to-primary-teal bg-clip-text text-transparent pt-2 pb-3">
              GDPR
            </span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto">
            Practical information about Regulation (EU) 2016/679 and how we support transparency, security, and your rights.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8 text-slate-500">

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">Our approach</h2>
                <p className="leading-relaxed mb-0">
                  {siteConfig.legalName} designs {siteConfig.name} with privacy-by-design principles: minimisation, transparency, and strong security. This page summarises how EU GDPR fits into that programme. The full legal details are in our{' '}
                  <a href="/privacy-policy" className="text-primary-teal hover:text-cyan-600">Privacy Policy</a> and <a href="/cookie-policy" className="text-primary-teal hover:text-cyan-600">Cookie Policy</a>.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">Controller vs processor</h2>
                <p className="leading-relaxed mb-4">
                  For our website, accounts, and general service operation, we typically act as a <strong className="text-secondary-navy">controller</strong> for personal data we determine the purposes and means of processing.
                </p>
                <p className="leading-relaxed mb-0">
                  For enterprise deployments, we may act as a <strong className="text-secondary-navy">processor</strong> on your instructions under a Data Processing Agreement (DPA). Commercial customers should rely on their contract and DPA for organisational obligations.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">Exercising your GDPR rights</h2>
                <p className="leading-relaxed mb-4">
                  You may request access, rectification, erasure, restriction, portability, or object to certain processing, and withdraw consent where processing is consent-based. Email{' '}
                  <a href={`mailto:${siteConfig.privacyEmail}`} className="text-primary-teal hover:text-cyan-600">{siteConfig.privacyEmail}</a> with your request and enough information to verify your identity (we may ask proportionate follow-up questions to protect account security).
                </p>
                <p className="text-sm text-slate-400 mb-0 leading-relaxed">
                  Under Art. 12(3) GDPR we aim to respond within one month, extendable by two further months in complex cases with notice.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">Supervisory authority</h2>
                <p className="leading-relaxed mb-0">
                  You have the right to lodge a complaint with a supervisory authority, in particular in the EU Member State of your habitual residence, place of work, or of an alleged infringement. A list of EU authorities is maintained by the European Data Protection Board (EDPB).
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">SOC 2 readiness (trust programme)</h2>
                <p className="leading-relaxed mb-0">
                  We maintain a security programme aligned with the AICPA Trust Services Criteria (Security, and where applicable Availability and Confidentiality) as a roadmap toward independent assurance. A SOC 2 report, when available, is typically shared with customers under confidentiality; it is not a substitute for your own legal or compliance assessment. See also our <a href="/legal-security" className="text-primary-teal hover:text-cyan-600">Trust & security overview</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
