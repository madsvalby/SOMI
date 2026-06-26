# Paper Empires — Growth-System Log

> Løbende log over ændringer i det selv-forbedrende vækstsystem. Nyeste øverst.
> Drives af Claude som autonomt growth-system. Program-kilde: fuld system-audit 2026-06-24.

---

## 2026-06-26 (forts.) — TTS-pacing-fix (Mads-feedback på Diddy)

Mads så Diddy: (a) læses for hurtigt/stressende, (b) kapitel 1→2-overgang springer for brat, ét ord misses. Begge fixet i `/opt/somi-tts/app.py` (backup: `app.py.bak-pacing-20260626-173754`):
- **TEMPO 0.92→0.85** (global net-hastighed via atempo) = ~7,6% langsommere, mindre stressende. Deterministisk: alt VO bliver 8,2% længere.
- **`_trim_fade` hale-margin 0.02→0.05s** = bevarer bløde ord-slutninger (anti-klip → "misser et ord"-fix).
- **Kapitel-pause:** +0.25s hale-stilhed pr. segment + slut-fade 0.18→0.12s → tydelig vejrtrækning mellem kapitler (scener concattes direkte i renderen, så pausen skal ligge i VO'en). Effektiv pause ~0.67s efter tempo-stretch.
- Validering: `py_compile` ✓ (lokal+remote), `systemctl restart somi-tts` → active, `/tts-one`-test genererede rent (6.68s). **Live for alle fremtidige renders.**
- ⚠️ **Diddy selv er renderet med GAMMEL pacing** — fixet rammer kun nye renders. Diddy skal re-renderes for at få den nye pacing før offentliggørelse (afventer Mads-beslutning).

---

## 2026-06-26 — Diddy-checkpoint: produceret + bridget, metrics refreshet

**Produktion sund:** alle n8n-kørsler grønne i dag (SYNC hver time, MASTER 09:22→09:32 producerede Diddy, SHORTS, RESEARCH, COMMENTS, watchers). Ingen fejl.

**Diddy = første post-hook-fix long-form**, uploadet privat 08:00 (`status uploadet_privat`, `yt_url GWBBYfcdwnI`). Afventer Mads' review. Title-QC mod låste regler: **"Diddy: How a $1B Empire Imploded"** — NAME-FIRST (Diddy) ✓, penge/imperie-framing ✓, legal-accuracy ✓ (ingen GUILTY/trafficking — korrekt, da frikendt racketeering+sex-trafficking, kun 2 prostitutions-counts).

**Bridge (restgæld-fix):** `yt_id` var null (publish skriver ikke tilbage i DataTablen). Sat `yt_id='GWBBYfcdwnI'`, `format='long'` på videos-rækken fra `urls.yt_url` → auto-joiner til video_metrics når den gøres offentlig. (Samme manuelle mønster som Terra Luna; auto-bridge ved publish er stadig åben restgæld.)

**Metrics refreshet manuelt:** lokal ingest-task (07:07) skrev ikke i dag (Claude-app var ikke åben kl. 07). Hentede frisk vidIQ channel-analytics (30-dages, dim=video) → upsert 30 rækker til `video_metrics` date 2026-06-26.

**ÆRLIG læsning af retention:** **intet hook-fix-signal endnu** — alle offentlige long-forms er renderet FØR hook-fixet (25/6); Diddy er den første post-fix og er privat. Dag-til-dag-bevægelser (Barings 23→34, Wirecard 29→33, Cryptoqueen 14→19, Theranos 22→26) er støj på bittesmå samples (2-110 views), ikke fix-effekt. Madoff (80 views, mest stabile sample) 30→32. Enron uændret 38. Ægte fix-signal kommer først når Diddy er offentlig + har views.

**Næste:** Mads reviewer Diddy → gør offentlig → følg dens retention vs. pre-fix baseline (Enron 38 = top at slå). Tune hook (`amt` server.js / `exag` app.py) + thumbnail-prompt efter syn hvis nødvendigt.

---

## 2026-06-25 (forts. 6) — Læringsbro: health-check + Terra Luna bridget

**Health-check af det autonome loop:** sundt. 112 grønne trigger-kørsler 25/6 (SYNC hver time, RESEARCH, COMMENTS, utils). Ingen produktions-*trigger*-fejl siden 23/6 (nyere errors = manuelle reschedule-forsøg).

**Diagnose af `video_metrics`-broen (memoryens "join 0→28" var unøjagtig):** kun 8 af 28 metrics-rækker joinede. Korrekt billede: 28 metrics = ~17 shorts (avg_view_pct >100% pga. loops) + 11 offentlige long-forms. 8 ældre long-forms joinede; de 3 nyeste (WeWork 24/6, Tate 23/6, Terra Luna 22/6) manglede i `video_metrics`.

**Rod-årsag = ikke en bug:** frisk vidIQ-analytics-kald (30-dages vindue) returnerer stadig kun de 28 — YouTube Analytics har ~48-72t processeringsforsinkelse, så videoer fra 22.-24./6 har endnu ingen aggregerede tal. Daglig ingest (07:07) fanger dem automatisk om et par dage. `video_metrics` er altså så frisk som muligt; ingen upsert nødvendig.

**Fix (durable, Supabase-only):** Terra Luna var den eneste offentlige long-form helt uden bridge (6 stale render-duplikater, ingen yt_id). Satte `yt_id='BFThTtD8PNE'` + `format='long'` på ÉN kanonisk række (`terra_luna_kwon-1782139365540`, status til_godkendelse) → joiner automatisk når analytics lander. yt_id/format er læringslag-kolonner som SYNC's "Map videos"-node IKKE rører (verificeret: upserter kun video_id/case_id/title/status/script_json/urls/channel_id/created_at, merge-duplicates) → fixet overlever SYNC. Tate + WeWork var allerede bridget. **Alle 13 long-form-rækker har nu yt_id+format.**

**Kendt restgæld (ikke gjort):** publish-steget skriver ikke yt_id tilbage i videos-DataTablen, så hver ny publiceret video skal bridges manuelt (som Terra Luna her). Duplikater (5× terra, 3× tate, 1× parmalat, status `producerer`) kan ikke slettes i Supabase — de har eget video_id i DataTablen (sandheden) og genskabes af SYNC; dedup skal ske i DataTablen. Begge = kandidater til durable automatisering, ikke blockers.

**Retention-baseline før hook-fixet (8 long-forms m. data):** Enron 38% · Madoff 30% · Wirecard 29% · FTX 27% · Barings 23% · Theranos 22% · Archegos 21% · OneCoin 14%. Alle under >40%-gaten. Første rene test af hook+niche+thumbnail = Diddy (i morgen 26/6).

---

## 2026-06-25 (forts. 5) — Mål-streg: systemet kører autonomt

**H1 (dual-truth) — LØST ved reframe:** ingen refaktor nødvendig. Produktion = n8n Data Table (sandhed); SYNC spejler → Supabase (dashboard) hver time; dashboard-skrivninger går via webhooks → Data Table. Hands-off-konsistent SÅ LÆNGE produktionsændringer sker via Data Table/webhooks (ikke direkte Supabase). Regel noteret.

**H2 (cloud-ingest) — beslutning: behold lokal.** n8n-cloud-ingest kræver YouTube `yt-analytics.readonly` OAuth-scope + credential-UI-bind (MCP-validator-bug blokerer API-bind) = 2 manuelle trin. Den lokale vidIQ-scheduled-task virker allerede (retention+views, indhenter ved app-open) og er mindre ejer-afhængig. Cloud = valgfri fremtidig opgradering, ikke en blocker.

**STATUS: fuldt autonomt loop kører.** idé-fødning (TREND + kommentarer) → demand-scoring (selv-korrigerende) → ≤1 upload/dag produktion (hook-fixet + ny thumbnail) → måling (video_metrics) → læring. Alt i cloud undtagen daglig analytics-read (lokal, indhenter).

**Valgfri hardening (ikke blockers, til senere):** budget-brake (hård stop i MASTER ved kostloft — BUDGET WATCH alarmerer pt. men stopper ikke), idempotens-guard (undgå stale video-dubletter), QC-veto (når kalibreret), dashboard "Lær"-klynge, B13 hook→retention few-shot (når mere retention-data).

**Næste checkpoint: fredag 26/6 — Diddy-videoen** (første med ny hook + niche + thumbnail). Review → tune.

---

## 2026-06-25 (forts. 4) — Thumbnail-opgradering (CTR-løftestang)

Rod-årsag: overlay-funktionen (render `buildThumbnail`) er god (beløb-hvid + nøgleord-guld + rødt stempel, Anton-font, venstre tekst-zone). Problemet var **hero-billedet** — Gemini-prompten gemte motivet i "deep shadow" + stor mørk tomhed → de mørk-på-mørk-thumbnails uden fokuspunkt (audit-score 19-28).

**Gjort (MASTER `Gemini: Hero-billede` prompt, published):** omskrevet til ÉT bold, gold/ember rim-lit fokuspunkt (anonym jakkesæt-silhuet el. ét symbol) på HØJRE side, fylder 45-55%, popper ved lille størrelse; ren mørk negative-space-zone til VENSTRE (matcher overlayets venstre-tekst); kontrolleret kontrast, minimal baggrund. Bevarer juridisk grænse (ingen rigtige ansigter, ingen tekst i billedet). Testet via vidIQ-reference-thumbnail for Diddy → iterereret efter scorer-feedback (simplere, ét fokus, mindre mætning).

**Faithful test = fredagens Diddy-video** (privat, første video med ny hero-prompt + hook-fix + ny niche). Mads reviewer → vi tuner prompten efter den faktiske output.

---

## 2026-06-25 (forts. 3) — Selv-korrigerende emne-motor + kommentar-loop LIVE

- **RESEARCH-prompt + guard (TqpBSlFljcX3A4la, published):** ny scoring i `Byg research-request` vægter DEMAND + niche (magt&penge) + recency + mætnings-straf; `Parse score` parkerer nu `demand=='low'` i stedet for `ready`. Begge syntaks-tjekket (node --check) før deploy, dobbelt-anførselstegn fjernet for sikker encode. → Fremtidige forslag selv-filtreres mod den nye strategi (stopper obskur-embezzlement-til-98).
- **Kommentar→idé-loop (ynAV3qg2KGFPVO7r, published):** ny gren `Parse + merge → Filtrér idé-kommentarer → POST til IDEAS-INTAKE`. `is_idea=true`-kommentarer → `proposed` → RESEARCH scorer/parkerer. Publikum-drevne idéer + auto-kvalitetsfilter. (Ingen Claude-node nødvendig; RESEARCH er filteret. HTTP-node = auth-fri webhook.)
- **Loopet lukket:** idé-fødning (TREND + kommentarer) → demand-scoring → ready → produktion → måling → (læring). Selv-korrigerende.

**Næste:** thumbnail-opgradering (CTR-løftestang, se vurdering) + arkitektur H1/H2.

---

## 2026-06-25 (forts. 2) — Autopilot-eksekvering (ultracode-plan)

5-agent plan-workflow kørte → eksekverbar tjekliste. **Kritisk fund:** produktionen læser n8n **Data Table** `fyNFjFIXaHME4h6b` (projekt C7PCi9TKnRc6Idan), IKKE Supabase. Gårsdagens Supabase-seeds nåede aldrig produktion (kun dashboard-mirror).

**Gjort:**
- **Produktionskø pivoteret:** 12 aktuelle/demand-validerede emner sået i Data Tablen som `ready` priority 1-12 (diddy, musk-vs-altman, builder-ai, evergrande, boeing, adani, murdoch, svb, lehman, sackler, credit-suisse, byju). MASTER laver disse næst.
- **Oprydning (Supabase-mirror):** 12 no-search-emner → `parked`; 9 stale `producerer`-dubletter → `abandoned`.
- **Shorts OMLAGT ✅:** 9 shorts var klumpet 25-27/6 (4 samme dag) → nu spredt **7/7→4/8**, ét hver 3.-4. dag, off-dage. Mads bandt YouTube-credential i UI (MCP-bug blokerede API-bind), `c1U8YtsfSOO1ZRfq` kørte (exec 632 success), verificeret via audit `yyuwr0jljSKp3Fno` (exec 633). Reschedule-workflowen kan genbruges når shorts klumper igen.

**Næste (durable, ikke gjort endnu):** RESEARCH-prompt+guard (TqpBSlFljcX3A4la: ny demand/niche/saturation-scoring i `Byg research-request` + park-guard i `Parse score`) — afventer omhyggelig encode (0 proposed nu, ikke akut). Kommentar→idé-loop (B3). Arkitektur: H1 (Data Table↔Supabase dual-truth), H2 (cloud analytics-ingest).

---

## 2026-06-25 (forts.) — Niche-pivot startet: emne-motoren

**Verificeret:** ingest-routinen kørte i baggrund (lastRun 14:40) → bekræfter at headless vidIQ+Supabase virker. Loopet er selvkørende.

**Fund:** idé-køen var domineret af mættet/obskur svindel (WorldCom, Tyco, Satyam, embezzlement-sager scoret 95-98) — lav-efterspørgsels-emner = vækstblokering. RESEARCH-scoring vægter "dokumenteret+gribende", ikke markedsefterspørgsel.

**Gjort:** sået 8 high-demand emner i imperier/dynastier/AI-niche som `ready` score 99 (evergrande, lehman-brothers, sackler-dynasty, credit-suisse, builder-ai, adani-group, byjus, sam-altman-openai) + tagget topic_category. Ruller ud 1/render. Hook-fixet video #1 kommer fredag 26/6 (WeWork var pre-fix).

**Næste (durable):** omskriv RESEARCH-prompt → vægt efterspørgsel + niche (imperier/dynastier/AI/institutioner) + læs video_metrics-performance + straf mætning. Så selv-korrigerer køen. Derefter B13 hook→retention few-shot + B17 dashboard "Lær"-klynge.

---

## 2026-06-25 — Analytics-ingest: måle-loopet lukket (Wave 2-keystone)

**Backfill kørt:** vidIQ `vidiq_channel_analytics` (dim=video) → upsert af 28 videoer til `video_metrics` (date 2026-06-25): views, avg_view_pct (retention-proxy), avg_view_sec, watch_time_min, subs_gained. Joiner nu rent til `videos` via yt_id.

**Første lærings-output (long-form retention, aldrig muligt før):** Enron 38% · Madoff 30% · Wirecard 29% · FTX 27% · Theranos 22% · Archegos 21% · Cryptoqueen 14%. Bekræfter hook-diagnosen — nu målbart pr. video, så hook-fixets effekt kan spores fra i morgen.

**Begrænsninger:** impressions/CTR fås ikke via YouTube Analytics API (kun Studio/Reporting API) → forbliver null; avg_view_pct er retention-metrikken. retention_30s/retention_curve pr. video kan tilføjes via `elapsedVideoTimeRatio`-kald når videoer har nok views.

**Daglig automatik — VALGT + OPSAT (A):** scheduled Claude-routine `paper-empires-analytics-ingest` kører dagligt 07:07 (lokal tid) → vidIQ→video_metrics-upsert + trafikkilde-log + top-retention-log. Task-fil: `C:\Users\madsv\.claude\scheduled-tasks\paper-empires-analytics-ingest\SKILL.md`. **Verificér:** klik "Run now" i Scheduled-panelet én gang for at (a) pre-godkende vidIQ+Supabase-værktøjerne og (b) bekræfte at headless-MCP-adgang virker. Fallback hvis den fejler: (B) n8n/app-cron via YouTube Analytics API (kræver `yt-analytics.readonly` OAuth-scope).

---

## 2026-06-25 — n8n: robusthed + cadence ≤1/dag

**Cadence (Mads-beslutning ≤1 upload/dag):** SHORTS havde 3 shorts/long-form spredt day+1/+2/+3 → ~1,7 uploads/dag samlet. Tilføjet **Limit-node (maxItems 1)** mellem "Byg shorts-jobs" og "Loop shorts" → **1 short pr. long-form** (stærkeste hook), lander day+1 på off-dag. Resultat: Man(L)·Tir(S)·Ons(L)·Tor(S)·Fre(L)·Lør(S)·Søn(–) = 6 uploads/uge, max 1/dag. Reversibelt (fjern Limit-node).

**Robusthed:** `retryOnFail` (3 forsøg, 5s) på alle TTS+render HTTP-noder — MASTER ("Send til TTS", "Tjek TTS-status", "Send til render", "Tjek render-status") + SHORTS ("Short VO (TTS)", "Send short til render", "Tjek short-status"). Fjerner 22-23/6-fejlklassen (transiente TTS/render-fejl uden retry).

**Render-IP (B7):** undersøgt — MASTER bruger udelukkende 81.88.25.119 (10×), `.env BASE_URL=http://81.88.25.119:8080`. Allerede konsistent; 212.x var kun gamle `videos`-rækker (kosmetisk, ikke rørt).

**Bevidst IKKE gjort (rationale):** QC-veto (B4) — QC har 0 rejects i historik = ukalibreret; hård veto kan stoppe produktion fejlagtigt. Venter på `predicted_retention`-kalibrering. Webhook-auth (B8) — har app-side afhængighed (Command kalder webhooks); kræver koordineret app-opdatering. Kommentar→idé-loop + niche-RESEARCH-prompt — næste batch.

---

## 2026-06-25 — Hook-fix deployet på render-server (#1 retention-løftestang)

**Mål:** stoppe 40-66%-droppet i de første ~45 sek (robot-VO + statisk slideshow). Godkendt af Mads (direkte til produktion, privat upload til review).

**Ændret (backup: `/opt/somi-renderer/server.js.bak-prehookfix-*`):**
- `server.js` `kenBurnsFilter`: zoom **7%→14%** (18% på åbningsklippet), tilføjet **pan** (alternerer retning efter zoom-fortegn, holder sig inden for billedet), **fjernet den sorte fade-in på allerførste klip** (idx0/img0) via ny `isOpening`-flag gennem `renderImageClip`/`renderScene`.
- `app.py` `gen_segment`/`run_job`: åbnings-segmentet (seg[0]) får **exaggeration 0.4→0.6, cfg 0.3→0.4, gap 0.32→0.18s** = mere dramatisk, mindre hakkende hook-levering. Resten uændret.

**Validering før deploy:** `node --check` ✓, `py_compile` ✓, begge nye ffmpeg-filtergrafer test-renderet på syntetisk billede (OPEN+NORM, begge 4.0s) ✓. Efter deploy: somi-renderer + somi-tts `active`, tts `/health` ok.

**Ikke gjort (bevidst, lavere ROI/højere risiko):** scene-0 hurtigere kliprytme (desync-risiko), tæller/kinetisk tal-overlay, TTS-parallelisering (OOM-risiko, kræver RAM-måling).

---

## 2026-06-24 — Fundament: lærings-loopet kan nu lukkes

**Rod-årsag fundet (6-agent audit):** Systemet var en envejs-fabrik der fangede *input* (cost, QC, idé-score) men intet *outcome* — og det ene outcome (views) kunne ikke joines tilbage til videoen. `videos.video_id` var syntetisk (`wework-1782...`), mens `stats_daily.video_id` var ægte YouTube-id (`Y2t106lIBFc`). **Direkte join = 0 rækker.** Derfor kunne intet loop lukkes.

**Udført (Supabase migration `learning_loop_foundation`, alt additivt/reversibelt):**
- `videos`: +`yt_id` (ægte YouTube-id, broen), +`format`, +`topic_category`, +`hook_type`, +`title_variant`, +`thumbnail_variant`, +`experiment_id`, +`published_at`. Unik index på `yt_id`.
- Ny tabel `video_metrics` (yt_id+date): views, impressions, ctr, avg_view_pct, avg_view_sec, **retention_30s**, **retention_curve** (jsonb), watch_time, subs_gained, est_revenue. RLS auth-read.
- Ny tabel `experiments` (hypotese → arm_a/b → metric → status). RLS auth-read.
- `ideas`: +`topic_category`, +`hook_type`. `qc_log`: +`hook_type`, +`predicted_retention` (QC-kalibrering).
- **Backfill:** `yt_id` udtrukket af `urls.yt_url` (12 videoer); `format='long'` på alle eksisterende; normaliseret `ideas.status`-casing.
- **Resultat:** join videos↔stats gik fra **0 → 22 koblede rækker** (6 videoer). Resten venter på genstartet ingest.

**Næste keystone:** genstart analytics-ingest → skriv til `video_metrics` (kan bygges via vidIQ `vidiq_channel_analytics` — adgang bekræftet, ingen ny credential nødvendig).

**Ikke rørt endnu (kræver beslutning/godkendelse):** render-server hook-fix (SSH), niche-rebrand, anti-flooding-cadence.
