'use client'

import { useState, useEffect, useRef } from 'react'
import CostCalculator from './CostCalculator'

export default function ProblemSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [showCalculator, setShowCalculator] = useState(false)
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

  const problems = [
    {
      title: "PMs Spend 40% of Their Time Guessing Task Status",
      metric: "10+ hours per week in 'are you working on X?' meetings",
      body: "Jira updates are manual, often 24 hours behind reality. Linear dashboards rely on developer discipline. GitHub tracks commits, not context. Result: PM is always blind to actual team state.",
      citation: "Stack Overflow 2024 Developer Survey",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3.5v.01M6.5 6.5h.01M14.5 6.5h.01M17.5 9h.01M17.5 12.5h.01M14.5 15.5h.01M9 17.5v.01M6.5 15.5h.01" />
        </svg>
      ),
      gradient: "from-red-50 to-pink-50",
      borderColor: "border-red-200",
      accentColor: "bg-red-500"
    },
    {
      title: "Time Tracking Tools Degrade Developer Morale",
      metric: "67% of developers hate Clockify/Toggl",
      body: "Invasive monitoring tools (keystroke tracking, screenshot capture, activity monitoring) create psychological safety issues. Developers feel spied on. Retention suffers. Culture suffers.",
      citation: "Blind 2024 Developer Satisfaction Index",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      ),
      gradient: "from-orange-50 to-red-50",
      borderColor: "border-orange-200",
      accentColor: "bg-orange-500"
    },
    {
      title: "Tool Fragmentation Costs €200+ Monthly Per Team",
      metric: "Jira + Clockify + Linear = 3 tools for one job",
      body: "Teams pay for overlapping tools that still don't solve the core problem. No single source of truth. Context is scattered across platforms. Integration friction wastes hours.",
      citation: "McKinsey 2024 Enterprise Software Analysis",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      gradient: "from-yellow-50 to-orange-50",
      borderColor: "border-yellow-200",
      accentColor: "bg-yellow-500"
    }
  ]

  return (
    <section ref={sectionRef} className="bg-gradient-to-b from-gray-50 to-white section-padding" id="problem">
      <div className="container-max">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
            The Task Traceability Crisis
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Teams lose visibility without sacrificing developer trust.
            Current tools either spy on developers or provide incomplete data.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {problems.map((problem, index) => (
            <div
              key={index}
              data-index={index}
              className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 ${problem.borderColor} transform hover:-translate-y-2 ${
                visibleCards.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${problem.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

              {/* Content */}
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${problem.accentColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {problem.icon}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                  {problem.title}
                </h3>

                <div className="text-lg font-semibold text-red-600 mb-4 bg-red-50 px-3 py-1 rounded-lg inline-block">
                  {problem.metric}
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {problem.body}
                </p>

                <div className="text-sm text-gray-500 italic border-l-4 border-gray-300 pl-4">
                  {problem.citation}
                </div>
              </div>

              {/* Hover Effect Line */}
              <div className={`absolute bottom-0 left-0 h-1 ${problem.accentColor} rounded-b-2xl transition-all duration-300 ${
                visibleCards.includes(index) ? 'w-full' : 'w-0'
              }`}></div>
            </div>
          ))}
        </div>

        {/* Calculator CTA */}
        <div className="text-center">
          <button
            onClick={() => setShowCalculator(true)}
            className="inline-flex items-center px-8 py-4 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
          >
            <svg className="w-6 h-6 text-teal-600 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
              Calculate Your Team's Traceability Cost
            </span>
            <svg className="w-5 h-5 text-gray-400 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Cost Calculator Modal */}
        {showCalculator && (
          <CostCalculator onClose={() => setShowCalculator(false)} />
        )}
      </div>
    </section>
  )
}
