import { runDeterministicCalculation } from './calculations'
import { isSensitiveEventSafe, runPublishGate } from './editorial-rules'
import { logMetric, logPipelineEvent } from './observability'
import { promptContracts, PROMPT_VERSION } from './prompts'
import type { EditorialModelProvider } from './provider'
import { scorePerspective } from './scoring'
import type {
  CalculationRecord,
  CalculationRequest,
  ClaimRecord,
  EditorialEvent,
  EditorialReview,
  Lens,
  Perspective,
  SourceRecord,
} from './types'

export interface PipelineSourceDocument {
  source: SourceRecord
  content: string
}

export interface EventNormalizationOutput {
  event: EditorialEvent
  candidateClaims: ClaimRecord[]
  entities: string[]
  uncertaintyNotes: string[]
}

export interface LensCandidate {
  lens: Lens
  factualAnchor: string
  transformationIdea: string
  requiredCalculations: string[]
  calculationRequest?: CalculationRequest
  whyInteresting: string
  failureRisk: string
}

export interface PipelineDraft {
  form: Perspective['form']
  body: string
  sourceLine: string
}

export interface PipelineResult {
  promptVersion: string
  provider: string
  model: string
  sources: SourceRecord[]
  event: EditorialEvent
  claims: ClaimRecord[]
  lensCandidates: LensCandidate[]
  selectedCandidate: LensCandidate
  calculation: CalculationRecord | null
  draft: PipelineDraft
  rewriteCount: 0 | 1
  modelReview: EditorialReview
  publishReview: EditorialReview
  perspective: Perspective
}

function percentage(score: number): number {
  return Math.max(0, Math.min(100, (score / 3) * 100))
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-|-$/gu, '')
    .slice(0, 56)
}

function makePerspective(input: {
  sourceRecords: SourceRecord[]
  event: EditorialEvent
  candidate: LensCandidate
  draft: PipelineDraft
  review: EditorialReview
  provider: EditorialModelProvider
}): Perspective {
  const qualityScore = scorePerspective({
    defensibility: percentage(input.review.scores.factualFidelity),
    perspectiveShift: percentage(input.review.scores.perspectiveShift),
    humanLegibility: percentage(input.review.scores.humanLegibility),
    novelty: input.event.scores.novelty,
    voiceFit: percentage(input.review.scores.voice),
  })
  const id = crypto.randomUUID()

  return {
    id,
    slug: `${slugify(input.event.titleInternal)}-${input.candidate.lens}-${id.slice(0, 8)}`,
    eventId: input.event.id,
    eventTitle: input.event.titleInternal,
    category: input.event.category,
    eventAt: input.event.eventAt,
    displayDate: new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })
      .format(new Date(input.event.eventAt))
      .toUpperCase(),
    lens: input.candidate.lens,
    form: input.draft.form,
    body: input.draft.body,
    sourceLine: input.draft.sourceLine,
    qualityScore,
    absurdityLevel: input.candidate.lens === 'absurd' ? 1 : 0,
    status: 'evaluated',
    sources: input.sourceRecords,
    corrected: false,
    fixture: false,
    promptVersion: PROMPT_VERSION,
    modelVersion: `${input.provider.name}:${input.provider.model}`,
    referenceDatasetVersion: 'v0.1',
  }
}

function selectCalculableCandidate(candidates: LensCandidate[]): {
  candidate: LensCandidate
  calculation: CalculationRecord | null
} {
  for (const candidate of candidates) {
    if (!candidate.calculationRequest && candidate.requiredCalculations.length === 0) {
      return { candidate, calculation: null }
    }
    if (!candidate.calculationRequest) continue

    try {
      return {
        candidate,
        calculation: runDeterministicCalculation(candidate.calculationRequest),
      }
    } catch (error) {
      logMetric('calculation_failure', 1, {
        lens: candidate.lens,
        reason: error instanceof Error ? error.message : 'unknown',
      })
    }
  }

  throw new Error('No lens candidate had a safe deterministic calculation path.')
}

async function critique(
  provider: EditorialModelProvider,
  payload: unknown,
): Promise<EditorialReview> {
  return provider.generateJson<EditorialReview>({
    stage: 'critique',
    system: promptContracts.critique,
    payload,
  })
}

