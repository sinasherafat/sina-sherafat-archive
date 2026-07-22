import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MetaProps {
  as?: ElementType
  uppercase?: boolean
  className?: string
  children: ReactNode
}

/**
 * Mono metadata label — dates, status, version, index.
 * Small, tracked, and low-emphasis. Never used for long copy.
 */
export function Meta({
  as: Tag = 'span',
  uppercase = false,
  className,
  children,
}: MetaProps) {
  return (
    <Tag
      className={cn(
        'font-mono text-meta text-text-secondary tracking-[0.04em]',
        uppercase && 'uppercase',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
