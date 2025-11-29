export default function ComparisonSection() {
  const comparison = {
    features: {
      "Privacy": ["❌", "⚠️", "⚠️", "⚠️", "✅"],
      "Automatic Tracking": ["❌", "❌", "❌", "⚠️", "✅"],
      "Context Understanding": ["❌", "⚠️", "⚠️", "❌", "✅"],
      "Time Tracking": ["✅", "❌", "❌", "❌", "✅"],
      "Developer Experience": ["❌", "✅", "✅", "✅", "✅"],
      "PM Visibility": ["✅", "✅", "✅", "⚠️", "✅"],
      "Compliance Ready": ["❌", "⚠️", "⚠️", "⚠️", "✅"]
    },
    tools: ["Clockify", "Jira", "Linear", "GitHub", "FlowSight"]
  }

  const getIcon = (value: string) => {
    if (value === "✅") {
      return (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )
    } else if (value === "❌") {
      return (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )
    } else if (value === "⚠️") {
      return (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    }
    return null
  }

  const features = Object.keys(comparison.features)

  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 section-padding">
      <div className="container-max px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 px-2">
            Stop Choosing Between Visibility and Privacy
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            FlowSight is the only tool that combines privacy + automatic tracking + context understanding.
          </p>
        </div>

        {/* Comparison Table - Desktop */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="text-left p-4 sm:p-6 font-bold">Feature</th>
                {comparison.tools.map((tool, index) => (
                  <th key={index} className={`text-center p-4 sm:p-6 font-bold ${tool === 'FlowSight' ? 'bg-teal-500' : ''}`}>
                    {tool}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, featureIndex) => (
                <tr key={feature} className={featureIndex % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-800/50'}>
                  <td className="p-4 sm:p-6 font-medium text-white">{feature}</td>
                  {comparison.features[feature as keyof typeof comparison.features].map((value, valueIndex) => (
                    <td key={valueIndex} className={`p-4 sm:p-6 text-center font-medium ${
                      comparison.tools[valueIndex] === 'FlowSight' && value === '✅' ? 'text-green-400' :
                      comparison.tools[valueIndex] === 'FlowSight' && value === '❌' ? 'text-red-400' :
                      value === '✅' ? 'text-green-500' :
                      value === '❌' ? 'text-red-500' :
                      'text-yellow-500'
                    }`}>
                      {getIcon(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Comparison Cards - Mobile */}
        <div className="lg:hidden space-y-4 sm:space-y-6">
          {comparison.tools.map((tool, toolIndex) => (
            <div key={tool} className={`bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border ${tool === 'FlowSight' ? 'border-teal-500' : 'border-slate-700'} p-4 sm:p-6`}>
              <div className="text-center mb-4 sm:mb-6">
                <h3 className={`text-lg sm:text-xl font-bold ${tool === 'FlowSight' ? 'text-teal-400' : 'text-white'}`}>
                  {tool}
                </h3>
                {tool === 'FlowSight' && (
                  <div className="mt-2 inline-block bg-teal-500 text-white text-xs px-3 py-1 rounded-full">
                    Recommended
                  </div>
                )}
              </div>

              <div className="space-y-3 sm:space-y-4">
                {features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center justify-between py-2 sm:py-3 border-b border-slate-700 last:border-b-0">
                    <span className="text-xs sm:text-sm font-medium text-gray-300 flex-1">{feature}</span>
                    <div className={`ml-4 ${
                      tool === 'FlowSight' && comparison.features[feature as keyof typeof comparison.features][toolIndex] === '✅' ? 'text-green-400' :
                      tool === 'FlowSight' && comparison.features[feature as keyof typeof comparison.features][toolIndex] === '❌' ? 'text-red-400' :
                      comparison.features[feature as keyof typeof comparison.features][toolIndex] === '✅' ? 'text-green-500' :
                      comparison.features[feature as keyof typeof comparison.features][toolIndex] === '❌' ? 'text-red-500' :
                      'text-yellow-500'
                    }`}>
                      {getIcon(comparison.features[feature as keyof typeof comparison.features][toolIndex])}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Key Insight */}
        <div className="mt-8 sm:mt-12 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl sm:rounded-lg p-4 sm:p-6 md:p-8">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Key Insight</h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-3xl mx-auto">
              FlowSight is the only tool that combines <strong className="text-teal-400">privacy</strong> + <strong className="text-teal-400">automatic tracking</strong> + <strong className="text-teal-400">context understanding</strong>.
              Everyone else makes you choose.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}