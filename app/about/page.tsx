import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/page-shell'
import { PageHeader } from '@/components/layout/page-header'
import { Container } from '@/components/primitives/container'
import { Section } from '@/components/primitives/section'
import { Meta } from '@/components/primitives/meta'
import { Divider } from '@/components/primitives/divider'
import { ArchiveLink } from '@/components/primitives/archive-link'
import { Logo } from '@/components/mark/logo'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About',
  description:
    'A concise introduction to Sina Sherafat — recurring areas of work and a direct way to make contact.',
  alternates: { canonical: '/about' },
}

const paragraphs = [
  'Sina Sherafat works across product, systems, and narrative. The projects differ in category but share recurring concerns: memory, intelligence, incentives, identity, and long-term value.',
  'This archive exists to give that work a durable public context — what each project is trying to understand, what the contribution was, and where it currently stands. It favours honest context over momentum, and continuity over volume.',
  'The intention is that the parts cohere over time. A visitor should gradually recognise the same standards and methods across otherwise different projects.',
]

const areas = [
  'Product and interface design',
  'Systems and coordination',
  'AI and narrative tools',
  'Long-term ventures',
]

export default function AboutPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="About"
        title="A person behind the work"
        width="reading"
        intro="Enough to establish identity and perspective, and a direct route to make contact. No exhaustive résumé."
      />

      <Section>
        <Container width="reading">
          <div className="flex flex-col gap-6">
            {paragraphs.map((text) => (
              <p key={text} className="text-body text-text-primary text-pretty">
                {text}
              </p>
            ))}
          </div>

          <Divider className="my-12" />

          <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
            <div>
              <Meta uppercase className="mb-4 block">
                Recurring areas
              </Meta>
              <ul className="flex flex-col gap-2">
                {areas.map((area) => (
                  <li key={area} className="text-body text-text-primary">
                    {area}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Meta uppercase className="mb-4 block">
                Contact
              </Meta>
              <ul className="flex flex-col gap-2 text-body">
                <li>
                  <ArchiveLink href={`mailto:${siteConfig.email}`}>
                    {siteConfig.email}
                  </ArchiveLink>
                </li>
              </ul>
            </div>
          </div>

          {/* Personal signature — the monogram alone, then the archive line. */}
          <div className="mt-16 flex flex-col items-start gap-4 border-t border-hairline pt-10">
            <Logo variant="mark" />
            <Meta>Sina Sherafat — Personal Archive</Meta>
          </div>
        </Container>
      </Section>
    </PageShell>
  )
}