export async function runEditorialPipeline(input: {
  sources: PipelineSourceDocument[]
  provider: EditorialModelProvider
  isNovel?: (draft: PipelineDraft, event: EditorialEvent) => Promise<boolean>
}): Promise<PipelineResult> {
  if (input.sources.length === 0) {
    throw new Error('The pipeline requires at least one source document.')
  }

  const sourceRecords = input.sources.map((document) => document.source)
  logPipelineEvent('event_normalize', 'started', {
    sourceCount: input.sources.length,
  })
  const normalized =
    await input.provider.generateJson<EventNormalizationOutput>({
      stage: 'event_normalize',
      system: promptContracts.event_normalize,
      payload: { sources: input.sources },
    })

  logPipelineEvent('claim_verify', 'started')
  const verified = await input.provider.generateJson<{ claims: ClaimRecord[] }>({
    stage: 'claim_verify',
    system: promptContracts.claim_verify,
    payload: { normalized, sources: input.sources },
  })
  const publishableClaims = verified.claims.filter(
    (claim) => claim.confidence !== 'low',
  )
  if (publishableClaims.length === 0) {
    logPipelineEvent('claim_verify', 'rejected')
    throw new Error('No high- or medium-confidence claims survived verification.')
  }

  logPipelineEvent('lens_propose', 'started')
  const proposed = await input.provider.generateJson<{
    candidates: LensCandidate[]
  }>({
    stage: 'lens_propose',
    system: promptContracts.lens_propose,
    payload: { event: normalized.event, claims: publishableClaims },
  })
  const lensCandidates = proposed.candidates.slice(0, 8)
  if (lensCandidates.length < 3) {
    throw new Error('The lens stage produced fewer than three candidates.')
  }

  logPipelineEvent('calculate', 'started')
  const { candidate: selectedCandidate, calculation } =
    selectCalculableCandidate(lensCandidates)
  logPipelineEvent('calculate', 'passed', {
    calculationId: calculation?.id ?? 'none',
    lens: selectedCandidate.lens,
  })

  logPipelineEvent('write', 'started')
  let draft = await input.provider.generateJson<PipelineDraft>({
    stage: 'write',
    system: promptContracts.write,
    payload: {
      claims: publishableClaims,
      lens: selectedCandidate,
      calculation,
    },
  })

  let modelReview = await critique(input.provider, {
    draft,
    claims: publishableClaims,
    event: normalized.event,
    calculation,
  })
  let rewriteCount: 0 | 1 = 0

  if (modelReview.decision === 'REWRITE_ONCE') {
    rewriteCount = 1
    draft = await input.provider.generateJson<PipelineDraft>({
      stage: 'write',
      system: promptContracts.write,
      payload: {
        previousDraft: draft,
        rewriteInstruction: modelReview.rewriteInstruction,
        claims: publishableClaims,
        lens: selectedCandidate,
        calculation,
      },
    })
    modelReview = await critique(input.provider, {
      draft,
      claims: publishableClaims,
      event: normalized.event,
      calculation,
      rewriteCount,
    })
  }

  const perspective = makePerspective({
    sourceRecords,
    event: normalized.event,
    candidate: selectedCandidate,
    draft,
    review: modelReview,
    provider: input.provider,
  })
  const novel = input.isNovel
    ? await input.isNovel(draft, normalized.event)
    : true
  const publishReview = runPublishGate({
    perspective,
    claims: publishableClaims,
    factualSupport:
      modelReview.decision === 'PASS' &&
      modelReview.scores.factualFidelity === 3,
    calculationVerified:
      (!selectedCandidate.calculationRequest || calculation !== null) &&
      modelReview.scores.math >= 2,
    sensitiveEventSafe: isSensitiveEventSafe(normalized.event, perspective),
    novel,
  })
  perspective.status = publishReview.decision === 'PASS' ? 'approved' : 'rejected'
  if (calculation) {
    calculation.id = `calc-${perspective.id}`
    calculation.perspectiveId = perspective.id
  }

  logPipelineEvent(
    'publish_gate',
    publishReview.decision === 'PASS' ? 'passed' : 'rejected',
    { perspectiveId: perspective.id, rewriteCount },
  )

  return {
    promptVersion: PROMPT_VERSION,
    provider: input.provider.name,
    model: input.provider.model,
    sources: sourceRecords,
    event: normalized.event,
    claims: publishableClaims,
    lensCandidates,
    selectedCandidate,
    calculation,
    draft,
    rewriteCount,
    modelReview,
    publishReview,
    perspective,
  }
}
