# Trin-for-trin: tænd de sidste to ting

To opgaver. Begge er valgfri — appen virker uden, men det her gør idé-loop'en
og konkurrent-benchmark fuldt automatiske. Tag dem i den rækkefølge du vil.

---

## OPGAVE 1 — Tænd auto-idé-loop'en (broen til n8n)

### Del A: Aktivér workflowet i n8n
1. Gå til **https://madsvalby.app.n8n.cloud/workflow/gPsOB8YR1nveyn8i**
2. Øverst til højre er der en kontakt der hedder **Inactive / Active**. Klik den, så den står på **Active**.
3. Klik på den første node, **"Idé-intake (POST)"**, så den åbner.
4. Find **Production URL** (IKKE "Test URL"). Den ser sådan ud:
   ```
   https://madsvalby.app.n8n.cloud/webhook/somi-ideas-intake
   ```
5. Klik på kopier-ikonet ved siden af URL'en.

### Del B: Læg URL'en ind i Vercel
6. Gå til **https://vercel.com** → log ind → vælg projektet **somi** (eller hvad det hedder).
7. Klik fanen **Settings** (øverst) → **Environment Variables** (i menuen til venstre).
8. Tryk **Add New** / **Add Another** og udfyld:
   - **Key:**  `N8N_IDEAS_WEBHOOK_URL`
   - **Value:** `https://madsvalby.app.n8n.cloud/webhook/somi-ideas-intake`
   - **Environments:** sæt flueben i **Production** (gerne også Preview + Development)
9. Tryk **Save**.

### Del C: (kun lokalt, hvis du udvikler på din PC)
10. Åbn `C:\Users\madsv\Desktop\somi-app\.env.local` og tilføj linjen:
    ```
    N8N_IDEAS_WEBHOOK_URL=https://madsvalby.app.n8n.cloud/webhook/somi-ideas-intake
    ```

### Del D: Aktivér ændringen
11. I Vercel: gå til fanen **Deployments** → find den øverste → klik **⋯** (de tre prikker) → **Redeploy** → bekræft.
    (Eller bare push en lille ændring — men Redeploy er nemmest.)

✅ **Færdig.** Nu sender "Gem i kø" og den ugentlige cron forslagene videre til
n8n's ideas-tabel (som `proposed`). De auto-produceres ikke — du godkender dem.

---

## OPGAVE 2 — Konkurrent-benchmark friskes dagligt i prod

Tallene vises allerede (jeg hentede dem). Det her sørger bare for at de
**opdaterer sig selv** hver dag på det live site. Du har allerede nøglerne i
`.env.local` — de skal bare også ligge i Vercel.

1. Åbn `C:\Users\madsv\Desktop\somi-app\.env.local` og find disse to linjer
   (kopiér VÆRDIEN efter `=` — del den ikke med nogen):
   ```
   YOUTUBE_API_KEY=...
   YT_CHANNEL_ID=...
   ```
2. Gå til **Vercel → Settings → Environment Variables** (samme sted som ovenfor).
3. Tilføj **to** variabler (én ad gangen):
   - **Key:** `YOUTUBE_API_KEY`  · **Value:** (værdien fra .env.local) · **Production** ✔
   - **Key:** `YT_CHANNEL_ID`   · **Value:** (værdien fra .env.local) · **Production** ✔
4. Tryk **Save** for hver.
5. **Deployments** → øverste → **⋯** → **Redeploy**.

✅ **Færdig.** Cron'en kører nu dagligt 05:00 UTC og holder benchmark frisk.

---

## Sådan tjekker du at det virker

- **Idé-loop:** Når winner-loop'en har data, tryk **Gem i kø** på Agenter-fanen →
  forslaget bør dukke op i n8n's ideas-tabel inden for få sekunder.
- **Benchmark:** Åbn dashboardet → **Overblik** → "Konkurrent-benchmark" viser de
  6 kanaler med Paper Empires fremhævet (👑).

## Vigtige regler (som altid)
- Skriv aldrig nøgle-værdier i en chat eller i git. `.env.local` er git-ignored.
- I env-filer: ingen anførselstegn, ingen mellemrum: `NAVN=værdi`.
