'use client'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import BetaSignupModal from '@/components/BetaSignupModal'
import { useBetaModal } from '@/hooks/useBetaModal'

export default function PricingPage() {
  const { isOpen, openModal, closeModal } = useBetaModal()
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
      ctaClass: "border-2 border-slate-600 text-gray-300 hover:border-teal-500 hover:text-teal-400 font-semibold px-6 py-3 rounded-xl transition-all duration-200"
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
      ctaClass: "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/25",
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
      ctaClass: "border-2 border-slate-600 text-gray-300 hover:border-teal-500 hover:text-teal-400 font-semibold px-6 py-3 rounded-xl transition-all duration-200"
    }
  ]

  const features = Object.keys(pricing[0].features)

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 sm:pb-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 container-max px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-10 md:mb-16">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Pricing That Makes Sense
              </h1>
              <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4">
                Start free, scale as you grow. No hidden fees, no surprise bills.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing - Desktop Table */}
        <section className="pb-16 sm:pb-24">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-sm border border-slate-700">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-6 font-bold text-white">Feature</th>
                    {pricing.map((tier, index) => (
                      <th key={index} className="text-center p-6">
                        <div className="space-y-2">
                          <div className="text-lg font-bold text-white">{tier.tier}</div>
                          <div className="text-2xl font-bold text-teal-400">{tier.price}</div>
                          {tier.popular && (
                            <div className="text-xs bg-teal-500 text-white px-2 py-1 rounded-full inline-block">
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
                    <tr key={feature} className={featureIndex % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-800/50'}>
                      <td className="p-6 font-medium text-white">{feature}</td>
                      {pricing.map((tier, tierIndex) => (
                        <td key={tierIndex} className="p-6 text-center text-gray-400">
                          {tier.features[feature as keyof typeof tier.features]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pricing - Mobile Cards */}
            <div className="lg:hidden space-y-4 sm:space-y-6">
              {pricing.map((tier, index) => (
                <div key={index} className={`bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border ${tier.popular ? 'border-teal-500' : 'border-slate-700'} p-4 sm:p-6`}>
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="flex items-center justify-center mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-white mr-2 sm:mr-3">{tier.tier}</h3>
                      {tier.popular && (
                        <div className="text-xs bg-teal-500 text-white px-2 sm:px-3 py-1 rounded-full">
                          Most Popular
                        </div>
                      )}
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-teal-400 mb-3 sm:mb-4">{tier.price}</div>
                  </div>

                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex justify-between items-center py-1.5 sm:py-2 border-b border-slate-700 last:border-b-0">
                        <span className="text-xs sm:text-sm font-medium text-gray-300">{feature}</span>
                        <span className="text-xs sm:text-sm text-gray-400 text-right ml-2">{tier.features[feature as keyof typeof tier.features]}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={tier.cta !== "Contact Sales" ? openModal : undefined}
                    className={tier.ctaClass + " w-full text-sm sm:text-base"}
                  >
                    {tier.cta}
                  </button>
                </div>
              ))}
            </div>

            {/* CTA Buttons - Desktop Only */}
            <div className="hidden lg:flex justify-center gap-4 mt-12">
              {pricing.map((tier, index) => (
                <button
                  key={index}
                  onClick={tier.cta !== "Contact Sales" ? openModal : undefined}
                  className={tier.ctaClass}
                >
                  {tier.cta}
                </button>
              ))}
            </div>

            {/* Pricing Note */}
            <div className="text-center mt-6 sm:mt-8 px-4">
              <p className="text-sm sm:text-base text-gray-400">
                Annual billing available—save 20%. Volume discounts for teams 500+.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-24 bg-slate-900/50">
          <div className="container-max px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-slate-800/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Can I change plans anytime?</h3>
                <p className="text-gray-400">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Is there a free trial?</h3>
                <p className="text-gray-400">Yes, we offer a 14-day free trial for all paid plans with full access to all features.</p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">What payment methods do you accept?</h3>
                <p className="text-gray-400">We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Do you offer discounts for teams?</h3>
                <p className="text-gray-400">Yes, we offer volume discounts for teams of 10 or more. Contact our sales team for details.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Beta Signup Modal */}
      <BetaSignupModal isOpen={isOpen} onClose={closeModal} />

      <Footer />
    </>
  )
}
