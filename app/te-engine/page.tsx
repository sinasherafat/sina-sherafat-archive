import type { Metadata } from 'next'
import { EditorialPage } from '@/components/editorial/editorial-page'
import { getInitialFixturePerspective } from '@/lib/editorial/fixtures'

export const metadata: Metadata = {
  title: 'Technology Editorial Engine',
  description:
    'Source-backed technology events transformed into concise, human-scale observations.',
  alternates: { canonical: '/te-engine' },
}

export default function TechnologyEditorialEnginePage() {
  return <EditorialPage initialPerspective={getInitialFixturePerspective()} />
}
