# CLAUDE.md — SOMI Command

> Læs denne fil + `docs/GROWTH-LOG.md` (nyeste øverst) først hver session. De er din fulde kontekst.
> Strategi/historik ud over koden ligger i Claude-memory (`MEMORY.md`-indekset).
> Repo-sti: `C:\Users\madsv\Desktop\Projekter\Kode\somi-app`. GitHub: `madsvalby/SOMI`. Vercel: auto-deploy fra `main`.

## Hvad er det her
SOMI Command er kommandocentralen for den faceless YouTube-dokumentarkanal **Paper Empires**
(financial-crime / corporate-collapse / fallen empires), drevet af en n8n-pipeline. Appen er en
**Next.js + Supabase**-webapp — den startede som en porteret Claude-artifact men er nu vokset til et
fuldt drifts-dashboard (17 faner) + et imperium-ben (6 AI-venture-landingssider under `/imperium`).

Ejeren er **Mads** (skriver dansk — svar på dansk). Hold svar korte og tekniske.

## Status (jun. 2026) — LIVE i drift
- Deployet på Vercel fra `main`, kører i produktion. `npm run build` skal være grøn før push.
- Login-bruger: `madsvalby@gmail.com`. Auth via `@supabase/ssr`.
- Det aktive arbejde er **selv-forbedrende vækstprogram** for kanalen (idé→produktion→måling→læring),
  ikke længere app-opbygning. Pipelinen kører i n8n (cloud). Se `docs/GROWTH-LOG.md` + memory.
- ⚠️ Produktions-emnekø læses fra **n8n Data Table** `fyNFjFIXaHME4h6b`, IKKE Supabase. Supabase
  ideas/videos = dashboard-mirror (SYNC: DataTable→Supabase). Lav ALDRIG produktionsændringer
  direkte i Supabase — skriv emner via n8n.

## Stak
Next.js 14.2.x (App Router, **JavaScript — ikke TypeScript**), React 18, `@supabase/ssr`,
`lucide-react`. **Ingen Tailwind** (komponenterne har egne `<style>`-blokke). Storage via Supabase.

## Dashboard-faner (kilde: `app/dashboard/Command.jsx`, `NAV_GROUPS`)
17 faner i 5 grupper. `tab`-state i Command.jsx; hver fane rendres af en komponent i `app/dashboard/`:

| Gruppe | Fane (id) | Komponent |
|---|---|---|
| — | Overblik (`overblik`) | inline i Command.jsx + `TodaysMission`, `SideQuests`, `InsightsPanel` |
| — | Udvikling (`udvikling`) | `PerformanceTab.jsx` |
| — | Rapporter (`rapporter`) | `ReportsTab.jsx` |
| — | Agenter (`agenter`) | `AgentsTab.jsx` |
| Drift | Kanaler (`kanaler`) | inline + `PackagingDoctor`, `CompetitorBenchmark` |
| Drift | Idé-kø (`ko`) | `IdeaQueueBoard.jsx` |
| Drift | Opslag (`opslag`) | inline (content-kadence/checkliste) |
| Drift | System (`system`) | inline |
| Økonomi | Kreditter (`kreditter`) | inline |
| Økonomi | Økonomi (`okonomi`) | inline |
| Plan | Byggeplan (`byggeplan`) | inline (FASE-data) |
| Plan | Roadmap (`roadmap`) | inline |
| Plan | Launchpad (`launchpad`) | inline |
| Imperiet | Kommende projekter (`kommende`) | `ImperiumTab view="plans"` |
| Imperiet | Roadmaps (`roadmaps`) | `CompanyRoadmaps.jsx` (+ `companyRoadmapsData.js`) |
| Imperiet | Eksempler (`eksempler`) | `ImperiumTab view="examples"` |
| Imperiet | Labs / AI Businesses (`labs`) | `LabsTab.jsx` |

