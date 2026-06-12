'use client'

import { ReactNode, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  /** Hide the default close-on-backdrop if you need a forced choice */
  dismissOnBackdrop?: boolean
}

export function ElegantDialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  dismissOnBackdrop = true,
}: Props) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => panelRef.current?.focus(), 0)
      return () => window.clearTimeout(t)
    }
  }, [open])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[400]">
      <button
        type="button"
        className="absolute inset-0 bg-zinc-900/10 backdrop-blur-[3px]"
        onClick={dismissOnBackdrop ? onClose : undefined}
        aria-label="Close dialog"
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto relative w-full max-w-[400px] overflow-hidden rounded-xl border border-zinc-200/90 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.12)]"
        >
          <div className="px-5 pt-5 pb-1">
            <h2 id={titleId} className="font-sans text-[15px] font-semibold tracking-tight text-zinc-900">
              {title}
            </h2>
            {description && (
              <div className="mt-1.5 font-sans text-[13px] leading-relaxed text-zinc-500">
                {description}
              </div>
            )}
          </div>

          {children && <div className="px-5 py-3">{children}</div>}

          {footer && (
            <div className="flex items-center justify-end gap-2 border-t border-zinc-100 bg-zinc-50/50 px-5 py-3.5">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

type DialogButtonProps = {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  variant?: 'default' | 'primary' | 'danger'
}

const buttonVariants = {
  default:
    'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300',
  primary: 'bg-zinc-900 border border-zinc-900 text-white hover:bg-zinc-800',
  danger: 'bg-red-600 border border-red-600 text-white hover:bg-red-700',
}

export function DialogButton({
  children,
  onClick,
  type = 'button',
  disabled,
  variant = 'default',
}: DialogButtonProps) {
  return (
    <button
      type={type}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      disabled={disabled}
      className={`rounded-lg px-3.5 py-1.5 font-sans text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${buttonVariants[variant]}`}
    >
      {children}
    </button>
  )
}
