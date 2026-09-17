export type PipelineStage =
  | 'event_normalize'
  | 'claim_verify'
  | 'lens_propose'
  | 'write'
  | 'critique'

export interface EditorialModelProvider {
  readonly name: string
  readonly model: string
  generateJson<T>(input: {
    stage: PipelineStage
    system: string
    payload: unknown
  }): Promise<T>
}

function getResponseText(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Model response was not an object.')
  }
  const response = payload as {
    output_text?: string
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>
  }
  if (response.output_text) return response.output_text
  for (const item of response.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === 'output_text' && content.text) return content.text
    }
  }
  throw new Error('Model response did not contain output text.')
}

export class OpenAIEditorialProvider implements EditorialModelProvider {
  readonly name = 'openai'
  readonly model: string
  private readonly apiKey: string

  constructor(input: { apiKey: string; model: string }) {
    this.apiKey = input.apiKey
    this.model = input.model
  }

  async generateJson<T>(input: {
    stage: PipelineStage
    system: string
    payload: unknown
  }): Promise<T> {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        instructions: input.system,
        input: JSON.stringify(input.payload),
        text: { format: { type: 'json_object' } },
        metadata: {
          product: 'technology-editorial-engine',
          pipeline_stage: input.stage,
          prompt_version: 'v0.1',
        },
      }),
      signal: AbortSignal.timeout(45_000),
    })

    if (!response.ok) {
      throw new Error(`Editorial provider returned ${response.status}.`)
    }

    return JSON.parse(getResponseText(await response.json())) as T
  }
}

export function getEditorialModelProvider(): EditorialModelProvider | null {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null
  return new OpenAIEditorialProvider({
    apiKey,
    model: process.env.OPENAI_MODEL ?? 'gpt-5-mini',
  })
}
