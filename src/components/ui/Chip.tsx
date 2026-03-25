'use client'

import { ReactNode } from 'react'

type ChipColor = 'default' | 'success' | 'warning' | 'danger' | 'primary'

const colorMap: Record<ChipColor, string> = {
  default: 'bg-zinc-100 text-zinc-600',
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  danger: 'bg-red-50 text-red-600',
  primary: 'bg-indigo-50 text-indigo-600',
}

type ChipProps = {
  children: ReactNode
  color?: ChipColor
  className?: string
}

export function Chip({ children, color = 'default', className = '' }: ChipProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[color]} ${className}`}>
      {children}
    </span>
  )
}
