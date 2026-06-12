'use client'

import { ReactNode, useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

type TooltipProps = {
  content: ReactNode
  children: ReactNode
  className?: string
  /** Wider panel for multi-section explanations (e.g. flow score math). */
  wide?: boolean
}

export function Tooltip({ content, children, className = '', wide = false }: TooltipProps) {
  const [show, setShow] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number; place: 'top' | 'bottom' } | null>(
    null
  )
  const triggerRef = useRef<HTMLSpanElement>(null)

  const updatePosition = useCallback(() => {
    const el = triggerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const place = rect.top < 80 ? 'bottom' : 'top'
    const top = place === 'top' ? rect.top - 8 : rect.bottom + 8
    const left = rect.left + rect.width / 2
    setCoords({ top, left, place })
  }, [])

  useEffect(() => {
    if (!show) return
    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [show, updatePosition])

  const popup =
    show && coords
      ? createPortal(
          <div
            role="tooltip"
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              transform: coords.place === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
            }}
            className={`z-[9999] px-3 py-2 text-xs text-white bg-zinc-800 rounded-lg shadow-lg whitespace-normal pointer-events-none ${
              wide ? 'max-w-[min(100vw-24px,380px)]' : 'max-w-[260px]'
            }`}
          >
            {content}
          </div>,
          document.body
        )
      : null

  return (
    <span
      ref={triggerRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {popup}
    </span>
  )
}
