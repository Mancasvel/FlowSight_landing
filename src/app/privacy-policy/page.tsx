import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${siteConfig.legalName} processes personal data in line with EU GDPR and related standards.`,
}

export default function PrivacyPolicyPage() {
  const euRep = siteConfig.euRepresentativeContactEmail

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
              Privacy <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm">Last updated: {new Date().toISOString().slice(0, 10)}</p>
          </div>
        </section>

        <section className="py-12 sm:py-20">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto prose prose-lg prose-invert prose-headings:text-white prose-a:text-teal-400">
              <p className="text-gray-500 text-sm border border-slate-700/60 rounded-lg p-4 bg-slate-900/40">
                This notice is provided to help you understand how we process personal data in connection with our website and services. It is not legal advice; you should obtain independent counsel for your organisation’s compliance obligations.
              </p>

              <div className="space-y-8 text-gray-300 mt-8">

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">1. Who is responsible?</h2>
                  <p>
                    The data controller for personal data described in this policy is <strong>{siteConfig.legalName}</strong> (“{siteConfig.name}”, “we”, “us”), unless we tell you otherwise (for example in a separate agreement for enterprise customers).
                  </p>
                  <p className="mb-0">
                    <strong>Postal / identity:</strong> {siteConfig.controllerPostalSummary}
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">2. Contact & EU representative</h2>
                  <p>
                    Privacy questions and requests:{' '}
                    <a href={`mailto:${siteConfig.privacyEmail}`} className="text-teal-400 hover:text-teal-300">
                      {siteConfig.privacyEmail}
                    </a>
                  </p>
                  {euRep ? (
                    <p className="mb-0">
                      <strong>EU GDPR Art. 27 representative:</strong>{' '}
                      <a href={`mailto:${euRep}`} className="text-teal-400 hover:text-teal-300">
                        {euRep}
                      </a>
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 mb-0">
                      If we appoint an EU representative under Article 27 GDPR, we will publish their contact details here. Until then, you may contact us at the address above.
                    </p>
                  )}
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">3. Scope</h2>
                  <p className="mb-0">
                    This policy applies to personal data we process through our marketing website (including forms and downloads), account areas where applicable, and related support channels. Product-specific processing may be described in separate documentation (for example a Data Processing Agreement for business customers).
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">4. Categories of personal data</h2>
                  <p>Depending on how you use {siteConfig.name}, we may process:</p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li><strong>Account & contact data:</strong> name, email, company, role, credentials (hashed where applicable).</li>
                    <li><strong>Usage & technical data:</strong> IP address, device/browser type, timestamps, pages viewed, approximate location derived from IP, security logs.</li>
                    <li><strong>Consent records:</strong> cookie/analytics preferences and related timestamps.</li>
                    <li><strong>Communications:</strong> messages you send to support or sales.</li>
                    <li><strong>Billing data (if applicable):</strong> processed by our payment provider; we receive limited billing metadata as needed for invoicing.</li>
                  </ul>
                  <p className="text-sm text-gray-500 mb-0">
                    Our product is designed so that sensitive workspace content is processed locally where possible; this policy focuses on data processed in connection with operating the service and website.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">5. Purposes and legal bases (GDPR Art. 6)</h2>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li><strong>Delivering the service and website</strong> — Art. 6(1)(b) (contract) and Art. 6(1)(f) (legitimate interests in reliable operation).</li>
                    <li><strong>Security, abuse prevention, and debugging</strong> — Art. 6(1)(f) (legitimate interests), and where strictly necessary Art. 6(1)(c) (legal obligation).</li>
                    <li><strong>Aggregated analytics on this site</strong> — Art. 6(1)(a) (consent), where not strictly necessary.</li>
                    <li><strong>Newsletters or marketing</strong> — Art. 6(1)(a) (consent) or Art. 6(1)(f) with opt-out where permitted by law.</li>
                    <li><strong>Legal compliance</strong> — Art. 6(1)(c) where applicable.</li>
                  </ul>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">6. Cookies & similar technologies</h2>
                  <p className="mb-0">
                    We use essential technologies to run the site and, only with your consent where required, aggregated analytics. See our{' '}
                    <a href="/cookie-policy" className="text-teal-400 hover:text-teal-300">Cookie Policy</a> for details and how to withdraw consent.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">7. Recipients & subprocessors</h2>
                  <p>
                    We use trusted infrastructure providers (for example hosting, databases, email delivery, and payment processing). They process personal data only on our instructions or as independent controllers as described in their terms, and we assess security and data protection terms with them.
                  </p>
                  <p className="mb-0 text-sm text-gray-500">
                    A current list of key subprocessors is available on request for business customers and may be updated as our suppliers change.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">8. International transfers</h2>
                  <p className="mb-0">
                    Where personal data is transferred outside the European Economic Area, we rely on appropriate safeguards such as Standard Contractual Clauses approved by the European Commission (and supplementary measures where required), or adequacy decisions, unless an exception applies.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">9. Retention</h2>
                  <p className="mb-0">
                    We retain personal data only as long as necessary for the purposes above, including legal, accounting, and dispute-resolution needs. Retention periods vary by category (for example security logs vs marketing consents); contact us for more detail about a specific processing activity.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">10. Your rights (GDPR Chapter III)</h2>
                  <p>Subject to conditions in applicable law, you may have the right to:</p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li>Access, rectification, erasure, restriction, and data portability;</li>
                    <li>Object to processing based on legitimate interests (Art. 21);</li>
                    <li>Withdraw consent at any time where processing is consent-based (without affecting prior lawful processing);</li>
                    <li>Lodge a complaint with a supervisory authority, in particular in the EU Member State of your habitual residence, place of work, or place of the alleged infringement.</li>
                  </ul>
                  <p className="mb-0">
                    To exercise rights, contact <a href={`mailto:${siteConfig.privacyEmail}`} className="text-teal-400 hover:text-teal-300">{siteConfig.privacyEmail}</a>.
                    We typically respond within one month (Art. 12(3) GDPR), subject to extension in complex cases as permitted by law.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">11. Automated decision-making</h2>
                  <p className="mb-0">
                    We do not use automated decision-making that produces legal or similarly significant effects solely by automated means in connection with the processing described in this website policy. If that changes, we will provide meaningful information and safeguards as required by law.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">12. Children</h2>
                  <p className="mb-0">
                    Our services are not directed at children under 16 (or the age required in your jurisdiction). If you believe we have collected a child’s data, contact us and we will take appropriate steps.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">13. Changes</h2>
                  <p className="mb-0">
                    We may update this Privacy Policy to reflect legal, technical, or business changes. We will post the updated version on this page and adjust the “Last updated” date. Where required, we will notify you or seek fresh consent.
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
