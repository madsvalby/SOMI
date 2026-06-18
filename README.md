# SOMI Command — live kommandocentral

Din kommandocentral porteret til **Next.js + Supabase**, klar til Vercel (Fase 3).
Forsiden er `somi_command.jsx` løftet 1:1 over; `window.storage` er byttet til Supabase
bag et login, og idé-AI'en kører nu server-side, så API-nøglen aldrig rammer browseren.

## Hvad er hvad

```
app/dashboard/Command.jsx   ← din kommandocentral (uændret logik)
app/dashboard/page.jsx      ← server-side auth-gate
app/login/page.jsx          ← login (e-mail + adgangskode)
app/api/state/route.js      ← læser/skriver dashboard-state i Supabase
app/api/anthropic/route.js  ← server-side proxy til Anthropic (holder nøglen)
app/api/cron/youtube/route.js ← daglig cron-stub (YouTube Analytics → stats_daily)
lib/supabase/*              ← supabase-ssr wiring (browser / server / middleware)
middleware.js               ← beskytter alt undtagen /login og /api
supabase/schema.sql         ← kør denne i Supabase (tabeller + RLS)
vercel.json                 ← daglig cron 06:00 UTC
.env.example                ← skabelon til miljøvariabler
```

## Trin 1 — Supabase

1. Opret et projekt på [supabase.com](https://supabase.com) (free-tier).
2. **SQL Editor** → indsæt hele `supabase/schema.sql` → Run.
3. **Authentication → Users → Add user** → din e-mail + en adgangskode, sæt **Auto Confirm**.
   (Ingen e-mail-opsætning nødvendig — det er kun dig.)
4. **Settings → API**: notér `Project URL`, den **publishable/anon**-nøgle og den
   **secret/service_role**-nøgle (sidstnævnte kun til server/n8n — aldrig i klienten).

## Trin 2 — Kør lokalt

```bash
cp .env.example .env.local      # udfyld med dine Supabase-/Anthropic-værdier
npm install
npm run dev                     # → http://localhost:3000  (log ind med brugeren fra trin 1)
```

## Trin 3 — Deploy til Vercel

1. Push mappen til et GitHub-repo.
2. [vercel.com](https://vercel.com) → **Add New → Project** → importér repoet.
3. **Environment Variables** — sæt de samme som i `.env.local`:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `CRON_SECRET`.
4. **Deploy**. Tilføj evt. dit eget domæne under **Settings → Domains**.
5. I Supabase: **Authentication → URL Configuration** → sæt **Site URL** til din Vercel-/domæne-URL.

Cron'en i `vercel.json` kalder `/api/cron/youtube` hver dag 06:00 UTC automatisk.

## Trin 4 — Live pipeline-data (næste increment)

Lige nu kører dashboardets eget kontrolpanel på Supabase. For at vise **live** pipeline-status:

1. Lad n8n skrive til Supabase-tabellerne `videos`/`costlog`/`qc_log` (brug **service_role**-nøglen
   i en Postgres-/Supabase-node — den bypasser RLS).
2. Bind Økonomi- og kø-visningerne til de tabeller i stedet for manuel indtastning.
3. Fyld `/api/cron/youtube` ud med et rigtigt YouTube Analytics-kald → `stats_daily`.

## Alternativ: din egen VPS

Vil du hellere køre det på din render-VPS i stedet for Vercel:
`npm run build && npm run start` (port 3000) bag nginx + certbot, som en systemd-unit
ligesom render-serveren. Supabase forbliver managed. Cron'en sættes så op som et almindeligt
cronjob der curler `/api/cron/youtube` med `Authorization: Bearer $CRON_SECRET`.

## Sikkerhed

- Hemmeligheder lever **kun** i miljøvariabler (lokalt i `.env.local`, i prod i Vercel/host). Commit dem aldrig.
- `service_role`-nøglen er server-only. Den må aldrig i en `NEXT_PUBLIC_`-variabel eller i browseren.
- Alt bag `/dashboard` og `/api` kræver login; `/api`-routes svarer 401 uden gyldig session.
