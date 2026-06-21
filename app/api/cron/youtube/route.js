import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// Daglig cron (06:00 UTC, se vercel.json): henter YouTube Analytics for et
// rullende vindue (sidste 14 dage) pr. video pr. dag → stats_daily + daglig
// samlet indtjening → earnings. Vinduet gør cronen selvhelende: et dags-hul
// (f.eks. en fejlet kørsel) fyldes automatisk ved næste kørsel via idempotent
// upsert. Skrives med service_role (cron har ingen bruger-session → RLS bypasses).
const WINDOW_DAYS = 14;

async function getAccessToken() {
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  if (!r.ok) throw new Error("token: " + (await r.text()));
  const j = await r.json();
  if (!j.access_token) throw new Error("token: intet access_token i svaret");
  return j.access_token;
}

// YouTube Analytics understøtter IKKE dimensions=video,day i samme kanal-query.
// Vi henter derfor pr. dag (dimensions=video, start=end=dagen).
function buildReportUrl(ids, day, metrics) {
  const params = new URLSearchParams({
    ids,
    startDate: day,
    endDate: day,
    metrics,
    dimensions: "video",
    sort: "-views",
    maxResults: "200",
  });
  return `https://youtubeanalytics.googleapis.com/v2/reports?${params.toString()}`;
}

function dayRange(startDate, endDate) {
  const days = [];
  for (let d = new Date(startDate); d <= new Date(endDate); d = new Date(d.getTime() + 86400000)) {
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export async function GET(request) {
  // Cron-gate
  const auth = request.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  for (const k of [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REFRESH_TOKEN",
    "SUPABASE_SERVICE_ROLE_KEY",
  ]) {
    if (!process.env[k]) {
      return NextResponse.json({ error: `${k} mangler` }, { status: 500 });
    }
  }

  try {
    const token = await getAccessToken();
    const ids = process.env.YT_CHANNEL_ID
      ? `channel==${process.env.YT_CHANNEL_ID}`
      : "channel==MINE";
    const endDate = new Date(Date.now() - 86400000).toISOString().slice(0, 10); // i går (UTC)
    const startDate = new Date(Date.now() - WINDOW_DAYS * 86400000)
      .toISOString()
      .slice(0, 10);
    const days = dayRange(startDate, endDate);

    const REV_METRICS = "views,estimatedMinutesWatched,subscribersGained,estimatedRevenue";
    const BASE_METRICS = "views,estimatedMinutesWatched,subscribersGained";

    // Indtjenings-scope afgøres på første dags-kald; falder tilbage uden hvis det mangler.
    let hasRevenue = true;
    const stats = [];
    const earningsRows = [];

    for (const day of days) {
      let yt = await fetch(buildReportUrl(ids, day, hasRevenue ? REV_METRICS : BASE_METRICS), {
        headers: { authorization: `Bearer ${token}` },
      });
      if (!yt.ok && hasRevenue) {
        const errText = await yt.text();
        if (yt.status === 403 || /estimatedRevenue|scope|monet/i.test(errText)) {
          hasRevenue = false; // skift permanent til base-metrics
          yt = await fetch(buildReportUrl(ids, day, BASE_METRICS), {
            headers: { authorization: `Bearer ${token}` },
          });
        }
      }
      if (!yt.ok) {
        return NextResponse.json({ error: `yt (${day}): ` + (await yt.text()) }, { status: 502 });
      }

      const rows = (await yt.json()).rows || [];
      let dayRevenue = 0;
      for (const row of rows) {
        const [video_id, views, mins, subs] = row;
        const revenue = hasRevenue ? Number(row[4]) || 0 : 0;
        const v = Number(views) || 0;
        dayRevenue += revenue;
        stats.push({
          video_id,
          date: day,
          views: v,
          watch_time: Math.round(Number(mins) || 0),
          subs: Number(subs) || 0,
          rpm: v > 0 && hasRevenue ? Math.round((revenue / v) * 1000 * 100) / 100 : 0,
        });
      }
      if (hasRevenue && rows.length) {
        earningsRows.push({
          channel_id: "ch1",
          platform: "youtube",
          date: day,
          usd: Math.round(dayRevenue * 100) / 100,
          source: "youtube_analytics",
        });
      }
    }

    const supabase = createAdminClient();
    let wroteStats = 0;
    let wroteEarnings = 0;

    if (stats.length) {
      const { error } = await supabase
        .from("stats_daily")
        .upsert(stats, { onConflict: "video_id,date" });
      if (error) return NextResponse.json({ error: "stats_daily: " + error.message }, { status: 500 });
      wroteStats = stats.length;
    }

    if (earningsRows.length) {
      const { error } = await supabase
        .from("earnings")
        .upsert(earningsRows, { onConflict: "channel_id,platform,date" });
      if (error) return NextResponse.json({ error: "earnings: " + error.message }, { status: 500 });
      wroteEarnings = earningsRows.length;
    }

    return NextResponse.json({
      ok: true,
      window: { startDate, endDate },
      stats: wroteStats,
      earnings: wroteEarnings,
      revenue_included: hasRevenue,
    });
  } catch (e) {
    return NextResponse.json({ error: String((e && e.message) || e) }, { status: 500 });
  }
}
