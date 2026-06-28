# Virtual Creator Lab — compliance-notat

> **Kilde-grundlag:** primærkilder (platformenes egne T&Cs/help-sider, EUR-Lex, EU-Kommissionen,
> Kulturministeriet, Retsinformation), verificeret 2026-06-28 via en 16-agent research+verify-workflow
> (hver påstand adversarielt kilde-tjekket). **Ikke juridisk rådgivning** — få en dansk IP/medieret-advokat
> til at læse det endelige § 73a-udkast før launch.
> Maskinlæsbar version: [`platform-policy-matrix.json`](platform-policy-matrix.json).

## TL;DR — platform-verdict

| Domæne | AI-content? | Risiko | Vores persona (photoreal, AI-discloseret, 25+) | Kerne-betingelse |
|---|---|---|---|---|
| **Fanvue** | ✅ ja, eksplicit velkommen | lav | **kompatibel** — næsten skræddersyet | konsekvent AI-disclosure + SFW offentlig profil + KYC af dig |
| **Fansly** | ⚠️ kun ikke-fotorealistisk | høj | **IKKE kompatibel som photoreal** | enten gør personaen ikke-fotorealistisk, ellers `incompatible`/pause |
| **Instagram** | ⚠️ betinget | medium | kompatibel **kun SFW** | alt strengt SFW; AI-label; suggestivt demotes |
| **Landing page** | ✅ | lav | kompatibel | 18+ notice + AI-disclosure + ingen eksplicit public |
| **Payments (SFW)** | ✅ mainstream (Stripe) | lav | kompatibel | SFW udløser ikke adult-card-regler |
| **Payments (adult)** | ⚠️ kun CCBill/Segpay | medium | betinget | closed-loop + ingen rigtig-person-likeness; verificér reserves i aftalen |

## Tværgående forpligtelser (gælder ALT, alle platforme)
1. **AI-disclosure på selve indholdet** — bio + on-image/-video watermark + caption. EU AI Act art. 50(4):
   disclosure **kun i T&C er ikke nok** (Kommissionens vejledning para. 35) — den skal være synlig på indholdet,
   senest ved første eksponering (art. 50(5)).
2. **Maskinlæsbar AI-mærkning** (art. 50(2)): brug genereringsværktøjer der lægger C2PA/Content Credentials i
   output, og **fjern den ikke**. Gælder fuldt fra **2. august 2026** (eksisterende systemer har frist til
   2. dec. 2026 *kun* for art. 50(2)-mærkning, jf. den foreløbige AI Omnibus-aftale).
3. **Ingen rigtig persons lighed.** Personaen skal være 100 % opdigtet og ikke kunne forveksles med nogen
   konkret virkelig person (kendt eller privat). Det er det enkeltkrav der holder os ude af deepfake-,
   NCII-, § 264d-, § 264e- og § 73a-risiko.
4. **Tydeligt 25+.** Intet teen-/school-look. Prompt/disclaimer "redder" ikke et mindreårigt udseende
   (eksplicit hos Fanvue + alle generatorer; rapporteres til NCMEC).
5. **Discloseret AI-chatbot** (art. 50(1)): en bot skal oplyse at man taler med et AI-system.

---

## 1) Fanvue — primær monetization · **lav risiko**
Fanvue *"welcomes and embraces the use of AI generated or enhanced media"* og *"we do allow fully
AI-generated content"* — fuldt virtuelle AI-creators er eksplicit velkomne.
- **Disclosure obligatorisk:** alle AI-medier skal bære klar oplysning (watermark/caption/bio). Fanvue
  påsætter selv et lovpligtigt "AI"-tag på AI-profiler — men stol ikke kun på det.
- **Ingen rigtig person** (ud over kontoejeren); ingen lighed med under-18.
- **Offentlig profil = SFW:** profilbillede/banner/intro-video/offentlig bio må ikke have nuditet, implied
  nuditet, gennemsigtigt tøj, hyper-seksualiseret posering eller eksplicit sprog.
- **Payout-gate:** det rigtige menneske bag personaen (Mads) består **KYC** med eget gyldigt statsligt
  foto-ID + selfie/biometri — selv når personaens ansigt er syntetisk. Plus skatteformular:
  **W-9** (US-creators) / **W-8BEN** (ikke-US, dvs. dig). Op til **15 AI-konti** pr. verificeret identitet.
- **Moderation:** "Reasonable Person's Test" af et moderation-team (antal moderatorer ikke oplyst).
- *Kilder:* help.fanvue.com (8442803, 9538738, 14290142, 9539091, 7860573), legal.fanvue.com (AUP + Community Guidelines).

