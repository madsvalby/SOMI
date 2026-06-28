# Link-in-bio — beslutning

> Den offentlige hub ligger på en **ekstern link-in-bio, ikke på SOMI-domænet** — fordi `/imperium/*`
> (Paper Empires) er offentligt på samme host og ville koble brandene. Verificeret 2026-06-28
> (7 tjenester, primærkilder + adversarielt tjek).

## Valg: AllMyLinks — **LIVE**
**Hub:** https://allmylinks.com/seraphine-sera (`@seraphine-sera`)
- ToS tillader at linke **ud** til Fanvue/adult-profil. Forbudt: (a) monetere adult-links *på selve siden*, (b) uploade eksplicit indhold til profilen → en SFW-hub der linker ud passer perfekt.
- Gratis kerne; custom domain + analytics på premium. 18+ via "My profile contains sensitive content" = ON.

## Compliance på hub'en (hold)
- Profil-/baggrundsbilleder **SFW** (ingen eksplicit upload — ToS).
- AI-disclosure + 18+ synligt i **Short Bio** + **About**.
- Ingen on-page-monetering af adult-links (kun link-ud).
- Gentjek ToS lige før større ændringer (ingen revisionsdato på siden).

## Profil-opsætning (canonical copy)
- **Full Name:** `Sera`
- **Short Bio (≤160):** `AI virtual creator — not a real person ✦ 18+ ✦ synthetic muse, rendered not born`
- **About:** `Sera is an AI-powered virtual creator — a fully synthetic persona, not a real person. Every image is AI-generated. 18+ only. Links below ✦`
- **Links:** Fanvue (primær) + Instagram (SFW). Append `?utm_source=allmylinks&utm_medium=link_hub` på destinationerne.
- **Profilbillede:** SFW AI-portræt af Sera (syntetiske markører + watermark).

## Fravalgt
- **GetMySocial** = avoid (høj risiko). **Linktree / Beacons** = adult-restriktioner.
- Backup: `/sera` (egen side, fuld disclosure/tracking) hvis du senere vil have eget domæne.

## Tracking
AllMyLinks har egne analytics (Analytics-fanen). Indtast visits/klik i dashboardets **Hub**-enhed
(Funnel/Økonomi → vælg "Hub"), eller scrape i Fase 2. UTM på destination-links → Fanvue ser kilden.
