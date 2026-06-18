-- ─────────────────────────────────────────────────────────────
-- SOMI Command · Supabase schema (Fase 3)
-- Kør i Supabase → SQL Editor. Idempotent (kan køres igen).
-- ─────────────────────────────────────────────────────────────

-- KV-state for dashboardets eget kontrolpanel (1 bruger = dig).
create table if not exists public.dashboard_state (
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  key text not null,
  value jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);
alter table public.dashboard_state enable row level security;
drop policy if exists "own state" on public.dashboard_state;
create policy "own state" on public.dashboard_state
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Pipeline-data (delt med n8n; spejler felterne 1:1) ──
create table if not exists public.videos (
  video_id text primary key, case_id text, title text, status text,
  script_json jsonb, urls jsonb, created_at timestamptz default now()
);
create table if not exists public.ideas (
  id text primary key, case_id text, title text, hook text,
  source text, status text, priority int
);
create table if not exists public.costlog (
  id bigserial primary key, video_id text, step text, model text,
  usd_cost numeric, ts timestamptz default now()
);
create table if not exists public.qc_log (
  id bigserial primary key, case_id text, title text, verdict text,
  overall numeric, compliance numeric, flags jsonb, ts timestamptz default now()
);
create table if not exists public.stats_daily (
  id bigserial primary key, video_id text, date date,
  views bigint, watch_time bigint, subs bigint, rpm numeric
);
create table if not exists public.clicks (
  id bigserial primary key, slug text, video_id text, platform text, ts timestamptz default now()
);

-- RLS: browseren (din login) kan KUN læse. n8n skriver med service_role-nøglen,
-- som bypasser RLS — derfor ingen write-policy her.
do $$
declare t text;
begin
  foreach t in array array['videos','ideas','costlog','qc_log','stats_daily','clicks'] loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "auth read" on public.%I;', t);
    execute format('create policy "auth read" on public.%I for select using (auth.role() = ''authenticated'');', t);
  end loop;
end $$;

-- ── Opgave 4: kanal/platform-dimensioner + automatik ──
-- Kanal-attribution: ét punkt på videos; costlog & stats_daily joiner via video_id.
alter table public.videos add column if not exists channel_id text;

-- Indtjening på tværs af platforme (penge). service_role skriver (cron/n8n), login læser.
create table if not exists public.earnings (
  id bigserial primary key,
  channel_id text, platform text, date date, usd numeric, source text,
  ts timestamptz default now()
);
alter table public.earnings enable row level security;
drop policy if exists "auth read" on public.earnings;
create policy "auth read" on public.earnings
  for select using (auth.role() = 'authenticated');

-- Naturlige nøgler → idempotent upsert (cron + n8n-sync via PostgREST merge-duplicates)
create unique index if not exists stats_daily_video_date_uidx on public.stats_daily (video_id, date);
create unique index if not exists costlog_video_step_uidx on public.costlog (video_id, step);
create unique index if not exists qc_log_case_ts_uidx on public.qc_log (case_id, ts);
create unique index if not exists earnings_channel_platform_date_uidx on public.earnings (channel_id, platform, date);
