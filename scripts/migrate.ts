import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is required to apply migrations.')
}

const sql = postgres(connectionString, { max: 1, prepare: false })
const migrationDirectory = join(process.cwd(), 'db', 'migrations')

async function main() {
  try {
  await sql.unsafe(`
    create table if not exists editorial_schema_migrations (
      name text primary key,
      applied_at timestamptz not null default now()
    )
  `)
  const applied = await sql<{ name: string }[]>`
    select name from editorial_schema_migrations
  `
  const appliedNames = new Set(applied.map((migration) => migration.name))
  const files = (await readdir(migrationDirectory))
    .filter((file) => file.endsWith('.sql'))
    .sort()

  for (const file of files) {
    if (appliedNames.has(file)) continue
    const contents = await readFile(join(migrationDirectory, file), 'utf8')
    await sql.begin(async (transaction) => {
      await transaction.unsafe(contents)
      await transaction`
        insert into editorial_schema_migrations (name) values (${file})
      `
    })
    console.info(`Applied ${file}`)
  }
  } finally {
    await sql.end()
  }
}

void main()
