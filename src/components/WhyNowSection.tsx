export default function WhyNowSection() {
  const reasons = [
    {
      title: "Enterprise Mandate: Zero Surveillance Infrastructure",
      content: "GDPR fines reach 4–6% of annual revenue. CCPA enforcement accelerates. CISOs now require: developer data never leaves corporate infrastructure. FlowSight's local-first architecture eliminates compliance risk entirely.",
      stat: "100% GDPR/CCPA compliant by design"
    },
    {
      title: "On-Device LLMs Now Production-Grade",
      content: "Phi-3 Mini, DeepSeek Coder, FastVLM deliver sub-200ms inference on consumer hardware. ONNX and MLX eliminate cross-platform friction. On-device AI is now viable for enterprise.",
      stat: "10x faster than 2023 alternatives"
    },
    {
      title: "Developer Productivity Is Now Venture-Scale",
      content: "Every major VC targets developer infrastructure. GitHub, Vercel, Linear reached $3B+ valuations. Developer productivity is direct business multiplier. The gap: task visibility + privacy simultaneously (nobody solves both).",
      stat: "$100B+ total developer tools market"
    }
  ]

  return (
    <section className="bg-white section-padding">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-4">
            Why Now: Market Perfect Storm
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Privacy regulation, AI maturity, and developer tools economics align perfectly
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-8 border-l-4 border-teal-500">
              <h3 className="text-2xl font-bold text-navy-900 mb-4">
                {reason.title}
              </h3>
              <p className="text-muted mb-6 leading-relaxed">
                {reason.content}
              </p>
              <div className="text-lg font-bold text-navy-900">
                {reason.stat}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
