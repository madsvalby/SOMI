# Manual Launch Checklist — Sera

> Trin-for-trin til live. Compliance-trin er ufravigelige. Se også [`manual-approvals.md`](manual-approvals.md).

## 1) Brand & persona (klar ✅)
- [x] Navn: **Seraphine «Sera»** · persona-bible + prompt-bible skrevet.
- [ ] Endelig disclosure-tekst bekræftet (bio + watermark + chat).
- [ ] 10-15 SFW-assets genereret (seed/reference låst for konsistens, syntetiske markører + AI-watermark).

## 2) Konti (kræver dig)
- [ ] Instagram **professional**-konto · handle · bio m. AI-disclosure + link til `/sera`.
- [ ] Fanvue-konto · **din KYC** (foto-ID + selfie) · **W-8BEN** · AI-tag/disclosure.
- [ ] Fansly: **spring over** (incompatible for photoreal) — eller byg bevidst ikke-fotoreal variant.
- [ ] (Senere) payment: SFW→Stripe; adult→CCBill/Segpay (verificér reserves i aftale).

## 3) Landing (bygget ✅ — skal deployes)
- [x] `/sera` bygget: 18+ gate, AI-disclosure, link-hub, UTM, dashboard-tracking. Build grøn.
- [ ] Sæt Fanvue/IG **Profil-URL** i dashboardet (VCL → Platforme) → hub-links går live.
- [ ] Deploy til Vercel · sæt evt. eget domæne · Supabase **Site URL** opdateret hvis nyt domæne.
- [ ] Tjek `/sera` på mobil (mobile-first) + at links åbner i ny fane med UTM.

## 4) Compliance-sign-off (ufravigeligt)
- [ ] Persona ligner ingen rigtig person · tydeligt 25+ · syntetiske markører synlige.
- [ ] AI-disclosure på indholdet (ikke kun T&C) · C2PA-metadata bevaret.
- [ ] IG-content 100% SFW · platform-policy bekræftet (`compliance.md`).
- [ ] (Dansk advokat læser endelig § 73a hvis nogen tvivl om lighed.)

## 5) Go-live
- [ ] Første SFW IG-posts + reels (manuel approval) · link-hub aktiv.
- [ ] Tracking verificeret (visits/klik i dashboardet).
- [ ] Start 30-dages growth-test (`30-day-growth-test.md`).

## 6) Drift (testfase, 30 dage)
- [ ] **ALT paid/spicy** human-godkendt før publicering.
- [ ] Chat reaktiv + safe routing; høj-risiko-beskeder → human review.
- [ ] Dagligt metrics-tjek · ugentlig growth-loop · 0 compliance-regler svækket uden din OK.
