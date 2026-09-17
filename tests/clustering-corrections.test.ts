import { describe, expect, it } from 'vitest'
import { clusterEvents, likelySameEvent } from '@/lib/editorial/clustering'
import { applyClaimCorrection } from '@/lib/editorial/corrections'
import { fixtureClaims, fixturePerspectives } from '@/lib/editorial/fixtures'

describe('event clustering', () => {
  const event = {
    id: 'a',
    title: 'Company opens large computing campus in Nevada',
    entities: ['Company', 'Nevada'],
    eventAt: '2026-09-17T10:00:00Z',
    eventType: 'infrastructure',
  }

  it('clusters reports about the same event', () => {
    const followUp = {
      ...event,
      id: 'b',
      title: 'Large Nevada computing campus opens for Company',
      eventAt: '2026-09-17T12:00:00Z',
    }
    expect(likelySameEvent(event, followUp)).toBe(true)
    expect(clusterEvents([event, followUp])).toHaveLength(1)
  })

  it('keeps different event types separate', () => {
    expect(
      likelySameEvent(event, { ...event, id: 'c', eventType: 'funding' }),
    ).toBe(false)
  })
})

describe('provenance-aware corrections', () => {
  it('supersedes the claim and unpublishes dependent perspectives', () => {
    const originalClaim = fixtureClaims[0]
    const result = applyClaimCorrection({
      originalClaim,
      replacementClaim: { ...originalClaim, id: 'replacement' },
      perspectives: fixturePerspectives,
      note: 'The source revised its stated requirement.',
    })
    expect(result.replacementClaim.supersedesClaimId).toBe(originalClaim.id)
    expect(result.affectedPerspectiveIds).toHaveLength(3)
    expect(
      result.unpublishedPerspectives.every(
        (perspective) => perspective.status === 'corrected',
      ),
    ).toBe(true)
  })
})
