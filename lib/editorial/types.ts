export type SourceTier = 'A' | 'B' | 'C' | 'D'

export type ClaimType =
  | 'observed'
  | 'reported'
  | 'company_claim'
  | 'estimate'
  | 'projection'
  | 'opinion'

export type ClaimConfidence = 'high' | 'medium' | 'low'

export type Lens =
  | 'scale'
  | 'human'
  | 'time'
  | 'money'
  | 'physical'
  | 'historical'
  | 'behavioral'
  | 'infrastructure'
  | 'language'
  | 'institutional'
  | 'absurd'

export type EditorialForm =
  | 'observation'
  | 'scale'
  | 'footnote'
  | 'longer_note'

export type PerspectiveStatus =
  | 'draft'
  | 'evaluated'
  | 'approved'
  | 'active'
  | 'stale'
  | 'archived'
  | 'rejected'
  | 'corrected'
  | 'unpublished'

export interface SourceRecord {
  id: string
  url: string
  title: string
  publisher: string
  publishedAt: string
  sourceTier: SourceTier
  fetchedAt: string
  canonicalHash: string
  fixture: boolean
}

export interface NumericValue {
  value: number
  unit: string
  qualifier?: string
  uncertainty?: string
}

export interface ClaimRecord {
  id: string
  eventId: string
  text: string
  type: ClaimType
  confidence: ClaimConfidence
  sourceId: string
  sourceSpan: string
  eventAt: string
  numbers: NumericValue[]
  supersedesClaimId?: string
  fixture: boolean
}

export interface EventScores {
  freshness: number
  significance: number
  transformability: number
  sourceConfidence: number
  novelty: number
  voiceFit: number
}

export interface EditorialEvent {
  id: string
  titleInternal: string
  category: string
  eventAt: string
  createdAt: string
  scores: EventScores
  status: 'watch' | 'eligible' | 'active' | 'rejected' | 'stale'
  sourceIds: string[]
  fixture: boolean
}

export interface Perspective {
  id: string
  slug: string
  eventId: string
  eventTitle: string
  category: string
  eventAt: string
  displayDate: string
  lens: Lens
  form: EditorialForm
  body: string
  sourceLine: string
  qualityScore: number
  absurdityLevel: 0 | 1 | 2 | 3
  status: PerspectiveStatus
  sources: SourceRecord[]
  corrected: boolean
  correctionNote?: string
  fixture: boolean
  promptVersion: string
  modelVersion: string
  referenceDatasetVersion: string
}

export interface SelectionHistory {
  perspectiveIds: string[]
  eventIds: string[]
  lensIds: Lens[]
}

export interface SelectionResult {
  perspective: Perspective
  relaxedRules: string[]
}

export interface ReferenceConstant {
  id: string
  name: string
  value: number
  unit: string
  geography: string | null
  period: string
  sourceUrl: string
  sourceTier: SourceTier
  version: string
  notes: string
}

export interface CalculationRecord {
  id: string
  perspectiveId?: string
  formula: string
  inputs: Record<string, number | string>
  referenceIds: string[]
  result: number
  resultUnit: string
  roundingRule: string
}

export type CalculationRequest =
  | {
      kind: 'attention'
      minutesPerPerson: number
      people: number
    }
  | {
      kind: 'time_saved'
      originalSeconds: number
      newSeconds: number
    }
  | {
      kind: 'area_acres'
      squareMeters: number
    }
  | {
      kind: 'per_capita'
      total: number
      people: number
      unit: string
    }
  | {
      kind: 'throughput'
      count: number
      durationSeconds: number
      unit: string
    }
  | {
      kind: 'energy_kwh'
      wattHours: number
    }

export interface EditorialReview {
  decision: 'PASS' | 'REWRITE_ONCE' | 'REJECT'
  scores: {
    factualFidelity: 0 | 1 | 2 | 3
    perspectiveShift: 0 | 1 | 2 | 3
    humanLegibility: 0 | 1 | 2 | 3
    voice: 0 | 1 | 2 | 3
    math: 0 | 1 | 2 | 3
    compression: 0 | 1 | 2 | 3
  }
  failureReasons: string[]
  rewriteInstruction?: string
}
