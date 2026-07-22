import type { ReactNode } from 'react'
import { Container } from '@/components/primitives/container'
import { Meta } from '@/components/primitives/meta'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  /** Small mono eyebrow that names the page. */
  eyebrow?: string
  title: string
  intro?: ReactNode
  width?: 'standard' | 'reading' | 'wide'
  className?: string
}

/** Page opening: names the page and establishes its purpose with minimal copy. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  width = 'standard',
  className,
}: PageHeaderProps) {
  return (
    <Container width={width} className={cn('pt-12 md:pt-20', className)}>
      <div className="archive-enter">
        {eyebrow && (
          <Meta uppercase className="mb-4 block">
            {eyebrow}
          </Meta>
        )}
        <h1 className="text-h1 font-medium text-balance text-text-primary">
          {title}
        </h1>
        {intro && (
          <div className="mt-5 max-w-reading text-body-lg text-text-secondary text-pretty">
            {intro}
          </div>
        )}
      </div>
    </Container>
  )
}
