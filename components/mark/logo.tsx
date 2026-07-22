import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/site'

/**
 * Personal mark + wordmark.
 *
 * NOTE: The final artwork is Sina Sherafat's supplied hand-drawn mark. This is a
 * restrained, neutral PLACEHOLDER. Replace the <PlaceholderMark /> SVG below with
 * the supplied mark (or an <img src="/brand/mark.svg" />) — do not redraw it.
 * The mark represents authorship, never a functional control icon.
 */

function PlaceholderMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex h-7 w-7 shrink-0 items-center justify-center border border-text-primary',
        className,
      )}
    >
      <span className="font-mono text-[0.6875rem] leading-none tracking-[0.02em] text-text-primary">
        SS
      </span>
    </span>
  )
}

type LogoVariant = 'wordmark' | 'mark' | 'full'

interface LogoProps {
  variant?: LogoVariant
  className?: string
}

export function Logo({ variant = 'wordmark', className }: LogoProps) {
  if (variant === 'mark') {
    return (
      <span className={cn('inline-flex', className)}>
        <PlaceholderMark />
        <span className="sr-only">{siteConfig.name}</span>
      </span>
    )
  }

  if (variant === 'full') {
    return (
      <span className={cn('inline-flex items-center gap-3', className)}>
        <PlaceholderMark />
        <span className="text-h3 font-medium tracking-[-0.01em] text-text-primary">
          {siteConfig.name}
        </span>
      </span>
    )
  }

  return (
    <span
      className={cn(
        'text-[0.9375rem] font-medium tracking-[-0.01em] text-text-primary',
        className,
      )}
    >
      {siteConfig.name}
    </span>
  )
}
