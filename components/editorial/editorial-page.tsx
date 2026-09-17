import { EditorialReader } from './editorial-reader'
import { PageHeader } from '@/components/layout/page-header'
import { PageShell } from '@/components/layout/page-shell'
import { Container } from '@/components/primitives/container'
import type { Perspective } from '@/lib/editorial/types'

export function EditorialPage({
  initialPerspective,
  updateStableUrl = false,
}: {
  initialPerspective: Perspective
  updateStableUrl?: boolean
}) {
  return (
    <PageShell>
      <PageHeader
        eyebrow="TE Engine"
        title="Technology Editorial Engine"
        intro="A source-backed editorial instrument for looking at technology from a more human angle."
      />

      <Container width="shell" className="mt-12 md:mt-16">
        <div
          className="h-1.5 w-full bg-archive-blue"
          aria-hidden="true"
        />
      </Container>

      <EditorialReader
        initialPerspective={initialPerspective}
        updateStableUrl={updateStableUrl}
      />
    </PageShell>
  )
}
