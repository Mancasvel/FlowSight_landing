'use client'

import { ReactNode, forwardRef } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
  isPressable?: boolean
  onClick?: () => void
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', isPressable, onClick }, ref) => (
    <div
      ref={ref}
      onClick={onClick}
      className={`bg-white rounded-2xl border border-zinc-100 shadow-card p-5
        ${isPressable ? 'cursor-pointer hover:shadow-card-hover transition-shadow' : ''}
        ${className}`}
    >
      {children}
    </div>
  )
)
Card.displayName = 'Card'

function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

export { Card, CardHeader, CardBody }