## Filkort
| Fil | Rolle |
|---|---|
| `app/dashboard/Command.jsx` | Dashboardets skal: nav, state, og de inline-rendrede faner |
| `app/dashboard/*Tab.jsx` m.fl. | Fane-komponenter (se tabel ovenfor) |
| `app/dashboard/page.jsx` | Server-side auth-gate |
| `app/login/page.jsx` | Login (e-mail + adgangskode) |
| `app/imperium/**` | 6 venture-landingssider + `/imperium/privacy` + delte `_components/` |
| `app/api/*/route.js` | API-ruter (se nedenfor) |
| `lib/supabase/{client,server,middleware}.js` | supabase-ssr wiring |
| `lib/agents.js`, `lib/agentSkills.js`, `lib/dashboardState.js` | Agenter-modul + KV-helpers |
| `middleware.js` | Beskytter alt undtagen `/login`, `/imperium*` og `/api` |
| `supabase/schema.sql` | Oprindeligt schema (reference — DB er siden udvidet, se Supabase MCP) |
| `docs/GROWTH-LOG.md` | Løbende vækst-/ændringslog (nyeste øverst) — LÆS DENNE |
| `gpu-worker/` | Drop-in GPU-render-worker (Dockerfile, validerede pins) — klar, ikke i drift |
| `vercel.json` | Cron-konfiguration |

## API-ruter (`app/api/`)
`state` (KV til `dashboard_state`), `anthropic` (server-proxy, holder nøglen), `ideas`, `agents`,
`analytics`, `performance`, `competitors`, `credits`, `reports`, `pipeline`, `imperium-stats`,
`imperium-track` (anonym funnel-tracking), `cron/*` (daglige jobs).

## Supabase
- Projekt: **"SOMI Dashbord"**, ref `ihmgmpuptlmxokdmdirm`, region `eu-west-1`, Postgres 17.
- **17 tabeller** (ikke 7 — DB er vokset): `dashboard_state` (KV: user_id/key/value jsonb, RLS "own state"),
  `videos`, `ideas`, `costlog`, `qc_log`, `stats_daily`, `clicks`, `channel_daily`, `comments`,
  `competitors`, `credits`, `earnings`, `experiments`, `foundry_orders`, `imperium_events`, `reports`,
  `video_metrics`. Pipeline-tabeller har RLS "auth read" (SELECT); n8n skriver med **service_role**.
- **Supabase MCP er tilgængelig** — brug den til at inspicere/migrere. `apply_migration` til DDL.
  Hardkod aldrig genererede ID'er i data-migrationer.

## Miljøvariabler  (`.env.local` lokalt · Vercel-env i prod)
| Variabel | Kilde |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → publishable/anon-nøgle |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → secret/service_role (**kun server**) |
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `CRON_SECRET` | tilfældig streng |
| `N8N_API_KEY` | n8n → Settings → n8n API (live agent-status; valgfri, falder tilbage til demo) |
| `N8N_IDEAS_WEBHOOK_URL` | "SOMI IDEAS INTAKE" (`gPsOB8YR1nveyn8i`) prod-URL (valgfri; se `docs/setup-ideas-loop.md`) |
| `YOUTUBE_API_KEY` | YouTube Data API v3 (konkurrent-benchmark; valgfri) |

## Regler (vigtigt)
- **Hemmeligheder aldrig i git eller i klienten.** `.env.local` er git-ignored. `service_role`-nøglen
  må aldrig i en `NEXT_PUBLIC_`-variabel eller i browser-kode.
- **Mads indsætter selv alle nøgler** — bed ham, indsæt dem ikke, og bed ham aldrig om at lime dem i chatten.
- Kør altid `npm run build` lokalt før deploy.
- **Produktionsændringer (emner/pipeline) ALDRIG direkte i Supabase** — gå via n8n DataTable/webhook.
- **Design (jun. 2026): lyst/guld hybrid** ("Paper Empires Command Center") — lys bg (`--bg:#F6F7FB`),
  hvide kort med bløde skygger, guld-accent `#C9A14E`, Fraunces / Inter / JetBrains Mono. CSS-variabler
  i `Command.jsx`'s `<style>`-blok. Imperium-siderne bruger samme guld-accent på mørkere baggrund.
  Lav ikke om på komponenternes *logik* uden grund — kun udseende/nye sektioner.

## Kommando-cheatsheet
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # verificér før deploy
npm run start    # prod-server lokalt
```
