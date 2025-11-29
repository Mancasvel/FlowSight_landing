export default function PricingSection() {
  const pricing = [
    {
      tier: "Basic",
      price: "€12/dev/mo",
      features: {
        "Task Traceability": "Local only",
        "Local Storage": "7 days",
        "PM Dashboard": "Not available",
        "Context Intelligence": "Basic (rules)",
        "Integrations": "None",
        "Max Team Size": "10 devs",
        "SSO (SAML)": "No",
        "Cloud Sync": "Not available",
        "Dedicated Support": "Community"
      },
      cta: "Create Free Account",
      ctaClass: "btn-outline"
    },
    {
      tier: "Pro",
      price: "€19/dev/mo",
      features: {
        "Task Traceability": "Full + cloud sync",
        "Local Storage": "90 days",
        "PM Dashboard": "Real-time context",
        "Context Intelligence": "Full (LLM+RAG)",
        "Integrations": "Jira, Linear, GitHub",
        "Max Team Size": "Unlimited",
        "SSO (SAML)": "No",
        "Cloud Sync": "Optional (encrypted)",
        "Dedicated Support": "Email"
      },
      cta: "Start 14-Day Trial",
      ctaClass: "btn-primary",
      popular: true
    },
    {
      tier: "Enterprise",
      price: "Custom",
      features: {
        "Task Traceability": "Full + API",
        "Local Storage": "Unlimited",
        "PM Dashboard": "Real-time + custom",
        "Context Intelligence": "Full + custom training",
        "Integrations": "All + custom",
        "Max Team Size": "Unlimited",
        "SSO (SAML)": "Yes",
        "Cloud Sync": "Required + compliant",
        "Dedicated Support": "Slack + engineer"
      },
      cta: "Contact Sales",
      ctaClass: "text-navy-900 hover:text-navy-700 font-medium underline"
    }
  ]

  const features = Object.keys(pricing[0].features)

  return (
    <section className="bg-gray-50 section-padding" id="pricing">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Pricing That Makes Sense
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start free, scale as you grow. No hidden fees, no surprise bills.
          </p>
        </div>

        {/* Pricing - Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-6 font-bold text-gray-900">Feature</th>
                {pricing.map((tier, index) => (
                  <th key={index} className="text-center p-6">
                    <div className="space-y-2">
                      <div className="text-lg font-bold text-gray-900">{tier.tier}</div>
                      <div className="text-2xl font-bold text-teal-600">{tier.price}</div>
                      {tier.popular && (
                        <div className="text-xs bg-teal-500 text-white px-2 py-1 rounded-full">
                          Most Popular
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, featureIndex) => (
                <tr key={feature} className={featureIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-6 font-medium text-gray-900">{feature}</td>
                  {pricing.map((tier, tierIndex) => (
                    <td key={tierIndex} className="p-6 text-center text-gray-600">
                      {tier.features[feature as keyof typeof tier.features]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing - Mobile Cards */}
        <div className="lg:hidden space-y-6">
          {pricing.map((tier, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  <h3 className="text-xl font-bold text-gray-900 mr-3">{tier.tier}</h3>
                  {tier.popular && (
                    <div className="text-xs bg-teal-500 text-white px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                </div>
                <div className="text-3xl font-bold text-teal-600 mb-4">{tier.price}</div>
              </div>

              <div className="space-y-3 mb-6">
                {features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-sm font-medium text-gray-700">{feature}</span>
                    <span className="text-sm text-gray-600">{tier.features[feature as keyof typeof tier.features]}</span>
                  </div>
                ))}
              </div>

              <button className={tier.ctaClass + " w-full"}>
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* CTA Buttons - Desktop Only */}
        <div className="hidden lg:flex justify-center gap-4 mt-12">
          {pricing.map((tier, index) => (
            <button key={index} className={tier.ctaClass}>
              {tier.cta}
            </button>
          ))}
        </div>

        {/* Pricing Note */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Annual billing available—save 20%. Volume discounts for teams 500+.
          </p>
        </div>
      </div>
    </section>
  )
}
