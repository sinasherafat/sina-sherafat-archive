type MetricName =
  | 'ingest_freshness'
  | 'active_event_count'
  | 'approved_inventory_size'
  | 'generation_rejection_rate'
  | 'calculation_failure'
  | 'correction_rate'
  | 'repetition_rate'
  | 'selection_latency'

export function logMetric(
  name: MetricName,
  value: number,
  context: Record<string, string | number | boolean> = {},
): void {
  console.info(
    JSON.stringify({
      type: 'editorial_metric',
      name,
      value,
      context,
      at: new Date().toISOString(),
    }),
  )
}

export function logPipelineEvent(
  stage: string,
  outcome: 'started' | 'passed' | 'rejected' | 'failed' | 'skipped',
  context: Record<string, string | number | boolean> = {},
): void {
  console.info(
    JSON.stringify({
      type: 'editorial_pipeline',
      stage,
      outcome,
      context,
      at: new Date().toISOString(),
    }),
  )
}
