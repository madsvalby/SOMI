# Prompt Bible — Seraphine «Sera»

> Genererings-skabeloner. **SFW-prompts er fuldt udfoldede.** Paid/"spicy" indhold holdes på
> **koncept-niveau** med human-approval-gate — eksplicitte prompts skrives og godkendes manuelt af Mads,
> ikke templated her (jf. [`compliance.md`](compliance.md) + 30-dages human-approval-regel).

## Ground rules (alle prompts)
- **Værktøj:** xAI/Grok eller Leonardo.ai (mest ToS-tilladelige per research); behold C2PA/Content Credentials.
- **Konsistens:** fast `seed` + reference-billede af Sera pr. kald → genkendeligt ansigt.
- **Altid med:** 25+ voksen, syntetiske markører (krom-sheen/halo), AI-watermark, "synthetic/AI-rendered".
- **Aldrig:** rigtig person/celebrity-lighed, teen/young/school, nudify/deepfake, fjern watermark.

## 1) SFW Instagram — still-billede (skabelon)
```
[SUBJECT]   Seraphine "Sera", a 27-year-old AI-generated virtual woman, clearly synthetic,
            subtle chrome sheen on skin highlights, faint iridescent halo accent
[SETTING]   {fx: minimalist penthouse at dusk / neon-lit city balcony / studio with soft gold rim-light}
[WARDROBE]  {elevated, SFW: tailored blazer / silk slip dress (modest) / chic athleisure}
[MOOD]      {confident, serene, playful}
[LIGHT]     soft cinematic rim-light, deep noir tones, single gold/chrome accent
[FRAMING]   {portrait / waist-up / wide editorial}, rule-of-thirds
[MARKERS]   visible "AI · Sera" watermark, render-perfect symmetry, synthetic finish
[NEG]       no nudity, no minors, no real-person likeness, no logos, no text artifacts
```
**Eksempler (SFW):**
- "Sera on a rain-glossed neon balcony, oversized trench, looking back over shoulder, chrome halo, AI watermark."
- "Sera in a sunlit studio, cream knit, holding a coffee, soft smile, faint iridescent skin sheen."

## 2) SFW Reel / kort video (skabelon)
```
HOOK (0-2s)   visuel overraskelse: "POV: your favorite AI just rendered herself" / hurtigt outfit-morph
BODY (2-8s)   1 idé: get-ready, location-reveal, "human or render?"-leg
LOOP/END      clean loop + CTA-overlay "link in bio"
STYLE         9:16, store captions (læsbar uden lyd), neon-noir, gold accent, AI-label synlig
SAFE          SFW; ingen seksuel akt; disclosure i caption
```

## 3) Caption-skabeloner (IG)
- `Rendered, not born. 🤍 {1 linje hook}. Full hub in bio. AI virtual creator.`
- `{spørgsmål til publikum}? Sera lives in the link below. #aiart #virtualcreator`
- Altid: disclosure-snippet (`AI virtual creator`) + 1 CTA til link-hub. Ingen seksuel solicitation på IG.

## 4) CTA-skabeloner (safe routing, ingen solicitation på IG)
- `More of me → link in bio` · `Find the full gallery in my hub` · `Exclusive stuff lives off-grid → bio`
- DM-bot CTA: `I can point you to my hub 💫` (router til landing/Fanvue, aldrig eksplicit på IG).

## 5) Paid-platform (Fanvue) — KONCEPT-niveau (ikke eksplicitte prompts)
Definér kun **tema/stemning/garderobe-koncept** + grænse. Selve genereringen + eventuelt suggestivt
(ikke-eksplicit) materiale **skrives og godkendes manuelt** før upload.
```
[KONCEPT]   {tema, fx "midnight glam set" / "chrome muse editorial"}
[GRÆNSE]    suggestivt men ≤ Meta near-nudity-grænse hvis cross-post til IG; ellers Fanvue-ToS-niveau
[GATE]      → virtual_creator_content (stage: compliance_review → human approval) FØR generering/upload
```
> Eksplicitte prompts findes bevidst ikke i denne fil. De er Mads' manuelle ansvar bag human-approval-gaten.

## 6) Forbudte prompt-mønstre (hard-block)
`real name/celebrity` · `teen, young, schoolgirl, barely legal, 18yo-looking` · `nudify, undress, deepfake,
face-swap` · `lookalike of {person}` · `remove watermark / strip metadata` · enhver alders-tvetydig deskriptor ·
enhver eksplicit akt på IG-bestemt content.

## QC-tjek før enhver upload
1. Ligner ikke en rigtig person? 2. Tydeligt 25+? 3. SFW (hvis IG)? 4. AI-watermark + C2PA intakt?
5. Disclosure i caption/bio? 6. Paid/spicy → human-godkendt? → log i `virtual_creator_compliance_checks`.
