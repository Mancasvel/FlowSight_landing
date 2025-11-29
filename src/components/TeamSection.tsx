import Image from 'next/image'

export default function TeamSection() {
  return (
    <section className="bg-white section-padding">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-4">
            Founded by a Developer Operations Engineer
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Building the future of organizational intelligence
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
            <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="flex-shrink-0">
                <Image
                  src="/mc_profile.jpg"
                  alt="Manuel Castillejo - Founder & CEO"
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>

              {/* Profile Content */}
              <div className="flex-grow">
                <h3 className="text-3xl font-bold text-navy-900 mb-2">
                  Manuel Castillejo
                </h3>
                <p className="text-xl text-teal-600 font-medium mb-4">
                  Founder & CEO, Organizational Intelligence Engineer
                </p>

                <div className="space-y-4 text-muted leading-relaxed">
                  <p>
                    Software Engineer turned founder-operator. Previously CTO at UNSENT (AI + privacy platform) and CoNest (intergenerational coliving platform).
                  </p>

                  <p>
                    <strong>Specialization:</strong> Combining technical systems, organizational psychology, and business strategy to solve team blindness.
                  </p>

                  <p>
                    <strong>Vision:</strong> I'm founding the discipline of Organizational Intelligence Engineering. FlowSight is the first application: giving teams visibility into their own dynamics without sacrificing trust or privacy.
                  </p>
                </div>

                {/* Social Links */}
                <div className="mt-6">
                  <a
                    href="https://www.linkedin.com/in/manuel-castillejo-vela/"
                    className="inline-flex items-center space-x-2 text-teal-600 hover:text-teal-700 font-medium"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
