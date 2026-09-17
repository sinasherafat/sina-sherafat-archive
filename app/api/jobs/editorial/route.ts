import { logMetric, logPipelineEvent } from '@/lib/editorial/observability'
import { runEditorialPipeline } from '@/lib/editorial/pipeline'
import { persistPipelineResult } from '@/lib/editorial/pipeline-persistence'
import { getEditorialModelProvider } from '@/lib/editorial/provider'
import {
  fetchRegistryDocuments,
  normalizeSourceRecord,
  sourceRegistry,
} from '@/lib/editorial/source-registry'

export const maxDuration = 300

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  return Boolean(secret) && request.headers.get('authorization') === `Bearer ${secret}`
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (process.env.ENABLE_LIVE_INGESTION !== 'true') {
    logPipelineEvent('ingest', 'skipped', { reason: 'live-ingestion-disabled' })
    return Response.json({ status: 'skipped', reason: 'live-ingestion-disabled' })
  }

  const provider = getEditorialModelProvider()
  if (!provider) {
    logPipelineEvent('ingest', 'failed', {
      reason: 'model-provider-unavailable',
    })
    return Response.json(
      { error: 'OPENAI_API_KEY is required for live editorial generation.' },
      { status: 503 },
    )
  }

  const connectionString = process.env.DATABASE_URL
  if (process.env.EDITORIAL_STORAGE !== 'postgres' || !connectionString) {
    return Response.json(
      {
        error:
          'Live ingestion requires EDITORIAL_STORAGE=postgres and DATABASE_URL.',
      },
      { status: 503 },
    )
  }

  const documents = await fetchRegistryDocuments()
  logMetric('ingest_freshness', 0, { fetchedDocuments: documents.length })
  logPipelineEvent('ingest', 'passed', {
    fetchedDocuments: documents.length,
    provider: provider.name,
    model: provider.model,
  })

  const runs = await Promise.allSettled(
    documents.map(async (document) => {
      const registrySource = sourceRegistry.find(
        (source) => source.id === document.registrySourceId,
      )
      if (!registrySource) {
        throw new Error(`Unknown registry source ${document.registrySourceId}.`)
      }

      const source = normalizeSourceRecord({
        id: `source-${document.canonicalHash.slice(0, 20)}`,
        url: registrySource.feedUrl,
        title: registrySource.name,
        publisher: registrySource.publisher,
        publishedAt: document.fetchedAt,
        tier: registrySource.tier,
        fetchedAt: document.fetchedAt,
        content: document.body,
      })
      const result = await runEditorialPipeline({
        sources: [{ source, content: document.body }],
        provider,
      })
      await persistPipelineResult(connectionString, result)
      return result.publishReview.decision
    }),
  )

  const decisions = runs.flatMap((run) =>
    run.status === 'fulfilled' ? [run.value] : [],
  )
  const failed = runs.length - decisions.length
  if (failed > 0) logMetric('generation_rejection_rate', failed / runs.length)

  return Response.json(
    {
      status: failed === runs.length ? 'failed' : 'completed',
      fetchedDocuments: documents.length,
      approved: decisions.filter((decision) => decision === 'PASS').length,
      rejected: decisions.filter((decision) => decision !== 'PASS').length,
      failed,
    },
    { status: failed === runs.length && runs.length > 0 ? 500 : 200 },
  )
}
