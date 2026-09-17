import postgres from 'postgres'
import type { PipelineResult } from './pipeline'
import type { EditorialReview } from './types'

function scoresJson(review: EditorialReview): string {
  return JSON.stringify(review.scores)
}

export async function persistPipelineResult(
  connectionString: string,
  result: PipelineResult,
): Promise<void> {
  const sql = postgres(connectionString, { max: 1, prepare: false })

  try {
    await sql.begin(async (tx) => {
      for (const source of result.sources) {
        await tx`
          insert into sources (
            id, url, title, publisher, published_at, source_tier,
            fetched_at, canonical_hash, fixture
          ) values (
            ${source.id}, ${source.url}, ${source.title}, ${source.publisher},
            ${source.publishedAt}, ${source.sourceTier}, ${source.fetchedAt},
            ${source.canonicalHash}, false
          )
          on conflict (id) do update set
            fetched_at = excluded.fetched_at,
            canonical_hash = excluded.canonical_hash,
            title = excluded.title
        `
      }

      const event = result.event
      await tx`
        insert into events (
          id, title_internal, category, event_at, created_at,
          freshness_score, significance_score, transformability_score,
          source_confidence_score, novelty_score, voice_fit_score, status, fixture
        ) values (
          ${event.id}, ${event.titleInternal}, ${event.category}, ${event.eventAt},
          ${event.createdAt}, ${event.scores.freshness},
          ${event.scores.significance}, ${event.scores.transformability},
          ${event.scores.sourceConfidence}, ${event.scores.novelty},
          ${event.scores.voiceFit}, ${event.status}, false
        )
        on conflict (id) do update set
          title_internal = excluded.title_internal,
          category = excluded.category,
          event_at = excluded.event_at,
          freshness_score = excluded.freshness_score,
          significance_score = excluded.significance_score,
          transformability_score = excluded.transformability_score,
          source_confidence_score = excluded.source_confidence_score,
          novelty_score = excluded.novelty_score,
          voice_fit_score = excluded.voice_fit_score,
          status = excluded.status
      `

      for (const source of result.sources) {
        await tx`
          insert into event_sources (event_id, source_id, is_primary)
          values (${event.id}, ${source.id}, ${source.id === result.sources[0]?.id})
          on conflict (event_id, source_id) do update set
            is_primary = excluded.is_primary
        `
      }

      for (const claim of result.claims) {
        await tx`
          insert into claims (
            id, event_id, source_id, text, claim_type, confidence,
            source_span, event_at, numeric_payload, supersedes_claim_id, fixture
          ) values (
            ${claim.id}, ${event.id}, ${claim.sourceId}, ${claim.text},
            ${claim.type}, ${claim.confidence}, ${claim.sourceSpan},
            ${claim.eventAt}, ${JSON.stringify(claim.numbers)}::jsonb,
            ${claim.supersedesClaimId ?? null}, false
          )
          on conflict (id) do nothing
        `
      }

      const perspective = result.perspective
      await tx`
        insert into perspectives (
          id, slug, event_id, lens, form, body, source_line, quality_score,
          absurdity_level, status, corrected, fixture, prompt_version,
          model_version, reference_dataset_version,
          activated_at
        ) values (
          ${perspective.id}, ${perspective.slug}, ${perspective.eventId},
          ${perspective.lens}, ${perspective.form}, ${perspective.body},
          ${perspective.sourceLine}, ${perspective.qualityScore},
          ${perspective.absurdityLevel}, ${perspective.status}, false, false,
          ${perspective.promptVersion}, ${perspective.modelVersion},
          ${perspective.referenceDatasetVersion},
          ${perspective.status === 'approved' ? new Date() : null}
        )
      `

      for (const source of result.sources) {
        await tx`
          insert into perspective_sources (perspective_id, source_id)
          values (${perspective.id}, ${source.id})
          on conflict do nothing
        `
      }

      if (result.calculation) {
        const calculation = result.calculation
        await tx`
          insert into calculations (
            id, perspective_id, formula, inputs_json, result, result_unit,
            rounding_rule, reference_ids
          ) values (
            ${calculation.id}, ${perspective.id}, ${calculation.formula},
            ${tx.json(calculation.inputs)}, ${calculation.result},
            ${calculation.resultUnit}, ${calculation.roundingRule},
            ${calculation.referenceIds}
          )
        `
      }

      for (const [reviewerType, review] of [
        ['model', result.modelReview],
        ['publish_gate', result.publishReview],
      ] as const) {
        await tx`
          insert into editorial_reviews (
            perspective_id, decision, scores, failure_reasons,
            reviewer_type, model_version, prompt_version
          ) values (
            ${perspective.id}, ${review.decision}, ${scoresJson(review)}::jsonb,
            ${JSON.stringify(review.failureReasons)}::jsonb, ${reviewerType},
            ${reviewerType === 'model' ? result.model : null},
            ${result.promptVersion}
          )
        `
      }
    })
  } finally {
    await sql.end()
  }
}
