import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function LegalSecurityPage() {
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
                Security
                <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                  Overview
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto px-4">
                Comprehensive security information and compliance details for FlowSight.
              </p>
            </div>
          </div>
        </section>

        {/* Security Overview */}
        <section className="py-16 sm:py-24">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Zero Data Collection</h3>
                <p className="text-gray-400 leading-relaxed">
                  We don't collect or store any of your code or development data. Everything stays local.
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Local Processing</h3>
                <p className="text-gray-400 leading-relaxed">
                  All AI processing happens on your machine. No external servers or cloud processing.
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Regular Audits</h3>
                <p className="text-gray-400 leading-relaxed">
                  We conduct regular security audits and maintain industry-standard security practices.
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
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-teal-400">GDPR</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">GDPR</h3>
                <p className="text-sm text-gray-400">EU data protection</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-400">SOC2</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">SOC 2</h3>
                <p className="text-sm text-gray-400">Security standards</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-400">ISO</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">ISO 27001</h3>
                <p className="text-sm text-gray-400">Information security</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-400">HIPAA</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">HIPAA</h3>
                <p className="text-sm text-gray-400">Healthcare data</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 sm:py-24">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="bg-gradient-to-r from-teal-900/20 to-blue-900/20 rounded-3xl p-8 sm:p-12 md:p-16 border border-teal-500/20">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
                  Security Questions?
                </h2>
                <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                  Have questions about FlowSight's security practices or compliance?
                  Our team is here to help.
                </p>
                <a href="/contact" className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-teal-500/25 transform hover:-translate-y-1">
                  Contact Security Team
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

