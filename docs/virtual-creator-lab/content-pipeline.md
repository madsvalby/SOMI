# Content Pipeline — Virtual Creator Lab

> Hvordan en idé bliver til publiceret, compliant content. Stadier mapper 1:1 til
> `virtual_creator_content.stage` og asset-felter til `virtual_creator_assets`.

## Stadier (→ `content.stage`)
`idea → prompt → generated → compliance_review → approval → scheduled → published → review`

| Stadie | Hvad sker | Gate |
|---|---|---|
| idea | hook/koncept noteres | — |
| prompt | prompt bygges fra [`prompt-bible.md`](prompt-bible.md) | forbudt-mønster-scan |
| generated | asset genereres (xAI/Grok·Leonardo), C2PA bevaret | — |
| compliance_review | QC-tjekliste køres | **auto-fail → tilbage** |
| approval | **menneske godkender** | **SFW: stikprøve · paid/spicy: ALT (30 dage)** |
| scheduled | planlagt udgivelse | kun godkendte |
| published | live + AI-label | — |
| review | performance vurderes → remix-kandidat? | fodrer eksperimenter |

## Asset-handling (→ `virtual_creator_assets`)
Pr. asset logges: `source_tool · prompt · seed_config · file_path · platform_target · sfw ·
compliance_status · approval_status · published_status · performance`. Seed + reference gemmes så
vindere kan re-genereres konsistent.

## Compliance-gate (kører på hvert asset → `virtual_creator_compliance_checks`)
1. Ingen rigtig-person-lighed 2. Tydeligt 25+ 3. SFW hvis IG 4. AI-watermark + C2PA intakt
5. Disclosure i caption/bio 6. Platform tillader content-typen → `verdict: pass|fail|needs_review`.

## Fase-model (skalér automation gradvist — aldrig compliance)
**Fase 1 — Manuel/semi-auto (nu)**
- Én persona (Sera). Manuel konto-setup + policy-verifikation. **Manuel approval på ALT.**
- SFW IG-content + Fanvue-setup. Landing + tracking-links. Dashboard-metrics. CSV/manuel import-fallback.

**Fase 2 — Assisteret automation**
- Auto-generér SFW IG-idéer + captions; auto-generér content-batches; auto-fyld dashboard.
- Auto-schedule SFW-posts **efter** approval. Browser/MCP-assisteret metrics-indsamling.
- **Human approval på spicy/paid uændret.**

**Fase 3 — Kontrolleret autopilot**
- Auto-publicering af SFW IG-content; auto-remix af vindere; chatbot på godkendte platforme.
- IG DM-bot kun til safe routing. Ugentlig optimering. Risk-alerts. Human approval ved flagged content.

## Recycle / remix
`review`-stadiet markerer `is_remix_candidate=true` på vindere → tilbage i `idea` med ny vinkel.
Vindende hooks/visuals/CTA'er fodres til Eksperimenter-sektionen (growth-loop).
