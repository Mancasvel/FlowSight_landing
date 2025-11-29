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
            setVisibleCards(prev => [...new Set([...prev, index])])
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
      headline: "Know Exactly What Your Team Is Actually Working On",
      content: "Developer machine runs local LLM + RAG. Infers task from activity patterns: window focus, IDE events, integration context (GitHub/Linear/Jira API data). Zero manual input required. Task mapping updates in real-time as developers work.",
      stat: "90%+ task classification accuracy",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      gradient: "from-teal-50 to-cyan-50",
      borderColor: "border-teal-200",
      accentColor: "bg-teal-500",
      textColor: "text-teal-600"
    },
    {
      headline: "Understand WHY Your Team Is Busy (Or Stuck)",
      content: "AI doesn't just track tasks. It understands context. When developer is in task X, AI explains: 'Debugging API timeout' vs. 'Waiting for design approval' vs. 'Blocked on infrastructure'. PM sees actionable context, not just time numbers.",
      stat: "Context accuracy: 87%",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      gradient: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
      accentColor: "bg-blue-500",
      textColor: "text-blue-600"
    },
    {
      headline: "Task Traceability Without Developer Surveillance",
      content: "All processing on developer's machine. Activity data stays local. Only aggregated task summaries go to PM dashboard (task ID, hours spent, confidence score). No screenshots captured. No raw activity transmitted. GDPR/CCPA compliant by design.",
      stat: "100% of processing local",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      gradient: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      accentColor: "bg-green-500",
      textColor: "text-green-600"
    }
  ]

  const flowSteps = [
    { 
      name: "Activity Monitoring", 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "bg-teal-500", 
      active: activeFlow === 0 
    },
    { 
      name: "Context Inference", 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: "bg-blue-500", 
      active: activeFlow === 1 
    },
    { 
      name: "PM Dashboard", 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "bg-green-500", 
      active: activeFlow === 2 
    }
  ]

  return (
    <section ref={sectionRef} className="bg-white section-padding" id="solution">
      <div className="container-max">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
            One Platform.
            <span className="block bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Complete Traceability.
            </span>
            <span className="block text-gray-600 text-3xl lg:text-4xl font-medium mt-2">
              Zero Surveillance.
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Automatic task mapping powered by local AI context understanding.
            Finally, visibility without sacrificing developer trust.
          </p>
        </div>

        {/* Three Pillars */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              data-index={index}
              className={`group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 ${pillar.borderColor} transform hover:-translate-y-3 ${
                visibleCards.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

              {/* Content */}
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-20 h-20 ${pillar.accentColor} rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <div className="text-white">
                    {pillar.icon}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                  {pillar.headline}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {pillar.content}
                </p>

                <div className={`inline-flex items-center px-4 py-2 bg-white rounded-xl border-2 ${pillar.borderColor} ${pillar.textColor} font-bold text-lg shadow-sm`}>
                  {pillar.stat}
                </div>
              </div>

              {/* Hover Effect Elements */}
              <div className={`absolute -top-2 -right-2 w-6 h-6 ${pillar.accentColor} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping`}></div>
              <div className={`absolute -top-2 -right-2 w-6 h-6 ${pillar.accentColor} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Visual Flow Animation */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-12 shadow-inner border border-gray-100">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How It All Works Together</h3>
            <p className="text-lg text-gray-600">From developer activity to PM insights in real-time</p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-12">
            {flowSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Step Circle */}
                <div className={`relative w-24 h-24 rounded-full ${step.color} flex items-center justify-center mb-4 transition-all duration-500 ${
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
                <div className={`text-center font-semibold text-lg transition-colors duration-300 ${
                  step.active ? 'text-gray-900' : 'text-gray-600'
                }`}>
                  {step.name}
                </div>


              </div>
            ))}
          </div>

          {/* Process Description */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white/50 rounded-xl">
              <div className="text-teal-600 font-semibold mb-2">Step 1: Capture</div>
              <p className="text-sm text-gray-600">Monitor developer activity patterns locally</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-xl">
              <div className="text-blue-600 font-semibold mb-2">Step 2: Understand</div>
              <p className="text-sm text-gray-600">AI infers context using LLM + RAG</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-xl">
              <div className="text-green-600 font-semibold mb-2">Step 3: Share</div>
              <p className="text-sm text-gray-600">Send insights to PM dashboard (optional)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
