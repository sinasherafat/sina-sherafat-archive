import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/site'

/**
 * Personal brand marks — Sina Sherafat's supplied artwork, used exactly as
 * provided (never redrawn or re-vectorised). Each mark ships as two flat
 * monochrome assets and switches automatically with the theme:
 *   - light mode → black artwork
 *   - dark mode  → white artwork
 *
 * The assets are pre-trimmed transparent PNGs derived from the originals, so
 * no surrounding square, border, or label is added. Images are never
 * auto-inverted; the correct asset is simply shown per theme via the `dark`
 * class. Marks are decorative (aria-hidden) with an adjacent sr-only name.
 */

// Intrinsic dimensions of the trimmed assets (used to reserve layout space).
const WORDMARK = { w: 862, h: 272 }
const MARK = { w: 224, h: 1006 }

type LogoVariant = 'wordmark' | 'mark' | 'full'

interface LogoProps {
  variant?: LogoVariant
  className?: string
}

/** The horizontal signature wordmark. Height is controlled by the caller. */
function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn('inline-flex h-5 w-auto md:h-6', className)}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo-dark.png"
        alt=""
        width={WORDMARK.w}
        height={WORDMARK.h}
        className="h-full w-auto select-none dark:hidden"
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo-light.png"
        alt=""
        width={WORDMARK.w}
        height={WORDMARK.h}
        className="hidden h-full w-auto select-none dark:block"
        draggable={false}
      />
    </span>
  )
}

/** The vertical monogram. */
function Monogram({ className }: { className?: string }) {
  return (
    <span
      className={cn('inline-flex h-8 w-auto', className)}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/monogram-dark.png"
        alt=""
        width={MARK.w}
        height={MARK.h}
        className="h-full w-auto select-none dark:hidden"
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/monogram-light.png"
        alt=""
        width={MARK.w}
        height={MARK.h}
        className="hidden h-full w-auto select-none dark:block"
        draggable={false}
      />
    </span>
  )
}

export function Logo({ variant = 'wordmark', className }: LogoProps) {
  if (variant === 'mark') {
    return (
      <span className={cn('inline-flex', className)}>
        <Monogram />
        <span className="sr-only">{siteConfig.name}</span>
      </span>
    )
  }

  if (variant === 'full') {
    return (
      <span className={cn('inline-flex items-center gap-3', className)}>
        <Monogram />
        <span className="text-h3 font-medium tracking-[-0.01em] text-text-primary">
          {siteConfig.name}
        </span>
      </span>
    )
  }

  return (
    <span className={cn('inline-flex', className)}>
      <Wordmark />
      <span className="sr-only">{siteConfig.name}</span>
    </span>
  )
}
