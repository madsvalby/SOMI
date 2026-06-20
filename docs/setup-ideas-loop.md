# Auto-idé-loop (winner-loop → ideas-tabel)

Lukker loop'en: vindere → AI-forslag → idé-køen. To lag.

## Lag A — app → Supabase (live, ingen opsætning)

- Winner-loop'en (`/api/analytics`) finder vinderne. På **Agenter**-fanen kan du
  trykke **Foreslå idéer** og **Gem i kø** / **Gem alle**.
- Forslag skrives til Supabase-tabellen `ideas` med `source='winner-loop'`,
  `status='proposed'`. De vises i **Idé-kø**-fanen ("Auto-forslag fra winner-loop").
- Ugentlig cron (`/api/cron/ideas`, mandag 07:00 UTC) gør det samme automatisk.
  No-op indtil kanalen har views i `stats_daily`.
- **Vigtigt:** `status='proposed'` betyder at intet auto-produceres — du godkender selv.

Nøgle-design: app, n8n og SYNC deler `case_id`-slug (Supabase `ideas.id = case_id`),
så samme idé aldrig bliver til to rækker, uanset hvilken vej den kom ind.

## Lag B — Supabase-forslag → n8n produktions-kø (kræver 2 trin)

Uden Lag B når forslagene **ikke** n8n's produktions-pipeline (TREND/MASTER trækker
fra n8n's egen ideas Data Table, ikke Supabase). Sådan kobles broen på:

1. **Aktivér intake-workflowet.** Åbn
   `SOMI IDEAS INTAKE: forslag til ideas-tabel`
   (id `gPsOB8YR1nveyn8i`,
   https://madsvalby.app.n8n.cloud/workflow/gPsOB8YR1nveyn8i) og slå **Active** til.
   Kopiér **Production URL** fra `Idé-intake (POST)`-noden
   (typisk `https://madsvalby.app.n8n.cloud/webhook/somi-ideas-intake`).

2. **Sæt env-variablen.** I Vercel (Project → Settings → Environment Variables)
   og i `.env.local`:
   ```
   N8N_IDEAS_WEBHOOK_URL=https://madsvalby.app.n8n.cloud/webhook/somi-ideas-intake
   ```
   Redeploy. Herefter pusher både "Gem i kø" og cron'en forslagene videre til
   n8n's ideas Data Table (intaken tvinger `status='proposed'`).

### Hvordan det hænger sammen

```
winner-loop ─► /api/ideas (POST)
                 ├─► Supabase ideas  (id=case_id, status=proposed)   ← vises i dashboard
                 └─► n8n IDEAS INTAKE webhook ─► n8n ideas Data Table (status=proposed)
                                                   │
                                  SYNC (hver 15. min) ─► Supabase  (merger på id=case_id, ingen dublet)
```

Når du vil sætte et forslag i produktion: skift dets `status` i n8n's ideas-tabel
fra `proposed` til `candidate` (eller `ready`) — så indgår det i MASTER's normale flow.
`proposed` indgår hverken i MASTER eller i TREND's backlog-tælling.