## 2) Fansly — **betinget / høj risiko for en photoreal persona**
Fanslys egen help-artikel (dateret dec. 2025) **forbyder photorealistisk/lifelike AI-indhold** (inkl.
deepfakes, face-swaps, syntetisk media designet til at fremstå som rigtige mennesker).
- **Tilladt:** en *non-photorealistic* virtuel creator/entitet — men kun hvis operatøren registrerer og
  verificerer sig med **sin egen rigtige juridiske identitet + foto-ID før launch**.
- **AI-chat skal have menneskeligt opsyn** (ingen fuldt autonom respons).
- **Konsekvens:** en photoreal persona rammer præcis det Fansly forbyder → **markér Fansly `incompatible`**
  i dashboardet, medmindre I bevidst laver en klart stiliseret/ikke-fotorealistisk variant.
- *Pas på 3.-partssider* (sozee.ai m.fl.) — de modsiger hinanden ("AI helt forbudt" vs. "deepfakes tilladt"); kun Fanslys egen artikel gælder.
- *Kilde:* help.fansly.com/en/articles/12315578.

## 3) Instagram — SFW-funnel · **medium risiko**
- **AI-nøgenhed = ægte nøgenhed:** Metas Adult Nudity-standard fjerner AI-/computergenereret nuditet og
  seksuel aktivitet **uanset om det ser fotorealistisk ud**. Hold alt på IG strengt SFW.
- **Suggestivt (lovligt) demotes:** borderline-indhold vises ikke i Explore/Reels og anbefales ikke —
  byg **ikke** vækst på at suggestivt materiale når nye følgere via anbefalinger.
- **AI-label ("AI Info"):** påsættes når Meta detekterer C2PA/IPTC-metadata, eller når du selv-discloser.
  Selv-disclosure er **krav** for fotorealistisk AI-video/realistisk lyd — manglende kan give sanktioner.
- **Sexual Solicitation:** funnel fra IG til paid-platform må ikke udgøre seksuel solicitation *på* IG.
- *Note:* NCII/deepfake-intime-billeder håndteres pt. under Metas *Bullying & Harassment*-standard (ikke "Adult Sexual Exploitation" — det var kun en Oversight Board-anbefaling). Strengt forbudt uanset.
- *Kilder:* transparency.meta.com (adult-nudity, sexual-solicitation, demote), about.fb.com (2024/02 + 2024/04 AI-labeling), Oversight Board.

## 4) Instagram DM / automation — **høj risiko (adfærd, ikke persona)**
Risikoen er **ikke** at personaen er AI — det er automatiserings-**adfærden**.
- **Eneste lovlige DM-automation:** officiel **Instagram Messaging API** (Graph) på en **professional**-konto.
- **Strengt reaktivt:** du må kun svare når brugeren skriver først; **24-timers** svarvindue; uden for vinduet
  kun **`human_agent`-tag (≤7 dage)**. *Ingen* kold/uopfordret DM, *ingen* bulk-outreach.
  (Efter Metas tag-deprecation 2026-04-27 er `human_agent` reelt det eneste relevante tag.)
- **Forbudt → ban/throttle:** køb/salg af engagement, auto-follow/-like/-comment, høj-frekvent posting,
  3.-parts-bots der logger ind med dine credentials, scraping/omgåelse af rate limits.
- **Bot-disclosure:** automatiseret oplevelse skal oplyses (start + ved skift menneske↔bot); svar ≤30 sek.
- *Konklusion:* brug DM kun til at **besvare indkommende** beskeder + **safe routing**; voks organisk.
- *Kilder:* developers.facebook.com (messenger/IG policy, send-messages, human-agent-escalation, platform terms), transparency.meta.com (spam, account-integrity, inauthentic-behavior), help.instagram.com/263751177667145.

## 5) EU AI Act (Forordning 2024/1689) art. 50 — **lav risiko (transparens, ikke forbud)**
Forbyder **ikke** syntetiske personaer — pålægger transparens.
- **Art. 50(2)** (provider): markér syntetisk output i maskinlæsbart format, detekterbart som AI-genereret.
- **Art. 50(4)** (deployer): oplys at billede/video/lyd er en **deepfake / kunstigt genereret**. En "deepfake"
  (art. 3(60)) defineres ved **realisme** — et *realistisk, natural-looking* syntetisk menneske tæller,
  **selv om ingen rigtig person afbildes** (Kommissionens vejledning juni 2026).
- **Ikrafttræden:** 2. august 2026. Disclosure i T&C alene er **ikke nok** (skal være på indholdet).
- **Code of Practice on Transparency** (10. juni 2026, frivillig): underskrivere får formodning om compliance
  (under endelig adequacy-vurdering; signatur-frist 22. juli 2026).
- *Kilder:* EUR-Lex 2024/1689, ai-act-service-desk.ec.europa.eu (art. 3 + 50), digital-strategy.ec.europa.eu (Code of Practice), artificialintelligenceact.eu (art. 50/113).

