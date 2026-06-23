// Genereret fra company-roadmaps workflow (6 agenter + QA), jun. 2026. Kondenseret til UI.
export const COMPANY_ROADMAPS = [
  {
    "slug": "faceless",
    "name": "Faceless Foundry",
    "tagline": "Done-for-you faceless-dokumentarer på autopilot — 90%+ margin, fabrikken kører allerede.",
    "summary": "Imperiets flagskib: en DFY-service der sælger faceless-dokumentar-videoer produceret af pipelinen Mads allerede driver (self-hosted ffmpeg-render + lokal Chatterbox-stemmeklon + n8n + Supabase) til ~90%+ margin. Kun landing page + lead-backend (foundry_orders + foundry-order edge-funktion) er live; alt i selve produktet mangler.",
    "deploy": {
      "recommendation": "Hybrid: salgs-/kunde-frontend på Vercel+Supabase, produktion LOKALT på Mads' egen render-server.",
      "stack": [
        "Frontend: behold den live statiske landing page (Tailwind CDN) på Vercel; opgradér",
        "Datalag: Supabase (projekt ihmgmpuptlmxokdmdirm). foundry_orders kører",
        "Edge: foundry-order (LIVE) som lead-intake; tilføj senere separat",
        "Orkestrering: n8n (self-hosted) — to nye workflows: FOUNDRY SAMPLE (lead → demo)",
        "Produktion (LOKALT, urørt): ffmpeg-render + lokal Chatterbox-stemmeklon = near-zero",
        "Betaling: Stripe (test-mode først, derefter live), Checkout-links pr. tier.",
        "Notifikation: n8n/edge mailer Mads ved nyt lead (genbrug somi-rapport-mønstret)."
      ],
      "rationale": "Den kundevendte del (landing, checkout, dashboard) skal være altid-oppe, hurtig og global — præcis hvad Vercel+Supabase er bygget til, og landingen kører allerede der. Selve produktionen skal blive lokal: hele 90%+ margin stammer fra self-hosted render + gratis lokal Chatterbox + ingen per-render-fee, og det er også GDPR-data-suverænitets-salgsargumentet."
    },
    "phases": [
      {
        "title": "Fase 1 — Fundament & positionering",
        "goal": "Gøre tilbuddet købbart: brand, niche, juridik, konti og domæne på plads, så en besøgende kan blive til en betalende kunde uden showstoppere.",
        "duration": "3-5 dage (mest Mads-beslutninger, ikke byg)",
        "deliverable": "Et godkendt, juridisk dækket tilbud (brand + niche + priser + ToS/voice-consent/refund) publiceret på den live landing page med eget domæne og strammet CORS, klar til trafik.",
        "steps": [
          {
            "title": "Landing page bygget og live",
            "detail": "Komplet professionel landing page (hero, how-it-works, pris-tiers, sample-form, FAQ) i faceless-content-engine/index.html.",
            "status": "done",
            "needsMads": false
          },
          {
            "title": "Lead-backend live og testet",
            "detail": "Supabase-tabel foundry_orders + edge-funktion foundry-order (CORS=*, testet ✅ jf. BACKEND.md) fanger alle leads med source='faceless'.",
            "status": "done",
            "needsMads": false
          },
          {
            "title": "Lås brand-navn + positionering",
            "detail": "Bekræft 'Faceless Foundry' (pt. placeholder i koden) eller vælg nyt, og lås nichevinkel: long-form dokumentarer, ikke short-form spam.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Køb domæne + peg på Vercel + stram CORS",
            "detail": "Køb domæne, peg DNS på Vercel, opdatér LEAD_ENDPOINT, og stram foundry-order CORS-origin fra '*' til det konkrete domæne.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Voice-consent + ToS + DPA + refund-politik",
            "detail": "Skriv og PUBLICÉR på siden: vilkår for klonede stemmer (eksplicit consent), refund-politik og DPA. Consent skal være på plads før første salg.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Godkend priser + kapacitets-beslutning",
            "detail": "Godkend tiers (Starter €499/12vid · Growth €1.499/~30vid · Custom €3-6k). Lås ÉT tal (live landing bruger €499).",
            "status": "todo",
            "needsMads": true
          }
        ]
      },
      {
        "title": "Fase 2 — Byg MVP (notifikation → sample → intake → produktion → levering)",
        "goal": "Lukke kæden fra 'lead i database' til 'leveret video' med så lidt ny kode som muligt — fabrikken (MASTER) genbruges næsten 100%; alt nedenstående er ny kode der ikke findes endnu.",
        "duration": "2-3 uger",
        "deliverable": "En test-mode end-to-end-flow: nyt lead → Mads notificeres → prospect kan få gratis sample → betalt ordre udløser automatisk video gennem MASTER med review-gate → download-klar fil + status",
        "steps": [
          {
            "title": "Lead-notifikations-mail + admin-lead-view",
            "detail": "n8n/edge-trin der mailer Mads ved nyt lead (genbrug somi-rapport-mønstret + Gmail SMTP) — pt. gemmes leads kun i DB.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "FOUNDRY SAMPLE-workflow (lead-magnet)",
            "detail": "Ny n8n-webhook: lead → Claude-script om prospektets emne → render+TTS 15-30s sample → email med URL. Demoen ER lead-magneten.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Udvid Supabase-datamodel (migration)",
            "detail": "Opret som SQL-migration (pt. kun forslag i README): customers, orders, videos(status queued→…→delivered), channels, assets — oven på foundry_orders.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Stripe-checkout + webhook",
            "detail": "Opret produkter/priser i Stripe (test-mode), Checkout-link pr. tier, og ny edge-webhook: betalt ordre → opret customer+order+video → trig FOUNDRY",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "FOUNDRY INTAKE-workflow",
            "detail": "Ny n8n-webhook modtager ordre → kalder MASTER med niche/stemme/længde; status-callback-noder skriver tilbage til videos.status pr. trin.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Menneske-review-gate + kunde-dashboard",
            "detail": "Indsæt eksplicit compliance/kvalitets-review FØR render i INTAKE ('meaningful human involvement') + et status-dashboard i SOMI-stil (Next.js +",
            "status": "todo",
            "needsMads": false
          }
        ]
      },
      {
        "title": "Fase 3 — Pilot (gratis samples → første betalende)",
        "goal": "Validere højest-margin-modellen med rigtige penge: bevis at folk betaler efter at have set en personlig sample.",
        "duration": "2-3 uger",
        "deliverable": "1-3 betalende pilotkunder (per-video eller Starter-tier) + 2-3 testimonials/case-videoer fra Paper Empires-porteføljen som bevis.",
        "steps": [
          {
            "title": "Generér ~20 gratis samples til prospects",
            "detail": "Brug FOUNDRY SAMPLE til personlige demo-klip til 20 håndplukkede prospects — demoen er selv lead-magneten.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Direkte outreach + bevis-portefølje",
            "detail": "Saml Paper Empires-videoer (Terra/Luna m.fl.) som synligt portfolio/bevis (kræver Mads' OK) og lav 1:1 outreach til niche-prospects. Tilføj evt.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Skift Stripe til live + luk første salg",
            "detail": "Aktivér Stripe live-mode (kræver verificeret entity + bankkonto), send checkout-link til varme leads, og luk de første per-video/Starter-ordrer.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Kør første rigtige ordre gennem pipelinen",
            "detail": "Verificér hele kæden end-to-end på en BETALT ordre: Stripe-webhook → intake → review-gate → Chatterbox → render → levering + status.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Indsaml feedback + testimonials",
            "detail": "Bed pilotkunder om feedback + skriftlig tilladelse til citat/case; justér pris/scope efter første reaktioner.",
            "status": "todo",
            "needsMads": true
          }
        ]
      },
      {
        "title": "Fase 4 — Launch (offentlig + recurring)",
        "goal": "Gå fra håndholdt pilot til en offentlig, gentagelig salgsmotor med månedlige abonnementer og selvbetjent checkout.",
        "duration": "2-4 uger",
        "deliverable": "Offentligt annonceret service med selvbetjent checkout, recurring månedsabonnementer (Starter/Growth) og et reproducerbart sample→salg-flow.",
        "steps": [
          {
            "title": "Offentlig launch + announce",
            "detail": "Annoncér på relevante kanaler; brug self-hosted/anti-crackdown-vinklen som differentiator.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Recurring billing (Starter/Growth)",
            "detail": "Skift fra per-video til Stripe-abonnementer for €499/€1.499/md med automatisk videokvote pr.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "OAuth auto-upload (valgfrit)",
            "detail": "Tilføj YouTube-OAuth så videoer kan uploades direkte til kundens kanal i stedet for kun download.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Resultat-dashboard + årsplaner",
            "detail": "Vis leverede videoer/status som outcome-lock-in og tilbyd årsplaner for at sænke churn (DFY-modellens styrke).",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Skift til dedikeret Supabase-projekt",
            "detail": "Flyt foundry_-tabellerne fra SOMI-projektet (ihmgmpuptlmxokdmdirm) til et dedikeret Supabase-projekt for renere drift ved volumen (BACKEND.md: 'flyt",
            "status": "todo",
            "needsMads": true
          }
        ]
      },
      {
        "title": "Fase 5 — Skalér (kapacitet, Custom-tier & annuitet)",
        "goal": "Fjerne flaskehalsene (kapacitet + tid) og udvide til de højmargin-modeller, der ikke skalerer på timer.",
        "duration": "Løbende (1-3 måneder+)",
        "deliverable": "En skalerbar leverance: optimeret produktionskapacitet, Custom/self-hosted-tilbud til bureauer, og et voksende eget kanal-netværk som annuitet + bevis.",
        "steps": [
          {
            "title": "Optimér/skalér TTS-kapacitet",
            "detail": "Adressér CPU-flaskehalsen (~80 min/video) — parallelisering, GPU eller separat produktionsserver — så mange samtidige kunder + samples kan betjenes",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Custom / self-hosted-tier til bureauer",
            "detail": "Pakketér €3-6k setup + retainer hvor pipelinen kører på kundens egen infra = fuld GDPR-suverænitet (Zapier/Make kan ikke).",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Multi-tenant n8n + multi-kanal",
            "detail": "Gør intake-flowet multi-tenant (kunde/kanal-isolation via channels-tabellen) så ét setup betjener flere kunders kanaler.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Eget kanal-netværk som annuitet",
            "detail": "Så nye egne kanaler (fx Maritime) parallelt — 100% upside + bevis-portefølje (RPM: history $4-6, true crime $6-9,5, finance $9-25).",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "White-label / licensing",
            "detail": "Tilbyd licensing/white-label ($1-5k/md/partner) til bureauer for lav-churn B2B-skalering.",
            "status": "todo",
            "needsMads": true
          }
        ]
      }
    ],
    "firstMove": "Køb domænet og lås brand + positionering, og byg så de to ting der mangler: (1) lead-notifikations-mailen (leads gemmes pt.",
    "madsNeeds": [
      "Domæne + peg på Vercel + sæt som CORS-origin (i stedet",
      "Lås brand-navn (pt. placeholder) + nichevinkel + lås ÉT",
      "Forretnings-entity (ApS) + bankkonto (kræves før Stripe",
      "Stripe-konto: produkter/priser, test→live, secret key i .env",
      "Voice-consent + ToS + DPA + refund-politik publiceret før",
      "Kapacitets-beslutning: samme server som Paper Empires eller",
      "Tilladelse til at bruge Paper Empires-videoer offentligt",
      "YouTube-OAuth-godkendelse hvis auto-upload ønskes (Fase 4)",
      "Liste over første ~20 prospects + selve outreach/salget",
      "(Skalering) Beslutning om GPU/ekstra server + dedikeret"
    ],
    "kpis": [
      "Gratis sample → betalende konvertering (mål: ≥10-15%)",
      "Antal betalende kunder / MRR (delmål 1-3 pilots → €7-30K)",
      "Bruttomargin pr. video ≥90% (kost ~€3 vs pris ~€50)",
      "Leveringstid pr. video (flaskehals-indikator",
      "Lead-respons: tid fra nyt lead til Mads notificeres (mål <1"
    ],
    "links": [
      {
        "label": "Eksempel (landing page, live HTTP 200)",
        "url": "https://somi-phi.vercel.app/imperium/faceless/index.html"
      },
      {
        "label": "Lead-backend (edge-funktion, LIVE + testet)",
        "url": "https://ihmgmpuptlmxokdmdirm.supabase.co/functions/v1/foundry-order"
      },
      {
        "label": "Markedsresearch (research-03-faceless-content.md)",
        "url": "file:///C:/Users/madsv/Desktop/imperium/research-03-faceless-content.md"
      },
      {
        "label": "Strategirapport top-3 (RAPPORT-top3.md)",
        "url": "file:///C:/Users/madsv/Desktop/imperium/RAPPORT-top3.md"
      },
      {
        "label": "Backend-arkitektur + status (BACKEND.md)",
        "url": "file:///C:/Users/madsv/Desktop/imperium/BACKEND.md"
      },
      {
        "label": "Kildemappe (faceless-content-engine)",
        "url": "file:///C:/Users/madsv/Desktop/imperium/faceless-content-engine/"
      },
      {
        "label": "Design-reference (bridgemind.ai)",
        "url": "https://bridgemind.ai"
      }
    ]
  },
  {
    "slug": "listingreel",
    "name": "ListingReel",
    "tagline": "Hver listing bliver til en video. Automatisk.",
    "summary": "Vertikal micro-SaaS for ejendomsmæglere: fotos + listing-detaljer → Claude-script → mæglerens klonede stemme → branded reel → auto-post. Mads' near-zero-marginalkost-infra (self-hosted render + Chatterbox + n8n + Supabase) gør flad per-listing-pris ($49-399/md) mulig hvor konkurrenter betaler per-credit.",
    "deploy": {
      "recommendation": "HYBRID: self-hosted pipeline (render + Chatterbox-voice + n8n) på one.com-serveren til det marginalkost-kritiske lag, koblet til Vercel + Supabase for det",
      "stack": [
        "Frontend/app: Next.js 14 (App Router, JS) på Vercel.",
        "Auth + DB + Storage: Supabase (eu-west-1). Nyt dedikeret 'ListingReel'-projekt når man",
        "Betaling: Paddle (Merchant of Record, håndterer EU-moms) anbefalet; Stripe Billing",
        "Pipeline (LOKAL): n8n 'LISTINGREEL' (ingest → Claude-script → Chatterbox-TTS:8090 →",
        "Render + Voice: self-hosted ffmpeg-renderer + Chatterbox (/opt/somi-tts) — UÆNDRET, det",
        "Auto-post: n8n IG/TikTok/FB/YouTube. Business-API har lang ledetid → Starter =",
        "Portal/MLS-ingest: for MVP manuel upload + valgfri URL-scrape."
      ],
      "rationale": "Den hybride model er den eneste der bevarer forspringet: render+voice konverterer konkurrenters største variable kost (per-minut) til 80-95% margin; flytter man pipelinen i cloud, taber man prisvåbnet. At hoste det kundevendte lag på samme enkelt-VPS er en single-point-of-failure + GDPR-risiko — Vercel+Supabase giver managed SSL, RLS og oppetid gratis til pilot-skala."
    },
    "phases": [
      {
        "title": "Fase 1 — Fundament & juridik",
        "goal": "Gør venturet kommercielt klar: brand, entity, betaling, samtykke-vilkår og et dedikeret datalag — så intet juridisk/ops blokerer betaling.",
        "duration": "1 uge aktivt (men 2-4 ugers ekstern ventetid på ApS + social-API — start NU)",
        "deliverable": "Registreret ApS (eller Stripe Atlas igangsat), Paddle/Stripe i test-mode, domæne live med SSL, voice-consent + ToS/DPA + GDPR-baseline, dedikeret Supabase-projekt, og IG/TikTok",
        "steps": [
          {
            "title": "Landing page bygget",
            "detail": "Poleret somi-tema landing page (listingreel/index.html, Tailwind CDN) er live og koblet til lead-backend; formularen POSTer source='listingreel'.",
            "status": "done",
            "needsMads": false
          },
          {
            "title": "Delt lead-backend live",
            "detail": "Supabase foundry_orders + foundry-order edge-funktion (verify_jwt=false, CORS=*) er deployet og testet; insert + {ok:true}-svar bekræftet",
            "status": "done",
            "needsMads": false
          },
          {
            "title": "Tilføj analytics + konverterings-sporing på landing",
            "detail": "Læg let analytics (Plausible/Umami/Vercel Analytics) + event på form-submit, så lead→besøg-konvertering kan måles (ellers er KPI 'lead→pilot ≥25%'",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Registrér entity + betaling",
            "detail": "Opret ApS (eller Stripe Atlas) + erhvervsbankkonto, og opret Paddle-konto i test-mode (MoR, EU-moms) — eller Stripe Billing.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Køb domæne + brand-beslutning",
            "detail": "Vælg endeligt navn (ListingReel = placeholder), køb domæne, peg på Vercel, sæt SSL, og sæt domænet som CORS-origin på foundry-order (pt. CORS=*).",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Voice-consent + GDPR-vilkår + ToS/DPA",
            "detail": "Skriv eksplicit voice-likeness-samtykke (mægler optager 60s → tilbagekaldeligt samtykke) + ToS + DPA + GDPR-baseline.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Dedikeret Supabase-projekt",
            "detail": "Opret separat 'ListingReel'-projekt i eu-west-1 til ren multi-tenant RLS, billing og dataisolation.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Indsend social-API business-ansøgning",
            "detail": "Start IG/TikTok/FB business-API-godkendelse NU (uger til måneders ledetid) så auto-post er klar til Pro-tier i Fase 5 i stedet for at blokere launch.",
            "status": "todo",
            "needsMads": true
          }
        ]
      },
      {
        "title": "Fase 2 — Byg MVP (app + pipeline)",
        "goal": "Byg produktet: et multi-tenant web-app oven på den eksisterende render+voice+n8n-core, så en mægler kan logge ind, uploade en listing og få en færdig branded reel retur.",
        "duration": "3-4 uger (template genbruges, men schema + pipeline + 9:16 + billing + onboarding er alle nye)",
        "deliverable": "Fungerende self-serve MVP: login → onboarding (logo, 60s stemme, brand-farver) → upload listing → automatisk reel ud → download/post. Paddle/Stripe-webhook (test) styrer tier-grænser.",
        "steps": [
          {
            "title": "Supabase-schema + RLS + Storage",
            "detail": "Tabeller: agents, brands[cloned_voice_id], listings, render_jobs[state-machine], usage, videos — med RLS per agent/brand og Storage til fotos/output.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Next.js-app på somi-skabelon",
            "detail": "Genbrug somi-app: @supabase/ssr, middleware-auth, noir/guld-design. Byg kundevendt dashboard på Vercel.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "n8n LISTINGREEL-pipeline",
            "detail": "ingest → Claude-script → Chatterbox-TTS (8090) → ffmpeg-render (:8080) → usage-log. Batch off-peak + samtidig-job-loft for CPU-margin.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "9:16 listing-template i renderer",
            "detail": "Tilføj branded ejendoms-template-preset i /opt/somi-renderer server.js (genbrug renderShort) med logo/farve-overlays per brand.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Onboarding-wizard",
            "detail": "Self-serve: upload logo, vælg brand-farver, optag 60s stemme (→ ref.wav per agent, kræver underskrevet consent), indsæt første listing.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Billing-webhook (test-mode)",
            "detail": "Edge-funktion i ListingReel-projektet: Paddle/Stripe-webhook → sæt subscription-status + reel-kvote (5/20/multi) per tier.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Job-fejl-håndtering + intern alarm",
            "detail": "Fejlede render/TTS-jobs sættes til fejl-state i render_jobs og udløser en n8n/edge-alarm til Mads — så en mislykket kunde-reel ikke forsvinder",
            "status": "todo",
            "needsMads": false
          }
        ]
      },
      {
        "title": "Fase 3 — Dogfood & demo-bevis",
        "goal": "Bevis at pipelinen producerer salgbare reels på rigtige listings, og forvandl outputtet til selve lead-magneten (demo = produkt = outreach-aktiv).",
        "duration": "1 uge",
        "deliverable": "10 færdige demo-reels fra rigtige offentlige listings, hver klar til personlig outreach til den specifikke mægler, en intern QC-tjekliste der låser et kvalitetsgulv, og en fungerende",
        "steps": [
          {
            "title": "Vælg ÉT lokalt marked",
            "detail": "Pick én geografi/brokerage-niche at angribe først (fokuseret outbound slår spredt — CAC-pointe).",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Generér 10 demo-reels",
            "detail": "Kør 10 rigtige offentlige listings (fra de valgte prospekters egne aktive listings, så outreach bliver personlig) gennem pipelinen → 10 polerede",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "QC + kvalitets-tjekliste",
            "detail": "Review hver reel for stemme-glitch, billed-sync, branding, drawtext-fejl; lås et skriftligt kvalitetsgulv før salg.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Lead → auto-sample workflow",
            "detail": "Byg n8n LISTINGREEL SAMPLE: nyt lead (source='listingreel') → Claude-script om DERES listing → 15-30s sample → email-svar.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Lead-notifikation til Mads",
            "detail": "Tilføj n8n/edge-trin der mailer Mads ved nyt lead (genbrug somi-rapport-mønster + Gmail SMTP) i stedet for kun DB-gem.",
            "status": "todo",
            "needsMads": false
          }
        ]
      },
      {
        "title": "Fase 4 — Pilot (5 betalende)",
        "goal": "Konvertér demo-bevis til de første betalende pilot-kunder via personlig outreach i det valgte marked, og valider pris + churn-loop i praksis.",
        "duration": "2-3 uger",
        "deliverable": "5 betalende pilots @ $49-149/md med signeret voice-consent, live abonnement i Paddle/Stripe (produktion), mindst én skriftlig testimonial/case, og verificeret end-to-end købsflow.",
        "steps": [
          {
            "title": "Cold-outreach på de 10",
            "detail": "Send hver mægler deres egen demo-reel (LinkedIn + email): 'her er din næste listing som video, gratis'. Multi-touch i ÉN vertical.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Skift billing til produktion",
            "detail": "Aktivér live Paddle/Stripe (kræver godkendt entity + bankkonto fra Fase 1), test hele købsflow inkl.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Onboard 5 pilots",
            "detail": "Kør hver gennem onboarding-wizard, optag voice-sample MED underskrevet samtykke (hård gate), lever første live reels.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Fang testimonial + case",
            "detail": "Bed tilfredse pilots om citat + før/efter-tal (sparet $/md) til social proof på landing page. Erstat de generiske landing-stats med rigtige pilot-tal.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Indfør årsprepay-tilbud",
            "detail": "Tilbyd rabat på årlig forudbetaling for at dæmpe churn (retention-anbefaling). Beslut rabat-størrelse.",
            "status": "todo",
            "needsMads": true
          }
        ]
      },
      {
        "title": "Fase 5 — Launch & skalér",
        "goal": "Gå fra håndholdt pilot til gentagelig launch: offentligt udbud, automatiseret onboarding/support, KPI-dashboard, og fundament for at genbruge samme core til næste vertical.",
        "duration": "3-4 uger (løbende derefter)",
        "deliverable": "Offentlig launch med betaling live, automatiseret onboarding + n8n-support, usage-metering med overage, KPI-dashboard, og en plan for vertical #2 (restaurant-reels eller dubbing) oven",
        "steps": [
          {
            "title": "Offentlig launch + auto-post",
            "detail": "Åbn self-serve signup bredt; aktivér IG/TikTok/FB/YouTube auto-post for Pro-tier — KUN hvis business-API-godkendelsen fra Fase 1 er kommet igennem",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Automatisér onboarding + support",
            "detail": "n8n-drevet onboarding-mails, fejlhåndtering og Claude-self-serve-support (lille team → automatisér).",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Usage-metering + overage",
            "detail": "Aktivér $9/listing overage-fakturering når kvote overskrides; hybrid base+metered matcher render-kurven.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "KPI-dashboard",
            "detail": "Byg admin-view (genbrug PerformanceTab.jsx-mønstret): MRR, aktive abonnenter, reels/md, churn, gross retention, margin per reel, og faktisk",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Kapacitets-beslutning (CPU vs GPU)",
            "detail": "Hvis pilot-efterspørgsel + overage presser CPU-TTS-loftet (~80 min/lang video), beslut GPU-opgradering af den self-hostede server — IKKE cloud-API",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Skalér outbound + 1-2 partnere",
            "detail": "Udvid outreach i samme vertical + søg 1-2 portal/CRM/MLS-integrationspartnere for distribution.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Forbered vertical #2",
            "detail": "Klon front-end til restaurant-reels eller SMB-dubbing på samme core (kun nyt UI + Claude-prompts), jf. porteføljestrategien.",
            "status": "todo",
            "needsMads": false
          }
        ]
      }
    ],
    "firstMove": "Registrér entity + Paddle (MoR), køb domænet OG indsend social-API business-ansøgningen — de eneste hård-blokeringer med lang ekstern ledetid.",
    "madsNeeds": [
      "EU-entity: ApS (eller Stripe Atlas) + erhvervsbankkonto",
      "Betaling: Paddle (MoR, EU-moms, anbefalet) ELLER Stripe",
      "Domæne + endelig brand-beslutning — sæt som CORS-origin",
      "Voice-consent/likeness + GDPR + ToS/DPA — hård gate før",
      "Dedikeret Supabase-projekt til ListingReel (adskil fra delt)",
      "Nøgler i .env: Anthropic; social auto-post-API (indsend",
      "Outbound-budget + ÉT lokalt startmarked (+ ~20-30",
      "Prisgodkendelse ($49/$149/$399 + $9/listing) +",
      "Kapacitets-beslutning: GPU-opgradering (ikke cloud-API)"
    ],
    "kpis": [
      "5 betalende pilots @ $49-149/md (~$250-750 MRR) inden ~30",
      "Bruttomargin per reel ≥80% (self-hosted, batch off-peak)",
      "Lead→pilot-konvertering ≥25% fra personlig",
      "Gross retention ≥85-90% efter 3 mdr (vertical-SaaS ~91%)",
      "Faktisk render+TTS-tid per reel under fastsat leverings-SLA"
    ],
    "links": [
      {
        "label": "Eksempel (landing page, live)",
        "url": "https://somi-phi.vercel.app/imperium/listingreel/index.html"
      },
      {
        "label": "Launch-guide (GUIDE.md)",
        "url": "file:///C:/Users/madsv/Desktop/imperium/listingreel/GUIDE.md"
      },
      {
        "label": "Markedsresearch (research-05 vertical micro-SaaS)",
        "url": "file:///C:/Users/madsv/Desktop/imperium/research-05-vertical-micro-saas.md"
      },
      {
        "label": "Top-3 strategirapport (TTS-kapacitets-forbehold)",
        "url": "file:///C:/Users/madsv/Desktop/imperium/RAPPORT-top3.md"
      },
      {
        "label": "Delt lead-backend (BACKEND.md)",
        "url": "file:///C:/Users/madsv/Desktop/imperium/BACKEND.md"
      },
      {
        "label": "Imperium-oversigt (README.md)",
        "url": "file:///C:/Users/madsv/Desktop/imperium/README.md"
      },
      {
        "label": "Lead-endpoint (foundry-order edge-funktion)",
        "url": "https://ihmgmpuptlmxokdmdirm.supabase.co/functions/v1/foundry-order"
      },
      {
        "label": "Design-reference (bridgemind.ai)",
        "url": "https://bridgemind.ai"
      }
    ]
  },
  {
    "slug": "adforge",
    "name": "AdForge",
    "tagline": "Unlimited AI UGC-ad-varianter til fast månedspris — platform-compliant, near-zero marginalkost.",
    "summary": "Managed/white-label UGC-ad-produktion (ikke endnu et DIY-tool) i et marked domineret af credit-baserede incumbents. Mads' edge inverterer økonomien: self-hosted render + gratis Chatterbox + open-source lip-sync = near-zero marginalkost → flad 'unlimited'-pris + gratis multi-sprog. Kun salgsfladen er bygget (landing + lead-backend source='ugc').",
    "deploy": {
      "recommendation": "Hybrid: produktions-tunge lag LOKALT på Mads' render-server (hele cost-edgen), salgs/SaaS-laget på Vercel+Supabase — som SOMI Command.",
      "stack": [
        "Render-server (LOKAL, one.com Cloud): FFmpeg + Chatterbox + MuseTalk/Wav2Lip lip-sync +",
        "n8n (LOKAL, samme instans som SOMI): intake → Claude hook-matrix (5×3×CTA) → voice →",
        "Supabase (projekt ihmgmpuptlmxokdmdirm): foundry_orders LIVE + nyt schema",
        "Vercel + Next.js 14 (App Router, JS): kunde-portal + admin i samme noir/guld-stak (egen",
        "Stripe (subscriptions: Brand €499/md, Scale €999/md, Agency custom + engros $1-3/video).",
        "Cloudflare Tunnel / reverse-proxy så Vercel + n8n sikkert kan nå render-serveren bag NAT"
      ],
      "rationale": "Lokal-først er ikke valgfrit her — det ER produktet: hele flad-unlimited-casen bygger på ~$0 marginalkost per variant, hvilket kun gælder på Mads' selv-hostede render+TTS+lip-sync-server. Det kundevendte lag (landing, portal, betaling) hører på Vercel+Supabase, hvor Mads allerede har en bevist stak."
    },
    "phases": [
      {
        "title": "Fase 1 — Fundament (juridik, brand, betaling, actor-bibliotek)",
        "goal": "Juridik, brand, betaling og det licenserede AI-actor-bibliotek på plads, så salg og levering er lovligt og indkasserbart.",
        "duration": "2-3 uger (mest Mads' beslutninger + indkøb; bank-onboarding 1-3 uger)",
        "deliverable": "Et lovligt, indkasseringsklart brand: domæne live, Stripe-planer oprettet, licenseret actor-bibliotek med consent på fil, GDPR-pakke + signeret ToS/IP/indemnification, og det live '5",
        "steps": [
          {
            "title": "Landing page live",
            "detail": "Poleret noir/guld-landing (index.html, Tailwind CDN) med flad-pris-positionering og lead-form er bygget og koblet til backend.",
            "status": "done",
            "needsMads": false
          },
          {
            "title": "Lead/ordre-backend live",
            "detail": "Supabase foundry_orders + foundry-order edge-funktion (projekt ihmgmpuptlmxokdmdirm) modtager allerede leads med source='ugc' (verificeret",
            "status": "done",
            "needsMads": false
          },
          {
            "title": "Håndtér det live '5 gratis varianter'-løfte (interim)",
            "detail": "Den live form lover '5 gratis varianter', men intet system genererer dem. Indtil Fase 3: enten (a) lever manuelt på ugc-leads, eller (b) ret teksten",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Licenseret AI-actor-bibliotek + consent på fil",
            "detail": "Køb/licensér fuldt kommercielt-rettede syntetiske skuespillere (face+stemme); gem consent/licens i Supabase (consent_records).",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Entity, Stripe & domæne",
            "detail": "Opret ApS + bankkonto + ansvarsforsikring, Stripe-konto med planer (Brand €499 / Scale €999 / Agency + engros $1-3/video) og køb domæne (AdForge =",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Juridisk pakke (inkl. GDPR)",
            "detail": "ToS med IP-assignment + AI-disclosure + indemnification, consent-vilkår, PLUS — pga.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Ad-platform-konti",
            "detail": "Opret/verificér Meta- og TikTok-business/ad-konti så leverede ads kan testes og compliance-flowet (AIGC-label/C2PA) kan valideres mod de rigtige",
            "status": "todo",
            "needsMads": true
          }
        ]
      },
      {
        "title": "Fase 2 — Byg produktions-pipelinen (MVP)",
        "goal": "Få den fulde produktionskæde til at køre end-to-end på render-serveren: fra produkt-URL til 15-30 compliant varianter uden manuel mellemkomst (undtagen QA-gate).",
        "duration": "2-3 uger (lip-sync-realisme + render-kapacitet er de reelle ukendte)",
        "deliverable": "Fungerende pipeline der tager 1 produkt-URL → 15-30 compliant per-platform-varianter på <48t til ~$0 marginalkost, logget i Supabase med consent/lineage — på en verificeret render-server",
        "steps": [
          {
            "title": "Verificér render-server: kapacitet, kvalitet & reachability",
            "detail": "FØR resten: bekræft at den nye one.com Cloud-server kører FFmpeg + Chatterbox stabilt, og mål CPU-render-throughput for en variant.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Supabase-domæneschema",
            "detail": "Tabeller med RLS: clients/products/briefs/scripts/assets/consent_records/variant_lineage/deliveries (oven på foundry_orders).",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Lip-sync på render-serveren",
            "detail": "Installér og test MuseTalk/Wav2Lip ved siden af FFmpeg + Chatterbox. Den åbne komponent der lukker pipelinen — men største kvalitetsrisiko på CPU",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "n8n end-to-end-workflow",
            "detail": "intake → Claude hook-matrix (5×3×CTA) → Chatterbox-voice → render+lip-sync → FFmpeg per-platform → compliance → QA → levering → logging.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Compliance-modul",
            "detail": "Auto-indlejr AIGC-labels + C2PA-metadata + per-platform-checkliste (TikTok/Meta) i hver levering — vores differentiator, ikke et eftertanke.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Claude hook-bibliotek",
            "detail": "Kuratér genbrugelige hook/angle/CTA-frameworks så script-matrixen producerer DR-testbare varianter, ikke generisk fyld.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Menneske-QA-gate",
            "detail": "Indsæt et review-trin før levering med eksplicit realisme-/policy-checkliste (afbøder realisme- og platform-policy-risiko og Icon-fælden) — hver",
            "status": "todo",
            "needsMads": false
          }
        ]
      },
      {
        "title": "Fase 3 — Demo-reel, dogfood & lead-automatik",
        "goal": "Bevise produktet på fiktive/egne produkter, så salg sker med vist arbejde (dokumentér, hyp ikke), og automatisér leverancen af '5 gratis varianter' som lead-magnet — så det live form-løfte endelig",
        "duration": "3-5 dage",
        "deliverable": "Offentligt demo-reel (inkl. multi-sprog) + automatisk '5 gratis varianter'-flow, så ethvert ugc-lead inden for minutter ser sit eget produkt som færdige ads — og det live form-løfte er nu",
        "steps": [
          {
            "title": "Dogfood 3 produkter",
            "detail": "Kør pipelinen på 3 fiktive/egne produkter → 15-30 varianter hver = et håndgribeligt demo-reel der dokumenterer kvalitet og turnaround.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Multi-sprog-bevis",
            "detail": "Re-voice mindst ét reel til 2-3 sprog gratis via Chatterbox — viser den lokaliserings-edge konkurrenter tager betaling for.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Sample-generator fra lead (opfylder '5 gratis'-løftet)",
            "detail": "n8n 'FOUNDRY SAMPLE'-workflow: nyt ugc-lead (source='ugc') → auto-generér 5 personlige varianter → email URL.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Lead-notifikation",
            "detail": "Tilføj mail-ved-nyt-lead (genbrug somi-rapport-mønstret via n8n Gmail SMTP) så intet ugc-lead falder mellem stolene før sample-automatikken er stabil.",
            "status": "todo",
            "needsMads": false
          }
        ]
      },
      {
        "title": "Fase 4 — Pilot (design-partnere)",
        "goal": "Land 2-3 betalende/rabatterede design-partnere, kør deres RIGTIGE produkter, og få en media-buyer til at rapportere CTR/CPA-paritet — valideringen der gør salg skalerbart.",
        "duration": "3-5 uger (afhænger af partnernes ad-spend-cyklus før CTR/CPA-data er meningsfuld)",
        "deliverable": "2-3 aktive design-partnere, mindst én betalende, og en dokumenteret case: 'X varianter, <48t, CTR/CPA på paritet eller bedre' — salgsbeviset, ikke et løfte.",
        "steps": [
          {
            "title": "Outreach: 20 DTC + 5 bureauer",
            "detail": "Kontakt 20 performance-DTC-brands + 5 bureauer (white-label-vinkel) med tilbud om '5 gratis test-varianter'.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Onboard 2-3 design-partnere",
            "detail": "Signér ToS/IP/indemnification/DPA, intake deres produkter, kør pipelinen på rigtige SKU'er.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Mål CTR/CPA mod baseline",
            "detail": "Få partnerens media-buyer til at køre varianterne live og rapportere paritet/løft vs. eksisterende creatives.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Kunde-portal (Vercel)",
            "detail": "Byg poleret portal (SOMI-stak: Next 14 JS, ingen Tailwind, noir/guld) hvor partnere indsender produkter og henter leverede varianter",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Stripe-abonnement live",
            "detail": "Konvertér mindst én pilot til betalende Brand/Scale-abonnement via Stripe (webhook → Supabase abonnement-status).",
            "status": "todo",
            "needsMads": true
          }
        ]
      },
      {
        "title": "Fase 5 — Launch & white-label",
        "goal": "Åbn for selvbetjent salg og lås den højeste-volumen-kanal: én white-label-bureauaftale (deres brand på levering = volumen uden salgsarbejde).",
        "duration": "2-4 uger",
        "deliverable": "Selvbetjent betalende kunder + mindst én white-label-bureaukanal der leverer volumen — første gentagne MRR fra to forskellige købertyper, med kapacitet verificeret under samtidig last.",
        "steps": [
          {
            "title": "Offentlig launch",
            "detail": "Skift CORS-origin fra '*' til domænet, slå Stripe-checkout til på landing, publicér case-studie fra pilot.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "White-label-bureauaftale",
            "detail": "Luk 1 performance-bureau på engros ($1-3/færdig video eller flad) med deres brand på leveringen — engros-laget er den mindst mættede del af markedet.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Admin-/leadview",
            "detail": "Simpelt Supabase-admin (SOMI-stak): leads new→contacted→won + ordre-/leverance-status, så pipeline og fulfillment er synlige.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Kapacitets-/skalerings-tjek",
            "detail": "Verificér at render+TTS+lip-sync-throughput holder ved FLERE samtidige kunder oven på Fase 2's enkelt-variant-måling; optimér eller batch-planlæg",
            "status": "todo",
            "needsMads": true
          }
        ]
      },
      {
        "title": "Fase 6 — Skalér",
        "goal": "Gå fra håndfuld kunder til en gentagelig maskine: flere bureaukanaler, multi-marked-lokalisering som upsell, og infrastruktur der ikke knækker.",
        "duration": "løbende (måned 2+)",
        "deliverable": "Skalerbar managed+white-label-forretning med forudsigelig MRR, lokaliserings-upsell og infrastruktur (egen Supabase, evt. GPU) dimensioneret efter faktisk betalende volumen.",
        "steps": [
          {
            "title": "Dediker Supabase-projekt",
            "detail": "Flyt foundry_-/AdForge-tabellerne fra det delte SOMI-projekt til et dedikeret AdForge-projekt ved skalering (renere RLS, kvoter, sikkerhed, ingen",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Multi-marked-upsell",
            "detail": "Pakkér gratis Chatterbox-fan-out til N sprog som Scale-upsell — lokalisering konkurrenter tager ekstra for.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Flere white-label-bureauer",
            "detail": "Replikér den første bureauaftale til 2-3 mere — engros-laget er den mindst mættede del af markedet.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "GPU/throughput-investering",
            "detail": "Renderen er pt. CPU; hvis betalende efterspørgsel overstiger CPU-kapacitet, evaluér en GPU-node KUN når volumen retfærdiggør det (datadrevet) — også",
            "status": "todo",
            "needsMads": true
          }
        ]
      }
    ],
    "firstMove": "Køb/licensér det fuldt kommercielt-rettede AI-actor-bibliotek og gem consent på fil — den ENESTE blokering der ikke kan pre-bygges, vigtigste juridiske must-have. Igangsæt bank/ApS (1-3 uger).",
    "madsNeeds": [
      "Licenseret AI-actor-bibliotek (face+stemme) + consent",
      "Entity/ApS + bankkonto (1-3 ugers onboarding) +",
      "Stripe-konto: Brand €499/md, Scale €999/md, Agency custom +",
      "Domæne + endeligt navn (AdForge = placeholder) +",
      "Juridisk pakke: ToS m. IP-assignment + AI-disclosure +",
      "GDPR-pakke pga. EU-kunder: privatlivspolitik + DPA",
      "Meta- + TikTok-business/ad-konti (test +",
      "Render-server-/netværksadgang: verificér FFmpeg+Chatterbox",
      "ANTHROPIC_API_KEY (Claude hook-matrix) + bekræft",
      "Godkendelse af positionering, priser og brand-navn",
      "Beslutning om '5 gratis varianter'-løftet: manuel levering",
      "Første outreach + de første 2-3 design-partnere + 1"
    ],
    "kpis": [
      "Tid fra produkt-URL → 15-30 compliant varianter: <48t",
      "Marginalkost per variant: ~$0 (self-hosted — beviset",
      "Render-kapacitet: målt throughput + maks.",
      "Lip-sync/voice-realisme: bestået menneske-QA-bar på ≥X%",
      "CTR/CPA-paritet eller bedre vs. kundens eksisterende",
      "Betalende: 2-3 design-partnere + 1 white-label-bureau inden"
    ],
    "links": [
      {
        "label": "Eksempel (landing page)",
        "url": "https://somi-phi.vercel.app/imperium/adforge/index.html"
      },
      {
        "label": "AdForge launch-guide",
        "url": "file:///C:/Users/madsv/Desktop/imperium/ugc-ad-creative/GUIDE.md"
      },
      {
        "label": "Markedsresearch (research-04 UGC ad-creative)",
        "url": "file:///C:/Users/madsv/Desktop/imperium/research-04-ugc-ad-creative.md"
      },
      {
        "label": "Top-3 strategirapport",
        "url": "file:///C:/Users/madsv/Desktop/imperium/RAPPORT-top3.md"
      },
      {
        "label": "Backend-status (foundry_orders + edge-funktion)",
        "url": "file:///C:/Users/madsv/Desktop/imperium/BACKEND.md"
      },
      {
        "label": "Lead-backend endpoint (source='ugc')",
        "url": "https://ihmgmpuptlmxokdmdirm.supabase.co/functions/v1/foundry-order"
      },
      {
        "label": "Design-reference (poleret moderne UI)",
        "url": "https://bridgemind.ai"
      }
    ]
  },
  {
    "slug": "automation",
    "name": "Northgate Automation",
    "tagline": "Privacy-first AI-automation — self-hosted, dine data forbliver dine.",
    "summary": "Et done-for-you AI-automationsbureau bygget på Mads' eksisterende stack (self-hosted n8n + Claude + Supabase + render/TTS). Differentiatoren er self-hosted dataholdighed: Zapier/Make kan ikke holde kundens data på kundens egen infra — det kan vi. Setup-fee + retainer (€3.000+€800/md Starter, €8.000+€2.000/md Growth), ~$7/md VPS = 90%+ margin.",
    "deploy": {
      "recommendation": "LOKAL-FØRST på Mads' egen VPS til drift/fulfillment (n8n + render/TTS), salgs-frontend statisk på Vercel, leads i Supabase.",
      "stack": [
        "n8n self-hosted (Community, gratis, ubegrænsede kørsler) — orkestrering/fulfillment",
        "Supabase — fælles lead/ordre-backend (foundry_orders + foundry-order LIVE) + per-kunde",
        "Claude (Anthropic API) — drafting, klassificering, summarering i workflows (kræver betalt",
        "Self-hosted render + lokal Chatterbox-TTS — content-ops til near-zero marginalkost (først",
        "Landing page: statisk HTML + Tailwind CDN på Vercel, domæne foran, CORS låst til domænet",
        "Stripe — fakturering/abonnement (setup-fee + retainer)",
        "Kundens EGEN n8n-instans pr. Growth/Enterprise-kunde (data-suverænitet = leverancen) + én"
      ],
      "rationale": "Lokal-først er ikke et kompromis — det er kerneproduktet: positioneringen er 'dine data forlader aldrig dine servere', så du differentierer ved selv at køre self-hosted n8n med ~$7/md VPS vs. konkurrenters per-task-fees. Salgs-frontenden hører på Vercel (hurtig, altid oppe, billig); Supabase håndterer leads/per-kunde-data uden serverdrift. Den hybride model er præcis det der allerede er bygget og verificeret live."
    },
    "phases": [
      {
        "title": "Fase 1 — Fundament (forretning + positionering)",
        "goal": "Gør venturet juridisk og kommercielt klar til at tage imod betaling, lås niche + tilbud + budskab, og luk de to åbne tekniske huller (CORS + lead-notifikation) så ingen audit-lead går tabt.",
        "duration": "2-4 uger (mest ventetid på ApS-registrering + bank-KYC)",
        "deliverable": "Et registreret ApS med erhvervskonto + Stripe, et domæne pegende på den live landing page med CORS låst, en lead-notifikation der rammer Mads ved hvert nyt audit-lead, og en godkendt niche",
        "steps": [
          {
            "title": "Stift ApS + erhvervskonto + ansvarsforsikring",
            "detail": "Registrér selskab hos Erhvervsstyrelsen, åbn erhvervskonto (regn med 2-4 ugers bank-KYC) og tegn ansvarsforsikring — krævet før kontrakter/DPA.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Godkend brand-navn + køb domæne",
            "detail": "'Northgate Automation' er placeholder — godkend eller erstat navnet, køb domænet og peg det på den eksisterende Vercel-landing page.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Opsæt Stripe til setup-fee + retainer",
            "detail": "Opret Stripe-konto med betalings-identitet (KYC); konfigurér ét setup-produkt (engangsbeløb) + ét månedligt abonnement pr. tier (Starter/Growth).",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Vælg ÉN startniche + godkend priser",
            "detail": "Lås lead-gen/outreach som indgang (renest ROI-demo: booked meetings) og godkend €3.000+€800/md (Starter) / €8.000+€2.000/md (Growth).",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Lås CORS-origin på lead-edge til domænet",
            "detail": "Edge-funktionen 'foundry-order' kører med CORS '*'. Sæt Access-Control-Allow-Origin til det rigtige domæne når købt, så kun din landing page kan",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Lead-notifikation ved nyt audit-lead",
            "detail": "Pt. lander 'automation'-leads tavst i foundry_orders. Tilføj n8n/edge-trin der mailer/Slacker Mads ved hvert nyt lead (genbrug",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Landing page LIVE med lead-backend",
            "detail": "Professionel self-hosted-vinklet landing page med gratis-audit-formular POSTer til live Supabase-edge (source='automation'). VERIFICERET live.",
            "status": "done",
            "needsMads": false
          },
          {
            "title": "Fælles lead/ordre-backend LIVE",
            "detail": "Supabase 'foundry_orders' + edge-funktion 'foundry-order' deployet med RLS (kun service_role skriver).",
            "status": "done",
            "needsMads": false
          }
        ]
      },
      {
        "title": "Fase 2 — Byg produkt (genbrugelige niche-aktiver + intake)",
        "goal": "Konvertér 'vi har en stack' til 'vi har et produkt': genbrugelige skabelon-workflows, salgs-assets, en demo-/sandbox-n8n, og e-mail-deliverability klar — så hver ny kunde er kopiér-tilpas frem",
        "duration": "2-3 uger",
        "deliverable": "Et niche-skabelonbibliotek (lead-gen først), Supabase client/jobs-schema, en DPA/MSA-skabelon (udkast), et Claude-prompt-bibliotek, en demo/sandbox-n8n, onboarding-docs, varmt",
        "steps": [
          {
            "title": "Byg lead-gen skabelon-workflow i n8n",
            "detail": "Genbrugelig pipeline: scraping → enrichment → Claude-personaliseret outreach → reply-klassificering, klar til at deploye på kundens n8n.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Opsæt demo/sandbox-n8n til salg",
            "detail": "Én intern n8n-instans hvor lead-gen-skabelonen kører på dummy-data, så du kan vise et fungerende system live i salgsmøder ('proof, not slides').",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Supabase client/jobs-schema",
            "detail": "Per-kunde tabeller (clients, jobs, leads) som staging-lag — adresserer #1-fejlårsag (datakvalitet, 43%) via data-readiness.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "DPA/MSA-skabelon (udkast)",
            "detail": "GDPR data-processing-aftale + kontrakt-udkast — self-hosted gør dette til et salgsargument.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Claude-prompt-bibliotek pr. use-case",
            "detail": "Versionerede prompts til outreach, support-triage, rapportering — kvalitet/konsistens på tværs af kunder.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Onboarding-docs + leverance-pakke",
            "detail": "Standard-docs til kunden ved deploy (hvordan workflow'et drives, hvad retainer dækker, KPI-rapport-skabelon) — gør hver onboarding kopiér-tilpas.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Klargør e-mail-deliverability til outreach",
            "detail": "Opsæt afsender-domæne med SPF/DKIM/DMARC + warmup før cold-outreach (B2B reply ~3,4% afhænger af deliverability + personalisering).",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Cold-outreach-sekvenser + salgs-script",
            "detail": "Hyper-specifik cold-email pr. niche + gratis-audit-tilbud + demo-flow; brug vores egen lead-gen-pipeline til at skaffe vores egne kunder.",
            "status": "todo",
            "needsMads": false
          }
        ]
      },
      {
        "title": "Fase 3 — Pilot (første gratis/discounted bevis)",
        "goal": "Skaf 1-2 pilotkunder i nichen, lever ÉN high-ROI automation bundet til ÉN målbar KPI, og forvandl resultatet til en case/testimonial du kan sælge på.",
        "duration": "3-4 uger",
        "deliverable": "Mindst én live automation kørende hos en rigtig kunde, en dokumenteret KPI (sparet tid/kost eller booked meetings) og en skriftlig case + testimonial.",
        "steps": [
          {
            "title": "Byg prospekt-liste i nichen (20-30 mål)",
            "detail": "Find 20-30 konkrete virksomheder i ÉN vertikal med en specifik smerte ('VVS-firmaer der mister kunder efter kl. 17').",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Send 20-30 hyper-specifikke audits",
            "detail": "Send personaliseret cold-outreach til listen med gratis-audit som lead-magnet, via det varmede afsender-domæne fra Fase 2.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Kør gratis automations-audit",
            "detail": "Kortlæg pilot-kundens manuelle workflows + ROI + data-readiness; landing-formularen fanger leadet (med notifikation til dig), du leverer auditen.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Byg + deploy én high-ROI workflow",
            "detail": "Deploy den genbrugelige skabelon på kundens egen n8n (eller din server efter aftale); bind til ÉN målbar KPI fra dag ét.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Mål og bevis KPI'en",
            "detail": "Vis konkret resultat (sparet tid/kost, booked meetings) over en måleperiode — bevis, ikke slides.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Indsaml case + testimonial",
            "detail": "Dokumentér resultatet skriftligt + få et citat fra kunden; dette bliver din vigtigste salgs-asset fremover.",
            "status": "todo",
            "needsMads": false
          }
        ]
      },
      {
        "title": "Fase 4 — Launch (betalende kunder + retainer)",
        "goal": "Konvertér pilot-beviset til betalende kunder: aktivér Stripe-fakturering, sæt audit→build→prove→expand-tragten i drift, og land de første setup-fees + retainere.",
        "duration": "3-4 uger",
        "deliverable": "Mindst 1-3 betalende kunder på Starter/Growth med setup-fee opkrævet og månedlig retainer kørende via Stripe.",
        "steps": [
          {
            "title": "Aktivér Stripe-fakturering på tilbud",
            "detail": "Send setup-fee-faktura + start retainer-abonnement (Starter €3.000+€800/md eller Growth €8.000+€2.000/md).",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Underskriv MSA + DPA pr. kunde",
            "detail": "Brug skabelonen fra Fase 2; self-hosted DPA er et lukke-argument for GDPR-følsomme kunder. Kræver din/juristens underskrift.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Onboard + deploy på kundens infra",
            "detail": "Installér workflow på kundens egen n8n (data-suverænitet = leverancen), træn brugeren, lever onboarding-docs fra Fase 2.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Sæt monitoring-retainer i drift",
            "detail": "Løbende overvågning + breakage-fix dækker legacy-integration-risiko; retainer ≈ 15-20% af build/md.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Skalér outreach med egen pipeline",
            "detail": "Brug Northgate's egen lead-gen-automation til at skaffe Northgate's kunder — selve outreachen er et bevis.",
            "status": "todo",
            "needsMads": false
          }
        ]
      },
      {
        "title": "Fase 5 — Skalér (flere nicher + content-ops-flagskib)",
        "goal": "Gå fra håndfuld kunder til ~$16K/md ved at produktisere, åbne en anden niche og koble content-ops på (hvor render/TTS-fabrikken giver unik margin).",
        "duration": "1-3 måneder",
        "deliverable": "3-5 retainer-kunder (≈ ~$16K/md), to nicher i drift og et produktiseret content-ops-tilbud der genbruger render/TTS-fabrikken.",
        "steps": [
          {
            "title": "Land 3-5 retainer-kunder",
            "detail": "Stabil tilbagevendende omsætning ≈ ~$16K/md på kostbase ~$7/md VPS = 90%+ margin.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Åbn niche #2 (support-triage)",
            "detail": "Kundesupport-triage har stærkeste ROI-bevis ($3,50 pr. $1); genbrug skabelon-mønstret fra lead-gen.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Lancér produktiseret content-ops-tilbud",
            "detail": "Genbrug Faceless Foundry/render+TTS-fabrikken som content-ops-leverance — near-zero marginalkost = flad pris hvor andre betaler per-credit.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Tilføj sample-generering som lead-magnet",
            "detail": "lead → n8n → render+TTS laver personlig sample → email: demoen ER produktet ER lead-magneten (pipelinen findes, mangler intake-kobling).",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Overvej dedikeret Supabase + value-based Enterprise",
            "detail": "Ved skalering: flyt 'foundry_'-tabeller til eget Supabase-projekt adskilt fra SOMI + tilbyd Enterprise value-based (10-25% af dokumenteret",
            "status": "todo",
            "needsMads": true
          }
        ]
      }
    ],
    "firstMove": "Stift ApS + åbn erhvervskonto + opret Stripe (Fase 1) og godkend brand/domæne + lead-gen som startniche — bank-KYC er flaskehalsen, så start den i dag.",
    "madsNeeds": [
      "ApS (eller enkeltmands) + erhvervsbankkonto +",
      "Domæne + endeligt brand-navn ('Northgate Automation' er",
      "Stripe-konto med betalings-identitet (setup-fee +",
      "Godkend niche (lead-gen), priser (€3.000+€800 /",
      "MSA/kontrakt + DPA-skabelon godkendt og underskrevet",
      "Betalte API-nøgler i .env (Anthropic billing-tjek; evt.",
      "CORS-origin på edge-funktionen sat fra '*' til domænet",
      "Afsender-domæne + SPF/DKIM/DMARC + warmup til cold-outreach",
      "Beslutning: kører kunde-workflows på din server eller"
    ],
    "kpis": [
      "Antal betalende retainer-kunder (mål: 3-5 → ~$16K/md)",
      "Månedlig tilbagevendende omsætning (MRR) fra retainere",
      "Audit-leads → betalende konvertering (audit → build →",
      "Outreach-respons: afsendte audits → audit-leads",
      "Dokumenteret KPI pr. build (sparet tid/kost eller booked"
    ],
    "links": [
      {
        "label": "Eksempel (landing page, LIVE)",
        "url": "https://somi-phi.vercel.app/imperium/automation/index.html"
      },
      {
        "label": "Go-to-market-guide (lokal)",
        "url": "file:///C:/Users/madsv/Desktop/imperium/automation-agency/GUIDE.md"
      },
      {
        "label": "Markedsresearch (research-01)",
        "url": "file:///C:/Users/madsv/Desktop/imperium/research-01-automation-agency.md"
      },
      {
        "label": "Top-3 strategirapport",
        "url": "file:///C:/Users/madsv/Desktop/imperium/RAPPORT-top3.md"
      },
      {
        "label": "Backend-dokumentation (lead/ordre)",
        "url": "file:///C:/Users/madsv/Desktop/imperium/BACKEND.md"
      },
      {
        "label": "Backend (live lead-endpoint)",
        "url": "https://ihmgmpuptlmxokdmdirm.supabase.co/functions/v1/foundry-order"
      },
      {
        "label": "Designreference (poleret UI)",
        "url": "https://bridgemind.ai"
      }
    ]
  },
  {
    "slug": "beacon",
    "name": "Beacon",
    "tagline": "Bliv citeret af AI — mål din synlighed i ChatGPT, Gemini & Perplexity, og få content",
    "summary": "En produktiseret GEO/AEO-service der lander mid-market B2B SaaS på et lavt monitoring-abonnement og ekspanderer til et done-for-you content-retainer. Markedet vokser ~45-50% CAGR; konkurrenterne måler godt, men flaskehalsen er at PRODUCERE answer-first, statistik-rig content der vinder citationer — præcis Mads' edge (Claude-pipeline + n8n + Supabase + render/voice).",
    "deploy": {
      "recommendation": "Hybrid: motoren LOKAL-først (batch/scheduled backend, near-zero marginalkost = hele margin-historien), kundefladen på Vercel+Supabase (genbrug SOMI",
      "stack": [
        "Frontend/dashboard: Next.js 14 (App Router, JS) + @supabase/ssr på Vercel — genbrug SOMI",
        "Data: Supabase Postgres med RLS multi-tenant. START prefikset i SOMI-projektet",
        "Monitoring-motor: self-hosted n8n (scheduled prompt-runner → fan-out til engines →",
        "AI-engines: Claude (parse + content + prompts) + OpenAI + Gemini + Perplexity",
        "Content-produktion: Claude content-pipeline (answer-first, FAQ-schema, llms.txt) +",
        "Lead/intake: eksisterende foundry-order edge-funktion (source='geo') — allerede live",
        "Mail/levering: transaktionel mail-udbyder (Resend/Postmark/SMTP) som n8n-credential —"
      ],
      "rationale": "Hele konkurrencefordelen er near-zero marginalkost på den tunge del (måling + content-produktion), som hører på den self-hostede server hvor n8n + Claude + render kører gratis i marginalen — der hvor konkurrenterne betaler per-credit/per-engine. Kundefladen (dashboard, login, betaling) har brug for oppetid, sikkerhed og polish, hvilket Vercel+Supabase leverer billigt, og som Mads allerede har et bygget skelet til."
    },
    "phases": [
      {
        "title": "Fase 1 — Fundament",
        "goal": "Få det juridiske, betalings-, mail- og API-grundlag på plads så Beacon kan processere kunde-brand-data lovligt, tage imod betaling og levere snapshots — og bekræft at det byggede (landing +",
        "duration": "4-7 dage (mest ventetid på konti og DNS-propagering)",
        "deliverable": "Live landing page på eget domæne (CORS-låst) der fanger leads, et lovligt grundlag (entity+bank+DPA+ToS), en fungerende mail-udbyder til snapshot/notifikation, og alle API-nøgler +",
        "steps": [
          {
            "title": "Landing page bygget",
            "detail": "Poleret noir/guld-landingsside (geo-ai-search/index.html, Tailwind CDN, Beacon-branding) er bygget og koblet til live lead-backend.",
            "status": "done",
            "needsMads": false
          },
          {
            "title": "Lead-backend live",
            "detail": "foundry_orders + foundry-order edge-funktion (verify_jwt=false, source='geo') deployet og testet i SOMI-projektet — landing-formularen gemmer leads",
            "status": "done",
            "needsMads": false
          },
          {
            "title": "Køb domæne + deploy landing + stram CORS",
            "detail": "Registrér fx getbeacon.io / beacon-ai.dk, peg DNS mod Vercel, deploy landing som selvstændigt site (ikke kun subpath), og lås lead-backendens CORS",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Entity + DPA/ToS + voice-consent",
            "detail": "ApS/enkeltmands-entity + bankkonto + DPA-skabelon (du processerer kunders OG konkurrenters brand-data) + ToS + voice-consent (video-answer bruger",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Skaf LLM- + SERP-nøgler + budgetloft i .env",
            "detail": "OpenAI-, Gemini- og Perplexity-nøgler + SERP/AI-Overviews-API (~$50/md) i .env på serveren — aldrig i chat/git.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Opsæt transaktionel mail-udbyder",
            "detail": "Tilføj Resend/Postmark/SMTP som n8n-credential (kræver Mads' konto + verificeret afsender-domæne via DNS) — bruges til at levere gratis snapshots",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Lead-notifikation + admin-view",
            "detail": "n8n/edge-trin der mailer Mads ved nyt 'geo'-lead (genbrug somi-rapport-mønstret) + simpelt Supabase-view (new→contacted→won).",
            "status": "todo",
            "needsMads": false
          }
        ]
      },
      {
        "title": "Fase 2 — Byg MVP (monitoring-motoren)",
        "goal": "Byg den near-gratis monitoring-motor: et n8n-scheduled prompt-runner-system der kører buyer-intent-prompts på tværs af alle engines, parser mentions/citationer med Claude og skriver en time-series",
        "duration": "2-3 uger (multi-engine fan-out, parsing-robusthed og scoring tager længere end det ser ud)",
        "deliverable": "En kørende, fejl-tolerant monitoring-motor der producerer ægte, verificerede citation-/SoV-data for vores eget brand + 2-3 prospects — fundamentet for gratis snapshot, betalt audit",
        "steps": [
          {
            "title": "Supabase-schema (multi-tenant)",
            "detail": "Tabeller via apply_migration: brands, competitors, prompts, runs, results (time-series), scores — med RLS så hver kunde kun ser egne rækker",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Prompt-sæt-generator (Claude)",
            "detail": "Claude genererer 75-100 buyer-intent-prompts pr. brand ud fra domæne + niche + konkurrenter, gemt i prompts-tabellen.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "n8n prompt-runner (multi-engine, N gange)",
            "detail": "Scheduled workflow: hver prompt × hver engine (ChatGPT/Gemini/Perplexity/Claude/AI Overviews) køres N gange for black-box-volatilitet.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Claude-parse → scoring",
            "detail": "Claude udtrækker mentions/citationer/sentiment pr. svar (struktureret JSON) → beregn citation-rate, share-of-voice vs konkurrenter, accuracy-flags",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Crawler-access-tjek",
            "detail": "Tjek prospektets robots.txt/llms.txt for GPTBot/ClaudeBot/PerplexityBot/Google-Extended-adgang — et hurtigt audit-fund der ofte afslører at AI er",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Kør motoren på Mads' eget brand + 2-3 navngivne prospects",
            "detail": "Generér live pitch-data uden at en kunde er nødvendig — dette ER demoen og lead-magneten til Fase 4-outreach. Sanity-tjek tallene manuelt (evt.",
            "status": "todo",
            "needsMads": false
          }
        ]
      },
      {
        "title": "Fase 3 — Pilot (audit-wedge + dashboard + content + betaling)",
        "goal": "Pakkér motorens output til et salgbart $1,5-3k automatiseret audit (salgs-wedge), en gratis snapshot-funnel, et minimalt kunde-dashboard og en Claude content-recommender — plus Stripe så der kan",
        "duration": "2-3 uger",
        "deliverable": "Et salgbart audit-produkt + automatisk gratis snapshot + kunde-dashboard + content-recommender + test-vs-control + Stripe-betaling — alt klart til at lande og fakturere betalende kunder.",
        "steps": [
          {
            "title": "Audit-rapport-skabelon (Claude)",
            "detail": "Auto-genereret gap-rapport: baseline citation-rate, SoV vs 3 konkurrenter, accuracy-alerts, crawler-adgang + prioriteret handlingsplan — pakket",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Gratis snapshot som funnel-top",
            "detail": "Slank version (brand vs 3 konkurrenter, 1 engine) trigget automatisk fra lead-formularen (source='geo') → motoren kører → resultat mailes via",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Minimalt kunde-dashboard (Next.js+Supabase)",
            "detail": "Genbrug SOMI Command-skelettet (middleware-auth, @supabase/ssr, /api-proxy): login + RLS-data + trend-grafer for citation-rate/SoV pr. engine.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Content-recommender (Claude)",
            "detail": "Claude → answer-first-sider, FAQ-schema, llms.txt-forslag + video-answer via self-hosted render/voice (statistik+kilder løfter AI-synlighed ~30-40%).",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Test-vs-control-setup",
            "detail": "Split prompt-/side-sættet: optimér et delsæt (producér content), hold et matchet kontrol-sæt tilbage uændret.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Stripe + abonnements-priser",
            "detail": "Opsæt Stripe Checkout/Payment Links for $199/md monitoring, $3k/md program og $1.500 audit.",
            "status": "todo",
            "needsMads": true
          }
        ]
      },
      {
        "title": "Fase 4 — Launch (første betalende kunder)",
        "goal": "Brug det automatiserede audit og den live pitch-data som wedge til at lande de første 1-3 design-partnere blandt mid-market B2B SaaS, og konvertér dem fra audit/monitoring til content-retainer.",
        "duration": "3-5 uger (afhænger af salgscyklus — B2B-salg tager længere end at bygge)",
        "deliverable": "1-3 betalende design-partnere på monitoring + mindst én på content-retainer, plus første dokumenterede citation-lift som case study.",
        "steps": [
          {
            "title": "Byg prospekt-liste (mid-market B2B SaaS)",
            "detail": "20-30 B2B SaaS <500 ansatte, content-tunge (passer Claude-pipelinen), højeste WTP/deal. Inkludér de 2-3 prospects motoren allerede har kørt i Fase 2.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Personaliseret outreach med snapshot",
            "detail": "Send hvert prospekt deres EGEN gratis AI-visibility-snapshot (vi har allerede kørt dem) = uimodståelig kold-kontakt.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Sælg audit-wedge → land",
            "detail": "Konvertér interesse til et betalt $1,5-3k audit; lever auto-genereret gap-rapport + handlingsplan. Mads fører salgssamtalerne.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Konvertér til monitoring + content",
            "detail": "Up-sell audit-kunder til $199-499/md monitoring + $3-5k/md content-program (land lavt, ekspandér). Mads forhandler/lukker.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Lever første content-sprint + bevis lift",
            "detail": "Producér de første answer-first-sider via Claude-pipelinen, mål citation-lift via test-vs-control over måle-vinduet, og indfang case-data.",
            "status": "todo",
            "needsMads": false
          }
        ]
      },
      {
        "title": "Fase 5 — Skalér",
        "goal": "Forvandl de første kunder + cases til en gentagelig salgsmotor, automatisér onboarding/rapportering yderligere, hærd infrastrukturen og hæv blended-MRR mod break-even på Mads' tid.",
        "duration": "1-3 måneder løbende",
        "deliverable": "En gentagelig, delvist automatiseret GEO-service med 3-5+ kunder, dokumenterede cases, hærdet infrastruktur og blended-MRR der retfærdiggør fuld fokus.",
        "steps": [
          {
            "title": "Selvbetjent onboarding",
            "detail": "Kunde indtaster domæne+konkurrenter → motoren auto-genererer prompts og baseline uden manuel opsætning; betaling (Stripe) aktiverer automatisk",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Automatiseret månedsrapport",
            "detail": "Genbrug somi-rapport-mønstret: månedlig citation-/SoV-/lift-rapport mailes automatisk pr. kunde via mail-udbyderen.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Case studies + referral-loop",
            "detail": "Pakkér første lift-cases til landingsside-proof og bed design-partnere om henvisninger. Mads godkender citater/case-brug.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Dediker Supabase-projekt + hærdning",
            "detail": "Flyt fra prefikset SOMI-projekt til dedikeret 'beacon'-Supabase ved skalering; CORS låst til domæne, RLS auditeret (get_advisors), service_role-nøgle",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Skaler-/kapacitets-tjek (API-spend + render)",
            "detail": "Overvåg blended API-spend pr. kunde mod margin, optimér N-frekvens og engine-mix, og bekræft at render/TTS-kapaciteten holder ved flere",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Udvid til nabo-nicher",
            "detail": "Efter B2B SaaS: high-AOV e-commerce (konvertering gør ROI bevisbar) og professionel service (legal/fintech/healthtech, brand-safety-vinkel).",
            "status": "todo",
            "needsMads": true
          }
        ]
      }
    ],
    "firstMove": "Køb domænet og kør monitoring-motoren på dit eget brand + 2-3 navngivne prospects FØRST — den live pitch-data ER lead-magneten og kræver ingen kunde. Sæt mail-udbyder + LLM/SERP-nøgler (m.",
    "madsNeeds": [
      "Domæne + DNS mod Vercel + landing som selvstændigt site +",
      "Entity (ApS/enkeltmands) + bankkonto til at fakturere kunder",
      "DPA + ToS + voice-consent godkendt (du processerer",
      "Godkend brand-navn 'Beacon' (placeholder) + positionering +",
      "LLM/SERP-nøgler i .env (OpenAI/Gemini/Perplexity + SERP",
      "Transaktionel mail-udbyder + verificeret afsender-domæne",
      "Stripe-konto til monitoring-abonnement + audit +",
      "Evt. 1 måneds benchmark-konto (Peec/Otterly) for at",
      "De første 1-3 design-partnere: prospekt-liste + kold",
      "Beslutning: snapshots/render på samme server eller separat"
    ],
    "kpis": [
      "Betalende kunder: 1-3 design-partnere inden 60-75 dage",
      "Blended MRR: $199-499/md monitoring + $3-5k/md content →",
      "Citation-lift (test-vs-control): målbar stigning for mindst",
      "Funnel: snapshot → audit ≥20% og audit → retainer ≥40%",
      "Margin/enhed: blended API+SERP-spend pr."
    ],
    "links": [
      {
        "label": "Eksempel (landing page — live)",
        "url": "https://somi-phi.vercel.app/imperium/beacon/index.html"
      },
      {
        "label": "Launch-guide (GUIDE.md)",
        "url": "file:///C:/Users/madsv/Desktop/imperium/geo-ai-search/GUIDE.md"
      },
      {
        "label": "Markedsresearch (research-06)",
        "url": "file:///C:/Users/madsv/Desktop/imperium/research-06-geo-ai-search.md"
      },
      {
        "label": "Lead-backend (live edge-funktion)",
        "url": "https://ihmgmpuptlmxokdmdirm.supabase.co/functions/v1/foundry-order"
      },
      {
        "label": "Top-3 strategirapport",
        "url": "file:///C:/Users/madsv/Desktop/imperium/RAPPORT-top3.md"
      },
      {
        "label": "Backend-doku (BACKEND.md)",
        "url": "file:///C:/Users/madsv/Desktop/imperium/BACKEND.md"
      },
      {
        "label": "Designreference (bridgemind.ai)",
        "url": "https://bridgemind.ai"
      },
      {
        "label": "GEO-markedsdata (IntelMarketResearch)",
        "url": "https://www.intelmarketresearch.com/generative-engine-optimization-services-market-36546"
      }
    ]
  },
  {
    "slug": "ringback",
    "name": "Ringback AI",
    "tagline": "AI-receptionist der besvarer hvert opkald 24/7, booker jobbet og fanger hvert lead.",
    "summary": "Et done-for-you AI-receptionist-bureau med beachhead i Home Services (VVS/el/HVAC), hvor ~62% af opkald er ubesvarede og en håndværker taber ~€45K/år. Vi sælger MÅLT ROI (aldrig hype — Air.ai blev FTC-bandlyst), flad pris (€399/€699), inbound-first (undgår TCPA). Margin-edge: self-hosted Chatterbox → ~€0,03-0,06/min.",
    "deploy": {
      "recommendation": "Hybrid: salgs/demo-laget på Vercel+Supabase NU, men voice-pipelinen på en DEDIKERET GPU-server (ikke Mads' CPU-render-server).",
      "stack": [
        "Frontend/landing: Next.js (App Router, JS) på Vercel — genbrug SOMI Command-mønstret",
        "Lead+data: Supabase (genbrug 'foundry_orders' source='voice' NU; eget projekt +",
        "Web-demo (FASE 2, ingen telefon/GPU): Pipecat → Deepgram STT → Claude Haiku (HVAC-prompt)",
        "Live telefoni (FASE 4, kræver GPU): Telnyx (lav latens, SIP) → Pipecat på GPU-server →",
        "Booking/fulfillment/post-call: n8n + Supabase (tjek availability→book→SMS",
        "GPU-infra (FASE 4): lej GPU-instans (RunPod/Lambda) coloc nær Telnyx-edge — start lille"
      ],
      "rationale": "Mads' self-hosted-edge gælder for de fleste produkter, men voice har en fysik-grænse: render-serveren er CPU (~3,4× realtid på Chatterbox = alt for langsom til en levende samtale, hvor brugere dropper ved 1,2s+). At tvinge det lokalt nu ville give en robotisk demo = dødsstødet i et marked Air.ai forgiftede."
    },
    "phases": [
      {
        "title": "Fase 1 — Fundament",
        "goal": "Brand, juridik og salgs-fundament på plads, så et lead kan blive til en betalende aftale uden friktion. Salgs-infrastrukturen (landing + lead-backend) er allerede live; her lukkes de resterende",
        "duration": "1-2 uger (kort byg-tid, men Mads-blokeret: ApS + bank + Stripe tager dage-til-uger)",
        "deliverable": "Live landing der konverterer besøgende til leads i Supabase (allerede oppe) + en notifikation til Mads ved hvert lead + en fakturérbar juridisk enhed (ApS/Stripe) +",
        "steps": [
          {
            "title": "Landing page live",
            "detail": "Poleret landing (voice-agent/index.html) med problem-stat (€45K/år tabt), how-it-works, pris, demo-CTA → lead-form.",
            "status": "done",
            "needsMads": false
          },
          {
            "title": "Lead-backend live",
            "detail": "Supabase 'foundry_orders' + 'foundry-order' edge-funktion gemmer hvert lead (source='voice', formularen sender email+biz).",
            "status": "done",
            "needsMads": false
          },
          {
            "title": "Lås brand + domæne",
            "detail": "Bekræft navnet 'Ringback AI' (pt. EKSPLICIT placeholder i index.html-kommentar) og køb domæne; sæt som CORS-origin i edge-funktionen (pt. '*').",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Entity + Stripe",
            "detail": "ApS/bankkonto + Stripe til flad retainer-fakturering (€399/€699/md) + setup-fee (€500-2.500).",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Compliance-baseline + ToS/DPA",
            "detail": "AI-disclosure i greeting ('jeg er en AI-assistent for [firma]'), inbound-only (TCPA-safe), opkalds-optagelses-disclosure (two-party-stater).",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Voice-clone consent-skabelon",
            "detail": "Pro-tieret sælger 'custom cloned brand voice' — kræver skriftligt samtykke fra den person hvis stemme klones (typisk ejeren).",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Lead-notifikation",
            "detail": "Tilføj n8n/edge-trin der mailer Mads ved nyt voice-lead (genbrug 'somi-rapport-email'-mønstret).",
            "status": "todo",
            "needsMads": false
          }
        ]
      },
      {
        "title": "Fase 2 — Byg web-demo (produktets kerne-bevis)",
        "goal": "En browser-demo hvor en prospect TALER med AI-receptionisten direkte i browseren — ingen telefon, ingen GPU. Dette er lead-magneten OG salgsbeviset, og det eneste der pt.",
        "duration": "2-3 uger",
        "deliverable": "En embedded, levende web-demo på landingen hvor enhver besøgende kan tale med VVS-receptionisten — produktet ER lead-magneten, uden en eneste telefon-konto eller GPU.",
        "steps": [
          {
            "title": "Design call-flow + system-prompt",
            "detail": "Definér samtale-flowet FØR koden: greeting→intent→book/FAQ/lead-capture→emergency-transfer→human-fallback.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Supabase voice-schema",
            "detail": "Tabeller clients/calls/transcripts/bookings/kb_entries/consent — pre-buildbart nu uden Mads' nøgler.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Pipecat-orkestrering",
            "detail": "Open-source Pipecat-scaffold der binder lyd-strømmen: mic → STT → LLM → TTS i browseren via WebRTC.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Deepgram STT + Claude Haiku",
            "detail": "Streaming-STT + kobl call-flow-prompten på Claude Haiku (lav latens). Kræver Deepgram-nøgle + Claude-budget-bekræftelse.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "TTS via ElevenLabs Flash",
            "detail": "Brug Flash til lav-latens i demoen (GPU ikke nødvendig endnu); planlæg migrering til self-hosted Chatterbox i Fase 4. Kræver ElevenLabs-nøgle.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Embed demo på landing",
            "detail": "Erstat pladsholderen '[bygges: Pipecat + Claude + Chatterbox]' i #demo-sektionen (index.html linje ~54) med den levende web-demo via WebRTC-iframe.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Latens-test <600ms p95",
            "detail": "Mål og stream ALT (STT→LLM→TTS); verificér samtalen føles naturlig (under 1,2s drop-grænse) før den vises til prospects.",
            "status": "todo",
            "needsMads": false
          }
        ]
      },
      {
        "title": "Fase 3 — Booking/fulfillment-laget (n8n + Supabase)",
        "goal": "Alt det der sker EFTER samtalen: bookinger, SMS-bekræftelser, lead-logs, emergency-routing og et kunde-dashboard der beviser ROI.",
        "duration": "2-3 uger (parallelt med Fase 2)",
        "deliverable": "Et fungerende efter-opkald-system: bookinger lander i kalenderen, kunden får SMS, ejeren får emergency-alerts, og et multi-tenant dashboard viser den reddede omsætning i kroner.",
        "steps": [
          {
            "title": "Kalender-backend valgt + koblet",
            "detail": "n8n 'tjek availability' kræver en kalender-kilde. Vælg og kobl Cal.com eller Google Calendar som availability/booking-backend FØR booking-workflowet",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "n8n booking-workflow",
            "detail": "Function-call-fulfillment: tjek availability (mod kalender-backend) → book aftale → SMS-bekræftelse til kunde.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Post-call-workflow",
            "detail": "Transcript → Supabase; emergency-detektion → øjeblikkelig SMS til ejer; lead-detaljer logget. Genbrug post-call-mønstret fra research.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Daglig ROI-digest",
            "detail": "n8n sender ejeren en daglig opsummering: opkald besvaret, jobs booket, 'calls saved' = penge reddet.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Kunde-dashboard",
            "detail": "Opkaldslog + transcripts + bookinger + 'calls saved'-ROI-tal (genbrug SOMI Command-mønster: Next.js + Supabase + noir/guld + auth-gate).",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "SMS-leverandør",
            "detail": "Tilknyt SMS-kanal (Telnyx/Twilio Messaging) til bekræftelser og emergency-alerts. Bemærk: dansk/EU-SMS kræver evt.",
            "status": "todo",
            "needsMads": true
          }
        ]
      },
      {
        "title": "Fase 4 — Telefoni-pilot (første rigtige opkald)",
        "goal": "Sæt et rigtigt telefonnummer på pipelinen og kør en GRATIS 2-ugers pilot hos én lokal VVS for at få det første testimonial og bevise ROI på ægte opkald.",
        "duration": "4-6 uger (GPU+Telnyx ~1-2 uger + forwarding + 2-ugers pilot + evaluering)",
        "deliverable": "Ét rigtigt telefonnummer der besvarer ægte opkald 24/7 hos en pilotkunde (linje viderestillet), plus et dokumenteret ROI-testimonial ('reddede X opkald / €Y på 2 uger').",
        "steps": [
          {
            "title": "GPU-server-beslutning",
            "detail": "Lej GPU-instans (RunPod/Lambda) coloc nær telefoni-edge til live-stemme — eneste store hardware-investering.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Telnyx-konto + inbound-nummer + forwarding",
            "detail": "Opret Telnyx (lav latens, SIP), provisionér inbound-nummer, ring pipelinen ind på Pipecat.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Reliability-fallbacks",
            "detail": "Under load/fejl: fallback til voicemail eller human-transfer; begræns scope + RAG mod hallucination; emergency-escape.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Pilot-KB + onboarding-data",
            "detail": "Indlæs pilot-VVS'ens åbningstider, services, priser, dækningsområde og emergency-kriterier i kb_entries; tilpas system-prompten til netop deres",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Rekrutér pilot-VVS",
            "detail": "Find én lokal VVS/el-virksomhed til gratis 2-ugers trial mod et testimonial + ROI-tal.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Migrér TTS til Chatterbox (efter bevist pilot)",
            "detail": "Skift fra ElevenLabs Flash til self-hosted Chatterbox stemmeklon på GPU → fang margin-edge + per-kunde brand-stemme.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Mål pilot-ROI",
            "detail": "Track opkald besvaret vs. tidligere mistet, jobs booket, kroner reddet — råstoffet til al fremtidig salg.",
            "status": "todo",
            "needsMads": false
          }
        ]
      },
      {
        "title": "Fase 5 — Launch + første betalende kunder",
        "goal": "Konvertér piloten til betalende abonnement og land de første 3-5 betalende Home Services-kunder via outbound + demo-magneten.",
        "duration": "3-4 uger",
        "deliverable": "3-5 betalende Home Services-kunder på flad retainer, et offentligt case-study, Stripe-fakturering live, og en gentagelig onboarding der gør hver ny kunde live på få dage.",
        "steps": [
          {
            "title": "Konvertér pilot → betalende",
            "detail": "Pilot-VVS over på €399/md Solo eller €699/md Pro med setup-fee; brug ROI-tallene som lukke-argument.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Stripe-fakturering live + abonnement-livscyklus",
            "detail": "Flad retainer + setup-fee opkræves automatisk; abonnement-status (active/paused/churned) i Supabase, koblet til om kundens nummer er aktivt.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Onboarding-flow standardiseret",
            "detail": "Gentagelig setup pr. ny kunde: KB-entries, kalender-kobling, nummer-provisionering + forwarding, (Pro: stemme-klon + consent), prompt-tilpasning",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Case-study fra pilot",
            "detail": "Pak testimonial + før/efter-ROI til landing + outreach-materiale. Erstatter 'placeholder'-tilliden med rigtigt bevis.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Outbound til lokale håndværkere",
            "detail": "Targeted outreach til VVS/el/HVAC med personlig web-demo-link som hook. Inbound-only produkt → outbound SALG er fint (B2B-prospektering, ingen",
            "status": "todo",
            "needsMads": true
          }
        ]
      },
      {
        "title": "Fase 6 — Skalér (premium-verticals + margin)",
        "goal": "Udvid til højere-værdi verticals og pres marginen op, når kerne-pipelinen er bevist og stabil.",
        "duration": "Løbende (kvartal+)",
        "deliverable": "En multi-vertical, multi-tenant voice-platform med premium-segmenter (advokat/dental), self-hosted margin-edge i fuld effekt, og dedikeret infrastruktur klar til volumen.",
        "steps": [
          {
            "title": "Advokat-vertical (PI)",
            "detail": "Højeste unit economics (sag ~$8K, betaler $97-1.695/md); kun intake/booking, ingen rådgivning → håndterbar compliance (ABA: ingen juridisk rådgivning",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Dental/medical (HIPAA)",
            "detail": "Top ROI men kræver BAA på HELE stacken (telefoni+STT+LLM+TTS+DB) + PMS-integration — self-hosting hjælper (data bliver på serveren); premium-pris.",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Migrér voice-DB til eget projekt",
            "detail": "Flyt fra delt 'foundry_orders'/SOMI-projekt til dedikeret Supabase-projekt med fuldt voice-schema når kunde-antal vokser.",
            "status": "todo",
            "needsMads": false
          },
          {
            "title": "Skalér GPU + multi-tenant-isolation",
            "detail": "Skalér GPU-kapacitet per samtidige samtaler; isolér kunde-stemmer/KB'er/transcripts multi-tenant (RLS + separat storage pr. client).",
            "status": "todo",
            "needsMads": true
          },
          {
            "title": "Per-kunde brand-stemme som differentiator",
            "detail": "Brug Chatterbox-kloning til unik brand-stemme pr. kunde (med consent fra Fase 1-skabelonen) — noget per-minut-konkurrenter ikke giver gratis.",
            "status": "todo",
            "needsMads": false
          }
        ]
      }
    ],
    "firstMove": "Byg web-demoen (Fase 2) — det eneste produkt-stykke der mangler for at landingen sælger sig selv (demo-sektionen står med en pladsholder), og det kræver hverken GPU eller telefoni.",
    "madsNeeds": [
      "Domæne (bekræft brand-navn — placeholder) + sæt",
      "Entity (ApS) + bankkonto + Stripe (€399/€699/md + setup",
      "Deepgram-nøgle (streaming STT) — i .env, aldrig i chat",
      "Claude-API-budget-tjek (Haiku til lav-latens)",
      "ElevenLabs Flash-nøgle til web-demo + pilot (indtil",
      "Kalender-backend (Cal.com/Google Calendar) — forudsætning",
      "GPU-server-beslutning (RunPod/Lambda) ELLER pilot på Flash",
      "Telefoni (Telnyx, lav latens) + inbound-nummer + SMS-kanal",
      "Pilot-VVS: én lokal virksomhed til gratis trial +",
      "ToS + DPA + voice-clone-consent (Pro); BAA/TCPA-rådgivning",
      "Godkend positionering + priser (sælg MÅLT ROI, aldrig hype"
    ],
    "kpis": [
      "Web-demo-engagement: % der starter en demo-samtale + gns.",
      "Lead→demo→pilot-konvertering (mål: ≥3-5 betalende kunder",
      "Pilot-ROI: opkald besvaret vs. mistet + kroner reddet",
      "Live-latens p95 <600ms + bruttomargin/min (€0,03-0,06 vs",
      "Drift/tillid: andel opkald håndteret uden fejl-fallback"
    ],
    "links": [
      {
        "label": "Eksempel (landing page, LIVE — HTTP 200 verificeret)",
        "url": "https://somi-phi.vercel.app/imperium/ringback/index.html"
      },
      {
        "label": "Markedsresearch (voice-agent, kildebelagt)",
        "url": "C:/Users/madsv/Desktop/imperium/research-02-voice-agent.md"
      },
      {
        "label": "Komplet go-to-market-guide",
        "url": "C:/Users/madsv/Desktop/imperium/voice-agent/GUIDE.md"
      },
      {
        "label": "Delt lead-backend (dok)",
        "url": "C:/Users/madsv/Desktop/imperium/BACKEND.md"
      },
      {
        "label": "Top-3 strategirapport (imperiet)",
        "url": "C:/Users/madsv/Desktop/imperium/RAPPORT-top3.md"
      },
      {
        "label": "Lead-backend (LIVE-endpoint, source='voice')",
        "url": "https://ihmgmpuptlmxokdmdirm.supabase.co/functions/v1/foundry-order"
      },
      {
        "label": "Pipecat (realtids-orkestrering, open-source)",
        "url": "https://github.com/pipecat-ai/pipecat"
      },
      {
        "label": "Telnyx (telefoni/SIP, lav latens)",
        "url": "https://telnyx.com"
      },
      {
        "label": "Deepgram (streaming STT)",
        "url": "https://deepgram.com"
      }
    ]
  }
];
