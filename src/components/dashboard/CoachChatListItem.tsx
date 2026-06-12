'use client'

import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { formatCoachChatRelativeTime } from '@/lib/coachChat/formatRelativeTime'
import type { CoachConversation } from '@/lib/coachChat/types'

type Props = {
  chat: CoachConversation
  selected: boolean
  onOpen: () => void
  onRequestRename: () => void
  onRequestDelete: () => void
}

/** Wait for Radix dropdown to fully close before opening a dialog. */
function afterDropdownClose(action: () => void) {
  window.setTimeout(action, 50)
}

export default function CoachChatListItem({
  chat,
  selected,
  onOpen,
  onRequestRename,
  onRequestDelete,
}: Props) {
  return (
    <div
      className={`group flex items-stretch rounded-md transition-colors ${
        selected ? 'bg-zinc-100' : 'hover:bg-zinc-50'
      }`}
    >
      <button type="button" onClick={onOpen} className="min-w-0 flex-1 px-2.5 py-2 text-left">
        <p className="truncate text-[13px] font-medium text-zinc-800">{chat.title}</p>
        <p className="mt-0.5 text-[11px] text-zinc-400">
          {formatCoachChatRelativeTime(chat.updatedAt)}
        </p>
      </button>

      <div className="flex shrink-0 items-center pr-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 outline-none transition-colors hover:bg-zinc-200/70 hover:text-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-300 data-[state=open]:bg-zinc-200/70 data-[state=open]:text-zinc-700"
              aria-label="Chat options"
            >
              <MoreHorizontal size={15} strokeWidth={1.75} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom" collisionPadding={12}>
            <DropdownMenuItem onSelect={() => afterDropdownClose(onRequestRename)}>
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:bg-red-50 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-700"
              onSelect={() => afterDropdownClose(onRequestDelete)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
