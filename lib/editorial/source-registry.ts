import { createHash } from 'node:crypto'
import type { SourceRecord, SourceTier } from './types'

export interface RegistrySource {
  id: string
  name: string
  feedUrl: string
  publisher: string
  tier: SourceTier
  active: boolean
}

export interface FetchedSourceDocument {
  registrySourceId: string
  body: string
  fetchedAt: string
  contentType: string
  canonicalHash: string
}

export const sourceRegistry: RegistrySource[] = [
  {
    id: 'registry-openai-news',
    name: 'OpenAI News',
    feedUrl: 'https://openai.com/news/rss.xml',
    publisher: 'OpenAI',
    tier: 'A',
    active: true,
  },
  {
    id: 'registry-google-ai',
    name: 'Google AI',
    feedUrl: 'https://blog.google/technology/ai/rss/',
    publisher: 'Google',
    tier: 'A',
    active: true,
  },
  {
    id: 'registry-microsoft',
    name: 'Microsoft Official Blog',
    feedUrl: 'https://blogs.microsoft.com/feed/',
    publisher: 'Microsoft',
    tier: 'A',
    active: true,
  },
]

export async function fetchRegistryDocuments(
  fetchImpl: typeof fetch = fetch,
): Promise<FetchedSourceDocument[]> {
  const active = sourceRegistry.filter((source) => source.active)
  const results = await Promise.allSettled(
    active.map(async (source) => {
      const response = await fetchImpl(source.feedUrl, {
        headers: {
          'User-Agent': 'TechnologyEditorialEngine/0.1 (+source intake)',
        },
        signal: AbortSignal.timeout(10_000),
      })
      if (!response.ok) {
        throw new Error(`${source.name} returned ${response.status}`)
      }
      const body = await response.text()
      return {
        registrySourceId: source.id,
        body,
        fetchedAt: new Date().toISOString(),
        contentType: response.headers.get('content-type') ?? 'application/xml',
        canonicalHash: createHash('sha256').update(body).digest('hex'),
      }
    }),
  )

  return results.flatMap((result) =>
    result.status === 'fulfilled' ? [result.value] : [],
  )
}

export function normalizeSourceRecord(input: {
  id: string
  url: string
  title: string
  publisher: string
  publishedAt: string
  tier: SourceTier
  fetchedAt: string
  content: string
}): SourceRecord {
  return {
    id: input.id,
    url: input.url,
    title: input.title,
    publisher: input.publisher,
    publishedAt: input.publishedAt,
    sourceTier: input.tier,
    fetchedAt: input.fetchedAt,
    canonicalHash: createHash('sha256').update(input.content).digest('hex'),
    fixture: false,
  }
}
