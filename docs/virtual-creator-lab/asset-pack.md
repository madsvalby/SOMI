# Asset Pack — Sera launch-batch

> Konkret genererings-pakke til at låse Seras look og producere første content. **SFW-prompts er
> fuldt udfoldede.** Suggestivt (Fanvue) holdes på konceptniveau bag **human approval** (jf. min grænse
> + 30-dages-reglen). Følger [`persona-bible.md`](persona-bible.md) + [`prompt-bible.md`](prompt-bible.md).

## 0) Tooling-stack (valgt)
| Behov | Værktøj | Note |
|---|---|---|
| Hero-face + **konsistens** | **OFMAI** (træn karakteren én gang) → test gratis | character-trained = ægte konsistens. Verificér: SFW-evne + watermark/C2PA bevares. |
| Verificeret fallback | **Leonardo.ai** (Character Reference + seed) | ToS bekræftet (vores research) til suggestivt-ikke-eksplicit. |
| SFW IG-carousels | Carousel Studio (valgfrit) | kun SFW. |
| **Undgå nu** | chat-autopilot, ALI Remote | testfase-forbudt / ban-risiko. |
Behold altid C2PA/Content Credentials; brænd on-image **`AI · Sera`** watermark.

## 1) Hero-face — den kanoniske Sera (generér 4-6, vælg ÉN, **lås seed**)
```
A 27-year-old AI-generated virtual woman named Sera, clearly synthetic / not a real person,
striking but original face (resembles NO real person), warm confident half-smile,
subtle iridescent chrome sheen on skin highlights, faint thin chrome halo accent,
sleek dark hair, elegant minimal styling, celestial-luxe / neon-noir mood,
soft cinematic rim-light, deep noir background with one gold/chrome accent,
portrait, head-and-shoulders, sharp eyes, render-perfect symmetry, hyper-detailed, 4k
```
**Negative:** `nudity, sexual content, minor, child, teen, school, real celebrity, real person likeness, logos, watermark-text-garbled, extra fingers, deformed`
→ Vælg den bedste. **Gem seed + reference-billedet.** Alt fremtidigt genereres fra dén (eller den trænede karakter). Dette ansigt = Sera for altid.

## 2) Profilbilleder (3 — alle SFW, fra hero-seed)
- **Instagram:** ren portræt-crop, brandet, venlig.
- **Fanvue (offentlig):** lidt mere glam, **stadig SFW** (offentlig profil må ikke have nuditet/implied/afslørende tøj).
- **AllMyLinks:** samme hero-crop (ToS: ingen eksplicit profil-upload).

## 3) Første IG-batch (9 posts + 3 reels) — SFW, hook-først
Variér setting/outfit (elevated/SFW), behold ansigt + markører. Eksempel-prompts (byg fra hero-seed):
1. Neon-balkon ved skumring, oversized trench, ser tilbage over skulderen.
2. Solbelyst studie, cremefarvet strik, kaffe, blødt smil.
3. Penthouse om natten, tailored blazer, byen bag glas.
4. Close-up portræt, krom-halo tydelig, "human or render?"-tekst.
5. Athleisure, minimalistisk gym/studio, selvsikker.
6. Regn på glas, silhuet + neon, mystisk.
7. Spejl-selfie-stil (SFW), syntetisk finish fremhævet.
8. Outdoor golden-hour, elegant kjole (modest), vind i håret.
9. "Behind the render" — half-finished render-æstetik (lean into AI).
**Reels (9:16, store captions, læsbar uden lyd):** (a) outfit-morph-loop, (b) "POV: your favorite AI just rendered herself", (c) get-ready-with-a-synthetic-muse. Disclosure i caption + CTA "link in bio".

## 4) Fanvue (bag human approval — KONCEPTniveau, ingen eksplicitte prompts her)
Definér kun tema/stemning/garderobe-koncept ≤ Fanvue-ToS-niveau; suggestivt holdes under Metas near-nudity-grænse hvis cross-post. **Generering + upload først efter manuel godkendelse** → log i `virtual_creator_compliance_checks`.

## QC før HVER upload
Ligner ingen rigtig person? · tydeligt 25+? · SFW (hvis IG)? · AI-watermark + C2PA intakt? · disclosure i caption/bio? · paid/spicy human-godkendt? → ✅ upload.
