import { STATUS_LABELS, type ProjectStatus } from '@/lib/content/types'
import { cn } from '@/lib/utils'

/** Status is information, not decoration. Plain mono text, optional hairline. */
export function StatusLabel({
  status,
  enclosed = false,
  className,
}: {
  status: ProjectStatus
  enclosed?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'font-mono text-meta uppercase tracking-[0.04em] text-text-secondary',
        enclosed && 'border border-hairline px-2 py-0.5',
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
