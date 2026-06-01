'use client'

import { useState } from 'react'
import { Bell, Download, Monitor, Terminal } from 'lucide-react'
import { Modal, ModalBody, ModalHeader } from '@/components/ui/Modal'

export type DownloadUpdateSource = 'download-windows' | 'download-linux-deb' | 'download-linux-appimage'

type DownloadUpdatesModalProps = {
  isOpen: boolean
  onClose: () => void
  source: DownloadUpdateSource
}

const PLATFORM_COPY: Record<
  DownloadUpdateSource,
  { title: string; subtitle: string; icon: typeof Monitor }
> = {
  'download-windows': {
    title: 'Your Windows download is starting',
    subtitle: 'FlowSight for Windows',
    icon: Monitor,
  },
  'download-linux-deb': {
    title: 'Your Linux download is starting',
    subtitle: 'FlowSight .deb package',
    icon: Terminal,
  },
  'download-linux-appimage': {
    title: 'Your Linux download is starting',
    subtitle: 'FlowSight AppImage',
    icon: Terminal,
  },
}

export function DownloadUpdatesModal({ isOpen, onClose, source }: DownloadUpdatesModalProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  const copy = PLATFORM_COPY[source]
  const Icon = copy.icon

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const response = await fetch('/api/download-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })

      const data = await response.json()

      if (response.ok || response.status === 200) {
        setMessageType('success')
        setMessage(data.message || 'Thanks! We will keep you posted on FlowSight updates.')
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
    setEmail('')
    setMessage('')
    setMessageType('')
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalHeader>
        <div className="flex items-center gap-3 pr-8">
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center">
            <Download className="text-emerald-600 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-secondary-navy">{copy.title}</h3>
            <p className="text-sm text-slate-500">{copy.subtitle}</p>
          </div>
        </div>
      </ModalHeader>

      <ModalBody>
        <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-slate-50 border border-slate-200">
          <Icon className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-600">
            Check your browser downloads if the file does not appear automatically. Want product updates,
            new releases, and tips? Leave your email below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="download-updates-email" className="block text-sm font-medium text-slate-700 mb-1">
              Email for FlowSight updates <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="email"
              id="download-updates-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-secondary-navy placeholder-slate-400 focus:outline-none focus:border-primary-teal focus:ring-1 focus:ring-primary-teal transition-colors"
              placeholder="you@company.com"
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

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isLoading || messageType === 'success' || !email.trim()}
              className="flex-1 py-3 bg-gradient-to-r from-primary-cyan to-primary-teal hover:from-primary-teal hover:to-primary-cyan disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                'Saving...'
              ) : messageType === 'success' ? (
                'Subscribed'
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  Get updates
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 text-secondary-navy font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              {messageType === 'success' ? 'Close' : 'No thanks, just download'}
            </button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  )
}
