import Link from 'next/link'
import { Container } from '@/components/primitives/container'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { siteConfig } from '@/lib/site'

export function SiteHeader() {
  return (
    <header className="border-b border-hairline">
      <Container width="shell">
        <div className="flex min-h-16 items-center justify-between gap-6 py-3">
          <Link
            href="/"
            className="max-w-[13rem] rounded-sm font-mono text-[0.6875rem] font-medium uppercase leading-[1.25] tracking-[0.12em] text-text-primary sm:max-w-none"
            aria-label={`${siteConfig.name} — home`}
          >
            Technology / Editorial Engine
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/about"
              className="rounded-sm text-small text-text-secondary transition-colors duration-150 hover:text-text-primary"
            >
              About
            </Link>
            <span aria-hidden="true" className="h-4 w-px bg-hairline" />
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  )
}
