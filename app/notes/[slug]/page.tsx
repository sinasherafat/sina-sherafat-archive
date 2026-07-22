import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageShell } from '@/components/layout/page-shell'
import { Container } from '@/components/primitives/container'
import { Meta } from '@/components/primitives/meta'
import { Divider } from '@/components/primitives/divider'
import { ArrowLeftIcon } from '@/components/primitives/icons'
import { ContentRenderer } from '@/components/content/content-renderer'
import { getNoteBySlug, getNoteSlugs } from '@/lib/content'
import { formatDate } from '@/lib/format'
import { siteConfig } from '@/lib/site'

interface Params {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getNoteSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const note = getNoteBySlug(slug)
  if (!note) return {}

  return {
    title: note.title,
    description: note.seoDescription,
    alternates: { canonical: `/notes/${note.slug}` },
    openGraph: {
      type: 'article',
      title: `${note.title} — ${siteConfig.name}`,
      description: note.seoDescription,
      url: `${siteConfig.url}/notes/${note.slug}`,
      publishedTime: new Date(note.publishedAt).toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${note.title} — ${siteConfig.name}`,
      description: note.seoDescription,
    },
  }
}

export default async function NotePage({ params }: Params) {
  const { slug } = await params
  const note = getNoteBySlug(slug)
  if (!note) notFound()

  return (
    <PageShell>
      <Container width="reading" className="pt-8 md:pt-12">
        <Link
          href="/notes"
          className="group inline-flex items-center gap-2 text-small text-text-secondary transition-colors hover:text-text-primary"
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-1" />
          Notes
        </Link>
      </Container>

      <article>
        <Container width="reading" className="pt-8 md:pt-10">
          <header className="archive-enter">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Meta as="time">{formatDate(note.publishedAt)}</Meta>
              {note.readingTime && (
                <>
                  <span aria-hidden="true" className="h-3 w-px bg-hairline" />
                  <Meta>{note.readingTime} min read</Meta>
                </>
              )}
            </div>
            <h1 className="mt-5 text-h1 font-medium text-balance text-text-primary">
              {note.title}
            </h1>
          </header>
        </Container>

        <Container width="reading" className="pt-10 md:pt-12">
          <ContentRenderer blocks={note.body} />

          <Divider className="mt-12" />
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {note.topics.map((topic) => (
              <Meta key={topic} uppercase>
                {topic}
              </Meta>
            ))}
          </div>
        </Container>
      </article>
    </PageShell>
  )
}
