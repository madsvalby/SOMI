# Virtual Creator Lab

Compliance-first AI **virtual creator**-pipeline. Separat brand fra Paper Empires, men trackes
internt i SOMI Command Center via fanen **Creator → Virtual Creator Lab**.

> Status: **ikke lanceret.** Fase 0 (fundament) er bygget: dashboard-tab + Supabase-datalag +
> compliance-skelet. Resten (policy-research, landing, content-/chat-/automation-design,
> growth-loop) bygges i faser — se nederst.

## Hvad det er (og ikke er)
- **Persona:** tydeligt AI/syntetisk, **discloseret**, 25+, ligner **ingen** rigtig person.
  International English. Brandes som AI-powered virtual creator.
- **Funnel:** Instagram = **kun SFW** discovery/trust → link-hub → AI-tolerant paid platform.
- **Monetization:** **Fanvue** primær. **Fansly** kun hvis aktuel policy tillader persona-stilen
  (ellers `incompatible`/pause). **OnlyFans** ikke prioriteret i fase 1.
- **Det her bygger vi ikke:** eksplicit seksuelt indhold eller eksplicitte billed-prompts.
  Alt paid/spicy går gennem **human approval** (de første 30 dage: alt).

## Ufravigelige compliance-regler
Ingen real-person deepfakes · ingen face-swap · ingen celebrity-lookalikes · ingen brug af
rigtige personers ansigt/krop/stemme/stil uden dokumenteret samtykke · ingen mindreårige eller
teen-look/tvetydig alder · ingen vildledning om at personaen er en rigtig fysisk person · ingen
omgåelse af platformregler/moderation/betalingsregler · ingen spam/fake engagement/bot-følgere ·
Instagram altid SFW · chatbot påstår aldrig at være en rigtig person · høj-risiko/eksplicit/
betalings-beskeder kræver human approval i testfasen.

## Arkitektur
| Lag | Hvor | Note |
|---|---|---|
| Dashboard-tab | `app/dashboard/VirtualCreatorLab.jsx` | 10 sektioner, scoped noir/guld-styles, KV-backed |
| Tab-wiring | `app/dashboard/Command.jsx` | NAV-gruppe "Creator" + `{tab === "vcl"}` |
| Persistens (nu) | `dashboard_state` KV, key `vcl_state` | manuel Fase 1-indtastning via `/api/state` |
| Datalag (kanonisk) | 11 × `virtual_creator_*`-tabeller | `supabase/virtual-creator-lab.sql` |
| Reglerne | denne fil + `compliance.md` + `platform-policy-matrix.json` | matrix er maskinlæsbar |

### Datamodel (Supabase, RLS overalt)
`virtual_creator_` + `projects · personas · platforms · content · assets · compliance_checks ·
metrics · revenue · experiments · chat_logs_summary · automation_runs`.

- **Config-tabeller** (projects/personas/platforms/content/assets/compliance_checks/experiments/
  metrics/revenue): `authenticated` kan CRUD → manuel indtastning nu.
- **Maskin-tabeller** (chat_logs_summary/automation_runs): login læser; n8n/cron skriver med
  **service_role**.
- **chat_logs_summary** gemmer **kun summaries/metrics** — aldrig fulde intime samtaler.

### Dynamisk-over-statisk
Fase 0-tabben gemmer hele sin tilstand som ét JSON-blob i `dashboard_state` (`vcl_state`), præcis
som `credits` i `Command.jsx`. Når n8n/scraping begynder at fylde de rigtige tabeller (Fase 2),
bindes visningerne til dem (read via en `/api/vcl`-rute), med KV som fallback/override.

## Faseplan
- **Fase 0 — fundament** ✅ tab + schema + compliance-skelet + docs.
- **Fase A — policy-research** → udfylder `compliance.md` + `platform-policy-matrix.json`.
- **Fase B — landing page** (separat brand, eget route group + middleware-allowlist).
- **Fase C — content/chat/automation** persona-bible · prompt-bible · pipeline · chatbot-design · n8n/MCP-plan.
- **Fase D — growth + launch** manual launch checklist · 30-dages growth-test · growth-loop.

Detaljer: `CHANGELOG.md`. Manuelle godkendelser du selv skal lave: `manual-approvals.md`.
