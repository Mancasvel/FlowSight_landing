export default function ProblemSolvedSection() {
  const metrics = [
    {
      title: "PM Time in Meetings",
      before: "10-12 hours/week asking \"what are you working on?\"",
      after: "2-3 hours/week (standups with actual context)",
      impact: "30-40 hours/month recovered = €2-3K/month value"
    },
    {
      title: "Task Status Accuracy",
      before: "30% accurate (manual Jira updates 24h behind)",
      after: "90% accurate (real-time AI inference)",
      impact: "Accurate planning, fewer surprises"
    },
    {
      title: "Developer Satisfaction",
      before: "3/10 (\"I feel watched by Clockify\")",
      after: "8/10 (\"Visibility happens automatically\")",
      impact: "Better retention, healthier culture"
    },
    {
      title: "Tool Costs",
      before: "Jira + Clockify + Linear = €700/month",
      after: "FlowSight = €300/month savings",
      impact: "€4,800/year cost reduction"
    }
  ]

  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 section-padding">
      <div className="container-max px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 px-2">
            What Changes With FlowSight
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Quantified impact from teams using automatic task traceability
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-lg p-4 sm:p-6 border border-slate-700 hover:border-slate-600 transition-colors">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">
                {metric.title}
              </h3>

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm text-red-400 line-through leading-tight">
                    Before: {metric.before}
                  </span>
                </div>

                <div className="flex items-start space-x-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs sm:text-sm text-green-400 font-medium leading-tight">
                    After: {metric.after}
                  </span>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-700">
                <div className="text-xs sm:text-sm text-teal-400 font-medium leading-tight">
                  Impact: {metric.impact}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}