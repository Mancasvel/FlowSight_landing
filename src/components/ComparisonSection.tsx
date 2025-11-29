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
        <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )
    } else if (value === "❌") {
      return (
        <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )
    } else if (value === "⚠️") {
      return (
        <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    }
    return null
  }

  const features = Object.keys(comparison.features)

  return (
    <section className="bg-white section-padding">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Stop Choosing Between Visibility and Privacy
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            FlowSight is the only tool that combines privacy + automatic tracking + context understanding. Everyone else makes you choose.
          </p>
        </div>

        {/* Comparison Table - Desktop */}
        <div className="hidden lg:block overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full bg-gray-50 rounded-lg border border-gray-200 min-w-[600px]">
            <thead>
              <tr className="bg-gray-900 text-white">
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
                <tr key={feature} className={featureIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-4 sm:p-6 font-medium text-gray-900">{feature}</td>
                  {comparison.features[feature as keyof typeof comparison.features].map((value, valueIndex) => (
                    <td key={valueIndex} className={`p-4 sm:p-6 text-center font-medium ${
                      comparison.tools[valueIndex] === 'FlowSight' && value === '✅' ? 'text-green-600' :
                      comparison.tools[valueIndex] === 'FlowSight' && value === '❌' ? 'text-red-600' :
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
        <div className="lg:hidden space-y-6">
          {comparison.tools.map((tool, toolIndex) => (
            <div key={tool} className={`bg-white rounded-2xl shadow-lg border-2 ${tool === 'FlowSight' ? 'border-teal-200 bg-teal-50/50' : 'border-gray-200'} p-6`}>
              <div className="text-center mb-6">
                <h3 className={`text-xl font-bold ${tool === 'FlowSight' ? 'text-teal-600' : 'text-gray-900'}`}>
                  {tool}
                </h3>
                {tool === 'FlowSight' && (
                  <div className="mt-2 inline-block bg-teal-500 text-white text-xs px-3 py-1 rounded-full">
                    Recommended
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <span className="text-sm font-medium text-gray-700 flex-1">{feature}</span>
                    <div className={`ml-4 ${
                      tool === 'FlowSight' && comparison.features[feature as keyof typeof comparison.features][toolIndex] === '✅' ? 'text-green-600' :
                      tool === 'FlowSight' && comparison.features[feature as keyof typeof comparison.features][toolIndex] === '❌' ? 'text-red-600' :
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
        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Insight</h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              FlowSight is the only tool that combines <strong>privacy</strong> + <strong>automatic tracking</strong> + <strong>context understanding</strong>.
              Everyone else makes you choose.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
