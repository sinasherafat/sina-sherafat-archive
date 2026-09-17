import postgres from 'postgres'
import type { EditorialRepository } from './repository'
import type { Perspective, SourceRecord } from './types'

interface PerspectiveRow {
  id: string
  slug: string
  event_id: string
  event_title: string
  category: string
  event_at: Date
  lens: Perspective['lens']
  form: Perspective['form']
  body: string
  source_line: string
  quality_score: number
  absurdity_level: 0 | 1 | 2 | 3
  status: Perspective['status']
  corrected: boolean
  correction_note: string | null
  fixture: boolean
  prompt_version: string
  model_version: string
  reference_dataset_version: string
  sources: SourceRecord[]
}

function mapPerspective(row: PerspectiveRow): Perspective {
  return {
    id: row.id,
    slug: row.slug,
    eventId: row.event_id,
    eventTitle: row.event_title,
    category: row.category,
    eventAt: row.event_at.toISOString(),
    displayDate: new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })
      .format(row.event_at)
      .toUpperCase(),
    lens: row.lens,
    form: row.form,
    body: row.body,
    sourceLine: row.source_line,
    qualityScore: row.quality_score,
    absurdityLevel: row.absurdity_level,
    status: row.status,
    sources: row.sources,
    corrected: row.corrected,
    correctionNote: row.correction_note ?? undefined,
    fixture: row.fixture,
    promptVersion: row.prompt_version,
    modelVersion: row.model_version,
    referenceDatasetVersion: row.reference_dataset_version,
  }
}

export class PostgresEditorialRepository implements EditorialRepository {
  private readonly sql: ReturnType<typeof postgres>

  constructor(connectionString: string) {
    this.sql = postgres(connectionString, { max: 3, prepare: false })
  }

  private async queryPerspectives(where: string, values: string[] = []) {
    const rows = (await this.sql.unsafe(
      `select
        p.id, p.slug, p.event_id, e.title_internal as event_title,
        e.category, e.event_at, p.lens, p.form, p.body, p.source_line,
        p.quality_score, p.absurdity_level, p.status, p.corrected,
        p.correction_note, p.fixture, p.prompt_version, p.model_version,
        p.reference_dataset_version,
        coalesce(json_agg(json_build_object(
          'id', s.id, 'url', s.url, 'title', s.title,
          'publisher', s.publisher, 'publishedAt', s.published_at,
          'sourceTier', s.source_tier, 'fetchedAt', s.fetched_at,
          'canonicalHash', s.canonical_hash, 'fixture', s.fixture
        )) filter (where s.id is not null), '[]') as sources
      from perspectives p
      join events e on e.id = p.event_id
      left join perspective_sources ps on ps.perspective_id = p.id
      left join sources s on s.id = ps.source_id
      ${where}
      group by p.id, e.id
      order by p.quality_score desc`,
      values,
    )) as unknown as PerspectiveRow[]
    return rows.map(mapPerspective)
  }

  async getActivePerspectives(): Promise<Perspective[]> {
    return this.queryPerspectives(
      "where p.status in ('active', 'approved') and p.corrected = false",
    )
  }

  async getPerspective(idOrSlug: string): Promise<Perspective | null> {
    const rows = await this.queryPerspectives(
      'where (p.id = $1 or p.slug = $1) limit 1',
      [idOrSlug],
    )
    return rows[0] ?? null
  }

  async recordSessionDraw(input: {
    sessionId: string
    perspective: Perspective
  }): Promise<void> {
    await this.sql`
      insert into session_draws (session_id, perspective_id, event_id, lens)
      values (
        ${input.sessionId},
        ${input.perspective.id},
        ${input.perspective.eventId},
        ${input.perspective.lens}
      )
    `
  }
}
