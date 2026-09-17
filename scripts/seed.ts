import postgres from 'postgres'
import {
  fixtureClaims,
  fixtureEvents,
  fixturePerspectives,
  fixtureSource,
} from '../lib/editorial/fixtures'
import { referenceConstants } from '../lib/editorial/reference-constants'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is required to seed data.')
const sql = postgres(connectionString, { max: 1, prepare: false })

async function main() {
  try {
  await sql.begin(async (transaction) => {
    await transaction`
      insert into sources (
        id, url, title, publisher, published_at, source_tier,
        fetched_at, canonical_hash, fixture
      ) values (
        ${fixtureSource.id}, ${fixtureSource.url}, ${fixtureSource.title},
        ${fixtureSource.publisher}, ${fixtureSource.publishedAt},
        ${fixtureSource.sourceTier}, ${fixtureSource.fetchedAt},
        ${fixtureSource.canonicalHash}, ${fixtureSource.fixture}
      ) on conflict (id) do update set
        title = excluded.title,
        canonical_hash = excluded.canonical_hash
    `

    for (const reference of referenceConstants) {
      await transaction`
        insert into reference_constants (
          id, name, value, unit, geography, period, source_url,
          source_tier, version, notes
        ) values (
          ${reference.id}, ${reference.name}, ${reference.value},
          ${reference.unit}, ${reference.geography}, ${reference.period},
          ${reference.sourceUrl}, ${reference.sourceTier}, ${reference.version},
          ${reference.notes}
        ) on conflict (id) do update set
          value = excluded.value,
          version = excluded.version,
          notes = excluded.notes
      `
    }

    for (const event of fixtureEvents) {
      await transaction`
        insert into events (
          id, title_internal, category, event_at, created_at,
          freshness_score, significance_score, transformability_score,
          source_confidence_score, novelty_score, voice_fit_score,
          status, fixture
        ) values (
          ${event.id}, ${event.titleInternal}, ${event.category},
          ${event.eventAt}, ${event.createdAt}, ${event.scores.freshness},
          ${event.scores.significance}, ${event.scores.transformability},
          ${event.scores.sourceConfidence}, ${event.scores.novelty},
          ${event.scores.voiceFit}, ${event.status}, ${event.fixture}
        ) on conflict (id) do update set
          title_internal = excluded.title_internal,
          status = excluded.status
      `
      await transaction`
        insert into event_sources (event_id, source_id, is_primary)
        values (${event.id}, ${fixtureSource.id}, true)
        on conflict do nothing
      `
    }

    for (const claim of fixtureClaims) {
      await transaction`
        insert into claims (
          id, event_id, source_id, text, claim_type, confidence,
          source_span, event_at, numeric_payload, fixture
        ) values (
          ${claim.id}, ${claim.eventId}, ${claim.sourceId}, ${claim.text},
          ${claim.type}, ${claim.confidence}, ${claim.sourceSpan},
          ${claim.eventAt}, ${sql.json(JSON.parse(JSON.stringify(claim.numbers)))}, ${claim.fixture}
        ) on conflict (id) do update set text = excluded.text
      `
    }

    for (const perspective of fixturePerspectives) {
      await transaction`
        insert into perspectives (
          id, slug, event_id, lens, form, body, source_line,
          quality_score, absurdity_level, status, corrected,
          correction_note, fixture, prompt_version, model_version,
          reference_dataset_version, activated_at
        ) values (
          ${perspective.id}, ${perspective.slug}, ${perspective.eventId},
          ${perspective.lens}, ${perspective.form}, ${perspective.body},
          ${perspective.sourceLine}, ${perspective.qualityScore},
          ${perspective.absurdityLevel}, ${perspective.status},
          ${perspective.corrected}, ${perspective.correctionNote ?? null},
          ${perspective.fixture}, ${perspective.promptVersion},
          ${perspective.modelVersion}, ${perspective.referenceDatasetVersion},
          now()
        ) on conflict (id) do update set
          body = excluded.body,
          quality_score = excluded.quality_score,
          status = excluded.status
      `
      await transaction`
        insert into perspective_sources (perspective_id, source_id)
        values (${perspective.id}, ${fixtureSource.id})
        on conflict do nothing
      `
    }
  })
  console.info(
    `Seeded ${fixtureEvents.length} events and ${fixturePerspectives.length} perspectives.`,
  )
  } finally {
    await sql.end()
  }
}

void main()
