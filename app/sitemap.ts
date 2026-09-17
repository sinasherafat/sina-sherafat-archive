import type { MetadataRoute } from 'next'
import { fixturePerspectives } from '@/lib/editorial/fixtures'
import { siteConfig } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteConfig.url}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${siteConfig.url}/about`, changeFrequency: 'monthly', priority: 0.6 },
    ...fixturePerspectives.map((perspective) => ({
      url: `${siteConfig.url}/perspectives/${perspective.slug}`,
      lastModified: new Date(perspective.eventAt),
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    })),
  ]
}
