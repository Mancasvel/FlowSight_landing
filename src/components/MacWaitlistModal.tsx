'use client'

import { useState } from 'react'
import { Apple, Bell } from 'lucide-react'
import { Modal, ModalBody, ModalHeader } from '@/components/ui/Modal'

type MacWaitlistModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function MacWaitlistModal({ isOpen, onClose }: MacWaitlistModalProps) {
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
      const response = await fetch('/api/mac-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'download-section' }),
      })

      const data = await response.json()

      if (response.ok || response.status === 200) {
        setMessageType('success')
        setMessage(data.message || 'Thanks! We will notify you when the macOS version is ready.')
        setEmail('')
      } else {
        setMessageType('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setMessageType('error')
      setMessage('Connection error. Please check your internet connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setMessage('')
    setMessageType('')
    setEmail('')
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalHeader>
        <div className="flex items-center gap-3 pr-8">
          <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center">
            <Apple className="text-slate-700 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-secondary-navy">macOS version in progress</h3>
            <p className="text-sm text-slate-500">We are building the Apple Silicon release</p>
          </div>
        </div>
      </ModalHeader>

      <ModalBody>
        <p className="text-slate-600 mb-6">
          The macOS agent is not available for download yet. Leave your email and we will notify you as soon as it is ready.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="mac-waitlist-email" className="block text-sm font-medium text-slate-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              id="mac-waitlist-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-secondary-navy placeholder-slate-400 focus:outline-none focus:border-primary-teal focus:ring-1 focus:ring-primary-teal transition-colors"
              placeholder="you@company.com"
              required
              disabled={isLoading || messageType === 'success'}
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-xl text-sm ${
                messageType === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || messageType === 'success'}
            className="w-full py-3 bg-gradient-to-r from-primary-cyan to-primary-teal hover:from-primary-teal hover:to-primary-cyan disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              'Saving...'
            ) : messageType === 'success' ? (
              'You are on the list'
            ) : (
              <>
                <Bell className="w-4 h-4" />
                Notify me when ready
              </>
            )}
          </button>
        </form>
      </ModalBody>
    </Modal>
  )
}
