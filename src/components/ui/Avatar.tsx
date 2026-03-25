'use client'

type AvatarProps = {
  src?: string | null
  name?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-7 h-7 text-[10px]',
  md: 'w-9 h-9 text-xs',
  lg: 'w-12 h-12 text-sm',
}

export function Avatar({ src, name = '', size = 'md', className = '' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover flex-shrink-0 ${sizeClasses[size]} ${className}`}
      />
    )
  }

  return (
    <div
      className={`rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center
        font-medium flex-shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {initials || '?'}
    </div>
  )
}
