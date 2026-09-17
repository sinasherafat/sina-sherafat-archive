/**
 * Site-wide configuration and canonical copy.
 * Editorial constants live here so pages stay free of scattered strings.
 */
const vercelHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL

export const siteConfig = {
  name: 'Technology Editorial Engine',
  shortName: 'Editorial Engine',
  version: 'v0.1',
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (vercelHost ? `https://${vercelHost}` : 'http://localhost:3000'),
  description:
    'A small editorial instrument that turns source-backed technology events into human-scale observations.',
  principle: 'Truth → Perspective → Absurdity',
} as const

export const navigation = [
  { label: 'About', href: '/about' },
] as const
