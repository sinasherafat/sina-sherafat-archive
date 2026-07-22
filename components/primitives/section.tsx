import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SectionSpacing = 'compact' | 'default' | 'wide'

const spacingClass: Record<SectionSpacing, string> = {
  compact: 'py-8 md:py-12',
  default: 'py-12 md:py-18',
  wide: 'py-16 md:py-24',
}

interface SectionProps {
  as?: ElementType
  spacing?: SectionSpacing
  className?: string
  children: ReactNode
}

/** Vertical page rhythm. Spacing follows the editorial scale, not decoration. */
export function Section({
  as: Tag = 'section',
  spacing = 'default',
  className,
  children,
}: SectionProps) {
  return (
    <Tag className={cn(spacingClass[spacing], className)}>{children}</Tag>
  )
}
