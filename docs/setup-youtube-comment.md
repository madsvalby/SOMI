# YouTube auto-kommentar — sådan tænder du den

YT-kommentaren (`commentThreads.insert`) kræver Google-scopet
`https://www.googleapis.com/auth/youtube.force-ssl`. Dit nuværende token har det
ikke endnu. Tre trin, ~10 min.

---

## Trin 1 — Tilføj scopet i Google Cloud
1. Gå til **console.cloud.google.com** → vælg projektet (**somi-engine**).
2. Venstremenu → **APIs & Services** → **OAuth consent screen** (nye UI: **Branding / Data Access**).
3. Find **Scopes / Data Access** → **Add or Remove Scopes**.
4. I "Manually add scopes" indsæt præcis:
   ```
   https://www.googleapis.com/auth/youtube.force-ssl
   ```
   → **Add to table** → **Update** → **Save**.
5. Tjek at **YouTube Data API v3** står som **Enabled** under *APIs & Services → Enabled APIs* (det gør den allerede).

> Hvis appen står som "Testing" og din Google-konto ikke er testbruger: tilføj din egen mail under **Audience → Test users**.

## Trin 2 — Forny YouTube-credentialen i n8n
1. n8n → øverst **Credentials** → åbn **"YouTube account"** (`NZTjBTYjUiV9JMoQ`).
   (Findes den ikke, opret en ny af typen **YouTube OAuth2 API**.)
2. Client ID + Client Secret skal være fra **samme** Google Cloud OAuth-klient som resten.
3. Klik **Connect my account** / **Reconnect** → log ind med Google-kontoen der ejer
   Paper Empires-kanalen → **godkend ALLE scopes** (inkl. den nye `youtube.force-ssl`).
4. Vent på "Account connected" → **Save**.

> Ser du "Google hasn't verified this app": klik **Advanced → Go to somi-engine (unsafe)** →
> fortsæt. Det er din egen app, så det er fint.

## Trin 3 — Aktivér pin-watcheren
1. Åbn **"SOMI YT PUBLISH WATCHER"**:
   https://madsvalby.app.n8n.cloud/workflow/2Nzp6u78iyxfPNZw
2. Tjek at **"YouTube account"**-credentialen er valgt på YouTube-noderne (HTTP/commentThreads).
3. Slå **Active** til (øverste højre).

---

## Sådan virker det så
Når en video bliver offentlig, poster watcheren automatisk kanalens forberedte
**top-kommentar** (`pinned_comment`, som MASTER allerede genererer) under videoen —
inden for ~30 min.

## Vigtigt om "pin"
- **At POSTE kommentaren** = kan automatiseres (det her). ✅
- **At PINNE den** øverst = der findes **ingen API** til det. ❌ Det er ét manuelt klik
  i YouTube Studio. Watcheren poster kommentaren; du pinner den når du vil (eller lader
  den stå upinned).

## Tjek at det virker
Efter en video publiceres → kig under videoen på YouTube: en kommentar fra kanalen
bør dukke op inden for ~30 min. Du kan også se workflow-kørslen i n8n → Executions.

---

## Bemærk: dette er adskilt fra app'ens YouTube-cron
App'ens `/api/cron/youtube` (Analytics) og benchmark bruger andre nøgler (hhv. et
Playground-token og `YOUTUBE_API_KEY`) — de er upåvirkede. Det her trin handler kun
om **n8n's YouTube-credential** til at poste kommentarer.
