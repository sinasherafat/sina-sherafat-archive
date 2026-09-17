import { describe, expect, it } from 'vitest'
import { fixturePerspectives } from '@/lib/editorial/fixtures'
import {
  appendSelectionHistory,
  emptySelectionHistory,
  sanitizeSelectionHistory,
  selectNextPerspective,
} from '@/lib/editorial/selection'

describe('session-aware selection', () => {
  it('does not immediately repeat the same perspective or event', () => {
    const current = fixturePerspectives[0]
    const history = appendSelectionHistory(emptySelectionHistory, current)
    const result = selectNextPerspective(fixturePerspectives, history, () => 0)
    expect(result.perspective.id).not.toBe(current.id)
    expect(result.perspective.eventId).not.toBe(current.eventId)
  })

  it('avoids the previous lens when alternatives exist', () => {
    const history = {
      perspectiveIds: ['not-present'],
      eventIds: ['not-present'],
      lensIds: ['infrastructure' as const],
    }
    const result = selectNextPerspective(fixturePerspectives, history, () => 0)
    expect(result.perspective.lens).not.toBe('infrastructure')
  })

  it('produces eight unique perspectives within the retained window', () => {
    let history = emptySelectionHistory
    const ids = new Set<string>()
    for (let index = 0; index < 8; index += 1) {
      const { perspective } = selectNextPerspective(
        fixturePerspectives,
        history,
        () => 0.37,
      )
      expect(ids.has(perspective.id)).toBe(false)
      ids.add(perspective.id)
      history = appendSelectionHistory(history, perspective)
    }
  })

  it('bounds untrusted history input', () => {
    const value = sanitizeSelectionHistory({
      perspectiveIds: Array.from({ length: 20 }, (_, index) => `p-${index}`),
      eventIds: Array.from({ length: 20 }, (_, index) => `e-${index}`),
      lensIds: Array.from({ length: 20 }, () => 'scale'),
    })
    expect(value.perspectiveIds).toHaveLength(8)
    expect(value.eventIds).toHaveLength(4)
    expect(value.lensIds).toHaveLength(3)
  })

  it('relaxes perspective history only after a small pool is exhausted', () => {
    const pool = fixturePerspectives.slice(0, 2)
    const history = {
      perspectiveIds: pool.map((item) => item.id),
      eventIds: [],
      lensIds: [],
    }
    const result = selectNextPerspective(pool, history, () => 0)
    expect(result.relaxedRules).toContain('perspective-history-exhausted')
  })
})
