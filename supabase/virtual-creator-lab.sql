-- ─────────────────────────────────────────────────────────────
-- VIRTUAL CREATOR LAB · schema (separat brand, trackes i Command Center)
-- ANVENDT via Supabase MCP apply_migration "virtual_creator_lab_init" (2026-06-28).
-- Denne fil = versioneret reference (samme rolle som supabase/schema.sql).
-- Idempotent. RLS overalt. To klasser:
--   config-tabeller  → login (authenticated) kan CRUD (manuel Fase 1-indtastning)
--   maskin-tabeller  → login læser; n8n/cron/scraping skriver med service_role
-- Chat-logs gemmes KUN som summaries/metrics — aldrig fulde intime samtaler.
-- ─────────────────────────────────────────────────────────────

-- 1) Projekter — én række pr. virtual-creator-brand (vi starter med ét)
create table if not exists public.virtual_creator_projects (
  id text primary key,
  name text not null,
  brand text,
  status text default 'planning',           -- planning|building|live|paused
  launch_readiness int default 0,           -- 0-100 %
  compliance_score int default 0,           -- 0-100 %
  active_personas int default 0,
  next_action text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2) Personaer
create table if not exists public.virtual_creator_personas (
  id text primary key,
  project_id text references public.virtual_creator_projects(id) on delete cascade,
  name text,
  age_label text default '25+',
  disclosure_status text,
  visual_identity_status text,
  brand_style text,
  voice_tone text,
  forbidden_resemblance_notes text,
  asset_library_url text,
  prompt_bible_url text,
  disclosure_text text,
  last_updated timestamptz default now()
);

-- 3) Platforme (instagram|fanvue|fansly|landing)
create table if not exists public.virtual_creator_platforms (
  id text primary key,
  project_id text references public.virtual_creator_projects(id) on delete cascade,
  platform text not null,
  status text default 'not_setup',          -- not_setup|setup|active|paused|incompatible
  policy_score int default 0,               -- 0-100 (fra compliance-research)
  setup_checklist jsonb default '[]'::jsonb,
  manual_action text,
  revenue_enabled boolean default false,
  automation_enabled boolean default false,
  risk_level text default 'unknown',        -- low|medium|high|critical|unknown
  policy_source text,
  notes text,
  updated_at timestamptz default now()
);

-- 4) Content pipeline
create table if not exists public.virtual_creator_content (
  id text primary key,
  project_id text references public.virtual_creator_projects(id) on delete cascade,
  kind text,                                -- reel|post|story|ppv|concept
  stage text default 'idea',                -- idea|prompt|generated|compliance_review|approval|scheduled|published|review
  idea text,
  caption text,
  platform text,
  sfw boolean default true,
  compliance_status text default 'pending', -- pending|passed|failed
  approval_status text default 'pending',   -- pending|approved|rejected (human)
  scheduled_at timestamptz,
  published_at timestamptz,
  performance jsonb,
  is_remix_candidate boolean default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5) Assets (genererede filer + herkomst/seed)
create table if not exists public.virtual_creator_assets (
  id text primary key,
  project_id text references public.virtual_creator_projects(id) on delete cascade,
  content_id text references public.virtual_creator_content(id) on delete set null,
  source_tool text,
  prompt text,
  seed_config jsonb,
  file_path text,
  platform_target text,
  sfw boolean default true,
  compliance_status text default 'pending',
  approval_status text default 'pending',
  published_status text default 'unpublished',
  performance jsonb,
  created_at timestamptz default now()
);

-- 6) Compliance-checks (revisionsspor)
create table if not exists public.virtual_creator_compliance_checks (
  id bigserial primary key,
  project_id text references public.virtual_creator_projects(id) on delete cascade,
  content_id text,
  subject text,
  ai_disclosure_present boolean,
  platform_allowed boolean,
  classification text,                      -- sfw|nsfw
  no_real_person boolean,
  no_minor_or_young_look boolean,
  no_celebrity_similarity boolean,
  human_approval_required boolean,
  policy_source_checked text,
  verdict text,                             -- pass|fail|needs_review
  notes text,
  checked_at timestamptz default now()
);

