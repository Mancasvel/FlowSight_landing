'use client'

import { ReactNode } from 'react'

export function Table({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${className}`}>{children}</table>
    </div>
  )
}

export function TableHeader({ children }: { children: ReactNode }) {
  return <thead>{children}</thead>
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-zinc-100">{children}</tbody>
}

export function TableRow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <tr className={`hover:bg-zinc-50 transition-colors ${className}`}>{children}</tr>
}

export function TableColumn({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <th className={`text-left text-xs font-medium text-zinc-500 uppercase tracking-wider py-3 px-4 ${className}`}>
      {children}
    </th>
  )
}

export function TableCell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <td className={`py-3 px-4 text-sm text-zinc-700 ${className}`}>{children}</td>
}
