import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// Daglig cron (06:00 UTC, se vercel.json): henter YouTube Analytics for i går
// og skriver pr. video → stats_daily + dagens samlede indtjening → earnings.
// Skrives med service_role (cron har ingen bruger-session → RLS skal bypasses).

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

function buildReportUrl(token, ids, startDate, endDate, metrics) {
  const params = new URLSearchParams({
    ids,
    startDate,
    endDate,
    metrics,
    dimensions: "video",
    sort: "-views",
    maxResults: "200",
  });
  return `https://youtubeanalytics.googleapis.com/v2/reports?${params.toString()}`;
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
    const date = new Date(Date.now() - 86400000).toISOString().slice(0, 10); // i går (UTC)

    // Forsøg med indtjening; fald tilbage uden hvis monetary-scope mangler.
    let hasRevenue = true;
    let yt = await fetch(
      buildReportUrl(token, ids, date, date, "views,estimatedMinutesWatched,subscribersGained,estimatedRevenue"),
      { headers: { authorization: `Bearer ${token}` } }
    );
    if (!yt.ok) {
      const errText = await yt.text();
      if (yt.status === 403 || /estimatedRevenue|scope|monet/i.test(errText)) {
        hasRevenue = false;
        yt = await fetch(
          buildReportUrl(token, ids, date, date, "views,estimatedMinutesWatched,subscribersGained"),
          { headers: { authorization: `Bearer ${token}` } }
        );
        if (!yt.ok) {
          return NextResponse.json({ error: "yt: " + (await yt.text()) }, { status: 502 });
        }
      } else {
        return NextResponse.json({ error: "yt: " + errText }, { status: 502 });
      }
    }

    const report = await yt.json();
    const rows = report.rows || [];

    const stats = rows.map((row) => {
      const [video_id, views, mins, subs] = row;
      const revenue = hasRevenue ? Number(row[4]) || 0 : 0;
      const v = Number(views) || 0;
      return {
        video_id,
        date,
        views: v,
        watch_time: Math.round(Number(mins) || 0),
        subs: Number(subs) || 0,
        rpm: v > 0 && hasRevenue ? Math.round((revenue / v) * 1000 * 100) / 100 : 0,
      };
    });

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

    if (hasRevenue && rows.length) {
      const totalRevenue = rows.reduce((s, r) => s + (Number(r[4]) || 0), 0);
      const { error } = await supabase.from("earnings").upsert(
        {
          channel_id: "ch1",
          platform: "youtube",
          date,
          usd: Math.round(totalRevenue * 100) / 100,
          source: "youtube_analytics",
        },
        { onConflict: "channel_id,platform,date" }
      );
      if (error) return NextResponse.json({ error: "earnings: " + error.message }, { status: 500 });
      wroteEarnings = 1;
    }

    return NextResponse.json({
      ok: true,
      date,
      stats: wroteStats,
      earnings: wroteEarnings,
      revenue_included: hasRevenue,
    });
  } catch (e) {
    return NextResponse.json({ error: String((e && e.message) || e) }, { status: 500 });
  }
}
