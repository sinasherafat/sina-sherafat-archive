# Technology Editorial Engine

A quiet editorial instrument that turns source-backed technology events into
human-scale observations.

## Local development

```bash
pnpm install
pnpm dev
```

The application defaults to a reviewed fixture inventory: 36 perspectives
across 12 synthetic events. No model or database is required to test the reader.

## Validation

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm db:validate
pnpm build
```

## Durable storage

Copy `.env.example`, configure `DATABASE_URL`, and explicitly select Postgres:

```bash
EDITORIAL_STORAGE=postgres pnpm db:migrate
EDITORIAL_STORAGE=postgres pnpm db:seed
```

The migration includes the full provenance model. Fixture mode remains the safe
fallback when storage is unavailable.

## Live intake

Live generation is intentionally opt-in. Configure `CRON_SECRET`,
`OPENAI_API_KEY`, `OPENAI_MODEL`, `DATABASE_URL`, and
`EDITORIAL_STORAGE=postgres`, then set `ENABLE_LIVE_INGESTION=true`. The
protected Vercel cron route runs the narrow editorial stages and stores both
approved and rejected outcomes for audit. The reader never invokes generation
synchronously.

See [the architecture](docs/architecture.md) and
[fixture policy](docs/editorial-fixtures.md) for operational details.
