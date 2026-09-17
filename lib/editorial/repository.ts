import { fixturePerspectives, getFixturePerspective } from './fixtures'
import type { Perspective } from './types'

export interface EditorialRepository {
  getActivePerspectives(): Promise<Perspective[]>
  getPerspective(idOrSlug: string): Promise<Perspective | null>
  recordSessionDraw(input: {
    sessionId: string
    perspective: Perspective
  }): Promise<void>
}

class FixtureEditorialRepository implements EditorialRepository {
  async getActivePerspectives(): Promise<Perspective[]> {
    return fixturePerspectives
  }

  async getPerspective(idOrSlug: string): Promise<Perspective | null> {
    return getFixturePerspective(idOrSlug)
  }

  async recordSessionDraw(): Promise<void> {
    // Fixture mode intentionally keeps session history in sessionStorage.
  }
}

let repositoryPromise: Promise<EditorialRepository> | null = null

export async function getEditorialRepository(): Promise<EditorialRepository> {
  if (!repositoryPromise) {
    repositoryPromise = (async () => {
      if (
        process.env.EDITORIAL_STORAGE === 'postgres' &&
        process.env.DATABASE_URL
      ) {
        const { PostgresEditorialRepository } = await import(
          './repository-postgres'
        )
        return new PostgresEditorialRepository(process.env.DATABASE_URL)
      }
      return new FixtureEditorialRepository()
    })()
  }

  return repositoryPromise
}
