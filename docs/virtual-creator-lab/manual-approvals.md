# Virtual Creator Lab — manuelle godkendelser (kun Mads)

Ting Claude **ikke** gør for dig — enten fordi de kræver dine konti/identitet/penge, eller fordi
de er compliance-gates der ved design kræver et menneske. Afkryds i dashboardet/her efterhånden.

## Før noget går live
- [ ] **Brand-navn + persona-navn** (international English, ligner ingen rigtig person/celebrity).
- [ ] **Disclosure-tekst** endeligt ordlyd (bio + on-image watermark). Forslag: "AI-generated virtual creator · not a real person · 18+".
- [ ] **Konto-oprettelse + identitets/alders-verifikation** på hver platform (IG, Fanvue, evt. Fansly) — kræver din ID.
- [ ] **Payment/payout-setup**: bankkonto, skatteforhold, processor-onboarding (kun dig).
- [ ] **AI-værktøjsvalg**: vælg billede-/video-tool hvis ToS tillader vores content-type — du accepterer deres vilkår.

## Policy-gates (sign-off pr. platform)
- [ ] **Fanvue**: bekræft AI-creator-policy tillader personaen (efter policy-research). Sign-off.
- [ ] **Fansly**: afgør `kompatibel` / `incompatible` / `pause` ud fra aktuel AI-policy. Dokumentér i tabben.
- [ ] **Instagram/Meta**: bekræft SFW-grænse + AI-label-krav forstået og overholdt.
- [ ] **EU AI Act / dansk ret**: bekræft disclosure-niveau opfylder transparenskrav (notat i `compliance.md`).

## Løbende (testfasen — første 30 dage)
- [ ] **ALT paid/spicy content** godkendes manuelt før publicering (billede, video, caption, PPV).
- [ ] **Alle chat-svar** der rører eksplicit/betaling/alderstvivl → human review før afsendelse.
- [ ] **Hver compliance-check** (AI-disclosure, no-real-person, no-minor-look, no-celebrity) bekræftet pr. asset.

## Gates mellem faser (du trykker "go")
- [ ] **Fase 1 → 2** (manuel → assisteret auto): først når SFW-flow + compliance-rutine er stabil.
- [ ] **Fase 2 → 3** (assisteret → kontrolleret autopilot): først når 30-dages human-approval-historik er ren.
- [ ] **Aldrig** svækkes en compliance-regel uden din eksplicitte godkendelse.

## Infra (kræver dine nøgler — indsæt selv, aldrig i chat/git)
- [ ] Evt. nye env-vars til scraping/posting-automation (Fase 2) i Vercel + `.env.local`.
- [ ] Service_role-baserede n8n-credentials til at skrive `virtual_creator_*`-tabeller (Fase 2).
