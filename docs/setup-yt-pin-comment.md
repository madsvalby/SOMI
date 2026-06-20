# Setup: Auto pin-kommentar på YouTube (publish-watcher)

Auto-poster kanalens egen top-kommentar på en ny Paper Empires-video, **når videoen bliver
offentlig** — ikke ved upload (man kan ikke kommentere en privat/planlagt video).

## Sådan virker det

MASTER (`SOMI MASTER: Idé → Færdig video`) genererer allerede en `pinned_comment` i Claude
SEO-noden. Den bliver nu **gemt** på videos-rækken ved upload ("Gem YouTube-URL" skriver også
`pinned_comment` + `comment_posted=false`).

Et separat workflow poster den så, når videoen faktisk er publiceret:

**`SOMI YT PUBLISH WATCHER: pin-kommentar ved publicering`** (id `2Nzp6u78iyxfPNZw`)
- **Hver 30. min** (+ manuel test-trigger).
- Henter videos-rækker med `status = 'uploadet_privat'`.
- Udtrækker YouTube-id fra `yt_url` (`https://youtu.be/<id>`).
- `GET videos?part=status&id=<id>` → tjekker `privacyStatus`.
- Hvis **public** OG der findes en `pinned_comment` → `POST commentThreads?part=snippet`
  (commentThreads.insert) med kommentaren.
- Sætter derefter `status='published'` + `comment_posted=true` på rækken
  (forsvinder dermed fra næste runs filter).

Private videoer og videoer uden `pinned_comment` springes sikkert over (de poster intet).

## n8n Data Table `videos` — nye kolonner
- `pinned_comment` (string)
- `comment_posted` (boolean)

Disse syncer **ikke** til Supabase (SYNC's "Map videos" bruger eksplicit mapping). `status`
syncer dog, så `published` vises i dashboardet inden for 15 min.

## Manuelle trin (skal gøres af Mads — én gang)

1. **Vælg credential på de 2 HTTP-noder.** Tooling kan ikke sætte HTTP-credentials.
   Åbn workflowet → på **"Tjek om offentlig"** og **"Post pin-kommentar"** vælg credential
   **"YouTube account"** (`youTubeOAuth2Api`) i node-dropdownen.
2. **Scope `youtube.force-ssl`.** `commentThreads.insert` kræver scope
   `https://www.googleapis.com/auth/youtube.force-ssl`. Hvis "Post pin-kommentar" giver **403**,
   re-auth "YouTube account"-credentialen med det scope. (`videos.list` kræver kun readonly.)
3. **Aktivér workflowet** (toggle øverst til højre). Lad det være inaktivt indtil trin 1 er gjort
   — ellers fejler hvert 30-min-run på manglende credential.

## Test

- Kan først testes på en **offentlig** video. Alle nuværende videoer er private.
- Når en MASTER-video publiceres (planlagt kl. 17:30 CPH), fanger watcheren den inden for 30 min.
- Manuel test: kør "Test (manuel)"-triggeren efter en video er blevet offentlig.

## Bemærkninger

- De ~7 nuværende `uploadet_privat`-videoer pollerne hver 30. min (1 quota-enhed/video/run,
  ~336/dag — langt under 10.000/dag). De poster intet (private + ingen `pinned_comment`).
- Det gamle sub-workflow `SOMI YT KOMMENTAR: Auto-top-kommentar` (`enSVlVhT1tIiMDuE`) er nu
  **overflødigt** (watcheren genbruger MASTERs pinned_comment i stedet for et nyt Claude-kald).
  Kan arkiveres.
