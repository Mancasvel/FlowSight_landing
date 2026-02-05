import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function GdprPage() {
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
                GDPR
                <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                  Compliance
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto px-4">
                FlowSight is fully compliant with GDPR regulations and data protection standards.
              </p>
            </div>
          </div>
        </section>

        {/* GDPR Content */}
        <section className="py-16 sm:py-24">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto prose prose-lg prose-invert">
              <div className="space-y-8">

                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Data Controller</h2>
                  <p className="text-gray-400 leading-relaxed">
                    FlowSight acts as a data controller only for minimal account information required
                    for service delivery. All development data remains under your control.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Data Processing</h2>
                  <p className="text-gray-400 leading-relaxed">
                    Since FlowSight processes all data locally on your device, we do not process
                    personal data on behalf of our users. Your code and development context never leaves your environment.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Data Subject Rights</h2>
                  <p className="text-gray-400 leading-relaxed">
                    You have full control over your data. Since no data is stored on our servers,
                    data deletion and portability requests are handled by simply uninstalling FlowSight.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">International Data Transfers</h2>
                  <p className="text-gray-400 leading-relaxed">
                    FlowSight does not transfer any user data internationally. All processing occurs
                    locally on the user's device, eliminating concerns about cross-border data transfers.
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


