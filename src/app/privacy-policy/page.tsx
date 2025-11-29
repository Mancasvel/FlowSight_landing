import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function PrivacyPolicyPage() {
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
                Privacy
                <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                  Policy
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto px-4">
                Your privacy is our priority. Learn how FlowSight protects your data.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Content */}
        <section className="py-16 sm:py-24">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto prose prose-lg prose-invert">
              <div className="space-y-8">

                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Data Collection</h2>
                  <p className="text-gray-400 leading-relaxed">
                    FlowSight is designed with privacy as a core principle. We do not collect, store, or transmit
                    any of your code, files, or development data. All processing happens locally on your machine.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Local Processing Only</h2>
                  <p className="text-gray-400 leading-relaxed">
                    Your code never leaves your environment. FlowSight's AI analyzes your development context
                    entirely on your local machine, ensuring complete data privacy and security.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">No External Dependencies</h2>
                  <p className="text-gray-400 leading-relaxed">
                    FlowSight operates entirely offline once installed. No internet connection is required
                    for core functionality, eliminating any possibility of external data transmission.
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Contact Information</h2>
                  <p className="text-gray-400 leading-relaxed">
                    If you have any questions about our privacy practices, please contact us at
                    <a href="mailto:privacy@flowsight.com" className="text-teal-400 hover:text-teal-300 ml-1">
                      privacy@flowsight.com
                    </a>
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
