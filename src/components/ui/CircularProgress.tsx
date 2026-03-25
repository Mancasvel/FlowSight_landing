'use client'

import { ReactNode } from 'react'

type CircularProgressProps = {
  value: number
  maxValue?: number
  color?: 'success' | 'warning' | 'danger' | 'primary'
  size?: 'sm' | 'md' | 'lg'
  children?: ReactNode
  className?: string
}

const colorStroke: Record<string, string> = {
  success: '#22c55e',
  warning: '#eab308',
  danger: '#ef4444',
  primary: '#4361ee',
}

const sizeMap = { sm: 64, md: 96, lg: 140 }
const strokeMap = { sm: 4, md: 6, lg: 8 }

export function CircularProgress({
  value,
  maxValue = 100,
  color = 'primary',
  size = 'md',
  children,
  className = '',
}: CircularProgressProps) {
  const dim = sizeMap[size]
  const stroke = strokeMap[size]
  const radius = (dim - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(value / maxValue, 1)
  const offset = circumference * (1 - pct)

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: dim, height: dim }}>
      <svg width={dim} height={dim} className="-rotate-90">
        <circle cx={dim / 2} cy={dim / 2} r={radius} fill="none" stroke="#e4e4e7" strokeWidth={stroke} />
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke={colorStroke[color]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}
