# Virtual Creator Lab — changelog

> Separat brand fra Paper Empires. Nyeste øverst.

## 2026-06-28 — Fase 0: fundament

**Dashboard-tab (`app/dashboard/VirtualCreatorLab.jsx`)**
- Ny fane **Creator → Virtual Creator Lab** i Command Center (NAV-gruppe "Creator", `Shield`-ikon).
- 10 sektioner: Overblik, Persona, Platforme, Funnel, Content, Chat, Compliance, Eksperimenter, Revenue, Automation.
- Compliance-bjælke altid synlig (ufravigelige regler). Noir/guld-design, scoped `<style>` som `LabsTab`.
- KV-backed: hele staten gemmes under `vcl_state` via `/api/state` (manuel Fase 1-indtastning, auto-merge mod default).

**Supabase (`supabase/virtual-creator-lab.sql`, migration `virtual_creator_lab_init`)**
- 11 tabeller `virtual_creator_*` (projects, personas, platforms, content, assets, compliance_checks, metrics, revenue, experiments, chat_logs_summary, automation_runs).
- RLS overalt. Config-tabeller: `authenticated` CRUD. Maskin-tabeller (chat_logs_summary, automation_runs): login læser, service_role skriver.
- `chat_logs_summary` gemmer kun summaries/metrics — aldrig fulde samtaler. Idempotente upsert-nøgler på metrics/revenue/chat.
- Security-advisor: ingen nye lints (de 3 warnings er præeksisterende foundry/pg_net).

**Docs (`docs/virtual-creator-lab/`)**
- `README.md`, `manual-approvals.md`, `CHANGELOG.md`.

**Verifikation:** `npm run build` grøn (Next 14.2.x). `/dashboard` kompilerer med fanen.

## 2026-06-28 — Fase A: policy-research (verificeret fra primærkilder)

16-agent research+verify-workflow (8 domæner, hver adversarielt kilde-tjekket). Resultat → to deliverables:
- `compliance.md` (menneskelæsbart notat) + `platform-policy-matrix.json` (maskinlæsbar).

**Nøglefund (former platform-strategien):**
- **Fanvue** ✅ AI eksplicit velkommen, lav risiko — primær monetization bekræftet. Kræver konsekvent AI-disclosure + SFW offentlig profil + din egen KYC (foto-ID + selfie) + W-8BEN.
- **Fansly** ❌ forbyder *photorealistisk* AI → **incompatible** for vores photoreal persona (kun ikke-fotorealistisk variant tilladt). Markeret `incompatible` i dashboardets default-state.
- **Instagram** ⚠️ kun SFW (AI-nøgenhed fjernes som ægte); suggestivt demotes i Explore/Reels; AI-label krav.
- **IG DM-automation** ⚠️ kun officiel Messaging API, reaktivt (24t-vindue, `human_agent` ≤7 dage); cold-DM/engagement-bots = ban-fælden.
- **EU AI Act art. 50** (fra 2026-08-02): maskinlæsbar AI-mærkning + disclosure *på indholdet* (ikke kun T&C).
- **Dansk ret:** fuldt syntetisk persona uden lighed med rigtig person falder uden for deepfake/§264d/§73a; reelle pligter = disclosure + GDPR på egne kunder.
- **Payments:** SFW → Stripe; adult → CCBill/Segpay (AI er ingen smutvej; verificér reserves i aftalen).
- **Tooling:** xAI/Grok + Leonardo mest tilladelige per ToS for suggestivt; Midjourney/Adobe/Stability/Kling forbyder.

**Dashboard:** default-state opdateret med verificerede policy-scores (Fanvue 95, IG 80, Fansly 25, landing 90), risici og Fansly=incompatible. `npm run build` grøn.

**Næste:** Fase C (design-docs) → Fase B (landing) → Fase D (growth/launch).

## 2026-06-28 — Fase C: content/chat/automation-design

Persona navngivet: **Seraphine «Sera»** (international English, tydeligt syntetisk, 25+, ligner ingen rigtig person).

5 design-docs i `docs/virtual-creator-lab/`:
- `persona-bible.md` — Sera: identitet, syntetiske markører, voice, visuel stil, do-not-generate, disclosure-tekster.
- `prompt-bible.md` — SFW IG/reel/caption/CTA-skabeloner (fuldt udfoldede); paid/spicy kun koncept + human-approval-gate (ingen eksplicitte prompts).
- `content-pipeline.md` — stadier (idea→published), compliance-gate, Fase 1-3 automation-model, asset-handling.
- `chatbot-design.md` — disclosed AI-bot, eskalerings-triggers, kanal-grænser (IG reaktiv API, Fansly=ingen bot), system-prompt-skelet.
- `automation-plan.md` — n8n-workflows (faset), MCP/scraping-grænser (kun egne metrics, ingen engagement-bots), dataflow, deploy.

Dashboard: persona-default sat til Sera + link til prompt-bible. `npm run build` grøn.

**Næste:** Fase B (landing page, separat brand "Sera") → Fase D (growth-loop + 30-dages test + launch checklist).

## 2026-06-28 — Fase B: landing page (Sera)

