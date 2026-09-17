import { describe, expect, it } from 'vitest'
import {
  aggregateAttention,
  areaInAcres,
  kilowattHoursFromWattHours,
  perCapita,
  throughputPerSecond,
  timeSaved,
} from '@/lib/editorial/calculations'

describe('deterministic calculation engine', () => {
  it('calculates exact saved seconds', () => {
    expect(timeSaved({ originalSeconds: 3600, newSeconds: 12 }).result).toBe(
      3588,
    )
  })

  it('aggregates minutes into sourced person-years', () => {
    const result = aggregateAttention({
      minutesPerPerson: 3,
      people: 100_000_000,
    })
    expect(result.result).toBe(570)
    expect(result.referenceIds).toHaveLength(3)
  })

  it('converts area using the versioned acre constant', () => {
    expect(areaInAcres(4046.8564224).result).toBe(1)
  })

  it('calculates money or counts per person without invented constants', () => {
    expect(perCapita({ total: 1000, people: 4, unit: 'usd' }).result).toBe(250)
  })

  it('calculates throughput from explicit inputs', () => {
    expect(
      throughputPerSecond({ count: 120, durationSeconds: 60, unit: 'tasks' })
        .result,
    ).toBe(2)
  })

  it('converts energy units without implying a household comparison', () => {
    expect(kilowattHoursFromWattHours(5000).result).toBe(5)
  })

  it('rejects impossible or zero denominators', () => {
    expect(() =>
      timeSaved({ originalSeconds: 10, newSeconds: 11 }),
    ).toThrow()
    expect(() => perCapita({ total: 10, people: 0, unit: 'usd' })).toThrow()
  })
})
