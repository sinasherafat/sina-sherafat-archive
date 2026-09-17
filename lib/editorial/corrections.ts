import type { ClaimRecord, Perspective } from './types'

export interface CorrectionResult {
  supersededClaim: ClaimRecord
  replacementClaim: ClaimRecord
  affectedPerspectiveIds: string[]
  unpublishedPerspectives: Perspective[]
}

export function applyClaimCorrection(input: {
  originalClaim: ClaimRecord
  replacementClaim: ClaimRecord
  perspectives: Perspective[]
  note: string
}): CorrectionResult {
  if (input.originalClaim.eventId !== input.replacementClaim.eventId) {
    throw new Error('A correction must remain attached to the same event.')
  }

  const affected = input.perspectives.filter(
    (perspective) => perspective.eventId === input.originalClaim.eventId,
  )

  return {
    supersededClaim: input.originalClaim,
    replacementClaim: {
      ...input.replacementClaim,
      supersedesClaimId: input.originalClaim.id,
    },
    affectedPerspectiveIds: affected.map((perspective) => perspective.id),
    unpublishedPerspectives: affected.map((perspective) => ({
      ...perspective,
      status: 'corrected',
      corrected: true,
      correctionNote: input.note,
    })),
  }
}