-- 7) Funnel-metrics (scrape/cron/manuel CSV)
create table if not exists public.virtual_creator_metrics (
  id bigserial primary key,
  project_id text references public.virtual_creator_projects(id) on delete cascade,
  platform text,
  date date,
  impressions bigint, reach bigint, profile_visits bigint,
  link_clicks bigint, landing_visits bigint, paid_visits bigint,
  followers bigint, subscribers bigint,
  posts_published int,
  revenue numeric,
  source text,                              -- scrape|manual|api
  ts timestamptz default now()
);

-- 8) Revenue (penge pr. platform)
create table if not exists public.virtual_creator_revenue (
  id bigserial primary key,
  project_id text references public.virtual_creator_projects(id) on delete cascade,
  platform text, date date,
  gross numeric, fees numeric, net numeric,
  subscribers int, tips numeric, ppv_chat_revenue numeric,
  payout_status text,
  source text,                              -- manual|scrape|api
  notes text,
  ts timestamptz default now()
);

-- 9) Experiments
create table if not exists public.virtual_creator_experiments (
  id text primary key,
  project_id text references public.virtual_creator_projects(id) on delete cascade,
  hook text, visual_style text, cta text,
  platform text, posting_time text,
  result text, verdict text,                -- winner|loser|running|inconclusive
  next_test text,
  created_at timestamptz default now()
);

-- 10) Chat-logs SUMMARY (aldrig fulde intime samtaler — kun aggregerede metrics)
create table if not exists public.virtual_creator_chat_logs_summary (
  id bigserial primary key,
  project_id text references public.virtual_creator_projects(id) on delete cascade,
  platform text, date date,
  bot_enabled boolean default false,
  human_approval_required boolean default true,
  conversations_reviewed int,
  risk_flags jsonb default '[]'::jsonb,     -- aggregerede flag-typer + antal
  dm_conversions int,
  chat_revenue numeric,
  summary text,                             -- kort sammendrag, INGEN rå indhold
  notes text,
  ts timestamptz default now()
);

-- 11) Automation runs
create table if not exists public.virtual_creator_automation_runs (
  id bigserial primary key,
  project_id text references public.virtual_creator_projects(id) on delete cascade,
  workflow text,
  status text,                              -- ok|error|running
  last_run timestamptz,
  errors jsonb,
  manual_action_required boolean default false,
  deploy_status text,
  logs_url text,
  ts timestamptz default now()
);

-- ── RLS ──
-- Config-tabeller: authenticated kan CRUD (manuel Fase 1). service_role (n8n) bypasser RLS uanset.
do $$
declare t text;
begin
  foreach t in array array[
    'virtual_creator_projects','virtual_creator_personas','virtual_creator_platforms',
    'virtual_creator_content','virtual_creator_assets','virtual_creator_compliance_checks',
    'virtual_creator_experiments','virtual_creator_metrics','virtual_creator_revenue'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "auth all" on public.%I;', t);
    execute format('create policy "auth all" on public.%I for all using (auth.role() = ''authenticated'') with check (auth.role() = ''authenticated'');', t);
  end loop;
end $$;

-- Maskin-tabeller: login læser kun; service_role skriver (chat-summaries + automation).
do $$
declare t text;
begin
  foreach t in array array['virtual_creator_chat_logs_summary','virtual_creator_automation_runs'] loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "auth read" on public.%I;', t);
    execute format('create policy "auth read" on public.%I for select using (auth.role() = ''authenticated'');', t);
  end loop;
end $$;

-- ── Idempotente upsert-nøgler (scrape/cron/CSV) ──
create unique index if not exists vc_metrics_proj_platform_date_uidx on public.virtual_creator_metrics (project_id, platform, date);
create unique index if not exists vc_revenue_proj_platform_date_uidx on public.virtual_creator_revenue (project_id, platform, date);
create unique index if not exists vc_chat_proj_platform_date_uidx on public.virtual_creator_chat_logs_summary (project_id, platform, date);
create index if not exists vc_content_proj_stage_idx on public.virtual_creator_content (project_id, stage);
create index if not exists vc_platforms_proj_idx on public.virtual_creator_platforms (project_id);
