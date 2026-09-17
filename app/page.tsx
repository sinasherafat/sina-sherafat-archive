import Link from 'next/link'
import { PageShell } from '@/components/layout/page-shell'
import { Container } from '@/components/primitives/container'
import { Section } from '@/components/primitives/section'
import { Meta } from '@/components/primitives/meta'
import { ArchiveLink } from '@/components/primitives/archive-link'
import { ArrowRightIcon } from '@/components/primitives/icons'
import { EditorialReader } from '@/components/editorial/editorial-reader'
import { ProjectRow } from '@/components/work/project-row'
import { getFeaturedProjects, getLatestNote } from '@/lib/content'
import { getInitialFixturePerspective } from '@/lib/editorial/fixtures'
import { formatDate } from '@/lib/format'
import { siteConfig } from '@/lib/site'

export default function HomePage() {
  const featured = getFeaturedProjects(4)
  const latestNote = getLatestNote()

  return (
    <PageShell>
      {/* Opening: a restrained statement, not a biography. */}
      <Container width="shell" className="pt-16 md:pt-28">
        <div className="archive-enter max-w-standard">
          <Meta uppercase className="block">
            Personal Archive
          </Meta>
          <h1 className="mt-6 text-display font-medium text-balance text-text-primary">
            {siteConfig.intro}
          </h1>
          <p className="mt-6 max-w-reading text-body-lg text-text-secondary text-pretty">
            A quiet, curated record of selected projects and ideas by{' '}
            {siteConfig.name}. Fewer things, more carefully kept — presented at
            their honest level of maturity.
          </p>
        </div>
      </Container>

      <Section spacing="compact">
        <Container width="shell">
          <EditorialReader
            initialPerspective={getInitialFixturePerspective()}
            variant="compact"
          />
        </Container>
      </Section>

      {/* Selected work */}
      <Section spacing="wide">
        <Container width="shell">
          <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-hairline pb-4">
            <h2 className="text-h2 font-medium text-text-primary">
              Selected work
            </h2>
            <ArchiveLink href="/work" className="text-small no-underline">
              <span className="underline decoration-hairline underline-offset-4">
                All work
              </span>
            </ArchiveLink>
          </div>

          <div>
            {featured.map((project, i) => (
              <ProjectRow
                key={project.id}
                project={project}
                index={String(i + 1).padStart(2, '0')}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* Latest note */}
      {latestNote && (
        <Section spacing="compact" className="border-t border-hairline">
          <Container width="shell">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-reading">
                <Meta uppercase className="mb-4 block">
                  Latest note
                </Meta>
                <h2 className="text-h2 font-medium text-balance text-text-primary">
                  <Link
                    href={`/notes/${latestNote.slug}`}
                    className="transition-colors hover:underline hover:decoration-text-primary hover:underline-offset-[6px]"
                  >
                    {latestNote.title}
                  </Link>
                </h2>
                {latestNote.description && (
                  <p className="mt-3 text-body text-text-secondary text-pretty">
                    {latestNote.description}
                  </p>
                )}
                <div className="mt-4">
                  <Meta as="time">{formatDate(latestNote.publishedAt)}</Meta>
                </div>
              </div>
              <Link
                href="/notes"
                className="group inline-flex items-center gap-2 text-small text-text-secondary transition-colors hover:text-text-primary"
              >
                All notes
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
              </Link>
            </div>
          </Container>
        </Section>
      )}
    </PageShell>
  )
}
