import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Data protection (GDPR)',
  description: `How to exercise GDPR rights and how ${siteConfig.legalName} supports EU data protection standards.`,
}

export default function GdprPage() {
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
              Data protection &{' '}
              <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">GDPR</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto px-4">
              Practical information about Regulation (EU) 2016/679 and how we support transparency, security, and your rights.
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-20">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto prose prose-lg prose-invert prose-headings:text-white prose-a:text-teal-400">
              <div className="space-y-8 text-gray-300">

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">Our approach</h2>
                  <p className="mb-0">
                    {siteConfig.legalName} designs {siteConfig.name} with privacy-by-design principles: minimisation, transparency, and strong security. This page summarises how EU GDPR fits into that programme. The full legal details are in our{' '}
                    <a href="/privacy-policy">Privacy Policy</a> and <a href="/cookie-policy">Cookie Policy</a>.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">Controller vs processor</h2>
                  <p>
                    For our website, accounts, and general service operation, we typically act as a <strong>controller</strong> for personal data we determine the purposes and means of processing.
                  </p>
                  <p className="mb-0">
                    For enterprise deployments, we may act as a <strong>processor</strong> on your instructions under a Data Processing Agreement (DPA). Commercial customers should rely on their contract and DPA for organisational obligations.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">Exercising your GDPR rights</h2>
                  <p>
                    You may request access, rectification, erasure, restriction, portability, or object to certain processing, and withdraw consent where processing is consent-based. Email{' '}
                    <a href={`mailto:${siteConfig.privacyEmail}`}>{siteConfig.privacyEmail}</a> with your request and enough information to verify your identity (we may ask proportionate follow-up questions to protect account security).
                  </p>
                  <p className="mb-0 text-sm text-gray-500">
                    Under Art. 12(3) GDPR we aim to respond within one month, extendable by two further months in complex cases with notice.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">Supervisory authority</h2>
                  <p className="mb-0">
                    You have the right to lodge a complaint with a supervisory authority, in particular in the EU Member State of your habitual residence, place of work, or of an alleged infringement. A list of EU authorities is maintained by the European Data Protection Board (EDPB).
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mt-0">SOC 2 readiness (trust programme)</h2>
                  <p className="mb-0">
                    We maintain a security programme aligned with the AICPA Trust Services Criteria (Security, and where applicable Availability and Confidentiality) as a roadmap toward independent assurance. A SOC 2 report, when available, is typically shared with customers under confidentiality — it is not a substitute for your own legal or compliance assessment. See also our <a href="/legal-security">Trust &amp; security overview</a>.
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
