/**
 * Canonical content models for the Personal Archive.
 * These mirror the schemas defined in the Technical Architecture v1.0.
 */

export type ProjectStatus =
  | 'concept'
  | 'in-development'
  | 'active'
  | 'evolving'
  | 'completed'
  | 'archived'

export type Visibility = 'public' | 'unlisted' | 'private'

export interface AssetRef {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
  credit?: string
  priority?: boolean
  treatment?: 'mono' | 'natural'
}

export interface ExternalLink {
  label: string
  href: string
}

/** Structured editorial body — the approved building blocks that control presentation. */
export type ContentBlock =
  | { type: 'lead'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'list'; items: string[] }
  | { type: 'image'; asset: AssetRef }
  | { type: 'related-links'; title?: string; links: ExternalLink[] }

export interface Project {
  id: string
  slug: string
  title: string
  summary: string
  yearStart: number
  yearEnd: number | null
  status: ProjectStatus
  role: string[]
  disciplines: string[]
  featured: boolean
  visibility: Visibility
  cover: AssetRef
  links: ExternalLink[]
  body: ContentBlock[]
  seoDescription: string
  publishedAt: string | null
  updatedAt: string
}

export interface Note {
  id: string
  slug: string
  title: string
  description?: string
  publishedAt: string
  updatedAt?: string
  topics: string[]
  visibility: Visibility
  readingTime?: number
  body: ContentBlock[]
  seoDescription: string
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  concept: 'Concept',
  'in-development': 'In development',
  active: 'Active',
  evolving: 'Evolving',
  completed: 'Completed',
  archived: 'Archived',
}
