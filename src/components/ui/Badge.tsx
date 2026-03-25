'use client'

import { ReactNode } from 'react'

type BadgeProps = {
  content?: string | number
  color?: 'success' | 'warning' | 'danger' | 'primary'
  children: ReactNode
}

const dotColor: Record<string, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  primary: 'bg-indigo-500',
}

export function Badge({ content, color = 'primary', children }: BadgeProps) {
  return (
    <div className="relative inline-flex">
      {children}
      {content !== undefined ? (
        <span className={`absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px]
          px-1 rounded-full text-[10px] font-bold text-white ${dotColor[color]}`}>
          {content}
        </span>
      ) : (
        <span className={`absolute top-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${dotColor[color]}`} />
      )}
    </div>
  )
}
