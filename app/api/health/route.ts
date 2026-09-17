import { fixtureEvents, fixturePerspectives } from '@/lib/editorial/fixtures'

export function GET() {
  return Response.json({
    status: 'ok',
    inventory: {
      mode: process.env.EDITORIAL_STORAGE ?? 'fixture',
      activeEvents: fixtureEvents.length,
      approvedPerspectives: fixturePerspectives.length,
    },
    liveIngestion: process.env.ENABLE_LIVE_INGESTION === 'true',
  })
}
