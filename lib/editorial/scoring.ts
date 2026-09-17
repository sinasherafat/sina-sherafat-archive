import type { EditorialEvent, EventScores } from './types'

const EVENT_WEIGHTS: Record<keyof EventScores, number> = {
  freshness: 0.2,
  significance: 0.2,
  transformability: 0.2,
  sourceConfidence: 0.2,
  novelty: 0.1,
  voiceFit: 0.1,
}

export function scoreEvent(scores: EventScores): number {
  return Math.round(
    Object.entries(EVENT_WEIGHTS).reduce((total, [key, weight]) => {
      const score = scores[key as keyof EventScores]
      return total + Math.min(100, Math.max(0, score)) * weight
    }, 0),
  )
}

export function isEventEligible(event: EditorialEvent): boolean {
  return !event.fixture && scoreEvent(event.scores) >= 70
}

export function freshnessDecay(ageHours: number): number {
  return Math.exp(-Math.max(0, ageHours) / 36)
}

export interface PerspectiveScoreInput {
  defensibility: number
  perspectiveShift: number
  humanLegibility: number
  novelty: number
  voiceFit: number
}

export function scorePerspective(input: PerspectiveScoreInput): number {
  return Math.round(
    input.defensibility * 0.3 +
      input.perspectiveShift * 0.25 +
      input.humanLegibility * 0.2 +
      input.novelty * 0.15 +
      input.voiceFit * 0.1,
  )
}
