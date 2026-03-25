'use client'

import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, children, className = '' }: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 bg-white border border-zinc-200 rounded-2xl shadow-elevated
        w-full max-w-2xl max-h-[85vh] overflow-y-auto mx-4 ${className}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  )
}

export function ModalHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 pt-6 pb-2 ${className}`}>{children}</div>
}

export function ModalBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>
}
