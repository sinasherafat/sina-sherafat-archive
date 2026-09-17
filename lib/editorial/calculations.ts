import { getReferenceConstant } from './reference-constants'
import type { CalculationRecord, CalculationRequest } from './types'

function roundToSignificant(value: number, digits = 2): number {
  if (value === 0) return 0
  const magnitude = Math.floor(Math.log10(Math.abs(value)))
  const factor = Math.pow(10, digits - magnitude - 1)
  return Math.round(value * factor) / factor
}

export function aggregateAttention(input: {
  minutesPerPerson: number
  people: number
}): CalculationRecord {
  const minutesPerHour = getReferenceConstant('ref-minutes-per-hour')
  const hoursPerDay = getReferenceConstant('ref-hours-per-day')
  const daysPerYear = getReferenceConstant('ref-days-per-year')
  const totalMinutes = input.minutesPerPerson * input.people
  const years =
    totalMinutes /
    minutesPerHour.value /
    hoursPerDay.value /
    daysPerYear.value

  return {
    id: 'calc-attention-years',
    formula: 'minutes_per_person * people / 60 / 24 / 365',
    inputs: input,
    referenceIds: [
      minutesPerHour.id,
      hoursPerDay.id,
      daysPerYear.id,
    ],
    result: roundToSignificant(years, 2),
    resultUnit: 'person-years',
    roundingRule: 'two significant figures',
  }
}

export function timeSaved(input: {
  originalSeconds: number
  newSeconds: number
}): CalculationRecord {
  if (input.newSeconds > input.originalSeconds) {
    throw new Error('New duration cannot exceed original duration.')
  }

  return {
    id: 'calc-time-saved',
    formula: 'original_seconds - new_seconds',
    inputs: input,
    referenceIds: [],
    result: input.originalSeconds - input.newSeconds,
    resultUnit: 'seconds',
    roundingRule: 'exact integer seconds',
  }
}

export function areaInAcres(squareMeters: number): CalculationRecord {
  const squareMetersPerAcre = getReferenceConstant(
    'ref-square-meters-per-acre',
  )
  return {
    id: 'calc-area-acres',
    formula: 'square_meters / square_meters_per_acre',
    inputs: { squareMeters },
    referenceIds: [squareMetersPerAcre.id],
    result: roundToSignificant(squareMeters / squareMetersPerAcre.value, 3),
    resultUnit: 'acres',
    roundingRule: 'three significant figures',
  }
}

export function perCapita(input: {
  total: number
  people: number
  unit: string
}): CalculationRecord {
  if (input.people <= 0) throw new Error('People must be greater than zero.')
  return {
    id: 'calc-per-capita',
    formula: 'total / people',
    inputs: input,
    referenceIds: [],
    result: roundToSignificant(input.total / input.people, 3),
    resultUnit: `${input.unit}/person`,
    roundingRule: 'three significant figures',
  }
}

export function throughputPerSecond(input: {
  count: number
  durationSeconds: number
  unit: string
}): CalculationRecord {
  if (input.durationSeconds <= 0) {
    throw new Error('Duration must be greater than zero.')
  }
  return {
    id: 'calc-throughput',
    formula: 'count / duration_seconds',
    inputs: input,
    referenceIds: [],
    result: roundToSignificant(input.count / input.durationSeconds, 3),
    resultUnit: `${input.unit}/second`,
    roundingRule: 'three significant figures',
  }
}

export function kilowattHoursFromWattHours(
  wattHours: number,
): CalculationRecord {
  const conversion = getReferenceConstant('ref-watt-hours-per-kwh')
  return {
    id: 'calc-energy-kwh',
    formula: 'watt_hours / watt_hours_per_kilowatt_hour',
    inputs: { wattHours },
    referenceIds: [conversion.id],
    result: roundToSignificant(wattHours / conversion.value, 3),
    resultUnit: 'kilowatt-hours',
    roundingRule: 'three significant figures',
  }
}

export function runDeterministicCalculation(
  request: CalculationRequest,
): CalculationRecord {
  switch (request.kind) {
    case 'attention':
      return aggregateAttention(request)
    case 'time_saved':
      return timeSaved(request)
    case 'area_acres':
      return areaInAcres(request.squareMeters)
    case 'per_capita':
      return perCapita(request)
    case 'throughput':
      return throughputPerSecond(request)
    case 'energy_kwh':
      return kilowattHoursFromWattHours(request.wattHours)
  }
}
