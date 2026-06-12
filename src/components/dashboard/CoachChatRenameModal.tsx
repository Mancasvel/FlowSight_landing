'use client'

import { useEffect, useId, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { DialogButton } from '@/components/ui/ElegantDialog'

type Props = {
  open: boolean
  title: string
  onClose: () => void
  onConfirm: (title: string) => void
}

export default function CoachChatRenameModal({ open, title, onClose, onConfirm }: Props) {
  const [draft, setDraft] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()

  useEffect(() => {
    if (open) setDraft(title)
  }, [open, title])

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 50)
    return () => window.clearTimeout(t)
  }, [open])

  function handleSave() {
    const trimmed = draft.trim()
    if (!trimmed) return
    onConfirm(trimmed)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          inputRef.current?.focus()
          inputRef.current?.select()
        }}
      >
        <DialogHeader>
          <DialogTitle>Rename chat</DialogTitle>
          <DialogDescription>
            Choose a name that helps you find this conversation later.
          </DialogDescription>
        </DialogHeader>

        <div className="px-5 py-3">
          <label htmlFor={inputId} className="sr-only">
            Chat title
          </label>
          <input
            id={inputId}
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSave()
              }
            }}
            maxLength={80}
            placeholder="Chat title"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-sans text-[14px] text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/5"
          />
        </div>

        <DialogFooter>
          <DialogButton onClick={onClose}>Cancel</DialogButton>
          <DialogButton variant="primary" disabled={!draft.trim()} onClick={handleSave}>
            Save
          </DialogButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
