import { describe, expect, it } from 'vitest'
import { fixtureClaims, fixturePerspectives } from '@/lib/editorial/fixtures'
import {
  findForbiddenPhrases,
  isSensitiveEventSafe,
  runPublishGate,
  validateFormLength,
} from '@/lib/editorial/editorial-rules'
import { rejectedVoiceExamples } from './fixtures/editorial-golden-set'

describe('editorial publish gate', () => {
  it('detects canonical generic AI phrases', () => {
    expect(findForbiddenPhrases(rejectedVoiceExamples[0].body)).toContain(
      "in today's rapidly evolving world",
    )
  })

  it('enforces each editorial form length', () => {
    expect(validateFormLength('footnote', 'Too short.')).not.toBeNull()
    expect(
      validateFormLength(
        'footnote',
        'Software has solved memory. Users may rediscover the advantages of forgetting a few administrative details.',
      ),
    ).toBeNull()
  })

  it('passes a supported reviewed fixture', () => {
    const perspective = fixturePerspectives[0]
    const claims = fixtureClaims.filter(
      (claim) => claim.eventId === perspective.eventId,
    )
    expect(
      runPublishGate({
        perspective,
        claims,
        factualSupport: true,
        calculationVerified: true,
        sensitiveEventSafe: true,
        novel: true,
      }).decision,
    ).toBe('PASS')
  })

  it('rejects unsupported factual clauses', () => {
    const perspective = fixturePerspectives[0]
    expect(
      runPublishGate({
        perspective,
        claims: fixtureClaims.slice(0, 1),
        factualSupport: false,
        calculationVerified: true,
        sensitiveEventSafe: true,
        novel: true,
      }).decision,
    ).toBe('REJECT')
  })

  it('permits exactly one rewrite for voice or compression only', () => {
    const perspective = {
      ...fixturePerspectives[0],
      body: "In today's rapidly evolving world, this game-changing system sits at the intersection of work and modern innovation. This highlights the growing importance of digital transformation for every person who uses software, and only time will tell what its mind-blowing future will mean.",
    }
    expect(
      runPublishGate({
        perspective,
        claims: [],
        factualSupport: true,
        calculationVerified: true,
        sensitiveEventSafe: true,
        novel: true,
      }).decision,
    ).toBe('REWRITE_ONCE')
  })

  it('prevents an absurd lens from turning a sensitive event into a joke', () => {
    const perspective = {
      ...fixturePerspectives[0],
      lens: 'absurd' as const,
      absurdityLevel: 1 as const,
    }
    const event = {
      ...fixturePerspectives[0],
      id: perspective.eventId,
      titleInternal: 'A fatal workplace injury is reported',
      createdAt: perspective.eventAt,
      scores: {
        freshness: 90,
        significance: 90,
        transformability: 80,
        sourceConfidence: 90,
        novelty: 80,
        voiceFit: 10,
      },
      status: 'eligible' as const,
      sourceIds: perspective.sources.map((source) => source.id),
    }
    expect(isSensitiveEventSafe(event, perspective)).toBe(false)
  })
})
