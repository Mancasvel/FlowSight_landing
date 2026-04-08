'use client'

import { ReactNode, useState, useRef, useEffect } from 'react'

type TooltipProps = {
  content: ReactNode
  children: ReactNode
  className?: string
  /** Wider panel for multi-section explanations (e.g. flow score math). */
  wide?: boolean
}

export function Tooltip({ content, children, className = '', wide = false }: TooltipProps) {
  const [show, setShow] = useState(false)
  const [position, setPosition] = useState<'top' | 'bottom'>('top')
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (show && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition(rect.top < 80 ? 'bottom' : 'top')
    }
  }, [show])

  return (
    <div
      ref={triggerRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className={`absolute z-50 px-3 py-2 text-xs text-white bg-zinc-800 
            rounded-lg shadow-lg whitespace-normal pointer-events-none
            ${wide ? 'max-w-[min(100vw-24px,380px)]' : 'max-w-[260px]'}
            ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-1/2 -translate-x-1/2`}
        >
          {content}
        </div>
      )}
    </div>
  )
}