Separat offentligt brand `/sera` (nyt route group, tilføjet middleware-allowlist `lib/supabase/middleware.js`). **Eget look** (iriserende celestial-luxe — bevidst forskelligt fra Paper Empires' noir/guld).
- 18+ gate (localStorage), prominent AI-disclosure (3 steder), link-hub, mobile-first, ingen eksplicit content.
- **Admin-konfigurerbare links:** dashboard → VCL → Platforme → Profil-URL → vises i hub'en via `/api/vcl/public` (service_role, returnerer KUN brand/disclosure/links).
- **UTM** på alle outbound-links (`utm_source=sera_hub`) + **dashboard-koblet tracking** via `/api/vcl/track` (cookie-fri beacon → `virtual_creator_metrics`).
- Seedet `virtual_creator_projects`-række `id='sera'` (FK-parent for metrics/revenue).
- **Verificeret visuelt (preview):** gate + hub renderer korrekt, 0 konsol-fejl; public-route 200, track 204, metrics-row skrives (test-række ryddet bagefter). Build grøn (`/sera` 3.38 kB).
- Filer: `app/sera/{page,layout}.jsx`, `app/api/vcl/{public,track}/route.js`.

## 2026-06-28 — Fase D: growth + launch

- `growth-loop.md` — selv-forbedrende loop (pull→rank→extract→suggest→remix), guardrails (compliance svækkes aldrig uden OK), n8n `VCL-GROWTH`.
- `30-day-growth-test.md` — uge-for-uge plan, succes-metrikker, kill/scale-gate dag 30.
- `launch-checklist.md` — trin-for-trin til live (brand→konti→landing→compliance→go-live→drift).

**Alle 17 deliverables leveret.** VCL er bygge-komplet for Fase 1 (manuel). Resten = din konto-setup + Fase 2/3 automation.

## 2026-06-28 — Per-platform tracking + udgifter + hub-beslutning

**Tracking pr. platform (efter ønske):** VCL-tabben ombygget så Overblik/Funnel/Økonomi/Chat har en **Samlet ↔ platform-toggle** (Instagram/Fanvue/Hub) — samme mønster som startsidens kanal/samlet-stats. "Samlet" summerer på tværs; vælg en platform for at se/redigere den enkelte. Data: per-unit `track`-objekt i `vcl_state` (KV); persona-lag tilføjes når persona #2 kommer.
- **Udgifter tilføjet** (manglede): ny tabel `virtual_creator_costs` (migration). Økonomi-sektionen viser nu gross/fees/tips/PPV → **netto-indtjening** og **− udgifter = profit**, pr. platform OG samlet (med platform-breakdown-tabel i Samlet-visning).
- Bug fanget+fikset: `ScopeBar`/`UnitEdit`/`EditNote` hejst til modul-niveau (var defineret inde i render → redigerings-inputs ville miste fokus pr. tastetryk). Build grøn.

**Link-in-bio research (7 tjenester, primærkilder + adversarielt tjekket):** offentlig hub flyttes **væk fra SOMI-domænet** (de offentlige `/imperium/*`-sider ligger på samme host → ville koble Sera til Paper Empires).
- **Vinder: AllMyLinks** (recommended, høj verificeret confidence). ToS tillader at linke UD til Fanvue/adult-profil; kun (a) on-page-monetering af adult-links og (b) eksplicit profil-upload er forbudt → passer en SFW-hub perfekt. Gratis kerne; custom domain + analytics på premium.
- GetMySocial = **avoid** (høj risiko). `/sera`-siden beholdes som fallback/egen-domæne-option.
- Før launch: verificér i AllMyLinks-UI at Fanvue-link + AI-disclosure + 18+ kan vises; gentjek ToS umiddelbart før brug (ingen dato på ToS-siden).

## 2026-06-28 — Launch-prep: konti live + content klar

Konti live: **Instagram + Fanvue + AllMyLinks** (allmylinks.com/seraphine-sera). Hub wired i dashboard + docs.
- **Tooling valgt:** content via OFMAI (test gratis) m. **Leonardo/Grok** som ToS-verificeret fallback; behold watermark/C2PA. Chat-autopilot droppet i testfasen; **ALI Remote = undgå** (device-farm/ban-risiko).
- Nye klar-til-brug-docs:
  - `asset-pack.md` — hero-face-prompt + konsistens-strategi (seed-lås) + profilbilleder + 9 IG-shots + Fanvue-koncept (gated).
  - `content-batch-1.md` — 9 SFW IG-captions + 3 reel-scripts + 2-ugers kalender + hashtag-sæt.
  - `dm-replies.md` — SFW manuelle DM-svar (discloser AI, router til hub, flag-triggers) — compliant alternativ til autopilot.
  - IG + Fanvue-bios skrevet (AI-disclosure + 18+).
- **Kritisk sti:** lås Seras ansigt (hero-face) → resten kører i serie.
- **Roadmap-sektion tilføjet til VCL-fanen** (11 milepæle Fase 0→Fase 3, klik for at skifte status, KV-persisteret) — så faseplanen er i dashboardet som hos de andre projekter, ikke kun i docs. Build grøn.
