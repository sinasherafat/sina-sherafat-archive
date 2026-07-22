import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ArrowUpRightIcon } from './icons'

interface ArchiveLinkProps {
  href: string
  children: ReactNode
  className?: string
  /** External links open in a new tab and show a small indicator. */
  external?: boolean
}

/**
 * Text link that stays identifiable without hover. Internal links use a subtle
 * underline; external links carry a north-east arrow indicator.
 */
export function ArchiveLink({
  href,
  children,
  className,
  external = false,
}: ArchiveLinkProps) {
  const classes = cn(
    'inline-flex items-center gap-1 text-text-primary underline decoration-hairline decoration-1 underline-offset-4',
    'transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:decoration-text-primary',
    className,
  )

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
        <ArrowUpRightIcon className="h-3.5 w-3.5 text-text-secondary" />
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}
