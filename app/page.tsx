import { EditorialReader } from '@/components/editorial/editorial-reader'
import { PageShell } from '@/components/layout/page-shell'
import { getInitialFixturePerspective } from '@/lib/editorial/fixtures'

export default function HomePage() {
  return (
    <PageShell>
      <EditorialReader initialPerspective={getInitialFixturePerspective()} />
    </PageShell>
  )
}
