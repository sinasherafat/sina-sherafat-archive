import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageShell } from '@/components/layout/page-shell'
import { Container } from '@/components/primitives/container'
import { Meta } from '@/components/primitives/meta'
import { Divider } from '@/components/primitives/divider'
import { ArrowLeftIcon } from '@/components/primitives/icons'
import { ProjectHeader } from '@/components/work/project-header'
import { ProjectNav } from '@/components/work/project-nav'
import { ProjectRow } from '@/components/work/project-row'
import { MetadataList } from '@/components/work/metadata-list'
import { ImageBlock } from '@/components/media/image-block'
import { ContentRenderer } from '@/components/content/content-renderer'
import {
  getAdjacentProjects,
  getProjectBySlug,
  getProjectSlugs,
  getRelatedProjects,
} from '@/lib/content'
import { formatDate, formatYearRange } from '@/lib/format'
import { STATUS_LABELS } from '@/lib/content/types'
import { siteConfig } from '@/lib/site'

interface Params {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}

  const title = project.title
  const description = project.seoDescription
  return {
    title,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: 'article',
      title: `${title} — ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/work/${project.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${siteConfig.name}`,
      description,
    },
  }
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const { previous, next } = getAdjacentProjects(slug)
  const related = getRelatedProjects(slug, 2)

  const metadataItems = [
    { label: 'Year', value: formatYearRange(project) },
    { label: 'Status', value: STATUS_LABELS[project.status] },
    { label: 'Role', value: project.role.join(', ') },
    { label: 'Disciplines', value: project.disciplines.join(', ') },
  ]

  return (
    <PageShell>
      <Container width="wide" className="pt-8 md:pt-12">
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 text-small text-text-secondary transition-colors hover:text-text-primary"
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-1" />
          Work
        </Link>
      </Container>

      <Container width="wide" className="pt-8 md:pt-10">
        <ProjectHeader project={project} />
      </Container>

      <Container width="wide" className="pt-10 md:pt-12">
        <ImageBlock
          asset={project.cover}
          priority
          sizes="(min-width: 1200px) 1200px, 100vw"
        />
      </Container>

      <Container width="wide" className="pt-12 md:pt-16">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <aside className="md:w-52 md:shrink-0">
            <MetadataList items={metadataItems} className="md:sticky md:top-20" />
          </aside>
          <div className="max-w-reading flex-1">
            <ContentRenderer blocks={project.body} />
            <Divider className="mt-12" />
            <p className="mt-4">
              <Meta>Last updated {formatDate(project.updatedAt)}</Meta>
            </p>
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <Container width="wide" className="pt-16 md:pt-24">
          <h2 className="mb-6 border-b border-hairline pb-4 text-h2 font-medium text-text-primary">
            Related work
          </h2>
          <div>
            {related.map((item) => (
              <ProjectRow key={item.id} project={item} />
            ))}
          </div>
        </Container>
      )}

      <Container width="wide" className="pt-16 md:pt-20">
        <ProjectNav previous={previous} next={next} />
      </Container>
    </PageShell>
  )
}
