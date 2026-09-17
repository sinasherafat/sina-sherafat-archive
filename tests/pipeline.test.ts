import { describe, expect, it } from 'vitest'
import { fixtureClaims, fixtureEvents, fixtureSource } from '@/lib/editorial/fixtures'
import { runEditorialPipeline } from '@/lib/editorial/pipeline'
import type { EditorialModelProvider, PipelineStage } from '@/lib/editorial/provider'

class FixtureProvider implements EditorialModelProvider {
  readonly name = 'fixture-provider'
  readonly model = 'fixture-model'
  readonly calls: PipelineStage[] = []

  async generateJson<T>(input: { stage: PipelineStage }): Promise<T> {
    this.calls.push(input.stage)
    const event = { ...fixtureEvents[0], fixture: false }
    const claim = {
      ...fixtureClaims[0],
      eventId: event.id,
      sourceId: fixtureSource.id,
      fixture: false,
    }

    const output = {
      event_normalize: {
        event,
        candidateClaims: [claim],
        entities: ['Synthetic company'],
        uncertaintyNotes: [],
      },
      claim_verify: { claims: [claim] },
      lens_propose: {
        candidates: [
          {
            lens: 'time',
            factualAnchor: claim.text,
            transformationIdea: 'Measure the saved interval.',
            requiredCalculations: ['time saved'],
            calculationRequest: {
              kind: 'time_saved',
              originalSeconds: 3600,
              newSeconds: 12,
            },
            whyInteresting: 'Makes the claim legible.',
            failureRisk: 'Overstatement.',
          },
          {
            lens: 'human',
            factualAnchor: claim.text,
            transformationIdea: 'Describe the human routine.',
            requiredCalculations: [],
            whyInteresting: 'Makes the claim concrete.',
            failureRisk: 'Generic prose.',
          },
          {
            lens: 'infrastructure',
            factualAnchor: claim.text,
            transformationIdea: 'Describe the supporting system.',
            requiredCalculations: [],
            whyInteresting: 'Reveals hidden machinery.',
            failureRisk: 'Unsupported scope.',
          },
        ],
      },
      write: {
        form: 'observation',
        body:
          'A hypothetical company says the task now takes twelve seconds instead of an hour. The saving is fifty-nine minutes and forty-eight seconds, calculated from the supplied durations. The machine has removed the waiting period. The person may now need a plan for the time returned without instructions.',
        sourceLine: 'Synthetic fixture supplied to the pipeline test.',
      },
      critique: {
        decision: 'PASS',
        scores: {
          factualFidelity: 3,
          perspectiveShift: 3,
          humanLegibility: 3,
          voice: 3,
          math: 3,
          compression: 3,
        },
        failureReasons: [],
      },
    }[input.stage]

    return output as T
  }
}

describe('multi-stage editorial pipeline', () => {
  it('calculates deterministically and publishes only after the hard gate', async () => {
    const provider = new FixtureProvider()
    const result = await runEditorialPipeline({
      sources: [
        {
          source: { ...fixtureSource, fixture: false },
          content: '<synthetic>source document</synthetic>',
        },
      ],
      provider,
    })

    expect(result.calculation?.result).toBe(3588)
    expect(result.rewriteCount).toBe(0)
    expect(result.publishReview.decision).toBe('PASS')
    expect(result.perspective.status).toBe('approved')
    expect(provider.calls).toEqual([
      'event_normalize',
      'claim_verify',
      'lens_propose',
      'write',
      'critique',
    ])
  })
})
