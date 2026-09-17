import type { PipelineStage } from './provider'

export const PROMPT_VERSION = 'v0.1'

export const promptContracts: Record<PipelineStage, string> = {
  event_normalize:
    'Convert source records into one structured event without interpretation. Extract candidate claims, entities, dates, category, numbers, source IDs, and uncertainty notes. Output JSON only. Do not write editorial prose.',
  claim_verify:
    'Verify candidate claims only against supplied source records. Preserve reported, company-claim, estimate, projection, and opinion status. Low-confidence claims are not publishable. Output JSON only.',
  lens_propose:
    'Propose 3-8 grounded perspectives from verified claims. For each return one canonical lens, factual anchor, transformation idea, required deterministic calculations, interest, and failure risk. When arithmetic is needed, provide one typed calculationRequest using only supplied numeric claims: attention, time_saved, area_acres, per_capita, throughput, or energy_kwh. Do not calculate the result. Reject lenses requiring unsupported assumptions. Output JSON only.',
  write:
    'Write one concise observation from supplied verified claims, one lens, and optional verified calculation. Preserve attribution. Use calm, concrete, dry, restrained prose. Do not add facts. Do not use generic AI framing, hype, exclamation marks, a conclusion paragraph, or an explained joke. Output JSON only.',
  critique:
    'Score factual fidelity, perspective shift, human legibility, voice, math, and compression. Return PASS, REWRITE_ONCE, or REJECT with precise failure reasons. A rewrite may only fix voice or compression and must not introduce a new factual angle. Output JSON only.',
}
