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
      title: "Developer Satisfaction (Trust)",
      before: "3/10 (\"I feel watched by Clockify\")",
      after: "8/10 (\"I work normally, visibility happens automatically\")",
      impact: "Better retention, healthier culture"
    },
    {
      title: "Tool Costs",
      before: "Jira (€200) + Clockify (€300) + Linear (€200) = €700/month",
      after: "FlowSight (€300) = €400/month savings",
      impact: "€4,800/year cost reduction"
    }
  ]

  return (
    <section className="bg-white section-padding">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-4">
            What Changes With FlowSight
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Quantified impact from teams using automatic task traceability
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-navy-900 mb-4">
                {metric.title}
              </h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-red-700 line-through">
                    Before: {metric.before}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-success font-medium">
                    After: {metric.after}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-navy-700 font-medium">
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
