create extension if not exists pgcrypto;

create table if not exists sources (
  id text primary key,
  url text not null,
  title text not null,
  publisher text not null,
  published_at timestamptz not null,
  source_tier text not null check (source_tier in ('A', 'B', 'C', 'D')),
  fetched_at timestamptz not null,
  canonical_hash text not null unique,
  fixture boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists events (
  id text primary key,
  title_internal text not null,
  category text not null,
  event_at timestamptz not null,
  created_at timestamptz not null default now(),
  freshness_score smallint not null check (freshness_score between 0 and 100),
  significance_score smallint not null check (significance_score between 0 and 100),
  transformability_score smallint not null check (transformability_score between 0 and 100),
  source_confidence_score smallint not null check (source_confidence_score between 0 and 100),
  novelty_score smallint not null check (novelty_score between 0 and 100),
  voice_fit_score smallint not null check (voice_fit_score between 0 and 100),
  status text not null check (status in ('watch', 'eligible', 'active', 'rejected', 'stale')),
  fixture boolean not null default false
);

create table if not exists event_sources (
  event_id text not null references events(id) on delete cascade,
  source_id text not null references sources(id) on delete restrict,
  is_primary boolean not null default false,
  primary key (event_id, source_id)
);

create table if not exists claims (
  id text primary key,
  event_id text not null references events(id) on delete cascade,
  source_id text not null references sources(id) on delete restrict,
  text text not null,
  claim_type text not null check (claim_type in ('observed', 'reported', 'company_claim', 'estimate', 'projection', 'opinion')),
  confidence text not null check (confidence in ('high', 'medium', 'low')),
  source_span text not null,
  event_at timestamptz not null,
  numeric_payload jsonb not null default '[]'::jsonb,
  supersedes_claim_id text references claims(id) on delete set null,
  fixture boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists reference_constants (
  id text primary key,
  name text not null,
  value numeric not null,
  unit text not null,
  geography text,
  period text not null,
  source_url text not null,
  source_tier text not null check (source_tier in ('A', 'B', 'C', 'D')),
  version text not null,
  notes text not null,
  created_at timestamptz not null default now()
);

create table if not exists perspectives (
  id text primary key,
  slug text not null unique,
  event_id text not null references events(id) on delete cascade,
  lens text not null check (lens in ('scale', 'human', 'time', 'money', 'physical', 'historical', 'behavioral', 'infrastructure', 'language', 'institutional', 'absurd')),
  form text not null check (form in ('observation', 'scale', 'footnote', 'longer_note')),
  body text not null,
  source_line text not null,
  quality_score smallint not null check (quality_score between 0 and 100),
  absurdity_level smallint not null check (absurdity_level between 0 and 3),
  status text not null check (status in ('draft', 'evaluated', 'approved', 'active', 'stale', 'archived', 'rejected', 'corrected', 'unpublished')),
  corrected boolean not null default false,
  correction_note text,
  fixture boolean not null default false,
  prompt_version text not null,
  model_version text not null,
  reference_dataset_version text not null,
  source_snapshot_id text,
  created_at timestamptz not null default now(),
  activated_at timestamptz
);

create table if not exists perspective_sources (
  perspective_id text not null references perspectives(id) on delete cascade,
  source_id text not null references sources(id) on delete restrict,
  primary key (perspective_id, source_id)
);

create table if not exists calculations (
  id text primary key,
  perspective_id text references perspectives(id) on delete cascade,
  formula text not null,
  inputs_json jsonb not null,
  result numeric not null,
  result_unit text not null,
  rounding_rule text not null,
  reference_ids text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists session_draws (
  id bigint generated always as identity primary key,
  session_id text not null,
  perspective_id text not null references perspectives(id) on delete cascade,
  event_id text not null references events(id) on delete cascade,
  lens text not null,
  shown_at timestamptz not null default now()
);

create table if not exists editorial_reviews (
  id bigint generated always as identity primary key,
  perspective_id text not null references perspectives(id) on delete cascade,
  decision text not null check (decision in ('PASS', 'REWRITE_ONCE', 'REJECT')),
  scores jsonb not null,
  failure_reasons jsonb not null default '[]'::jsonb,
  reviewer_type text not null,
  model_version text,
  prompt_version text not null,
  created_at timestamptz not null default now()
);

create table if not exists corrections (
  id bigint generated always as identity primary key,
  event_id text not null references events(id) on delete cascade,
  old_claim_id text references claims(id) on delete set null,
  new_claim_id text references claims(id) on delete set null,
  note text not null,
  source_id text not null references sources(id) on delete restrict,
  corrected_at timestamptz not null default now(),
  affected_perspective_ids text[] not null default '{}'
);

create index if not exists perspectives_active_quality_idx
  on perspectives (status, quality_score desc)
  where status in ('approved', 'active') and corrected = false;

create index if not exists session_draws_session_recent_idx
  on session_draws (session_id, shown_at desc);

create index if not exists claims_event_idx on claims (event_id);
create index if not exists events_active_time_idx on events (status, event_at desc);
