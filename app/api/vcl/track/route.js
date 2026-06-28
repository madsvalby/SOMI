import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Offentlig, cookie-fri funnel-beacon for Sera-landingen. Tæller dagligt
// landing_visits / link_clicks i virtual_creator_metrics (service_role, bypasser
// RLS). Validerer event hårdt; fejler stille (204) → minimal spam-overflade.
export const dynamic = "force-dynamic";

const EVENTS = new Set(["view", "click"]);
const noContent = () => new NextResponse(null, { status: 204 });

export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    body = {};
  }
  const event = String((body && body.event) || "");
  if (!EVENTS.has(event)) return noContent();

  try {
    const supabase = createAdminClient();
    const date = new Date().toISOString().slice(0, 10);
    const match = { project_id: "sera", platform: "landing", date };
    const { data: existing } = await supabase
      .from("virtual_creator_metrics")
      .select("id, landing_visits, link_clicks")
      .match(match)
      .maybeSingle();

    const next = {
      ...match,
      landing_visits: ((existing && existing.landing_visits) || 0) + (event === "view" ? 1 : 0),
      link_clicks: ((existing && existing.link_clicks) || 0) + (event === "click" ? 1 : 0),
      source: "landing",
    };
    if (existing && existing.id) {
      await supabase.from("virtual_creator_metrics").update(next).eq("id", existing.id);
    } else {
      await supabase.from("virtual_creator_metrics").insert(next);
    }
  } catch (e) {
    /* best-effort: aldrig fejl tilbage til klienten */
  }
  return noContent();
}
