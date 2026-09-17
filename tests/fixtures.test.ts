import { describe, expect, it } from 'vitest'
import {
  fixtureClaims,
  fixtureEvents,
  fixturePerspectives,
} from '@/lib/editorial/fixtures'
import {
  findForbiddenPhrases,
  preservesAttribution,
  validateFormLength,
} from '@/lib/editorial/editorial-rules'
import { isEventEligible } from '@/lib/editorial/scoring'

describe('approved fixture inventory', () => {
  it('meets the v0.1 launch inventory target', () => {
    expect(fixtureEvents).toHaveLength(12)
    expect(fixturePerspectives).toHaveLength(36)
  })

  it('keeps fixture records separate from live eligibility', () => {
    expect(fixtureEvents.every((event) => event.fixture)).toBe(true)
    expect(fixtureEvents.some(isEventEligible)).toBe(false)
    expect(fixturePerspectives.every((item) => item.displayDate === 'SPECIMEN')).toBe(
      true,
    )
  })

  it('has unique stable IDs and slugs', () => {
    expect(new Set(fixturePerspectives.map((item) => item.id)).size).toBe(36)
    expect(new Set(fixturePerspectives.map((item) => item.slug)).size).toBe(36)
  })

  it('covers every canonical lens', () => {
    expect(new Set(fixturePerspectives.map((item) => item.lens)).size).toBe(11)
  })

  it('keeps every perspective sourced and above the quality threshold', () => {
    for (const perspective of fixturePerspectives) {
      expect(perspective.sources.length).toBeGreaterThan(0)
      expect(perspective.qualityScore).toBeGreaterThanOrEqual(75)
    }
  })

  it('obeys form lengths and the anti-cliche scan', () => {
    for (const perspective of fixturePerspectives) {
      expect(validateFormLength(perspective.form, perspective.body)).toBeNull()
      expect(findForbiddenPhrases(perspective.body)).toEqual([])
    }
  })

  it('preserves attribution states for every event claim', () => {
    for (const perspective of fixturePerspectives) {
      const claims = fixtureClaims.filter(
        (claim) => claim.eventId === perspective.eventId,
      )
      expect(preservesAttribution(perspective.body, claims)).toBe(true)
    }
  })
})
