import type { MetadataRoute } from 'next'
import { fixturePerspectives } from '@/lib/editorial/fixtures'
import { siteConfig } from '@/lib/site'
import { getAllNotes, getAllProjects } from '@/lib/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/work`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/notes`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/te-engine`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/te-engine/about`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/about`, changeFrequency: 'yearly', priority: 0.6 },
  ]

  const projectRoutes: MetadataRoute.Sitemap = getAllProjects().map((p) => ({
    url: `${base}/work/${p.slug}`,
    lastModified: new Date(`${p.yearEnd ?? p.yearStart}-01-01`),
    changeFrequency: 'yearly',
    priority: 0.7,
  }))

  const noteRoutes: MetadataRoute.Sitemap = getAllNotes().map((n) => ({
    url: `${base}/notes/${n.slug}`,
    lastModified: new Date(n.publishedAt),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  const perspectiveRoutes: MetadataRoute.Sitemap = fixturePerspectives.map(
    (perspective) => ({
      url: `${base}/perspectives/${perspective.slug}`,
      lastModified: new Date(perspective.eventAt),
      changeFrequency: 'yearly',
      priority: 0.4,
    }),
  )

  return [
    ...staticRoutes,
    ...projectRoutes,
    ...noteRoutes,
    ...perspectiveRoutes,
  ]
}
