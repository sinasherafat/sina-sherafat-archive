import { cn } from '@/lib/utils'

/** Structural hairline. Used only where spacing alone cannot establish grouping. */
export function Divider({ className }: { className?: string }) {
  return <hr className={cn('border-0 border-t border-hairline', className)} />
}
