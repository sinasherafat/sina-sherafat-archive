import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const requiredTables = [
  'sources',
  'events',
  'event_sources',
  'claims',
  'reference_constants',
  'calculations',
  'perspectives',
  'perspective_sources',
  'session_draws',
  'editorial_reviews',
  'corrections',
]
async function main() {
  const directory = join(process.cwd(), 'db', 'migrations')
  const files = (await readdir(directory)).filter((file) => file.endsWith('.sql'))
  if (files.length === 0) throw new Error('No SQL migrations found.')

  const sql = (
    await Promise.all(files.map((file) => readFile(join(directory, file), 'utf8')))
  ).join('\n')
  const missing = requiredTables.filter(
    (table) => !new RegExp(`create table if not exists ${table}\\b`, 'i').test(sql),
  )
  if (missing.length > 0) {
    throw new Error(`Missing canonical tables: ${missing.join(', ')}`)
  }
  if (!sql.includes('perspectives_active_quality_idx')) {
    throw new Error('Active inventory index is missing.')
  }
  console.info(
    `Validated ${files.length} migration file with ${requiredTables.length} canonical tables.`,
  )
}

void main()
