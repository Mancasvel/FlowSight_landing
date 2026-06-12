'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  FileBarChart,
  Settings,
  Menu,
  X,
  ChevronsUpDown,
  Sparkles,
  LayoutDashboard,
  ChevronDown,
  Minus,
  Plus,
} from 'lucide-react'
import { useCoachChat } from '@/components/dashboard/CoachChatProvider'
import { formatCoachChatRelativeTime } from '@/lib/coachChat/formatRelativeTime'
import { useState, useEffect, useCallback } from 'react'
import { Avatar } from '@/components/ui'

type TeamOption = { id: string; name: string }

type SidebarProps = {
  displayName: string
  avatarUrl: string | null
  role: 'pm' | 'worker'
  teams: TeamOption[]
  activeTeamId: string | null
  personalizedDashboardTitle?: string | null
  hasPersonalizedDashboard?: boolean
}

const staticMenuItems = [
  { href: '/dashboard/reports', label: 'Team Report', icon: FileBarChart },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
] as const

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + '/')
}

function TeamSelector({
  teams,
  activeTeamId,
  onSwitch,
}: {
  teams: TeamOption[]
  activeTeamId: string | null
  onSwitch: (teamId: string) => void
}) {
  const [open, setOpen] = useState(false)
  const activeTeam = teams.find((t) => t.id === activeTeamId) ?? teams[0]

  return (
    <div className="relative">
      <p className="mb-2 px-1 text-[11px] font-medium tracking-wide text-zinc-400">Team</p>
      <button
        type="button"
        onClick={() => teams.length > 1 && setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 rounded-lg border border-zinc-200
          bg-white px-3 py-2.5 text-left transition-colors
          ${teams.length > 1 ? 'hover:bg-zinc-50' : ''}`}
      >
        <span className="truncate text-sm font-medium text-zinc-800">
          {activeTeam?.name ?? 'Select team'}
        </span>
        {teams.length > 1 && <ChevronsUpDown size={15} className="shrink-0 text-zinc-400" />}
      </button>

      {open && teams.length > 1 && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 top-full z-[70] mt-1.5 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
            {teams.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onSwitch(t.id)
                  setOpen(false)
                }}
                className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                  t.id === activeTeamId
                    ? 'bg-zinc-100 font-medium text-zinc-900'
                    : 'text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function AiCoachNavItem({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate?: () => void
}) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const {
    conversations,
    activeConversationId,
    selectConversation,
    startNewConversation,
  } = useCoachChat()

  const isActive = pathname === '/dashboard'
  const pastChats = conversations.filter((c) => c.messages.length > 0)
  const hasChats = pastChats.length > 0

  async function openChat(conversationId?: string) {
    if (conversationId) await selectConversation(conversationId)
    else await startNewConversation()
    router.push('/dashboard')
    onNavigate?.()
  }

  return (
    <li>
      <div
        className={`group flex items-center rounded-lg transition-colors ${
          isActive ? 'bg-zinc-100' : 'hover:bg-zinc-50'
        }`}
      >
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className={`flex min-w-0 flex-1 items-center gap-2.5 py-2 pl-3 pr-1 text-sm ${
            isActive ? 'font-medium text-zinc-900' : 'font-medium text-zinc-600 group-hover:text-zinc-900'
          }`}
        >
          <Sparkles size={17} strokeWidth={1.75} className="shrink-0 text-zinc-400" />
          <span className="truncate">AI Coach</span>
        </Link>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex shrink-0 items-center self-stretch px-3 py-2 text-zinc-400 transition-colors hover:text-zinc-600"
          aria-label={expanded ? 'Close chat history' : 'Open chat history'}
          aria-expanded={expanded}
        >
          {expanded ? (
            <Minus size={15} strokeWidth={2} />
          ) : (
            <ChevronDown size={15} strokeWidth={1.75} />
          )}
        </button>
      </div>

      {expanded && (
        <ul className="mt-1 space-y-0.5 border-l border-zinc-100 pl-3 ml-5">
          <li>
            <button
              type="button"
              onClick={() => openChat()}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[13px] text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-800"
            >
              <Plus size={14} strokeWidth={1.75} className="shrink-0" />
              New chat
            </button>
          </li>
          {hasChats ? (
            pastChats.map((chat) => {
              const selected = isActive && activeConversationId === chat.id
              return (
                <li key={chat.id}>
                  <button
                    type="button"
                    onClick={() => openChat(chat.id)}
                    className={`w-full rounded-md px-2.5 py-2 text-left transition-colors ${
                      selected
                        ? 'bg-zinc-100 text-zinc-900'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                    }`}
                  >
                    <p className="truncate text-[13px] font-medium">{chat.title}</p>
                    <p className="mt-0.5 text-[11px] text-zinc-400">
                      {formatCoachChatRelativeTime(chat.updatedAt)}
                    </p>
                  </button>
                </li>
              )
            })
          ) : (
            <li className="px-2.5 py-2 text-[12px] text-zinc-400">No chats yet</li>
          )}
        </ul>
      )}
    </li>
  )
}

function DrawerContent({
  displayName,
  avatarUrl,
  role,
  teams,
  activeTeamId,
  personalizedDashboardTitle,
  hasPersonalizedDashboard,
  pathname,
  onNavigate,
  onSwitchTeam,
}: SidebarProps & {
  pathname: string
  onNavigate?: () => void
  onSwitchTeam: (teamId: string) => void
}) {
  const dashboardItems = hasPersonalizedDashboard
    ? [
        {
          href: '/account/my-dashboard',
          label: personalizedDashboardTitle ?? 'My Dashboard',
          icon: LayoutDashboard,
        },
      ]
    : []

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-100/80 px-5 py-5">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="text-base font-semibold tracking-tight text-zinc-900 hover:text-zinc-600 transition-colors"
        >
          FlowSight
        </Link>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto px-5 py-6">
        <TeamSelector teams={teams} activeTeamId={activeTeamId} onSwitch={onSwitchTeam} />

        <nav className="space-y-6">
          <div>
            <p className="mb-3 px-1 text-[11px] font-medium tracking-wide text-zinc-400">Main</p>
            <ul className="space-y-1">
              <AiCoachNavItem pathname={pathname} onNavigate={onNavigate} />
              {dashboardItems.map((item) => {
                const Icon = item.icon
                const active = isActive(pathname, item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                        active
                          ? 'bg-zinc-100 font-medium text-zinc-900'
                          : 'font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                      }`}
                    >
                      <Icon size={17} strokeWidth={1.75} className="shrink-0 text-zinc-400" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <p className="mb-3 px-1 text-[11px] font-medium tracking-wide text-zinc-400">Menu</p>
            <ul className="space-y-1">
              {staticMenuItems.map((item) => {
                const Icon = item.icon
                const active = isActive(pathname, item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                        active
                          ? 'bg-zinc-100 font-medium text-zinc-900'
                          : 'font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                      }`}
                    >
                      <Icon size={17} strokeWidth={1.75} className="shrink-0 text-zinc-400" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>
      </div>

      <div className="border-t border-zinc-100 px-5 py-4">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-zinc-50">
          <Avatar src={avatarUrl || undefined} name={displayName} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-800">{displayName}</p>
            <p className="text-[11px] text-zinc-400">{role === 'pm' ? 'Project Manager' : 'Member'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardSidebar({
  displayName,
  avatarUrl,
  role,
  teams,
  activeTeamId,
  personalizedDashboardTitle,
  hasPersonalizedDashboard,
}: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleSwitchTeam = useCallback(
    (teamId: string) => {
      document.cookie = `flowsight_active_team=${teamId};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`
      router.refresh()
    },
    [router]
  )

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center gap-3 border-b border-zinc-200/60
          bg-white/75 px-4 backdrop-blur-md sm:px-6"
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-700
            transition-colors hover:bg-zinc-100"
          aria-label="Open menu"
        >
          <Menu size={22} strokeWidth={1.75} />
        </button>
        <Link
          href="/dashboard"
          className="text-sm font-semibold tracking-tight text-zinc-900 hover:text-zinc-600 transition-colors"
        >
          FlowSight
        </Link>
      </header>

      <div
        className={`fixed inset-0 z-50 bg-zinc-900/15 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-[min(300px,88vw)] flex-col bg-white font-sans shadow-2xl
          transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-end px-4 pt-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400
              transition-colors hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Close menu"
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>
        <div className="-mt-2 flex flex-1 flex-col overflow-hidden pb-2">
          <DrawerContent
            displayName={displayName}
            avatarUrl={avatarUrl}
            role={role}
            teams={teams}
            activeTeamId={activeTeamId}
            personalizedDashboardTitle={personalizedDashboardTitle}
            hasPersonalizedDashboard={hasPersonalizedDashboard}
            pathname={pathname}
            onNavigate={() => setOpen(false)}
            onSwitchTeam={handleSwitchTeam}
          />
        </div>
      </aside>
    </>
  )
}
