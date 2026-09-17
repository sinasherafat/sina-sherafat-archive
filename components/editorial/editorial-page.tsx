import { EditorialReader } from './editorial-reader'
import { PageHeader } from '@/components/layout/page-header'
import { PageShell } from '@/components/layout/page-shell'
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

      <EditorialReader
        initialPerspective={initialPerspective}
        updateStableUrl={updateStableUrl}
        avoidInitialRepeat={!updateStableUrl}
      />
    </PageShell>
  )
}
