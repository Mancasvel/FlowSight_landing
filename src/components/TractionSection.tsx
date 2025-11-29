export default function TractionSection() {
  const stats = [
    {
      stat: "+50",
      label: "Active Developers",
      body: "+10 Engineering Teams in Closed Beta. From startups to enterprise."
    },
    {
      stat: "+85%",
      label: "Task Classification Accuracy",
      body: "Real-time context inference across 500+ developer sessions."
    },
    {
      stat: "4,800",
      label: "Dollars Saved Per Team Annually",
      body: "Tool consolidation + recovered PM time. 42 NPS score. Target: 50+"
    }
  ]

  return (
    <section className="bg-gray-50 section-padding">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Real Traction. Real Impact.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {stats.map((item, index) => (
            <div key={index} className="bg-white rounded-xl p-8 border border-gray-200 text-center shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {item.stat}
              </div>
              <div className="text-xl font-semibold text-gray-700 mb-4">
                {item.label}
              </div>
              <p className="text-gray-600">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
