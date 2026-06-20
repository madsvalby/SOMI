import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Winner-loop (Analytics-agentens hjerne). Beregner deterministisk fra stats_daily + videos:
// vindere, underperformere, repurpose-kandidater, watchlist og et winner-pattern.
// Bevæbnet nu — returnerer hasData:false indtil der er views i stats_daily, hvorefter
// det automatisk begynder at give resultater. Idé-forslag fra vindere laves i klienten
// via /api/anthropic (genbrug), så denne route holder sig deterministisk og billig.

const STOP = new Set([
  "the", "and", "for", "with", "from", "that", "this", "how", "why", "what", "his", "her",
  "der", "den", "det", "som", "med", "for", "til", "the", "and", "case", "story", "scandal",
]);

function themes(titles) {
  const count = {};
  titles.forEach((t) => {
    String(t || "")
      .toLowerCase()
      .split(/[^a-z0-9æøå]+/i)
      .filter((w) => w.length > 3 && !STOP.has(w))
      .forEach((w) => { count[w] = (count[w] || 0) + 1; });
  });
  return Object.entries(count)
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([w, n]) => ({ word: w, n }));
}

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const [statsR, videosR] = await Promise.all([
    supabase.from("stats_daily").select("video_id,date,views,watch_time,subs,rpm"),
    supabase.from("videos").select("video_id,case_id,title,status,channel_id,created_at"),
  ]);

  const stats = statsR.data || [];
  const videos = videosR.data || [];
  const vmap = {};
  videos.forEach((v) => { vmap[v.video_id] = v; });

  // Aggregér pr. video
  const byVid = {};
  stats.forEach((s) => {
    const k = s.video_id;
    if (!k) return;
    if (!byVid[k]) byVid[k] = { video_id: k, views: 0, watch: 0, subs: 0, rpm: null };
    byVid[k].views += Number(s.views) || 0;
    byVid[k].watch += Number(s.watch_time) || 0;
    byVid[k].subs += Number(s.subs) || 0;
    if (s.rpm != null) byVid[k].rpm = Number(s.rpm);
  });

  const now = Date.now();
  const ageDays = (iso) => (iso ? Math.floor((now - new Date(iso).getTime()) / 86400000) : null);
  const rows = Object.values(byVid).map((r) => {
    const v = vmap[r.video_id] || {};
    return {
      video_id: r.video_id,
      title: v.title || v.case_id || r.video_id,
      status: v.status || null,
      views: r.views,
      watchMin: Math.round(r.watch / 60),
      retentionSecPerView: r.views ? Math.round((r.watch / r.views) * 10) / 10 : 0,
      subs: r.subs,
      rpm: r.rpm,
      ageDays: ageDays(v.created_at),
    };
  });

  const withViews = rows.filter((r) => r.views > 0);
  const hasData = withViews.length > 0;

  const sortedByViews = withViews.slice().sort((a, b) => b.views - a.views);
  const sortedViews = sortedByViews.map((r) => r.views);
  const median = sortedViews.length
    ? sortedViews[Math.floor(sortedViews.length / 2)]
    : 0;

  const winners = sortedByViews.slice(0, 3);

  // Underperformere: mindst 14 dage gamle og under 40% af median
  const underperformers = rows
    .filter((r) => (r.ageDays == null || r.ageDays >= 14) && median > 0 && r.views < median * 0.4)
    .sort((a, b) => a.views - b.views)
    .slice(0, 4)
    .map((r) => ({ ...r, reason: r.views === 0 ? "Ingen views endnu" : "Under 40% af median-views" }));

  const repurpose = winners.map((w) => ({
    video_id: w.video_id,
    title: w.title,
    views: w.views,
    action: "Lav 3 shorts/reels fra denne vinder",
  }));

  const watchlist = underperformers.map((u) => ({
    video_id: u.video_id,
    title: u.title,
    views: u.views,
    action: "Test ny titel + thumbnail (ompakning)",
  }));

  const winnerPattern = {
    themes: themes(winners.map((w) => w.title)),
    avgRetentionSecPerView: winners.length
      ? Math.round((winners.reduce((a, w) => a + w.retentionSecPerView, 0) / winners.length) * 10) / 10
      : 0,
  };

  return NextResponse.json({
    hasData,
    generatedAt: new Date().toISOString(),
    metrics: {
      trackedVideos: rows.length,
      videosWithViews: withViews.length,
      totalViews: withViews.reduce((a, r) => a + r.views, 0),
      medianViews: median,
    },
    winners,
    underperformers,
    repurpose,
    watchlist,
    winnerPattern,
  });
}
