'use client'

import { useState, useEffect, useRef } from 'react'

export default function HowItWorksSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
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

  const steps = [
    {
      step: "01",
      title: "Capture Activity",
      subtitle: "Automatically monitor developer work",
      description: "FlowSight runs locally on each developer's machine, capturing window focus, IDE events, and application context without storing sensitive data.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "from-teal-50 to-cyan-50",
      accentColor: "bg-teal-500",
      textColor: "text-teal-600"
    },
    {
      step: "02",
      title: "Understand Context",
      subtitle: "AI analyzes patterns and intent",
      description: "Local AI models process activity patterns to understand what developers are actually working on, learning from historical data and team dynamics.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: "from-blue-50 to-indigo-50",
      accentColor: "bg-blue-500",
      textColor: "text-blue-600"
    },
    {
      step: "03",
      title: "Share Insights",
      subtitle: "PM dashboard with full context",
      description: "Aggregated insights flow to the PM dashboard, showing task progress, blockers, and context without exposing individual developer activity.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "from-green-50 to-emerald-50",
      accentColor: "bg-green-500",
      textColor: "text-green-600"
    }
  ]

  return (
    <section ref={sectionRef} id="how-it-works" className="bg-gradient-to-b from-gray-50 to-white section-padding">
      <div className="container-max">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
            From Activity to
            <span className="block bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Actionable Insights
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Three simple steps transform developer activity into contextual project visibility.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {steps.map((step, index) => (
            <div
              key={index}
              data-index={index}
              className={`group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 transform hover:-translate-y-2 ${
                visibleCards.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

              {/* Step Number */}
              <div className="relative z-10 mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${step.accentColor} rounded-2xl text-white font-bold text-xl shadow-lg`}>
                  {step.step}
                </div>
              </div>

              {/* Icon */}
              <div className={`relative z-10 inline-flex items-center justify-center w-16 h-16 ${step.textColor} bg-white rounded-2xl shadow-md mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className={step.textColor}>
                  {step.icon}
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                  {step.title}
                </h3>
                <h4 className="text-lg text-gray-600 mb-4 font-medium">
                  {step.subtitle}
                </h4>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {step.description}
                </p>
              </div>

              {/* Hover Effect Elements */}
              <div className={`absolute -top-2 -right-2 w-6 h-6 ${step.accentColor} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping`}></div>
              <div className={`absolute -top-2 -right-2 w-6 h-6 ${step.accentColor} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Visual Flow */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-12 shadow-inner border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">The Complete Flow</h3>
            <p className="text-gray-600">Activity → Context → Insights</p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center">
            <div className="flex items-center space-x-4 lg:space-x-8">
              {/* Developer Machine */}
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-sm font-medium text-gray-900">Developer Machine</div>
                <div className="text-xs text-gray-500">Local Processing</div>
              </div>

              {/* Arrow */}
              <svg className="w-8 h-8 text-teal-500 hidden lg:block" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>

              {/* AI Processing */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="text-sm font-medium text-gray-900">AI Processing</div>
                <div className="text-xs text-gray-500">Context Understanding</div>
              </div>

              {/* Arrow */}
              <svg className="w-8 h-8 text-teal-500 hidden lg:block" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>

              {/* PM Dashboard */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-sm font-medium text-gray-900">PM Dashboard</div>
                <div className="text-xs text-gray-500">Actionable Insights</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
