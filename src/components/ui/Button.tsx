'use client'

import { ReactNode, ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'solid' | 'flat' | 'ghost'

const variantStyles: Record<ButtonVariant, string> = {
  solid: 'bg-indigo-600 text-white hover:bg-indigo-700',
  flat: 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200',
  ghost: 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  children: ReactNode
}

export function Button({ variant = 'solid', children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function ButtonGroup({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`flex gap-2 ${className}`}>{children}</div>
}
