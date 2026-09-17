export interface ClusterCandidate {
  id: string
  title: string
  entities: string[]
  eventAt: string
  eventType: string
}

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'for',
  'in',
  'of',
  'on',
  'the',
  'to',
  'with',
])

function titleTokens(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .split(/\s+/)
      .filter((token) => token.length > 2 && !STOP_WORDS.has(token)),
  )
}

function overlap(left: Set<string>, right: Set<string>): number {
  const union = new Set([...left, ...right])
  if (union.size === 0) return 0
  let intersection = 0
  for (const value of left) if (right.has(value)) intersection += 1
  return intersection / union.size
}

export function likelySameEvent(
  left: ClusterCandidate,
  right: ClusterCandidate,
): boolean {
  const hoursApart =
    Math.abs(Date.parse(left.eventAt) - Date.parse(right.eventAt)) / 3_600_000
  if (hoursApart > 72 || left.eventType !== right.eventType) return false

  const leftEntities = new Set(left.entities.map((entity) => entity.toLowerCase()))
  const rightEntities = new Set(
    right.entities.map((entity) => entity.toLowerCase()),
  )
  const entityScore = overlap(leftEntities, rightEntities)
  const titleScore = overlap(titleTokens(left.title), titleTokens(right.title))

  return entityScore >= 0.5 && titleScore >= 0.25
}

export function clusterEvents(
  candidates: ClusterCandidate[],
): ClusterCandidate[][] {
  const clusters: ClusterCandidate[][] = []

  for (const candidate of candidates) {
    const existing = clusters.find((cluster) =>
      cluster.some((member) => likelySameEvent(candidate, member)),
    )
    if (existing) existing.push(candidate)
    else clusters.push([candidate])
  }

  return clusters
}
