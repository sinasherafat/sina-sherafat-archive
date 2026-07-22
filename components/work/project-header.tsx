import type { Project } from '@/lib/content/types'
import { formatYearRange } from '@/lib/format'
import { Meta } from '@/components/primitives/meta'
import { StatusLabel } from './status-label'

/** Project opening: name, year/status and role near the top. */
export function ProjectHeader({ project }: { project: Project }) {
  return (
    <header className="archive-enter">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Meta>{formatYearRange(project)}</Meta>
        <span aria-hidden="true" className="h-3 w-px bg-hairline" />
        <StatusLabel status={project.status} />
      </div>

      <h1 className="mt-5 text-display font-medium text-balance text-text-primary">
        {project.title}
      </h1>

      <p className="mt-5 max-w-reading text-body-lg text-text-secondary text-pretty">
        {project.summary}
      </p>
    </header>
  )
}
