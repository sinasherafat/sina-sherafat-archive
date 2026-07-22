import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ContainerWidth = 'shell' | 'wide' | 'standard' | 'reading' | 'compact'

const widthClass: Record<ContainerWidth, string> = {
  shell: 'max-w-shell',
  wide: 'max-w-wide',
  standard: 'max-w-standard',
  reading: 'max-w-reading',
  compact: 'max-w-compact',
}

interface ContainerProps {
  as?: ElementType
  width?: ContainerWidth
  className?: string
  children: ReactNode
}

/**
 * Horizontal reading frame with responsive outer margins that match the grid
 * system (12px mobile, 16px tablet, 20–24px desktop). Content shares a left axis.
 */
export function Container({
  as: Tag = 'div',
  width = 'standard',
  className,
  children,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full px-3 md:px-4 lg:px-5',
        widthClass[width],
        className,
      )}
    >
      {children}
    </Tag>
  )
}
