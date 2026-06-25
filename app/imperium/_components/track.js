// Letvægts, cookie-fri event-beacon for imperium-landingssiderne → /api/imperium-track.
// Ingen PII: kun anonyme funnel-tællinger (view/cta/lead pr. venture) + referrer-HOST (ikke fuld URL).
// Tracking må ALDRIG påvirke UX — alt er try/catch og best-effort (sendBeacon, ellers keepalive-fetch).
const ENDPOINT = "/api/imperium-track";

export function track(slug, event, extra = {}) {
  if (typeof window === "undefined") return;
  try {
    let refHost = null;
    try { refHost = document.referrer ? new URL(document.referrer).host : null; } catch (e) {}
    const payload = JSON.stringify({
      slug,
      event,
      path: location.pathname,
      ref: refHost,
      ...extra,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: "application/json" }));
    } else {
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: payload,
        keepalive: true,
      });
    }
  } catch (e) {
    /* swallow — tracking er aldrig kritisk */
  }
}
