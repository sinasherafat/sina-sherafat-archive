import type {
  Lens,
  Perspective,
  SelectionHistory,
  SelectionResult,
} from './types'

const HISTORY_LIMITS = {
  perspectives: 8,
  events: 4,
  lenses: 3,
} as const

export const emptySelectionHistory: SelectionHistory = {
  perspectiveIds: [],
  eventIds: [],
  lensIds: [],
}

function uniqueCount<T>(values: T[]): number {
  return new Set(values).size
}

function weightedPick(
  perspectives: Perspective[],
  random: () => number,
): Perspective {
  const weights = perspectives.map((perspective) =>
    Math.pow(perspective.qualityScore / 100, 2),
  )
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  let cursor = Math.min(Math.max(random(), 0), 0.999999999) * total

  for (let index = 0; index < perspectives.length; index += 1) {
    cursor -= weights[index]
    if (cursor <= 0) return perspectives[index]
  }

  return perspectives[perspectives.length - 1]
}

export function sanitizeSelectionHistory(
  value: unknown,
): SelectionHistory {
  if (!value || typeof value !== 'object') return emptySelectionHistory

  const candidate = value as Partial<SelectionHistory>
  const strings = (input: unknown, limit: number): string[] =>
    Array.isArray(input)
      ? input.filter((item): item is string => typeof item === 'string').slice(-limit)
      : []

  return {
    perspectiveIds: strings(
      candidate.perspectiveIds,
      HISTORY_LIMITS.perspectives,
    ),
    eventIds: strings(candidate.eventIds, HISTORY_LIMITS.events),
    lensIds: strings(candidate.lensIds, HISTORY_LIMITS.lenses) as Lens[],
  }
}

export function appendSelectionHistory(
  history: SelectionHistory,
  perspective: Perspective,
): SelectionHistory {
  return {
    perspectiveIds: [...history.perspectiveIds, perspective.id].slice(
      -HISTORY_LIMITS.perspectives,
    ),
    eventIds: [...history.eventIds, perspective.eventId].slice(
      -HISTORY_LIMITS.events,
    ),
    lensIds: [...history.lensIds, perspective.lens].slice(
      -HISTORY_LIMITS.lenses,
    ),
  }
}

export function selectNextPerspective(
  pool: Perspective[],
  historyInput: SelectionHistory,
  random: () => number = Math.random,
): SelectionResult {
  const history = sanitizeSelectionHistory(historyInput)
  const active = pool.filter(
    (perspective) =>
      perspective.status === 'active' || perspective.status === 'approved',
  )

  if (active.length === 0) {
    throw new Error('No approved perspectives are available.')
  }

  const relaxedRules: string[] = []
  let candidates = active.filter(
    (perspective) => !history.perspectiveIds.includes(perspective.id),
  )

  if (candidates.length === 0) {
    candidates = active
    relaxedRules.push('perspective-history-exhausted')
  }

  const eventCount = uniqueCount(active.map((perspective) => perspective.eventId))
  if (eventCount >= 6 && history.eventIds.length > 0) {
    const recentEvents = new Set(history.eventIds.slice(-2))
    const eventDiverse = candidates.filter(
      (perspective) => !recentEvents.has(perspective.eventId),
    )
    if (eventDiverse.length > 0) candidates = eventDiverse
    else relaxedRules.push('recent-event-exclusion')
  } else if (history.eventIds.length > 0) {
    const previousEvent = history.eventIds.at(-1)
    const notPrevious = candidates.filter(
      (perspective) => perspective.eventId !== previousEvent,
    )
    if (notPrevious.length > 0) candidates = notPrevious
  }

  const lensCount = uniqueCount(candidates.map((perspective) => perspective.lens))
  const previousLens = history.lensIds.at(-1)
  if (previousLens && lensCount >= 3) {
    const lensDiverse = candidates.filter(
      (perspective) => perspective.lens !== previousLens,
    )
    if (lensDiverse.length > 0) candidates = lensDiverse
    else relaxedRules.push('previous-lens-exclusion')
  }

  const lastSeenLensByEvent = new Map<string, Lens>()
  const pairedHistoryLength = Math.min(
    history.eventIds.length,
    history.lensIds.length,
  )
  for (let offset = 1; offset <= pairedHistoryLength; offset += 1) {
    const eventId = history.eventIds.at(-offset)
    const lens = history.lensIds.at(-offset)
    if (eventId && lens) lastSeenLensByEvent.set(eventId, lens)
  }
  const meaningfullyDifferent = candidates.filter(
    (perspective) =>
      lastSeenLensByEvent.get(perspective.eventId) !== perspective.lens,
  )
  if (meaningfullyDifferent.length > 0) candidates = meaningfullyDifferent

  return {
    perspective: weightedPick(candidates, random),
    relaxedRules,
  }
}
