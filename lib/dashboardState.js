// Delte KV-helpers oven på /api/state (Supabase dashboard_state).
// Samme kontrakt som de inline-helpers i Command.jsx, udtrukket så nye
// komponenter (fx AgentsTab) kan genbruge dem.

export async function loadKey(key, fallback = null) {
  try {
    if (typeof window === "undefined") return fallback;
    const res = await fetch(`/api/state?key=${encodeURIComponent(key)}`);
    if (!res.ok) return fallback;
    const data = await res.json();
    return data && data.value != null ? data.value : fallback;
  } catch (e) {
    return fallback;
  }
}

export async function saveKey(key, value) {
  try {
    if (typeof window === "undefined") return false;
    const res = await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}
