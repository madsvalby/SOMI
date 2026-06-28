# Automation Plan — n8n / MCP / browser scraping

> Hvordan VCL automatiseres oven på den eksisterende stack (n8n Cloud + Supabase + Vercel cron).
> Service_role skriver `virtual_creator_*`-tabeller (bypasser RLS); dashboard læser. **Compliance-gates
> automatiseres aldrig væk** — kun det mekaniske.

## Dataflow
```
n8n / cron / MCP-scrape  --service_role-->  virtual_creator_*  --auth read-->  VCL-dashboard (read)
manuel indtastning (Fase 1)  --KV vcl_state via /api/state-->  VCL-dashboard (read/write)
```
Senere: en `/api/vcl`-rute læser de rigtige tabeller og flettes over KV (dynamisk-over-statisk), så
dashboardet skifter fra manuel til maskindata uden UI-ændring.

## n8n-workflows (byg i faser)
| Workflow | Fase | Funktion | Skriver til |
|---|---|---|---|
| `VCL-IDEAS` | 2 | auto-generér SFW IG-idéer (Claude via `/api/anthropic`-mønster) | `virtual_creator_content` (stage idea) |
| `VCL-CAPTION` | 2 | captions + CTA fra prompt-bible | `content.caption` |
| `VCL-SCHEDULE` | 2-3 | schedule **godkendte** SFW-posts (IG Graph/Buffer) | `content.scheduled_at/published_at` |
| `VCL-METRICS` | 2 | dagligt: followers/visits/clicks → upsert | `virtual_creator_metrics` |
| `VCL-REVENUE` | 2 | import (CSV/scrape) gross/fees/net/payout | `virtual_creator_revenue` |
| `VCL-CHAT-SUM` | 3 | opsummer chats (kun summary + flags) | `virtual_creator_chat_logs_summary` |
| `VCL-RUNLOG` | 2 | log hver kørsel + fejl | `virtual_creator_automation_runs` |

Mønster genbrugt fra eksisterende `app/api/cron/*` + `vercel.json` (cron 06:00 UTC, `CRON_SECRET`-guard).

## MCP / browser scraping (metrics ingen åben API giver)
- **Tilladt:** læse **egne** analytics (IG Insights for egen professional-konto), landing-side-metrics, Fanvue-dashboard-tal.
- **Ikke tilladt:** auto-follow/-like/-comment, cold-DM, købt engagement, høj-frekvent posting, scraping der omgår rate limits (ToS-brud → ban; jf. [`compliance.md`](compliance.md) §4).
- Browser/MCP bruges til at **aflæse** dashboards og skrive tal til Supabase — ikke til at manipulere engagement.

## Idempotens & guards
- Upsert på naturlige nøgler (`metrics/revenue/chat`: `project_id+platform+date`) → kørsel kan gentages.
- Hver workflow logger til `automation_runs` (status/last_run/errors/manual_action_required).
- **Approval-gate i n8n:** content med `approval_status != approved` må ikke nå `VCL-SCHEDULE`.

## Deploy
Vercel (eksisterende). Nye cron-ruter under `app/api/cron/vcl-*`. Env: ingen nye nøgler til Fase 1;
Fase 2 kan kræve IG Graph-token + evt. scraping-credentials (Mads indsætter selv, aldrig i git/chat).

## Risk-alerts (→ dashboard Automation-sektion)
n8n sætter `manual_action_required=true` ved: fejlet kørsel · policy-flag · credit/budget-tærskel ·
unormal metrics-drop. Dashboardet viser det som alert (samme mønster som CREDIT WATCH i Command.jsx).
