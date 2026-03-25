'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import type { RoleView } from '@/lib/types/dashboard'

const roles: { key: RoleView; label: string }[] = [
  { key: 'me', label: 'My Flow' },
  { key: 'team', label: 'Team' },
  { key: 'org', label: 'Org' },
]

export default function RoleToggle() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const currentRole = (searchParams.get('role') as RoleView) || 'team'

  function handleRole(role: RoleView) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('role', role)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex gap-0.5 bg-zinc-100 p-1 rounded-lg">
      {roles.map((r) => (
        <button
          key={r.key}
          onClick={() => handleRole(r.key)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all
            ${currentRole === r.key
              ? 'bg-white text-zinc-800 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700'
            }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  )
}
