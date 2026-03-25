'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Activity, Layers, CalendarClock, Video,
  Settings, Users, FileBarChart, Menu, X, ChevronsUpDown,
} from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { Avatar, Badge } from '@/components/ui'

type TeamOption = { id: string; name: string }

type SidebarProps = {
  displayName: string
  avatarUrl: string | null
  role: 'pm' | 'worker'
  teams: TeamOption[]
  activeTeamId: string | null
}

const analyticsItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/flow-state', label: 'Flow State', icon: Activity },
  { href: '/dashboard/context-load', label: 'Context & Load', icon: Layers },
  { href: '/dashboard/planning', label: 'Planning', icon: CalendarClock },
  { href: '/dashboard/meetings', label: 'Meetings', icon: Video },
]

const managementItems = [
  { href: '/dashboard/team', label: 'Team', icon: Users },
  { href: '/dashboard/reports', label: 'Reports', icon: FileBarChart },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

function isActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href
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

  if (teams.length <= 1) {
    return (
      <div className="px-4 pb-3">
        <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider px-2">
          {activeTeam?.name ?? 'Team'}
        </p>
      </div>
    )
  }

  return (
    <div className="px-3 pb-3 relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl
          bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
      >
        <span className="text-[13px] font-semibold text-zinc-700 truncate">
          {activeTeam?.name ?? 'Select team'}
        </span>
        <ChevronsUpDown size={14} className="text-zinc-400 flex-shrink-0" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-3 right-3 top-full mt-1 z-50 bg-white rounded-xl shadow-lg border border-zinc-100 py-1">
            {teams.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onSwitch(t.id)
                  setOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-[13px] transition-colors
                  ${t.id === activeTeamId
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
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

function SidebarContent({
  displayName,
  avatarUrl,
  role,
  teams,
  activeTeamId,
  pathname,
  onNavigate,
  onSwitchTeam,
}: SidebarProps & { pathname: string; onNavigate?: () => void; onSwitchTeam: (teamId: string) => void }) {
  return (
    <>
      <div className="px-5 pt-5 pb-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5"
          onClick={onNavigate}
        >
          <Image
            src="/flowsight_sinfondo.png"
            alt="FlowSight"
            width={32}
            height={32}
            className="flex-shrink-0"
          />
          <span className="text-base font-semibold text-zinc-900 tracking-tight">
            FlowSight
          </span>
        </Link>
      </div>

      <TeamSelector teams={teams} activeTeamId={activeTeamId} onSwitch={onSwitchTeam} />

      <nav className="flex-1 px-3 space-y-6 overflow-y-auto">
        <div>
          <p className="px-3 pb-1.5 text-[10px] font-semibold text-zinc-300 uppercase tracking-widest">
            Analytics
          </p>
          <ul className="space-y-0.5">
            {analyticsItems.map((item) => {
              const Icon = item.icon
              const active = isActive(pathname, item.href, item.exact)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150
                      ${active
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'
                      }`}
                  >
                    <Icon size={18} strokeWidth={active ? 2 : 1.5} className="flex-shrink-0" />
                    <span className={`text-[13px] ${active ? 'font-semibold' : 'font-medium'}`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div>
          <p className="px-3 pb-1.5 text-[10px] font-semibold text-zinc-300 uppercase tracking-widest">
            Manage
          </p>
          <ul className="space-y-0.5">
            {managementItems.map((item) => {
              const Icon = item.icon
              const active = isActive(pathname, item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150
                      ${active
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'
                      }`}
                  >
                    <Icon size={18} strokeWidth={active ? 2 : 1.5} className="flex-shrink-0" />
                    <span className={`text-[13px] ${active ? 'font-semibold' : 'font-medium'}`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      <div className="border-t border-zinc-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <Badge color="primary">
            <Avatar src={avatarUrl} name={displayName} size="sm" />
          </Badge>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-zinc-700 truncate">{displayName}</p>
            <p className="text-[11px] text-zinc-400">{role === 'pm' ? 'Project Manager' : 'Member'}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default function DashboardSidebar({ displayName, avatarUrl, role, teams, activeTeamId }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleSwitchTeam = useCallback((teamId: string) => {
    document.cookie = `flowsight_active_team=${teamId};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`
    router.refresh()
  }, [router])

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2.5 bg-white rounded-xl shadow-md
          text-zinc-500 hover:text-zinc-700 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div
        className={`lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40
          transition-opacity duration-300
          ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-[280px] bg-white z-50
          flex flex-col shadow-xl transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-end px-4 pt-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <SidebarContent
          displayName={displayName}
          avatarUrl={avatarUrl}
          role={role}
          teams={teams}
          activeTeamId={activeTeamId}
          pathname={pathname}
          onNavigate={() => setMobileOpen(false)}
          onSwitchTeam={handleSwitchTeam}
        />
      </aside>

      <aside className="hidden lg:flex fixed top-0 left-0 z-30 h-screen w-[240px] bg-white border-r border-zinc-100 flex-col">
        <SidebarContent
          displayName={displayName}
          avatarUrl={avatarUrl}
          role={role}
          teams={teams}
          activeTeamId={activeTeamId}
          pathname={pathname}
          onSwitchTeam={handleSwitchTeam}
        />
      </aside>
    </>
  )
}
