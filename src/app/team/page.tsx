import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'

export default function TeamPage() {
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
            <div className="text-center mb-10 md:mb-16">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Founded by a Developer Operations Engineer
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto px-4">
                Building the future of organizational intelligence
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="pb-16 sm:pb-24">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-lg p-4 sm:p-6 md:p-8 border border-slate-700">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 sm:space-y-6 md:space-y-0 md:space-x-6 lg:space-x-8">
                  <div className="flex-shrink-0">
                    <Image
                      src="/mc_profile.jpg"
                      alt="Manuel Castillejo - Founder & CEO"
                      width={128}
                      height={128}
                      className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-slate-700 shadow-lg"
                    />
                  </div>

                  {/* Profile Content */}
                  <div className="flex-grow text-center md:text-left">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                      Manuel Castillejo
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-teal-400 font-medium mb-3 sm:mb-4">
                      Founder & CEO
                    </p>

                    <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-400 leading-relaxed">
                      <p>
                        Software Engineer turned founder-operator. Previously CTO at UNSENT (AI + privacy platform) and CoNest (intergenerational coliving platform).
                      </p>

                      <p>
                        <strong className="text-gray-300">Specialization:</strong> Combining technical systems, organizational psychology, and business strategy to solve team blindness.
                      </p>

                      <p>
                        <strong className="text-gray-300">Vision:</strong> I'm founding the discipline of Organizational Intelligence Engineering. FlowSight is the first application.
                      </p>
                    </div>

                    {/* Social Links */}
                    <div className="mt-4 sm:mt-6">
                      <a
                        href="https://www.linkedin.com/in/manuel-castillejo-vela/"
                        className="inline-flex items-center space-x-2 text-teal-400 hover:text-teal-300 font-medium transition-colors"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm sm:text-base">LinkedIn</span>
                      </a>
                    </div>
                  </div>
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
