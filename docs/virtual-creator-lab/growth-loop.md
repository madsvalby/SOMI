# Growth Loop — Virtual Creator Lab

> Selv-forbedrende loop: data ind → vindere identificeret → eksperimenter ud → remix. Spejler det
> eksisterende `lib/winnerLoop.js`-mønster fra Paper Empires. **Compliance svækkes aldrig uden Mads' OK.**

## Loop (ugentlig kerne, dagligt data-pull)
```
1. PULL (dagligt)   metrics ind → virtual_creator_metrics (scrape/CSV/API), revenue → virtual_creator_revenue
2. RANK             top-posts (engagement, profil→klik, klik→sub, revenue); virtual_creator_content.performance
3. EXTRACT          bedste hook / visual-stil / CTA / posting-tid (fra virtual_creator_experiments)
4. SUGGEST          næste 2-3 tests skrives → virtual_creator_experiments (verdict=running)
5. MARK             vindere → content.is_remix_candidate=true; risiko-mønstre → compliance-flag
6. REPORT           ugentlig rapport → dashboard (Eksperimenter + Overblik) + evt. reports-tabel
```

## Hvad "vinder" måles på
| Signal | Kilde | Bruges til |
|---|---|---|
| Reach/impressions → profil-visits | metrics | hook-styrke |
| Profil → link-klik | metrics | bio/CTA-styrke |
| Klik → paid-visit → subscriber | metrics | funnel-konvertering |
| Revenue / 1.000 impressions | metrics+revenue | hvad der faktisk tjener |
| Posting-tid × engagement | experiments | timing |

## Remix
Vindende hook/visual/CTA → ny `idea` (content-pipeline) med samme vinkel, ny eksekvering. Tabere
arkiveres med årsag (træningsdata til hvad der ikke virker).

## Guardrails (hard)
- **Aldrig** svække en compliance-regel for at booste en metric uden Mads' eksplicitte godkendelse.
- Risiko-mønstre (fx en vinder der kun virker tæt på Metas SFW-grænse) **flagges**, ikke skaleres blindt.
- Alt paid/spicy forbliver bag human approval i testfasen uanset performance.

## Implementering (n8n)
`VCL-GROWTH` (ugentlig cron): kører 2-6, skriver experiments + sætter `manual_action_required` hvis
en risiko-flag opstår. Mønster + auth som eksisterende `app/api/cron/*` + `winnerLoop.js`.
