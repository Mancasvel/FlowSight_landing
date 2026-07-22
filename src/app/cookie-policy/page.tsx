import type { Metadata } from 'next'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { siteConfig } from '@/lib/site'
import { CONSENT_STORAGE_KEY } from '@/lib/consent-storage'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: `How ${siteConfig.name} uses cookies and similar technologies on this website.`,
}

export default function CookiePolicyPage() {
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
            Cookie
            <span className="block bg-gradient-to-r from-primary-cyan to-primary-teal bg-clip-text text-transparent pt-2 pb-3">
              Policy
            </span>
          </h1>
          <p className="text-slate-400 text-sm">Last updated: {new Date().toISOString().slice(0, 10)}</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8 text-slate-500">

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">1. Purpose of this policy</h2>
                <p className="leading-relaxed mb-0">
                  This Cookie Policy explains how <strong className="text-secondary-navy">{siteConfig.legalName}</strong> ("we", "us") uses cookies and similar technologies on{' '}
                  <strong className="text-secondary-navy">{siteConfig.url}</strong> and related marketing pages, in line with the EU ePrivacy rules (Directive 2002/58/EC as implemented in EU Member States)
                  and the General Data Protection Regulation ("GDPR", Regulation (EU) 2016/679) where personal data is involved.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">2. What are cookies and similar technologies?</h2>
                <p className="leading-relaxed mb-0">
                  Cookies are small text files placed on your device. Similar technologies include local storage, session storage, pixels, and scripts that store or access information on your device.
                  Some are "strictly necessary" to deliver a service you request; others require your consent before they are used (unless a narrow exemption applies under applicable law).
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">3. How we use categories on this site</h2>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-300">
                        <th className="py-2 pr-4 font-semibold text-secondary-navy">Category</th>
                        <th className="py-2 pr-4 font-semibold text-secondary-navy">Purpose</th>
                        <th className="py-2 font-semibold text-secondary-navy">Legal basis (GDPR)</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-500">
                      <tr className="border-b border-slate-200 align-top">
                        <td className="py-3 pr-4 font-medium text-secondary-navy">Essential / strictly necessary</td>
                        <td className="py-3 pr-4">
                          Operation and security of the site (for example load balancing, bot protection where used, authentication cookies for logged-in areas, and storing your cookie consent choice).
                        </td>
                        <td className="py-3">
                          Art. 6(1)(b) GDPR (performance of a contract / steps prior) and/or Art. 6(1)(f) (legitimate interests in secure delivery), and ePrivacy implementation for strictly necessary storage.
                        </td>
                      </tr>
                      <tr className="align-top">
                        <td className="py-3 pr-4 font-medium text-secondary-navy">Analytics (aggregated)</td>
                        <td className="py-3 pr-4">
                          Understanding aggregated usage (for example aggregated click counters for navigation and downloads). No advertising profiles; no sale of personal data.
                        </td>
                        <td className="py-3">Art. 6(1)(a) GDPR, consent, obtained through our cookie banner before non-essential analytics run.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-slate-400 mb-0 leading-relaxed">
                  Consent for analytics is stored in your browser under the key <code className="text-primary-teal bg-slate-100 px-1.5 py-0.5 rounded">{CONSENT_STORAGE_KEY}</code> (local storage) so we can respect your choice on return visits.
                  That storage is treated as strictly necessary to prove and honour consent.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">4. Managing preferences</h2>
                <p className="leading-relaxed mb-0">
                  You can accept or reject non-essential analytics using the cookie banner when you first visit, or later via the "Cookie preferences" control shown on our pages.
                  You can also clear site data in your browser settings; clearing consent storage will prompt the banner again on your next visit.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">5. Updates</h2>
                <p className="leading-relaxed mb-0">
                  We may update this Cookie Policy when our technologies or legal requirements change. Material changes will be reflected by updating the "Last updated" date and, where appropriate, renewing consent when required by law.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">6. Contact</h2>
                <p className="leading-relaxed mb-0">
                  Questions about this policy:{' '}
                  <a href={`mailto:${siteConfig.privacyEmail}`} className="text-primary-teal hover:text-cyan-600">
                    {siteConfig.privacyEmail}
                  </a>
                  . See also our <a href="/privacy-policy" className="text-primary-teal hover:text-cyan-600">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
