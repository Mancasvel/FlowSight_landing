'use client'

import { ReactNode } from 'react'

type SkeletonProps = {
  isLoaded: boolean
  children: ReactNode
  className?: string
}

export function Skeleton({ isLoaded, children, className = '' }: SkeletonProps) {
  if (isLoaded) return <>{children}</>

  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-zinc-200 rounded-xl h-full w-full min-h-[40px]" />
    </div>
  )
}

export function SkeletonLine({ width = 'w-full', height = 'h-4' }: { width?: string; height?: string }) {
  return <div className={`animate-pulse bg-zinc-200 rounded ${width} ${height}`} />
}
