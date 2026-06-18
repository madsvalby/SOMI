import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Læser pipeline-data (n8n + cron) og returnerer det i dashboardets view-shapes,
// så Command.jsx kan bruge det direkte. RLS "auth read" tillader SELECT for indloggede.
export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const [videosR, costR, earnR] = await Promise.all([
    supabase.from("videos").select("video_id,case_id,title,channel_id"),
    supabase.from("costlog").select("video_id,usd_cost"),
    supabase.from("earnings").select("channel_id,platform,date,usd"),
  ]);

  const videos = videosR.data || [];
  const vmap = {};
  videos.forEach((v) => {
    vmap[v.video_id] = v;
  });

  // costs: aggreger costlog pr. video → én linje pr. sag i shapen {id, channelId, case, usd}
  const byVideo = {};
  (costR.data || []).forEach((c) => {
    const key = c.video_id || "ukendt";
    if (!byVideo[key]) {
      const v = vmap[c.video_id];
      byVideo[key] = {
        id: "cl_" + key,
        channelId: (v && v.channel_id) || "ch1",
        case: (v && (v.title || v.case_id)) || c.video_id || "Ukendt",
        usd: 0,
      };
    }
    byVideo[key].usd += Number(c.usd_cost) || 0;
  });
  const costs = Object.values(byVideo).map((c) => ({
    ...c,
    usd: Math.round(c.usd * 100) / 100,
  }));

  // earnings: {id, channelId, source, month, usd}
  const earnings = (earnR.data || []).map((e, i) => ({
    id: "ear_" + i,
    channelId: e.channel_id || "ch1",
    source: e.platform || "other",
    month: e.date ? String(e.date).slice(0, 7) : "",
    usd: Math.round((Number(e.usd) || 0) * 100) / 100,
  }));

  return NextResponse.json({
    costs,
    earnings,
    counts: {
      videos: videos.length,
      costlog: (costR.data || []).length,
      earnings: (earnR.data || []).length,
    },
  });
}
