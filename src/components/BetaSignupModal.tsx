'use client'

import { useState } from 'react'
import Image from 'next/image'

interface BetaSignupModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function BetaSignupModal({ isOpen, onClose }: BetaSignupModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const response = await fetch('/api/beta-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessageType('success')
        setMessage('Thank you for signing up! We\'ll contact you soon with beta access.')
        setName('')
        setEmail('')

        // Close modal after 3 seconds
        setTimeout(() => {
          onClose()
          setMessage('')
          setMessageType('')
        }, 3000)
      } else {
        setMessageType('error')
        setMessage(data.error || 'An error occurred. Please try again.')
      }
    } catch (error) {
      setMessageType('error')
      setMessage('Connection error. Please check your internet connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-800 shadow-xl transition-all">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-teal-900/50 to-blue-900/50 px-6 py-8">
            <div className="flex items-center space-x-3">
              <Image
                src="/flowsight_sinfondo.png"
                alt="FlowSight Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <div>
                <h3 className="text-xl font-bold text-white">FlowSight Beta</h3>
                <p className="text-sm text-gray-300">Exclusive early access</p>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="text-center mb-6">
              <h4 className="text-lg font-semibold text-white mb-2">
                Join the Exclusive Beta
              </h4>
              <p className="text-sm text-gray-400">
                Be one of the first to try FlowSight and shape the future of work.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 transition-colors"
                  placeholder="Your name"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 transition-colors"
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Message */}
              {message && (
                <div className={`p-3 rounded-lg text-sm ${messageType === 'success'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/25"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </div>
                ) : (
                  'Request Beta Access'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-700">
              <p className="text-xs text-gray-400 text-center">
                Your information is secure and will never be shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
