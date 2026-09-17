import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageShell } from '@/components/layout/page-shell'
import { EditorialReader } from '@/components/editorial/editorial-reader'
import {
  fixturePerspectives,
  getFixturePerspective,
} from '@/lib/editorial/fixtures'
import { getEditorialRepository } from '@/lib/editorial/repository'

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return fixturePerspectives.map((perspective) => ({
    slug: perspective.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const perspective = getFixturePerspective(slug)
  if (!perspective) return { title: 'Perspective' }

  return {
    title: `${perspective.category} perspective`,
    description: perspective.body,
    alternates: { canonical: `/perspectives/${perspective.slug}` },
    openGraph: {
      title: `${perspective.category} perspective`,
      description: perspective.body,
      type: 'article',
    },
  }
}

export default async function PerspectivePage({ params }: PageProps) {
  const { slug } = await params
  const repository = await getEditorialRepository()
  const perspective = await repository.getPerspective(slug)
  if (!perspective) notFound()

  return (
    <PageShell>
      <EditorialReader initialPerspective={perspective} updateStableUrl />
    </PageShell>
  )
}
