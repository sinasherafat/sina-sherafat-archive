import Link from 'next/link'
import type { Project } from '@/lib/content/types'
import { Meta } from '@/components/primitives/meta'
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/primitives/icons'

/** Sequential previous / next wayfinding at the end of a project page. */
export function ProjectNav({
  previous,
  next,
}: {
  previous: Project | null
  next: Project | null
}) {
  if (!previous && !next) return null

  return (
    <nav
      aria-label="Project navigation"
      className="grid grid-cols-1 gap-px border-t border-hairline sm:grid-cols-2"
    >
      {previous ? (
        <Link
          href={`/work/${previous.slug}`}
          className="group flex flex-col gap-2 py-8 pr-4 transition-colors"
        >
          <Meta uppercase className="inline-flex items-center gap-2">
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Previous
          </Meta>
          <span className="text-h3 font-medium text-text-primary group-hover:underline group-hover:underline-offset-4">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}

      {next && (
        <Link
          href={`/work/${next.slug}`}
          className="group flex flex-col items-start gap-2 py-8 sm:items-end sm:pl-4 sm:text-right"
        >
          <Meta uppercase className="inline-flex items-center gap-2">
            Next
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Meta>
          <span className="text-h3 font-medium text-text-primary group-hover:underline group-hover:underline-offset-4">
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  )
}
