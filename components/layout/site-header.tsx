'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Container } from '@/components/primitives/container'
import { Logo } from '@/components/mark/logo'
import { CloseIcon, MenuIcon } from '@/components/primitives/icons'
import { navigation } from '@/lib/site'
import { cn } from '@/lib/utils'

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteHeader() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close the mobile sheet whenever the route changes.
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Prevent body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/90 backdrop-blur-sm">
      <Container width="shell">
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="flex items-center rounded-sm"
            aria-label={`${'Sina Sherafat'} — home`}
          >
            <Logo variant="wordmark" />
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-6">
              {navigation.map((item) => {
                const active = isActive(pathname, item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'text-[0.9375rem] transition-colors duration-150',
                        active
                          ? 'font-medium text-text-primary underline decoration-text-primary decoration-1 underline-offset-[6px]'
                          : 'text-text-secondary hover:text-text-primary',
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="flex h-11 w-11 items-center justify-center rounded-sm text-text-primary md:hidden"
          >
            {menuOpen ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </Container>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-hairline bg-canvas md:hidden"
        >
          <Container width="shell">
            <nav aria-label="Primary mobile" className="py-4">
              <ul className="flex flex-col">
                {navigation.map((item) => {
                  const active = isActive(pathname, item.href)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex min-h-11 items-center text-h3',
                          active
                            ? 'font-medium text-text-primary'
                            : 'text-text-secondary',
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </Container>
        </div>
      )}
    </header>
  )
}
