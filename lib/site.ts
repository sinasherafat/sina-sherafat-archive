/**
 * Site-wide configuration and canonical copy.
 * Editorial constants live here so pages stay free of scattered strings.
 */
export const siteConfig = {
  name: 'Sina Sherafat',
  version: 'v1.1',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sinasherafat.com',
  twitter: '@sinasherafat',
  description:
    'A quiet personal archive of selected work, ideas, and things still becoming.',
  intro:
    'Selected work, ideas, and things still becoming.',
  location: 'Working across product, systems, and narrative.',
  email: 'hello@sinasherafat.com',
} as const

export const navigation = [
  { label: 'Work', href: '/work' },
  { label: 'Notes', href: '/notes' },
  { label: 'TE Engine', href: '/te-engine' },
  { label: 'About', href: '/about' },
] as const
