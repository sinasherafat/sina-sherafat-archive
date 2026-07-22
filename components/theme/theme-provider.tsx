'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ComponentProps } from 'react'

/**
 * Thin client wrapper around next-themes. Configured in the root layout with
 * attribute="class", defaultTheme="system" and enableSystem so that:
 *   - first load follows the OS via prefers-color-scheme,
 *   - a manual choice is persisted and restored,
 *   - "System" keeps tracking OS changes live.
 * next-themes injects a blocking pre-hydration script that sets the class
 * before paint, so there is no flash of the incorrect theme.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
