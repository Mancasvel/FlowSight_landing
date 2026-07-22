import type { Metadata } from 'next'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${siteConfig.legalName} processes personal data in line with EU GDPR and related standards.`,
}

export default function PrivacyPolicyPage() {
  const euRep = siteConfig.euRepresentativeContactEmail

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
            Privacy
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
            <p className="text-slate-500 text-sm border border-slate-200 rounded-lg p-4 bg-slate-50 mb-12 leading-relaxed">
              This notice is provided to help you understand how we process personal data in connection with our website and services. It is not legal advice; you should obtain independent counsel for your organisation's compliance obligations.
            </p>

            <div className="space-y-8 text-slate-500">

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">1. Who is responsible?</h2>
                <p className="leading-relaxed mb-4">
                  The data controller for personal data described in this policy is <strong className="text-secondary-navy">{siteConfig.legalName}</strong> ("{siteConfig.name}", "we", "us"), unless we tell you otherwise (for example in a separate agreement for enterprise customers).
                </p>
                <p className="leading-relaxed mb-0">
                  <strong className="text-secondary-navy">Postal / identity:</strong> {siteConfig.controllerPostalSummary}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">2. Contact & EU representative</h2>
                <p className="leading-relaxed mb-4">
                  Privacy questions and requests:{' '}
                  <a href={`mailto:${siteConfig.privacyEmail}`} className="text-primary-teal hover:text-cyan-600">
                    {siteConfig.privacyEmail}
                  </a>
                </p>
                {euRep ? (
                  <p className="leading-relaxed mb-0">
                    <strong className="text-secondary-navy">EU GDPR Art. 27 representative:</strong>{' '}
                    <a href={`mailto:${euRep}`} className="text-primary-teal hover:text-cyan-600">
                      {euRep}
                    </a>
                  </p>
                ) : (
                  <p className="text-sm text-slate-400 mb-0">
                    If we appoint an EU representative under Article 27 GDPR, we will publish their contact details here. Until then, you may contact us at the address above.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">3. Scope</h2>
                <p className="leading-relaxed mb-0">
                  This policy applies to personal data we process through our marketing website (including forms and downloads), account areas where applicable, and related support channels. Product-specific processing may be described in separate documentation (for example a Data Processing Agreement for business customers).
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">4. Categories of personal data</h2>
                <p className="leading-relaxed mb-4">Depending on how you use {siteConfig.name}, we may process:</p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li><strong className="text-secondary-navy">Account & contact data:</strong> name, email, company, role, credentials (hashed where applicable).</li>
                  <li><strong className="text-secondary-navy">Usage & technical data:</strong> IP address, device/browser type, timestamps, pages viewed, approximate location derived from IP, security logs.</li>
                  <li><strong className="text-secondary-navy">Consent records:</strong> cookie/analytics preferences and related timestamps.</li>
                  <li><strong className="text-secondary-navy">Communications:</strong> messages you send to support or sales.</li>
                  <li><strong className="text-secondary-navy">Billing data (if applicable):</strong> processed by our payment provider; we receive limited billing metadata as needed for invoicing.</li>
                </ul>
                <p className="text-sm text-slate-400 mb-0 leading-relaxed">
                  Our product is designed so that sensitive workspace content is processed locally where possible; this policy focuses on data processed in connection with operating the service and website.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">5. Purposes and legal bases (GDPR Art. 6)</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-secondary-navy">Delivering the service and website</strong>, Art. 6(1)(b) (contract) and Art. 6(1)(f) (legitimate interests in reliable operation).</li>
                  <li><strong className="text-secondary-navy">Security, abuse prevention, and debugging</strong>, Art. 6(1)(f) (legitimate interests), and where strictly necessary Art. 6(1)(c) (legal obligation).</li>
                  <li><strong className="text-secondary-navy">Aggregated analytics on this site</strong>, Art. 6(1)(a) (consent), where not strictly necessary.</li>
                  <li><strong className="text-secondary-navy">Newsletters or marketing</strong>, Art. 6(1)(a) (consent) or Art. 6(1)(f) with opt-out where permitted by law.</li>
                  <li><strong className="text-secondary-navy">Legal compliance</strong>, Art. 6(1)(c) where applicable.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">6. Cookies & similar technologies</h2>
                <p className="leading-relaxed mb-0">
                  We use essential technologies to run the site and, only with your consent where required, aggregated analytics. See our{' '}
                  <a href="/cookie-policy" className="text-primary-teal hover:text-cyan-600">Cookie Policy</a> for details and how to withdraw consent.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">7. Recipients & subprocessors</h2>
                <p className="leading-relaxed mb-4">
                  We use trusted infrastructure providers (for example hosting, databases, email delivery, and payment processing). They process personal data only on our instructions or as independent controllers as described in their terms, and we assess security and data protection terms with them.
                </p>
                <p className="text-sm text-slate-400 mb-0 leading-relaxed">
                  A current list of key subprocessors is available on request for business customers and may be updated as our suppliers change.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">8. International transfers</h2>
                <p className="leading-relaxed mb-0">
                  Where personal data is transferred outside the European Economic Area, we rely on appropriate safeguards such as Standard Contractual Clauses approved by the European Commission (and supplementary measures where required), or adequacy decisions, unless an exception applies.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">9. Retention</h2>
                <p className="leading-relaxed mb-0">
                  We retain personal data only as long as necessary for the purposes above, including legal, accounting, and dispute-resolution needs. Retention periods vary by category (for example security logs vs marketing consents); contact us for more detail about a specific processing activity.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">10. Your rights (GDPR Chapter III)</h2>
                <p className="leading-relaxed mb-4">Subject to conditions in applicable law, you may have the right to:</p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Access, rectification, erasure, restriction, and data portability;</li>
                  <li>Object to processing based on legitimate interests (Art. 21);</li>
                  <li>Withdraw consent at any time where processing is consent-based (without affecting prior lawful processing);</li>
                  <li>Lodge a complaint with a supervisory authority, in particular in the EU Member State of your habitual residence, place of work, or place of the alleged infringement.</li>
                </ul>
                <p className="leading-relaxed mb-0">
                  To exercise rights, contact <a href={`mailto:${siteConfig.privacyEmail}`} className="text-primary-teal hover:text-cyan-600">{siteConfig.privacyEmail}</a>.
                  We typically respond within one month (Art. 12(3) GDPR), subject to extension in complex cases as permitted by law.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">11. Automated decision-making</h2>
                <p className="leading-relaxed mb-0">
                  We do not use automated decision-making that produces legal or similarly significant effects solely by automated means in connection with the processing described in this website policy. If that changes, we will provide meaningful information and safeguards as required by law.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">12. Children</h2>
                <p className="leading-relaxed mb-0">
                  Our services are not directed at children under 16 (or the age required in your jurisdiction). If you believe we have collected a child's data, contact us and we will take appropriate steps.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="text-xl font-bold text-secondary-navy mb-4">13. Changes</h2>
                <p className="leading-relaxed mb-0">
                  We may update this Privacy Policy to reflect legal, technical, or business changes. We will post the updated version on this page and adjust the "Last updated" date. Where required, we will notify you or seek fresh consent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
