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

  const problems = [
    {
      title: "Managers Spend 40% of Their Time Guessing Task Status",
      metric: "10+ hours per week in 'are you working on X?' meetings",
      body: "Jira updates are manual, often 24 hours behind reality. Linear dashboards rely on employee discipline. GitHub tracks commits, not context.",
      citation: "Stack Overflow 2024 Developer Survey",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: "from-red-900/20 to-pink-900/20",
      borderColor: "border-red-500/30",
      accentColor: "bg-red-500"
    },
    {
      title: "Time Tracking Tools Degrade Morale",
      metric: "67% of workers hate Clockify/Toggl",
      body: "Invasive monitoring tools create psychological safety issues. Employees feel spied on. Retention suffers. Culture suffers.",
      citation: "Blind 2024 Developer Satisfaction Index",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      gradient: "from-orange-900/20 to-red-900/20",
      borderColor: "border-orange-500/30",
      accentColor: "bg-orange-500"
    },
    {
      title: "Tool Fragmentation Costs €200+ Monthly Per Team",
      metric: "Jira + Clockify + Linear = 3 tools for one job",
      body: "Teams pay for overlapping tools that still don't solve the core problem. No single source of truth. Context is scattered.",
      citation: "McKinsey 2024 Enterprise Software Analysis",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      gradient: "from-yellow-900/20 to-orange-900/20",
      borderColor: "border-yellow-500/30",
      accentColor: "bg-yellow-500"
    }
  ]

  return (
    <section ref={sectionRef} className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 section-padding" id="problem">
      <div className="container-max px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 px-2">
            The Task Traceability Crisis
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Teams lose visibility without sacrificing employee trust.
            Current tools either spy on workers or provide incomplete data.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 md:mb-16">
          {problems.map((problem, index) => (
            <div
              key={index}
              data-index={index}
              className={`group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border ${problem.borderColor} transform hover:-translate-y-2 ${visibleCards.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${problem.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

              {/* Content */}
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${problem.accentColor} rounded-xl sm:rounded-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {problem.icon}
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-gray-100 transition-colors leading-tight">
                  {problem.title}
                </h3>

                <div className="text-sm sm:text-base font-semibold text-red-400 mb-3 sm:mb-4 bg-red-500/10 px-2 sm:px-3 py-1 rounded-lg inline-block border border-red-500/20">
                  {problem.metric}
                </div>

                <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 leading-relaxed group-hover:text-gray-300 transition-colors">
                  {problem.body}
                </p>

                <div className="text-xs sm:text-sm text-gray-500 italic border-l-4 border-gray-600 pl-3 sm:pl-4">
                  {problem.citation}
                </div>
              </div>

              {/* Hover Effect Line */}
              <div className={`absolute bottom-0 left-0 h-1 ${problem.accentColor} rounded-b-2xl transition-all duration-300 ${visibleCards.includes(index) ? 'w-full' : 'w-0'
                }`}></div>
            </div>
          ))}
        </div>

        {/* Calculator CTA */}
        <div className="text-center px-4">
          <button
            onClick={() => setShowCalculator(true)}
            className="inline-flex items-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg border border-slate-700 hover:border-teal-500/50 hover:shadow-xl transition-all duration-300 group"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400 mr-2 sm:mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-sm sm:text-base md:text-lg font-semibold text-white group-hover:text-teal-400 transition-colors">
              Calculate Your Team's Cost
            </span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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