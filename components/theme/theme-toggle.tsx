'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
] as const

/**
 * Quiet, editorial theme selector: Light / Dark / System.
 * No icons, no colored switch, no animated toggle — just three small text
 * labels with the active one carried in the primary ink. Rendered as an
 * accessible radio group. `mounted` guards against hydration mismatch since
 * the resolved theme is only known on the client.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const current = mounted ? theme : undefined

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className={cn('inline-flex items-center gap-1', className)}
    >
      {OPTIONS.map((option) => {
        const active = current === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${option.label} theme`}
            onClick={() => setTheme(option.value)}
            className={cn(
              'rounded-sm px-2 py-1 text-small transition-colors duration-150',
              active
                ? 'font-medium text-text-primary'
                : 'text-muted hover:text-text-primary',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
