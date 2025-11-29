'use client'

import { useState, useEffect, useRef } from 'react'

export default function SolutionSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [activeFlow, setActiveFlow] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            setVisibleCards(prev => Array.from(new Set([...prev, index])))
          }
        })
      },
      { threshold: 0.3 }
    )

    const cards = sectionRef.current?.querySelectorAll('[data-index]')
    cards?.forEach(card => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  // Auto-rotate flow animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFlow(prev => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const pillars = [
    {
      headline: "Know What Your Team Is Working On",
      content: "Local LLM + RAG infers tasks from activity patterns. Zero manual input required. Task mapping updates in real-time.",
      stat: "90%+ accuracy",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      gradient: "from-teal-900/20 to-cyan-900/20",
      borderColor: "border-teal-500/30",
      accentColor: "bg-teal-500",
      textColor: "text-teal-400"
    },
    {
      headline: "Understand WHY Your Team Is Busy",
      content: "AI understands context: 'Debugging API timeout' vs. 'Waiting for design approval'. PM sees actionable insights.",
      stat: "87% context accuracy",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      gradient: "from-blue-900/20 to-indigo-900/20",
      borderColor: "border-blue-500/30",
      accentColor: "bg-blue-500",
      textColor: "text-blue-400"
    },
    {
      headline: "Traceability Without Surveillance",
      content: "All processing on developer's machine. Only aggregated summaries go to PM dashboard. GDPR/CCPA compliant.",
      stat: "100% local processing",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      gradient: "from-green-900/20 to-emerald-900/20",
      borderColor: "border-green-500/30",
      accentColor: "bg-green-500",
      textColor: "text-green-400"
    }
  ]

  const flowSteps = [
    { 
      name: "Activity Monitoring", 
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "bg-teal-500", 
      active: activeFlow === 0 
    },
    { 
      name: "Context Inference", 
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: "bg-blue-500", 
      active: activeFlow === 1 
    },
    { 
      name: "PM Dashboard", 
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "bg-green-500", 
      active: activeFlow === 2 
    }
  ]

  return (
    <section ref={sectionRef} className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 section-padding" id="solution">
      <div className="container-max px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 px-2">
            One Platform.
            <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
              Complete Traceability.
            </span>
            <span className="block text-gray-400 text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-medium mt-2">
              Zero Surveillance.
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Automatic task mapping powered by local AI context understanding.
            Finally, visibility without sacrificing developer trust.
          </p>
        </div>

        {/* Three Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 md:mb-20">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              data-index={index}
              className={`group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border ${pillar.borderColor} transform hover:-translate-y-3 ${
                visibleCards.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

              {/* Content */}
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 ${pillar.accentColor} rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <div className="text-white">
                    {pillar.icon}
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-gray-100 transition-colors leading-tight">
                  {pillar.headline}
                </h3>

                <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 leading-relaxed group-hover:text-gray-300 transition-colors">
                  {pillar.content}
                </p>

                <div className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-900/50 rounded-lg sm:rounded-xl border ${pillar.borderColor} ${pillar.textColor} font-bold text-sm sm:text-base md:text-lg shadow-sm`}>
                  {pillar.stat}
                </div>
              </div>

              {/* Hover Effect Elements */}
              <div className={`absolute -top-2 -right-2 w-4 h-4 sm:w-6 sm:h-6 ${pillar.accentColor} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping`}></div>
              <div className={`absolute -top-2 -right-2 w-4 h-4 sm:w-6 sm:h-6 ${pillar.accentColor} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Visual Flow Animation */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-inner border border-slate-700">
          <div className="text-center mb-8 md:mb-12">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">How It All Works Together</h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-400">From developer activity to PM insights in real-time</p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-8 xl:space-x-12">
            {flowSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Step Circle */}
                <div className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full ${step.color} flex items-center justify-center mb-3 sm:mb-4 transition-all duration-500 ${
                  step.active ? 'scale-110 shadow-2xl' : 'scale-100 shadow-lg'
                }`}>
                  <div className="text-white">
                    {step.icon}
                  </div>
                  {step.active && (
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                  )}
                </div>

                {/* Step Name */}
                <div className={`text-center font-semibold text-sm sm:text-base md:text-lg transition-colors duration-300 ${
                  step.active ? 'text-white' : 'text-gray-500'
                }`}>
                  {step.name}
                </div>
              </div>
            ))}
          </div>

          {/* Process Description */}
          <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-3 sm:p-4 bg-slate-900/50 rounded-xl border border-slate-700">
              <div className="text-teal-400 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Step 1: Capture</div>
              <p className="text-xs sm:text-sm text-gray-400">Monitor developer activity patterns locally</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-slate-900/50 rounded-xl border border-slate-700">
              <div className="text-blue-400 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Step 2: Understand</div>
              <p className="text-xs sm:text-sm text-gray-400">AI infers context using LLM + RAG</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-slate-900/50 rounded-xl border border-slate-700">
              <div className="text-green-400 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Step 3: Share</div>
              <p className="text-xs sm:text-sm text-gray-400">Send insights to PM dashboard (optional)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}