# Technology Editorial Engine v0.1

The engine is a feature inside the Sina Sherafat Personal Archive. Its reader,
stable perspective routes, and About page reuse the Archive's global logo,
header, navigation, theme system, typography, footer, and responsive shell.

## Reader path

The reader receives only `approved` or `active` perspectives. The initial page
ships with a reviewed fixture immediately. `Another perspective →` posts the
last eight perspective IDs, four event IDs, and three lens IDs to the selection
route. The route applies hard anti-repeat filters, event and lens diversity, and
quality-squared weighted sampling. It never calls a model.

The Preview inventory contains 36 perspectives across 12 clearly labeled
synthetic events. It exercises the full reader without pretending to be current
news.

## Editorial path

The live architecture is separated into narrow stages:

1. Registry fetch → source snapshots with canonical hashes.
2. Event normalize → event object and candidate claims.
3. Claim verify → typed, attributed, publishable claims.
4. Lens propose → three to eight grounded candidates.
5. Calculate → deterministic code plus versioned reference constants.
6. Write → one claim set, one lens, optional verified calculation.
7. Critique → pass, rewrite once, or reject.
8. Publish gate → approved perspective with complete provenance.

The model provider is optional and isolated behind `EditorialModelProvider`.
The reader remains usable when generation, intake, or the database is absent.

## Storage

`db/migrations/001_editorial_engine.sql` creates the canonical relational model:
sources, events, event-source joins, claims, reference constants, calculations,
perspectives, perspective-source joins, session draws, editorial reviews, and
corrections.

`EDITORIAL_STORAGE=fixture` is the safe default. Set `EDITORIAL_STORAGE=postgres`
with `DATABASE_URL`, run `pnpm db:migrate`, and then `pnpm db:seed` to use durable
storage.

## Operations

Vercel calls `/api/jobs/editorial` daily on the current Hobby-compatible
schedule. On a Pro project, change the expression to `17 * * * *` for the
intended hourly cadence. The endpoint requires `CRON_SECRET` and remains a no-op
unless `ENABLE_LIVE_INGESTION=true`. When enabled, it also requires Postgres
storage and a model credential, runs each typed stage through the hard publish
gate, and persists approved or rejected results for audit.
Structured logs cover ingest freshness, pool size, generation decisions,
calculation failures, corrections, repetition, and selection latency without
user profiling.

Corrections supersede claims, identify dependent perspectives, mark them
corrected/unpublished, and preserve the note rather than silently rewriting a
durable URL.
