'use client'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import BetaSignupModal from '@/components/BetaSignupModal'
import { useBetaModal } from '@/hooks/useBetaModal'

export default function SecurityPage() {
  const { isOpen, openModal, closeModal } = useBetaModal()
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 sm:pb-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 container-max px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-12 md:mb-16">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Security First
                <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                  Architecture
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto px-4">
                Your code and data never leave your environment. Complete privacy
                with enterprise-grade security.
              </p>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-16 sm:py-24">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* Local Processing */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 sm:p-8 border border-slate-700/50">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">100% Local Processing</h3>
                <p className="text-gray-400 leading-relaxed">
                  All AI processing happens on your machine. No code, comments, or context
                  ever leaves your local environment.
                </p>
              </div>

              {/* Zero Data Collection */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 sm:p-8 border border-slate-700/50">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Zero Data Collection</h3>
                <p className="text-gray-400 leading-relaxed">
                  We don't collect, store, or analyze any of your code or development data.
                  Your privacy is completely protected.
                </p>
              </div>

              {/* Open Source Core */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 sm:p-8 border border-slate-700/50">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Open Source Core</h3>
                <p className="text-gray-400 leading-relaxed">
                  Our core AI models and processing logic are open source,
                  allowing independent security audits and community validation.
                </p>
              </div>

              {/* End-to-End Encryption */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 sm:p-8 border border-slate-700/50">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-teal-500/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">End-to-End Encryption</h3>
                <p className="text-gray-400 leading-relaxed">
                  All data transfers are encrypted end-to-end using industry-standard
                  encryption protocols and secure key management.
                </p>
              </div>

              {/* No External Dependencies */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 sm:p-8 border border-slate-700/50">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">No External Dependencies</h3>
                <p className="text-gray-400 leading-relaxed">
                  FlowSight operates entirely offline. No internet connection required
                  for core functionality, eliminating external attack vectors.
                </p>
              </div>

              {/* Regular Security Audits */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 sm:p-8 border border-slate-700/50">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Regular Security Audits</h3>
                <p className="text-gray-400 leading-relaxed">
                  We conduct regular security audits and penetration testing
                  to ensure the highest standards of security and data protection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance */}
        <section className="py-16 sm:py-24 bg-slate-900/50">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
                Compliance & Certifications
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Meeting the highest standards for data protection and privacy
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-teal-400">GDPR</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">GDPR Compliant</h3>
                <p className="text-sm text-gray-400">Full compliance with EU data protection regulations</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-400">SOC2</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">SOC 2 Type II</h3>
                <p className="text-sm text-gray-400">Security, availability, and confidentiality standards</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-400">ISO</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">ISO 27001</h3>
                <p className="text-sm text-gray-400">Information security management systems</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-400">HIPAA</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">HIPAA Ready</h3>
                <p className="text-sm text-gray-400">Healthcare data protection standards</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="bg-gradient-to-r from-teal-900/20 to-blue-900/20 rounded-3xl p-8 sm:p-12 md:p-16 border border-teal-500/20">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
                  Security You Can Trust
                </h2>
                <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                  Experience enterprise-grade security with the privacy and convenience
                  of local processing.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={openModal}
                    className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-teal-500/25 transform hover:-translate-y-1"
                  >
                    Start Secure Today
                  </button>
                  <a
                    href="/documentation"
                    className="border-2 border-slate-600 text-gray-300 hover:border-teal-500 hover:text-teal-400 font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
                  >
                    View Security Docs
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BetaSignupModal isOpen={isOpen} onClose={closeModal} />
    </>
  )
}

