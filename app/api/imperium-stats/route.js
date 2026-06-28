import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { VENTURES } from "@/app/imperium/_data/ventures";

export const dynamic = "force-dynamic";

// Funnel pr. venture for dashboardets Imperium-kort: view → cta → lead.
// Auth-gated (samme RLS-mønster som /api/performance): den authenticated server-klient
// må SELECT'e imperium_events ("auth read"-policy). Aggregering sker server-side i JS —
// PostgREST eksponerer ikke rå GROUP BY, og volumen er lav (landing-funnel).
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("imperium_events")
    .select("slug,event");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // tæl pr. slug+event → { [slug]: { view, cta, lead } }
  const counts = {};
  let totalEvents = 0;
  (data || []).forEach((r) => {
    const slug = r && r.slug;
    const event = r && r.event;
    if (!slug || !event) return;
    totalEvents += 1;
    if (!counts[slug]) counts[slug] = { view: 0, cta: 0, lead: 0 };
    if (event in counts[slug]) counts[slug][event] += 1;
  });

  // én række pr. venture i kanonisk rank-rækkefølge; cvr = lead/view (%).
  const ventures = VENTURES.map((v) => {
    const c = counts[v.slug] || { view: 0, cta: 0, lead: 0 };
    return {
      slug: v.slug,
      name: v.name,
      accent: v.accent,
      views: c.view,
      cta: c.cta,
      leads: c.lead,
      cvr: c.view ? Math.round((c.lead / c.view) * 1000) / 10 : 0,
    };
  });

  const hub = counts.hub || { view: 0, cta: 0, lead: 0 };

  return NextResponse.json({
    ventures,
    hub: { views: hub.view, cta: hub.cta },
    totals: {
      events: totalEvents,
      views: ventures.reduce((a, v) => a + v.views, 0) + hub.view,
      cta: ventures.reduce((a, v) => a + v.cta, 0) + hub.cta,
      leads: ventures.reduce((a, v) => a + v.leads, 0),
    },
  });
}
