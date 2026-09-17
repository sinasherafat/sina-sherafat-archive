import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/layout/page-shell'
import { Container } from '@/components/primitives/container'
import { Meta } from '@/components/primitives/meta'

export const metadata: Metadata = {
  title: 'About',
  description:
    'How the Technology Editorial Engine turns source-backed events into restrained, human-scale observations.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <PageShell>
      <Container width="reading" className="py-20 md:py-32">
        <Meta uppercase className="block">
          About / v0.1
        </Meta>
        <h1 className="mt-6 text-h1 font-medium text-balance text-text-primary">
          Turn abstract technology into something a human can feel.
        </h1>

        <div className="mt-10 space-y-6 text-body-lg text-text-primary text-pretty">
          <p>
            The Technology Editorial Engine transforms source-backed technology
            events into short observations. It does not replace journalism. It
            preserves sources, separates claims from interpretation, and treats
            accuracy as more important than cleverness.
          </p>
          <p>
            The editorial pipeline may use AI to normalize events, verify claims,
            propose perspectives, and draft language. Calculation happens in
            deterministic code, not model memory. Every publishable observation
            must pass a provenance, attribution, voice, sensitivity, and length
            gate before entering the reader pool.
          </p>
          <p>
            The reader never waits for live generation. “Another perspective →”
            samples only from a pre-generated, approved inventory with session
            rules that limit repeated observations, events, and lenses.
          </p>
        </div>

        <section id="fixtures" className="mt-16 border-t border-hairline pt-10">
          <Meta as="h2" uppercase className="block">
            Preview data
          </Meta>
          <p className="mt-5 text-body text-text-secondary text-pretty">
            This Preview uses 36 reviewed perspectives across 12 synthetic events
            adapted from the canonical specification. They are specimens for
            testing interaction, voice, provenance, and diversity. They are not
            current news and are labeled accordingly. Live ingestion remains
            opt-in until a database and model credentials are configured.
          </p>
        </section>

        <div className="mt-12">
          <Link
            href="/"
            className="rounded-sm text-body font-medium text-text-primary underline decoration-hairline underline-offset-[6px] hover:decoration-text-primary"
          >
            Return to the reader →
          </Link>
        </div>
      </Container>
    </PageShell>
  )
}
