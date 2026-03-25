'use client'

import { Tabs, Avatar, Badge } from '@/components/ui'
import RoleToggle from './RoleToggle'

type NavBarProps = {
  displayName: string
  avatarUrl: string | null
  role: string
}

const tabItems = [
  { key: 'flow-state', label: 'Flow State', href: '/dashboard/flow-state' },
  { key: 'context-load', label: 'Context & Load', href: '/dashboard/context-load' },
  { key: 'planning', label: 'Planning', href: '/dashboard/planning' },
  { key: 'meetings', label: 'Meetings', href: '/dashboard/meetings' },
]

export default function NavBar({ displayName, avatarUrl, role }: NavBarProps) {
  return (
    <nav className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
        <Tabs items={tabItems} />
      </div>
      <div className="flex items-center gap-3 self-end sm:self-auto">
        <RoleToggle />
        <div className="flex items-center gap-2.5">
          <Badge color={role === 'pm' ? 'primary' : 'success'}>
            <Avatar src={avatarUrl} name={displayName} size="sm" />
          </Badge>
          <span className="text-sm text-zinc-500 hidden xl:inline">{displayName}</span>
        </div>
      </div>
    </nav>
  )
}
