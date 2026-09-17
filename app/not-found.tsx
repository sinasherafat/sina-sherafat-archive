import Link from 'next/link'
import { PageShell } from '@/components/layout/page-shell'
import { Container } from '@/components/primitives/container'
import { Meta } from '@/components/primitives/meta'

export default function NotFound() {
  return (
    <PageShell>
      <Container width="reading" className="py-32 md:py-48">
        <Meta uppercase className="block">
          404 / No perspective
        </Meta>
        <h1 className="mt-6 text-h1 font-medium text-balance">
          This observation is not in the approved pool.
        </h1>
        <p className="mt-5 text-body-lg text-text-secondary">
          It may have been corrected, archived, or never published.
        </p>
        <Link
          href="/"
          className="mt-10 inline-block rounded-sm text-body font-medium underline decoration-hairline underline-offset-[6px] hover:decoration-text-primary"
        >
          Another perspective →
        </Link>
      </Container>
    </PageShell>
  )
}
