'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type TabItem = {
  key: string
  label: string
  href: string
}

type TabsProps = {
  items: TabItem[]
  className?: string
}

export function Tabs({ items, className = '' }: TabsProps) {
  const pathname = usePathname()

  return (
    <div className={`flex gap-1 bg-zinc-100 p-1 rounded-xl ${className}`}>
      {items.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.key}
            href={item.href}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap
              ${isActive
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/50'
              }`}
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
