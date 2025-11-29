'use client'

import { useState, useEffect } from 'react'

interface CostCalculatorProps {
  onClose: () => void
}

export default function CostCalculator({ onClose }: CostCalculatorProps) {
  const [teamSize, setTeamSize] = useState<number>(10)
  const [meetingHours, setMeetingHours] = useState<number>(10)
  const [toolCosts, setToolCosts] = useState<number>(700)

  const [results, setResults] = useState({
    weeklyMeetings: 0,
    monthlyMeetings: 0,
    annualMeetings: 0,
    annualToolCosts: 0,
    totalAnnualCost: 0,
    flowsightSavings: 0
  })

  // Calculate costs when inputs change
  useEffect(() => {
    const weeklyMeetings = (meetingHours / 5) * teamSize // Convert hours to meetings per week
    const monthlyMeetings = weeklyMeetings * 4.33 // Average weeks per month
    const annualMeetings = monthlyMeetings * 12
    const annualToolCosts = toolCosts * 12
    const totalAnnualCost = annualMeetings * 50 + annualToolCosts // Assuming €50/hour for meetings
    const flowsightSavings = totalAnnualCost - (teamSize * 12 * 12) // €12/dev/mo * 12 months

    setResults({
      weeklyMeetings,
      monthlyMeetings,
      annualMeetings,
      annualToolCosts,
      totalAnnualCost,
      flowsightSavings: Math.max(0, flowsightSavings)
    })
  }, [teamSize, meetingHours, toolCosts])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Cost Calculator</h2>
              <p className="text-sm text-gray-600">Calculate your team's traceability costs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Input Fields */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Team Size
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={teamSize}
                onChange={(e) => setTeamSize(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              />
              <p className="text-xs text-gray-500">Number of developers</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Weekly Meeting Hours
              </label>
              <input
                type="number"
                min="0"
                max="40"
                value={meetingHours}
                onChange={(e) => setMeetingHours(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              />
              <p className="text-xs text-gray-500">Hours spent in status meetings</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Monthly Tool Costs
              </label>
              <input
                type="number"
                min="0"
                max="5000"
                value={toolCosts}
                onChange={(e) => setToolCosts(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              />
              <p className="text-xs text-gray-500">Current tool subscription costs</p>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Annual Costs</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Weekly status meetings</span>
                  <span className="font-medium text-gray-900">{results.weeklyMeetings.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monthly meetings</span>
                  <span className="font-medium text-gray-900">{results.monthlyMeetings.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Annual meetings</span>
                  <span className="font-medium text-gray-900">{results.annualMeetings.toFixed(0)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Annual tool costs</span>
                  <span className="font-medium text-gray-900">€{results.annualToolCosts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total annual cost</span>
                  <span className="font-bold text-red-600">€{results.totalAnnualCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-900">FlowSight savings</span>
                  <span className="font-bold text-green-600">€{results.flowsightSavings.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* FlowSight Alternative */}
            <div className="bg-teal-50 rounded-xl p-4 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-teal-900">With FlowSight</h4>
                  <p className="text-sm text-teal-700">€{teamSize * 12}/month for complete traceability</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-teal-600">€{(teamSize * 12 * 12).toLocaleString()}</div>
                  <div className="text-sm text-teal-600">annual cost</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close Calculator
            </button>
            <button className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-200">
              Get Started with FlowSight
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
