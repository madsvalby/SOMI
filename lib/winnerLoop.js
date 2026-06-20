// ─────────────────────────────────────────────────────────────
// Winner-loop — Analytics-agentens hjerne, som ren funktion.
//
// Deler beregningen mellem /api/analytics (UI) og /api/cron/ideas (auto-loop),
// så de aldrig kan komme ud af sync. Tager rå stats_daily + videos og udleder
// vindere, underperformere, repurpose-kandidater, watchlist og winner-pattern.
// Ingen I/O her — kald-stedet henter data og sender det ind.
// ─────────────────────────────────────────────────────────────

const STOP = new Set([
  "the", "and", "for", "with", "from", "that", "this", "how", "why", "what", "his", "her",
  "der", "den", "det", "som", "med", "for", "til", "the", "and", "case", "story", "scandal",
]);

export function themes(titles) {
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

// stats: rækker fra stats_daily (video_id,date,views,watch_time,subs,rpm)
// videos: rækker fra videos (video_id,case_id,title,status,channel_id,created_at)
export function computeWinnerLoop({ stats = [], videos = [] }) {
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

  return {
    hasData,
    generatedAt: new Date().toISOString(),
    metrics: {
      trackedVideos: rows.length,
      videosWithViews: withViews.length,
      totalViews: withViews.reduce((a, r) => a + r.views, 0),
      medianViews: median,
      totalSubs: rows.reduce((a, r) => a + (Number(r.subs) || 0), 0),
      totalWatchMin: rows.reduce((a, r) => a + (Number(r.watchMin) || 0), 0),
    },
    winners,
    underperformers,
    repurpose,
    watchlist,
    winnerPattern,
  };
}
