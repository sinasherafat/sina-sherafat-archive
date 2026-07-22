import { projects } from './projects'
import { notes } from './notes'
import type { Note, Project } from './types'

export * from './types'

const isPublic = <T extends { visibility: string }>(item: T) =>
  item.visibility === 'public'

/** Editorial ordering: featured first, then reverse-chronological by start year. */
function byEditorialOrder(a: Project, b: Project): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1
  return b.yearStart - a.yearStart
}

export function getAllProjects(): Project[] {
  return [...projects].filter(isPublic).sort(byEditorialOrder)
}

export function getFeaturedProjects(limit = 4): Project[] {
  return getAllProjects()
    .filter((p) => p.featured)
    .slice(0, limit)
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug && isPublic(p))
}

export function getProjectSlugs(): string[] {
  return projects.filter(isPublic).map((p) => p.slug)
}

/** Sequential neighbours for previous/next wayfinding. */
export function getAdjacentProjects(slug: string): {
  previous: Project | null
  next: Project | null
} {
  const all = getAllProjects()
  const index = all.findIndex((p) => p.slug === slug)
  if (index === -1) return { previous: null, next: null }
  return {
    previous: index > 0 ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
  }
}

export function getRelatedProjects(slug: string, limit = 2): Project[] {
  const current = getProjectBySlug(slug)
  if (!current) return []
  return getAllProjects()
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      project: p,
      overlap: p.disciplines.filter((d) => current.disciplines.includes(d))
        .length,
    }))
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map((entry) => entry.project)
}

function byPublishedDesc(a: Note, b: Note): number {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
}

export function getAllNotes(): Note[] {
  return [...notes].filter(isPublic).sort(byPublishedDesc)
}

export function getLatestNote(): Note | null {
  return getAllNotes()[0] ?? null
}

export function getNoteBySlug(slug: string): Note | undefined {
  return notes.find((n) => n.slug === slug && isPublic(n))
}

export function getNoteSlugs(): string[] {
  return notes.filter(isPublic).map((n) => n.slug)
}
