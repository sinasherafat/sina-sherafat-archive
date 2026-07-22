import type { Project } from './content/types'

/** Year or range for project metadata. Ongoing work reads "YYYY–Present". */
export function formatYearRange(project: Project): string {
  if (project.yearEnd === null) return `${project.yearStart}–Present`
  if (project.yearEnd === project.yearStart) return `${project.yearStart}`
  return `${project.yearStart}–${project.yearEnd}`
}

/** ISO date to a quiet, readable form: "18 May 2026". */
export function formatDate(iso: string): string {
  const date = new Date(iso)
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function formatDateISO(iso: string): string {
  return new Date(iso).toISOString().split('T')[0]
}
