import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function TermsOfServicePage() {
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
                Terms of
                <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                  Service
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto px-4">
                Please read these terms carefully before using FlowSight.
              </p>
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16 sm:py-24">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto prose prose-lg prose-invert">
              <div className="space-y-8">

                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Acceptance of Terms</h2>
                  <p className="text-gray-400 leading-relaxed">
                    By accessing and using FlowSight, you accept and agree to be bound by the terms
                    and provision of this agreement.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Use License</h2>
                  <p className="text-gray-400 leading-relaxed">
                    Permission is granted to temporarily use FlowSight for personal and commercial
                    purposes. This license shall automatically terminate if you violate any of these restrictions.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Disclaimer</h2>
                  <p className="text-gray-400 leading-relaxed">
                    The materials on FlowSight are provided on an 'as is' basis. FlowSight makes no
                    warranties, expressed or implied, and hereby disclaims and negates all other warranties.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Limitations</h2>
                  <p className="text-gray-400 leading-relaxed">
                    In no event shall FlowSight or its suppliers be liable for any damages arising out of
                    the use or inability to use FlowSight, even if FlowSight has been notified of the possibility of such damage.
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


