import Link from 'next/link'
import type { Project } from '@/lib/content/types'
import { formatYearRange } from '@/lib/format'
import { Meta } from '@/components/primitives/meta'
import { ArrowRightIcon } from '@/components/primitives/icons'
import { StatusLabel } from './status-label'
import { cn } from '@/lib/utils'

interface ProjectRowProps {
  project: Project
  /** Optional archive index, e.g. "01". Mono, low emphasis. */
  index?: string
  showStatus?: boolean
}

/**
 * The primary index object. Horizontal on desktop, stacked on mobile.
 * Readable as text before any image appears.
 */
export function ProjectRow({
  project,
  index,
  showStatus = true,
}: ProjectRowProps) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block border-t border-hairline py-6 transition-colors duration-150 first:border-t-0 md:py-7"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-baseline md:gap-8">
        {index && (
          <Meta className="md:w-8 md:shrink-0 md:pt-1">{index}</Meta>
        )}

        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className="text-h3 font-medium text-text-primary">
              {project.title}
            </h3>
            <ArrowRightIcon className="h-4 w-4 translate-x-0 text-muted opacity-0 transition-all duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:text-text-primary group-hover:opacity-100" />
          </div>
          <p className="mt-2 max-w-reading text-body text-text-secondary text-pretty">
            {project.summary}
          </p>
        </div>

        <div className="flex items-center gap-4 md:w-56 md:shrink-0 md:flex-col md:items-end md:gap-2">
          <Meta>{formatYearRange(project)}</Meta>
          <span className="text-small text-text-secondary md:text-right">
            {project.role.join(', ')}
          </span>
          {showStatus && (
            <StatusLabel status={project.status} className={cn('md:text-right')} />
          )}
        </div>
      </div>
    </Link>
  )
}
