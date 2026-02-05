import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function CareersPage() {
  const positions = [
    {
      title: 'Senior AI Engineer',
      type: 'Full-time',
      location: 'Remote',
      description: 'Build the next generation of AI-powered developer tools.'
    },
    {
      title: 'Product Designer',
      type: 'Full-time',
      location: 'Remote',
      description: 'Design intuitive interfaces for developer productivity tools.'
    },
    {
      title: 'DevOps Engineer',
      type: 'Full-time',
      location: 'Remote',
      description: 'Maintain and scale our infrastructure for millions of developers.'
    }
  ]

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
                Join Our
                <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                  Mission
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto px-4">
                Help us build the future of development workflow management.
                Work with cutting-edge AI and make an impact on millions of developers.
              </p>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 sm:py-24">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              Open Positions
            </h2>

            <div className="space-y-6 max-w-4xl mx-auto">
              {positions.map((position, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 sm:p-8 border border-slate-700/50 hover:border-teal-500/30 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{position.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full text-sm">{position.type}</span>
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">{position.location}</span>
                      </div>
                      <p className="text-gray-400">{position.description}</p>
                    </div>
                    <button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-teal-500/25 transform hover:-translate-y-1 whitespace-nowrap">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-16 sm:py-24 bg-slate-900/50">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
                Why Join FlowSight?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Cutting-Edge Technology</h3>
                <p className="text-gray-400">Work with the latest AI and machine learning technologies shaping the future of developer tools.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Amazing Team</h3>
                <p className="text-gray-400">Join a passionate team of engineers, designers, and product experts building something meaningful.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Global Impact</h3>
                <p className="text-gray-400">Your work will directly impact millions of developers worldwide, improving their daily workflow.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}


