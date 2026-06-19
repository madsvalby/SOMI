# Opsætning: YouTube-cron (Opgave 4C)

> Trin-for-trin til at få den daglige YouTube Analytics-cron til at køre.
> Cron-koden er **færdig** (`app/api/cron/youtube/route.js`) — den mangler kun 4 værdier.
> **Du indsætter selv alle nøgler** i `.env.local` + Vercel. Lim dem aldrig i chatten.

## Hvad cron'en gør
Kører dagligt 06:00 UTC (se `vercel.json`), henter i går's tal pr. video via **YouTube Analytics API**
og skriver → `stats_daily` (views, watch time, subs, RPM) + dagens samlede indtjening → `earnings`.
Skrives med `service_role` (allerede sat ✅).

## De 4 manglende variabler
| Variabel | Hvad |
|---|---|
| `GOOGLE_CLIENT_ID` | OAuth-klient (trin C–D) |
| `GOOGLE_CLIENT_SECRET` | OAuth-klient (trin C–D) |
| `GOOGLE_REFRESH_TOKEN` | Langtidsnøgle til at hente access tokens (trin E) |
| `YT_CHANNEL_ID` | Paper Empires' kanal-ID, `UC…` (trin A) |

---

## Trin A — Find YT_CHANNEL_ID
1. YouTube Studio → **Indstillinger → Kanal → Avancerede indstillinger**.
2. Kopiér **Kanal-ID** (starter med `UC…`). Det er `YT_CHANNEL_ID`.
   - Alternativt: din kanalside-URL `youtube.com/channel/UCxxxx` — delen efter `/channel/`.

## Trin B — Aktivér API'et i Google Cloud
1. [console.cloud.google.com](https://console.cloud.google.com) → vælg projektet **somi-engine**
   (`ethereal-bison-499116-e2`) — det du allerede bruger til pipelinen.
2. **APIs & Services → Library** → søg **"YouTube Analytics API"** → **Enable**.
   (Behold også YouTube Data API v3 hvis den allerede er på — cron'en bruger Analytics.)

## Trin C — OAuth consent screen (VIGTIGT: publish, ellers udløber nøglen)
1. **APIs & Services → OAuth consent screen**.
2. User type: **External** → Create (hvis ikke sat op).
3. Tilføj scopes:
   - `https://www.googleapis.com/auth/yt-analytics.readonly`
   - `https://www.googleapis.com/auth/yt-analytics-monetary.readonly` (til indtjening — valgfri; cron'en falder pænt tilbage uden)
4. **Publish app → "In production".**
   ⚠️ **Fælde:** står appen i *Testing*, **udløber refresh-token efter 7 dage** og cron'en dør hver uge.
   I *Production* udløber den ikke. Du er eneste bruger med ikke-følsomme scopes, så ingen Google-verificering kræves
   for at det virker (du ser måske en "unverified app"-skærm — *Advanced → Go to (unsafe)* er fint for din egen konto).

## Trin D — Opret OAuth Client ID
1. **APIs & Services → Credentials → Create credentials → OAuth client ID**.
2. Application type: **Web application**.
3. Under **Authorized redirect URIs** tilføj præcist:
   `https://developers.google.com/oauthplayground`
4. Create → kopiér **Client ID** (`GOOGLE_CLIENT_ID`) og **Client secret** (`GOOGLE_CLIENT_SECRET`).

## Trin E — Hent refresh token (OAuth Playground)
1. Gå til [developers.google.com/oauthplayground](https://developers.google.com/oauthplayground).
2. Øverst højre **tandhjul** → kryds **"Use your own OAuth credentials"** → indsæt Client ID + Secret.
3. Venstre side, felt **"Input your own scopes"** → indsæt (mellemrum imellem):
   ```
   https://www.googleapis.com/auth/yt-analytics.readonly https://www.googleapis.com/auth/yt-analytics-monetary.readonly
   ```
4. **Authorize APIs** → log ind med **kanalens Google-konto** (den der ejer Paper Empires) → accepter.
5. Trin 2 i Playground: **Exchange authorization code for tokens**.
6. Kopiér **Refresh token** (lang streng) → det er `GOOGLE_REFRESH_TOKEN`.
   - Får du ingen refresh token? Tjek at "offline access" er aktivt (Playground gør det automatisk) og at du
     authorize'de *forfra* med consent-prompt.

## Trin F — Sæt variablerne (du gør det selv)
**`.env.local`** (lokalt) — tilføj:
```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=...
YT_CHANNEL_ID=UC...
```
**Vercel** → Project → Settings → **Environment Variables** → tilføj de samme 4 (Production + Preview) → **Redeploy**.

## Trin G — Test
**Lokalt** (med `.env.local`):
```bash
npm run dev
# i en anden terminal — brug din CRON_SECRET:
curl -H "Authorization: Bearer DIN_CRON_SECRET" http://localhost:3000/api/cron/youtube
```
Forventet svar (JSON): `{ "ok": true, "date": "…", "stats": N, "earnings": 0|1, "revenue_included": true|false }`.

**I produktion** kører Vercel cron'en automatisk 06:00 UTC og sætter selv `Authorization: Bearer $CRON_SECRET`.

## Fejlfinding
| Symptom | Årsag / fix |
|---|---|
| `GOOGLE_… mangler` (500) | En env-var er tom — tjek stavning, redeploy Vercel. |
| `stats: 0` men ingen fejl | Analytics har **1–2 dages forsinkelse** — i går kan være tom de første dage. Normalt. |
| `revenue_included: false` | Monetary-scope mangler/ikke godkendt — cron skriver views/subs alligevel, bare uden RPM/earnings. |
| Cron dør efter ~7 dage | Consent screen står i *Testing* → sæt til **In production** (trin C.4) og hent token igen. |
| `401 unauthorized` på test | Forkert `CRON_SECRET` i Authorization-headeren. |

Når dette virker, fyldes `stats_daily` + `earnings`, og Økonomi-fanens indtjening + KPI'erne bliver levende.
