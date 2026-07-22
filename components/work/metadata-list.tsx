import { Meta } from '@/components/primitives/meta'
import { cn } from '@/lib/utils'

export interface MetadataItem {
  label: string
  value: string
}

/**
 * Key/value metadata. Stacks above content on mobile; can occupy a narrow
 * left rail on desktop via the parent layout.
 */
export function MetadataList({
  items,
  className,
}: {
  items: MetadataItem[]
  className?: string
}) {
  return (
    <dl className={cn('flex flex-col gap-4', className)}>
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1">
          <Meta as="dt" uppercase>
            {item.label}
          </Meta>
          <dd className="text-small text-text-primary">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
