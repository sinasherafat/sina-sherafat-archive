import Image from 'next/image'
import type { AssetRef } from '@/lib/content/types'
import { Meta } from '@/components/primitives/meta'
import { cn } from '@/lib/utils'

interface ImageBlockProps {
  asset: AssetRef
  sizes?: string
  className?: string
  priority?: boolean
  rounded?: boolean
}

/**
 * Figure with dimensions, alt text, and optional caption. Monochrome treatment
 * is applied only where the Design System calls for it (index/archive contexts).
 */
export function ImageBlock({
  asset,
  sizes = '(min-width: 920px) 920px, 100vw',
  className,
  priority,
  rounded = false,
}: ImageBlockProps) {
  return (
    <figure className={cn('flex flex-col gap-3', className)}>
      <div
        className={cn(
          'overflow-hidden border border-hairline bg-surface',
          rounded && 'rounded-md',
        )}
      >
        <Image
          src={asset.src || '/placeholder.svg'}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          sizes={sizes}
          priority={priority ?? asset.priority}
          className={cn(
            'h-auto w-full',
            asset.treatment === 'mono' && 'grayscale',
          )}
        />
      </div>
      {asset.caption && (
        <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-small text-text-secondary text-pretty">
            {asset.caption}
          </span>
          {asset.credit && <Meta>{asset.credit}</Meta>}
        </figcaption>
      )}
    </figure>
  )
}
