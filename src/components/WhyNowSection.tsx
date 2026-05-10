export default function WhyNowSection() {
  const reasons = [
    {
      title: "Regulators and workers reject bossware",
      content:
        "Bossware is a legal and morale liability. FlowSight keeps pixels on the laptop; you publish narratives on purpose.",
      stat: "Privacy posture buyers can defend",
    },
    {
      title: "Vision-language models finally fit on a laptop",
      content:
        "Modern vision-language stacks, ONNX/MLX runtimes, and Apple Silicon mean rich local inference no longer requires shipping pixels to a hyperscaler. FlowSight’s code is open to inspect, so “local” is verifiable, not vaporware.",
      stat: "On device VL, not vaporware",
    },
    {
      title: "Clients still demand receipts",
      content:
        "Remote work still wants receipts without spying. FlowSight is proof of work with worker-owned pixels.",
      stat: "Individuals → clients → platforms",
    },
  ]

  return (
    <section className="bg-white section-padding">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-4">
            Why now: brains, law, and GPUs aligned
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Cognitive burnout is measurable, VL models run locally, and procurement teams need a story that is not spyware.
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
