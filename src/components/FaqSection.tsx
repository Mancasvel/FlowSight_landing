'use client'

import { useState } from 'react'

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "Is this just another time tracking tool?",
      answer: "No. Time tracking tools (Clockify, Toggl) are invasive and capture raw activity. FlowSight infers task context automatically—you never enter time manually, and developers never feel surveilled. It's the inverse of traditional time tracking."
    },
    {
      question: "Does FlowSight collect my code or screenshots?",
      answer: "No. 100% of processing on your local machine. We never capture screenshots, code, logs, or raw activity. Only task inference results leave your machine (and only if you enable cloud sync). You always have control."
    },
    {
      question: "How is this different from Jira / Linear dashboards?",
      answer: "Jira and Linear rely on manual task updates. Developers forget to update status, so dashboards are 24 hours behind reality. FlowSight automatically infers task context in real-time. If developer is working on TASK-482, we know it instantly."
    },
    {
      question: "What are the hardware requirements?",
      answer: "Minimal. ~200MB RAM at rest, 500MB peak. CPU <5% idle, 30% peak. Optimized for MacBook Air M2 and mid-range Windows/Linux laptops. Tested on 4GB minimum RAM systems."
    },
    {
      question: "Can we run this entirely offline?",
      answer: "Yes. Free and Pro tiers run 100% offline. No internet required. Cloud sync is opt-in—you enable explicitly. Default: zero cloud access."
    },
    {
      question: "How accurate is the AI context inference?",
      answer: "MVP targets 80-85% accuracy. By month 3-6, with feedback loops, accuracy reaches 90%+. Early accuracy is conservative (better to miss some than have false positives)."
    },
    {
      question: "How do you handle compliance (GDPR, CCPA, HIPAA)?",
      answer: "Since FlowSight never accesses sensitive data, compliance is automatic by architecture. SOC 2 Type II audit planned Q2 2026. For regulated industries, enterprise deployments support private infrastructure."
    },
    {
      question: "Which tools integrate with FlowSight?",
      answer: "Native integrations: Jira, Linear, GitHub, Slack. Custom webhooks via REST API for any tool. We integrate into your existing stack without replacing it."
    }
  ]

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="bg-gray-50 section-padding">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Everything you need to know about FlowSight
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-navy-900 pr-4">
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-5 h-5 text-navy-500 transform transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-muted leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
