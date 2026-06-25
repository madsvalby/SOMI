import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Offentlig, cookie-fri funnel-beacon for imperium-landingssiderne.
// Insert sker server-side med SERVICE-ROLE (bypasser RLS); nøglen forlader aldrig serveren.
// Validerer slug+event hårdt og dropper alt andet stille (204) → minimal spam-overflade.
export const dynamic = "force-dynamic";

const SLUGS = new Set(["faceless", "listingreel", "adforge", "automation", "beacon", "ringback", "hub"]);
const EVENTS = new Set(["view", "cta", "lead"]);
const noContent = () => new NextResponse(null, { status: 204 });

export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    try { body = JSON.parse(await request.text()); } catch (e2) { body = {}; }
  }

  const slug = String(body && body.slug || "");
  const event = String(body && body.event || "");
  if (!SLUGS.has(slug) || !EVENTS.has(event)) return noContent();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return noContent();

  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    await supabase.from("imperium_events").insert({
      slug,
      event,
      label: body.label ? String(body.label).slice(0, 120) : null,
      path: body.path ? String(body.path).slice(0, 200) : null,
      ref: body.ref ? String(body.ref).slice(0, 200) : null,
      meta: body.meta && typeof body.meta === "object" ? body.meta : null,
    });
  } catch (e) {
    /* best-effort: aldrig fejl tilbage til klienten */
  }
  return noContent();
}
