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