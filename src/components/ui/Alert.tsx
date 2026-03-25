'use client'

import { ReactNode, useState } from 'react'
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react'

type AlertColor = 'success' | 'warning' | 'danger' | 'primary'

const alertStyles: Record<AlertColor, { bg: string; border: string; text: string; icon: typeof Info }> = {
  success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: CheckCircle },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: AlertTriangle },
  danger: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: AlertCircle },
  primary: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800', icon: Info },
}

type AlertProps = {
  children: ReactNode
  color?: AlertColor
  dismissible?: boolean
  className?: string
}

export function Alert({ children, color = 'primary', dismissible = true, className = '' }: AlertProps) {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  const style = alertStyles[color]
  const Icon = style.icon

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${style.bg} ${style.border} ${className}`}>
      <Icon size={18} className={`flex-shrink-0 mt-0.5 ${style.text}`} />
      <div className={`flex-1 text-sm ${style.text}`}>{children}</div>
      {dismissible && (
        <button onClick={() => setVisible(false)} className="flex-shrink-0 text-zinc-400 hover:text-zinc-600 transition-colors">
          <X size={14} />
        </button>
      )}
    </div>
  )
}
