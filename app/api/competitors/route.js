import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Læser cachede konkurrent-tal (fyldt af /api/cron/competitors). Returnerer
// konkurrenter + vores egen kanal samlet, sorteret efter abonnenter, så
// dashboardet kan vise benchmark uden at ramme YouTube-API'et pr. visning.
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("competitors")
    .select("handle,name,channel_id,subs,views,videos,is_self,updated_at");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (data || []).map((r) => ({
    handle: r.handle,
    name: r.name || r.handle,
    channelId: r.channel_id || null,
    subs: r.subs == null ? null : Number(r.subs),
    views: Number(r.views) || 0,
    videos: Number(r.videos) || 0,
    isSelf: !!r.is_self,
  }));
  rows.sort((a, b) => (b.subs || 0) - (a.subs || 0));

  const updatedAt = (data || []).reduce((m, r) => (r.updated_at > m ? r.updated_at : m), "");

  return NextResponse.json({
    competitors: rows,
    hasData: rows.length > 0,
    updatedAt: updatedAt || null,
  });
}
