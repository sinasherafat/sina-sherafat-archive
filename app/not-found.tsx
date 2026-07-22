import Link from 'next/link'
import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/page-shell'
import { Container } from '@/components/primitives/container'
import { ArchiveLink } from '@/components/primitives/archive-link'

export const metadata: Metadata = {
  title: 'Not found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <PageShell>
      <Container width="reading" className="py-32 md:py-48">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          404
        </p>
        <h1 className="mt-6 text-balance text-3xl font-medium leading-tight tracking-tight md:text-4xl">
          This page has slipped out of the archive.
        </h1>
        <p className="mt-4 max-w-prose text-pretty leading-relaxed text-muted-foreground">
          {
            "The thing you were looking for may have moved, been renamed, or never quite made it here. Nothing is truly lost — start again from the beginning."
          }
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-8">
          <ArchiveLink href="/">Return home</ArchiveLink>
          <ArchiveLink href="/work">Browse the work</ArchiveLink>
        </div>
        <p className="mt-16 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <Link href="/notes" className="transition-colors hover:text-foreground">
            Or read the notes
          </Link>
        </p>
      </Container>
    </PageShell>
  )
}