## 6) Dansk/EU-ret: efterligning, NCII, GDPR — **lav-medium (fordi ingen rigtig person)**
- En **fuldt syntetisk persona uden lighed med nogen virkelig person** falder uden for: EU AI Act-deepfake
  (art. 3(60)), dansk **§ 73a**-udkast (digitale efterligninger — beskytter kun virkelige/identificerbare
  personer; i kraft ~31. marts 2026, parodi/satire fortsat tilladt), **straffeloven § 264d** (videregivelse af
  privatlivsbilleder) og **§ 264e** (identitetsmisbrug). Alle kræver en konkret virkelig person.
- **De reelle pligter:** (a) AI-disclosure (AI Act + Meta); (b) **GDPR på jeres egne kunder/abonnenter** — ikke
  på figuren. Indsamler I seksualliv/biometri om **virkelige** kunder (art. 9) kræves **udtrykkeligt samtykke**.
- **Anbefaling:** dokumentér at figuren er opdigtet; få en dansk advokat til at læse det endelige § 73a-udkast
  før launch hvis personaen overhovedet kunne minde om en virkelig person.
- *Kilder:* kum.dk (deepfake-aftale 26-06-2025), hoeringsportalen.dk/70269, retsinformation.dk (§ 264d), gdpr-info.eu (art. 4 + 9).

## 7) Payment processors — **SFW = ingen blokering**
- **SFW-gate:** card-brand adult-regler (Visa VIRP / Mastercard SMR) bider **kun** ved eksplicit/adult indhold.
  Et SFW persona-projekt → brug en **mainstream-processor (Stripe e.l.)** og læs *deres* AUP.
- **Hvis I går adult:** kun **CCBill/Segpay** (mainstream afviser). **AI er ingen smutvej** — Mastercards
  samtykke-/moderationskrav gælder indhold "whether uploaded or generated"; Segpays forbudsliste gælder
  eksplicit "AI-generated and computer content". Adult kræver alders-/identitets-/samtykke-verifikation af
  alle afbildede, forhåndsmoderation, takedown <7 hverdage, månedlig rapportering.
- **Segpay AI-sites:** closed-loop (ingen fri-prompt), merchant-ejet aldersverificeret model-bibliotek,
  likeness-samtykke, chat-monitorering.
- **Payout-tal** (reserves, hold-perioder) er **sekundære/ubekræftede** → verificér i den underskrevne aftale.
- *Kilder:* corporate.visa.com (network-integrity), newsroom.mastercard.com (2021 SMR), gethelp.segpay.com (prohibited-content, disclosures), ccbill.com (AUP).

## 8) AI-genererings-værktøjer — **vælg efter ToS *og* faktisk filter**
For et suggestivt-men-ikke-eksplicit, AI-discloseret, 25+ syntetisk persona (ligner ingen rigtig person):
- **Mest tilladelige per skreven ToS:** **xAI/Grok** (forbyder kun real-person/child-seksualisering) og
  **Leonardo.ai** (forbyder kun eksplicit/non-consent/impersonation).
- **Forbyder vores formål:** **Midjourney** (al "sexualized imagery", SFW-only), **Adobe Firefly**,
  **Stability** (hosted, efter 31-07-2025), **Kling** — eksplicit/nudity-forbud + strikse filtre.
- **Policy-vs-model-gap:** OpenAI/Google forbyder i policy kun *eksplicit*, men model-filtrene afviser i
  praksis også mildt suggestivt. (Påstande om OpenAI "adult mode" og Leonardo "NSFW-toggle" er **ikke** i de
  officielle ToS — behandl som ubekræftede.)
- **Loftet sættes af Meta på IG:** hold output **under** near-nudity-grænsen (påklædt/badetøj, ingen synlige
  kønsdele/brystvorter, ingen simuleret seksuel akt) → passerer både generator-ToS og bliver på Instagram.
- *Kilder:* officielle usage policies for Midjourney, Stability, Google, OpenAI, Adobe, Leonardo, xAI, Kling + Meta Community Standard + EU AI Act art. 50.

---

## Åbne punkter / skal verificeres før/ved launch
- [ ] **§ 73a endelig lovtekst** (PDF var 403 under research) — dansk advokat læser før launch.
- [ ] **Fanvue W-8BEN + payout-vilkår** — bekræft i Fanvues tax/payout-hjælpeartikel ved onboarding.
- [ ] **Adult payout-reserves** (hvis adult-rute) — verificér i CCBill/Segpay-aftalen før volumen.
- [ ] **Generator-filter i praksis** — test xAI/Grok + Leonardo på faktisk suggestivt output (ToS ≠ filter).
- [ ] **Fansly-beslutning** — `incompatible` (photoreal) eller byg ikke-fotorealistisk variant. Dokumentér i tabben.
- [ ] **xAI AUP** er mærket "previous version" — tjek nyeste før produktion.
