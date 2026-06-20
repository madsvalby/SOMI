# CLAUDE.md — SOMI Command

> Læs denne fil først hver session. Den er din fulde kontekst på projektet.

## Hvad er det her
SOMI Command er kommandocentralen for den faceless YouTube-dokumentarkanal **Paper Empires**
(financial-crime / corporate-collapse), drevet af en n8n-pipeline. Denne app er dashboardet
porteret fra en Claude-artifact til en rigtig **Next.js + Supabase**-webapp (masterplanens Fase 3).
Forsiden (`app/dashboard/Command.jsx`) er hele kommandocentralen; resten er auth, persistence
og en API-proxy rundt om den.

Ejeren er **Mads** (skriver dansk — svar på dansk). Hold svar korte og tekniske.

## Status — hvad er allerede gjort
- Repoet er bygget og `npm run build` kører rent (Next 14.2.x).
- Supabase-projektet er oprettet og `supabase/schema.sql` er kørt: 7 tabeller med RLS + policyer,
  og hardened (API-eksponering af `rls_auto_enable` er fjernet).
- Login-bruger er oprettet: `madsvalby@gmail.com`.

## Hvad mangler — din opgave (definition of done)
1. **Kør lokalt.** Lav `.env.local` fra `.env.example` (Mads indsætter selv nøglerne), `npm install`,
   `npm run dev`. Log ind med `madsvalby@gmail.com`. Verificér at en handling i dashboardet skriver
   en række til `dashboard_state` (tjek via Supabase MCP: `select count(*) from dashboard_state`).
2. **Verificér idé-AI.** I en kanal → "foreslå idéer" skal ramme `/api/anthropic` uden fejl
   (kræver `ANTHROPIC_API_KEY`).
3. **Deploy.** `git init` + push til GitHub → importér i Vercel → sæt de 5 env-variabler → deploy.
   Sæt derefter Supabase → **Authentication → URL Configuration → Site URL** til Vercel/domæne-URL'en.
4. **Næste increment (ikke nødvendigt for "live"):** lad n8n skrive til `videos`/`costlog`/`qc_log`
   (service_role-nøgle, bypasser RLS); bind Økonomi-/kø-visningerne til de tabeller i stedet for
   manuel indtastning; implementér YouTube Analytics i cron-routen → `stats_daily`.

## Stak
Next.js 14.2.x (App Router, **JavaScript — ikke TypeScript**), React 18, `@supabase/ssr`,
`lucide-react`. **Ingen Tailwind** (komponenten har sin egen `<style>`-blok). Persistent storage via Supabase.

## Filkort
| Fil | Rolle |
|---|---|
| `app/dashboard/Command.jsx` | Hele dashboardet (~1730 linjer, uændret logik fra artifact) |
| `app/dashboard/page.jsx` | Server-side auth-gate |
| `app/login/page.jsx` | Login (e-mail + adgangskode) |
| `app/api/state/route.js` | Læser/skriver `dashboard_state` (KV) i Supabase |
| `app/api/anthropic/route.js` | Server-side proxy til Anthropic — holder nøglen |
| `app/api/cron/youtube/route.js` | Daglig cron-stub (endnu ikke implementeret) |
| `lib/supabase/{client,server,middleware}.js` | supabase-ssr wiring |
| `middleware.js` | Beskytter alt undtagen `/login` og `/api` |
| `supabase/schema.sql` | Det kørte schema (reference) |
| `vercel.json` | Cron 06:00 UTC |

## Supabase
- Projekt: **"SOMI Dashbord"**, ref `ihmgmpuptlmxokdmdirm`, region `eu-west-1`, Postgres 17.
- `dashboard_state`: KV (`user_id`, `key`, `value` jsonb). RLS-policy "own state" (ALL, `auth.uid() = user_id`).
- `videos` / `ideas` / `costlog` / `qc_log` / `stats_daily` / `clicks`: pipeline-data delt med n8n.
  RLS "auth read" (SELECT). n8n skriver med **service_role**-nøglen (bypasser RLS).
- **Supabase MCP er tilgængelig** — brug den til at inspicere og migrere DB. Brug `apply_migration`
  til DDL. Hardkod aldrig genererede ID'er i data-migrationer.

## Miljøvariabler  (`.env.local` lokalt · Vercel-env i prod)
| Variabel | Kilde |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → publishable/anon-nøgle |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → secret/service_role (**kun server**) |
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `CRON_SECRET` | en tilfældig streng du selv finder på |
| `N8N_API_KEY` | n8n → Settings → n8n API (til live agent-status på Agenter-fanen; valgfri — UI falder tilbage til demo uden den) |
| `N8N_IDEAS_WEBHOOK_URL` | Auto-idé-loop Lag B: production-URL fra workflowet "SOMI IDEAS INTAKE" (`gPsOB8YR1nveyn8i`). Valgfri — uden den skrives forslag kun til Supabase. Se `docs/setup-ideas-loop.md` |

## Regler (vigtigt)
- **Hemmeligheder aldrig i git eller i klienten.** `.env.local` er git-ignored. `service_role`-nøglen
  må aldrig i en `NEXT_PUBLIC_`-variabel eller i browser-kode.
- **Mads indsætter selv alle nøgler** — bed ham gøre det, indsæt dem ikke for ham, og bed ham aldrig
  om at lime dem ind i chatten.
- Kør altid `npm run build` lokalt før deploy.
- **Design (opdateret jun. 2026): lyst/guld hybrid-tema** ("Paper Empires Command Center") — lys baggrund
  (`--bg:#F6F7FB`), hvide kort med bløde skygger, guld-accent `#C9A14E`. Fraunces / Inter / JetBrains Mono.
  Temaet styres af CSS-variabler i `Command.jsx`'s `<style>`-blok (`--bg/--panel/--field/--ink/--num/--bone*`).
  Tidligere noir-tema er afløst. Lav ikke om på `Command.jsx`'s *logik* uden grund — kun udseende/nye sektioner.
- **Agenter-modul:** `app/dashboard/AgentsTab.jsx` + `lib/agents.js` (roster mappet til n8n-workflows) +
  `lib/agentSkills.js` (`MOCK_SKILLS` + `runSkill()` n8n-webhook-stub) + `lib/dashboardState.js` (delte KV-helpers).
  Agent-status er pt. DEMO/mock indtil n8n-executions wires ind. Skills-state gemmes i KV `somi_agent_skills_v1`.

## Kommando-cheatsheet
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # verificér før deploy
npm run start    # prod-server lokalt
```
