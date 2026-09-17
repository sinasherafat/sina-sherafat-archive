import type { ReferenceConstant } from './types'

export const REFERENCE_DATASET_VERSION = 'reference-v1.0'

export const referenceConstants: ReferenceConstant[] = [
  {
    id: 'ref-seconds-per-minute',
    name: 'Seconds per minute',
    value: 60,
    unit: 'seconds/minute',
    geography: null,
    period: 'exact unit definition',
    sourceUrl: 'https://www.bipm.org/en/publications/si-brochure',
    sourceTier: 'A',
    version: REFERENCE_DATASET_VERSION,
    notes: 'Exact SI-compatible time conversion.',
  },
  {
    id: 'ref-minutes-per-hour',
    name: 'Minutes per hour',
    value: 60,
    unit: 'minutes/hour',
    geography: null,
    period: 'exact unit definition',
    sourceUrl: 'https://www.bipm.org/en/publications/si-brochure',
    sourceTier: 'A',
    version: REFERENCE_DATASET_VERSION,
    notes: 'Exact time conversion.',
  },
  {
    id: 'ref-hours-per-day',
    name: 'Hours per day',
    value: 24,
    unit: 'hours/day',
    geography: null,
    period: 'civil day',
    sourceUrl: 'https://www.bipm.org/en/publications/si-brochure',
    sourceTier: 'A',
    version: REFERENCE_DATASET_VERSION,
    notes: 'Exact civil-time convention used for reader-facing comparisons.',
  },
  {
    id: 'ref-days-per-year',
    name: 'Days per common year',
    value: 365,
    unit: 'days/year',
    geography: null,
    period: 'common calendar year',
    sourceUrl: 'https://www.nist.gov/pml/time-and-frequency-division',
    sourceTier: 'A',
    version: REFERENCE_DATASET_VERSION,
    notes: 'Common-year convention; leap-year sensitivity must be disclosed when material.',
  },
  {
    id: 'ref-square-meters-per-acre',
    name: 'Square meters per international acre',
    value: 4046.8564224,
    unit: 'square_meters/acre',
    geography: null,
    period: 'international definition',
    sourceUrl: 'https://www.nist.gov/pml/owm/si-units-area',
    sourceTier: 'A',
    version: REFERENCE_DATASET_VERSION,
    notes: 'Exact conversion from the international yard and pound agreement.',
  },
  {
    id: 'ref-watt-hours-per-kwh',
    name: 'Watt-hours per kilowatt-hour',
    value: 1000,
    unit: 'watt_hours/kilowatt_hour',
    geography: null,
    period: 'exact SI prefix conversion',
    sourceUrl: 'https://www.bipm.org/en/publications/si-brochure',
    sourceTier: 'A',
    version: REFERENCE_DATASET_VERSION,
    notes: 'Exact prefix conversion; not a household-energy assumption.',
  },
]

export function getReferenceConstant(id: string): ReferenceConstant {
  const reference = referenceConstants.find((item) => item.id === id)
  if (!reference) throw new Error(`Unknown reference constant: ${id}`)
  return reference
}
