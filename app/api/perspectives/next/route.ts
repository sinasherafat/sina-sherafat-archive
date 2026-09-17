import { after } from 'next/server'
import { logMetric } from '@/lib/editorial/observability'
import { getEditorialRepository } from '@/lib/editorial/repository'
import {
  sanitizeSelectionHistory,
  selectNextPerspective,
} from '@/lib/editorial/selection'

export async function POST(request: Request) {
  const startedAt = performance.now()

  try {
    const payload = (await request.json()) as {
      sessionId?: unknown
      history?: unknown
    }
    const sessionId =
      typeof payload.sessionId === 'string' && payload.sessionId.length <= 100
        ? payload.sessionId
        : crypto.randomUUID()
    const history = sanitizeSelectionHistory(payload.history)
    const repository = await getEditorialRepository()
    const pool = await repository.getActivePerspectives()
    const result = selectNextPerspective(pool, history)
    const selectionMs = Math.round(performance.now() - startedAt)

    after(async () => {
      await repository.recordSessionDraw({
        sessionId,
        perspective: result.perspective,
      })
      logMetric('selection_latency', selectionMs, {
        inventorySize: pool.length,
        relaxedRuleCount: result.relaxedRules.length,
      })
    })

    return Response.json(
      { perspective: result.perspective, selectionMs },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch {
    return Response.json(
      { error: 'An approved perspective could not be selected.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
