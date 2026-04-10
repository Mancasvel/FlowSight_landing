import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { siteConfig } from '@/lib/site'
import { CONSENT_STORAGE_KEY } from '@/lib/consent-storage'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: `How ${siteConfig.name} uses cookies and similar technologies on this website.`,
}

export default function CookiePolicyPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <section className="relative pt-20 pb-12 sm:pb-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 container-max px-4 sm:px-6 lg:px-12 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Cookie <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm">Last updated: {new Date().toISOString().slice(0, 10)}</p>
          </div>
        </section>

        <section className="py-12 sm:py-20">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto prose prose-lg prose-invert prose-headings:text-white prose-a:text-teal-400">
              <div className="space-y-8 text-gray-300">

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">1. Purpose of this policy</h2>
                  <p className="leading-relaxed mb-0">
                    This Cookie Policy explains how <strong>{siteConfig.legalName}</strong> (“we”, “us”) uses cookies and similar technologies on{' '}
                    <strong>{siteConfig.url}</strong> and related marketing pages, in line with the EU ePrivacy rules (Directive 2002/58/EC as implemented in EU Member States)
                    and the General Data Protection Regulation (“GDPR”, Regulation (EU) 2016/679) where personal data is involved.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">2. What are cookies and similar technologies?</h2>
                  <p className="leading-relaxed">
                    Cookies are small text files placed on your device. Similar technologies include local storage, session storage, pixels, and scripts that store or access information on your device.
                    Some are “strictly necessary” to deliver a service you request; others require your consent before they are used (unless a narrow exemption applies under applicable law).
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">3. How we use categories on this site</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="py-2 pr-4 font-semibold text-white">Category</th>
                          <th className="py-2 pr-4 font-semibold text-white">Purpose</th>
                          <th className="py-2 font-semibold text-white">Legal basis (GDPR)</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-400">
                        <tr className="border-b border-slate-700/80 align-top">
                          <td className="py-3 pr-4 font-medium text-gray-200">Essential / strictly necessary</td>
                          <td className="py-3 pr-4">
                            Operation and security of the site (for example load balancing, bot protection where used, authentication cookies for logged-in areas, and storing your cookie consent choice).
                          </td>
                          <td className="py-3">
                            Art. 6(1)(b) GDPR (performance of a contract / steps prior) and/or Art. 6(1)(f) (legitimate interests in secure delivery), and ePrivacy implementation for strictly necessary storage.
                          </td>
                        </tr>
                        <tr className="align-top">
                          <td className="py-3 pr-4 font-medium text-gray-200">Analytics (aggregated)</td>
                          <td className="py-3 pr-4">
                            Understanding aggregated usage (for example aggregated click counters for navigation and downloads). No advertising profiles; no sale of personal data.
                          </td>
                          <td className="py-3">Art. 6(1)(a) GDPR — consent, obtained through our cookie banner before non-essential analytics run.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-gray-500 mt-4 mb-0">
                    Consent for analytics is stored in your browser under the key <code className="text-teal-400/90">{CONSENT_STORAGE_KEY}</code> (local storage) so we can respect your choice on return visits.
                    That storage is treated as strictly necessary to prove and honour consent.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">4. Managing preferences</h2>
                  <p className="leading-relaxed">
                    You can accept or reject non-essential analytics using the cookie banner when you first visit, or later via the “Cookie preferences” control shown on our pages.
                    You can also clear site data in your browser settings; clearing consent storage will prompt the banner again on your next visit.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">5. Updates</h2>
                  <p className="leading-relaxed mb-0">
                    We may update this Cookie Policy when our technologies or legal requirements change. Material changes will be reflected by updating the “Last updated” date and, where appropriate, renewing consent when required by law.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">6. Contact</h2>
                  <p className="leading-relaxed mb-0">
                    Questions about this policy:{' '}
                    <a href={`mailto:${siteConfig.privacyEmail}`} className="text-teal-400 hover:text-teal-300">
                      {siteConfig.privacyEmail}
                    </a>
                    . See also our <a href="/privacy-policy" className="text-teal-400 hover:text-teal-300">Privacy Policy</a>.
                  </p>
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
