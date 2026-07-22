import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/page-shell'
import { PageHeader } from '@/components/layout/page-header'
import { Container } from '@/components/primitives/container'
import { Section } from '@/components/primitives/section'
import { ProjectRow } from '@/components/work/project-row'
import { getAllProjects } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'The complete public archive of selected projects, with status, year, role, and a short summary.',
  alternates: { canonical: '/work' },
}

export default function WorkPage() {
  const projects = getAllProjects()

  return (
    <PageShell>
      <PageHeader
        eyebrow="Work"
        title="The complete archive"
        intro="A list first, not a gallery. Selected projects appear at their honest level of maturity — a finished study and an active venture can sit on the same shelf."
      />

      <Section>
        <Container width="shell">
          <div>
            {projects.map((project, i) => (
              <ProjectRow
                key={project.id}
                project={project}
                index={String(i + 1).padStart(2, '0')}
              />
            ))}
          </div>
        </Container>
      </Section>
    </PageShell>
  )
}
