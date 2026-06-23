import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Performance/Udvikling-data: tidsserie (channel_daily) + per-video scorecard +
// omkostning pr. leverandør. Driver "Udvikling"-fanens grafer i dashboardet.
function round2(n) { return Math.round((Number(n) || 0) * 100) / 100; }
function providerOf(model) {
  const m = String(model || "").toLowerCase();
  if (m.includes("claude") || m.includes("sonnet") || m.includes("opus") || m.includes("anthropic")) return "Anthropic (script/QC)";
  if (m.includes("chatterbox") || m.includes("somi-tts")) return "TTS (self-host · $0)";
  if (m.includes("gemini") || m.includes("nano")) return "Gemini (billeder)";
  if (m.includes("renderer")) return "Render-server";
  if (m.includes("youtube")) return "YouTube API";
  return model || "Andet";
}

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const [chR, costR, vidsR, earnR] = await Promise.all([
    supabase.from("channel_daily").select("date,subs,views,videos,cost_usd").order("date", { ascending: true }),
    supabase.from("costlog").select("video_id,model,usd_cost"),
    supabase.from("videos").select("video_id,case_id,title,status,created_at"),
    supabase.from("earnings").select("usd,date,platform"),
  ]);

  const series = (chR.data || []).map((r) => ({
    date: r.date,
    subs: r.subs == null ? null : Number(r.subs),
    views: r.views == null ? null : Number(r.views),
    videos: r.videos == null ? null : Number(r.videos),
    cost: r.cost_usd == null ? 0 : Number(r.cost_usd),
  }));

  const costlog = costR.data || [];
  const byModel = {};
  const byVideoCost = {};
  let totalSpend = 0;
  costlog.forEach((c) => {
    const usd = Number(c.usd_cost) || 0;
    totalSpend += usd;
    const p = providerOf(c.model);
    byModel[p] = (byModel[p] || 0) + usd;
    if (c.video_id) byVideoCost[c.video_id] = (byVideoCost[c.video_id] || 0) + usd;
  });
  const costByProvider = Object.entries(byModel)
    .map(([provider, usd]) => ({ provider, usd: round2(usd) }))
    .sort((a, b) => b.usd - a.usd);

  const videos = (vidsR.data || [])
    .slice()
    .sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")))
    .map((v) => ({
      video_id: v.video_id,
      title: v.title || v.case_id || v.video_id,
      status: v.status || "",
      cost: round2(byVideoCost[v.video_id] || 0),
    }));

  const earnings = earnR.data || [];
  const totalEarn = round2(earnings.reduce((a, e) => a + (Number(e.usd) || 0), 0));
  const latest = series.filter((s) => s.subs != null).slice(-1)[0] || null;

  return NextResponse.json({
    series,
    costByProvider,
    videos,
    totals: {
      subs: latest ? latest.subs : null,
      views: latest ? latest.views : null,
      videos: latest ? latest.videos : videos.length,
      spend: round2(totalSpend),
      earnings: totalEarn,
      profit: round2(totalEarn - totalSpend),
    },
    subsPoints: series.filter((s) => s.subs != null).length,
  });
}
