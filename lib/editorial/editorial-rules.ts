import type {
  ClaimRecord,
  EditorialEvent,
  EditorialForm,
  EditorialReview,
  Perspective,
} from './types'

const SENSITIVE_EVENT_TERMS = [
  'death',
  'fatal',
  'injury',
  'injured',
  'disaster',
  'attack',
  'abuse',
  'harassment',
  'trauma',
  'medical emergency',
  'layoff',
  'job loss',
]

export const forbiddenPhrases = [
  "in today's rapidly evolving world",
  'this raises important questions',
  'only time will tell',
  'it remains to be seen',
  'this highlights the growing importance of',
  'a fascinating glimpse into the future',
  'at the intersection of',
  'game-changing',
  'mind-blowing',
] as const

const FORM_LIMITS: Record<EditorialForm, readonly [number, number]> = {
  observation: [35, 90],
  scale: [20, 70],
  footnote: [10, 35],
  longer_note: [150, 300],
}

const ATTRIBUTION_MARKERS = [
  'says',
  'reports',
  'estimates',
  'projects',
  'plans',
  'claims',
  'expected',
  'fictional',
  'synthetic',
  'hypothetical',
]

export function wordCount(text: string): number {
  return text.trim().split(/\s+/u).filter(Boolean).length
}

export function findForbiddenPhrases(text: string): string[] {
  const normalized = text.toLowerCase()
  return forbiddenPhrases.filter((phrase) => normalized.includes(phrase))
}

export function validateFormLength(
  form: EditorialForm,
  body: string,
): string | null {
  const count = wordCount(body)
  const [minimum, maximum] = FORM_LIMITS[form]
  return count >= minimum && count <= maximum
    ? null
    : `${form} requires ${minimum}-${maximum} words; received ${count}.`
}

export function preservesAttribution(
  body: string,
  claims: ClaimRecord[],
): boolean {
  const requiresAttribution = claims.some((claim) =>
    ['company_claim', 'estimate', 'projection', 'reported'].includes(claim.type),
  )
  if (!requiresAttribution) return true

  const normalized = body.toLowerCase()
  return ATTRIBUTION_MARKERS.some((marker) => normalized.includes(marker))
}

export function isSensitiveEventSafe(
  event: EditorialEvent,
  perspective: Pick<Perspective, 'lens' | 'absurdityLevel'>,
): boolean {
  const eventText = `${event.titleInternal} ${event.category}`.toLowerCase()
  const sensitive = SENSITIVE_EVENT_TERMS.some((term) => eventText.includes(term))

  return !sensitive || (perspective.lens !== 'absurd' && perspective.absurdityLevel === 0)
}

export function runPublishGate(input: {
  perspective: Perspective
  claims: ClaimRecord[]
  factualSupport: boolean
  calculationVerified: boolean
  sensitiveEventSafe: boolean
  novel: boolean
}): EditorialReview {
  const failures: string[] = []
  const lengthFailure = validateFormLength(
    input.perspective.form,
    input.perspective.body,
  )
  const cliches = findForbiddenPhrases(input.perspective.body)

  if (!input.factualSupport) failures.push('unsupported-factual-clause')
  if (!input.calculationVerified) failures.push('unverified-calculation')
  if (!preservesAttribution(input.perspective.body, input.claims)) {
    failures.push('lost-attribution')
  }
  if (!input.sensitiveEventSafe) failures.push('sensitivity-risk')
  if (!input.novel) failures.push('near-duplicate')
  if (lengthFailure) failures.push('form-length')
  if (cliches.length > 0) failures.push('generic-ai-phrase')
  if (input.perspective.body.includes('!')) failures.push('habitual-exclamation')
  if (input.perspective.qualityScore < 75) failures.push('quality-below-threshold')
  if (input.perspective.sources.length === 0) failures.push('missing-provenance')

  const voiceOnly = failures.every((failure) =>
    ['generic-ai-phrase', 'habitual-exclamation', 'form-length'].includes(failure),
  )
  const decision =
    failures.length === 0 ? 'PASS' : voiceOnly ? 'REWRITE_ONCE' : 'REJECT'

  return {
    decision,
    scores: {
      factualFidelity: input.factualSupport ? 3 : 0,
      perspectiveShift: input.perspective.qualityScore >= 85 ? 3 : 2,
      humanLegibility: 3,
      voice: cliches.length === 0 ? 3 : 1,
      math: input.calculationVerified ? 3 : 0,
      compression: lengthFailure ? 1 : 3,
    },
    failureReasons: failures,
    rewriteInstruction:
      decision === 'REWRITE_ONCE'
        ? 'Remove generic phrasing or compress once without introducing new facts.'
        : undefined,
  }
}
