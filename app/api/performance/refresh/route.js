import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { SELF_HANDLE } from "@/lib/competitors";

export const dynamic = "force-dynamic";

// Manuel opdatering fra Udvikling-fanen (POST). Session-gated: kun den
// indloggede bruger kan kalde den. Henter kanalens aktuelle subs/views/videoer
// via YouTube Data API (real-time, ingen analytics-lag) og upserter dagens
// channel_daily-snapshot — samme kilde som den daglige competitors-cron, så
// graferne kan friskes på kommando i stedet for kun 1×/dag.

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const key = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YT_CHANNEL_ID;
  if (!key || !channelId) {
    return NextResponse.json({ error: "YOUTUBE_API_KEY/YT_CHANNEL_ID mangler" }, { status: 500 });
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY mangler" }, { status: 500 });
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${encodeURIComponent(channelId)}&key=${key}`;
    const r = await fetch(url);
    if (!r.ok) return NextResponse.json({ error: "yt: " + (await r.text()) }, { status: 502 });
    const j = await r.json();
    const c = (j.items || [])[0];
    if (!c) return NextResponse.json({ error: "kanal ikke fundet" }, { status: 404 });
    const s = c.statistics || {};
    const name = (c.snippet && c.snippet.title) || "Paper Empires";
    const subs = s.hiddenSubscriberCount ? null : Number(s.subscriberCount) || 0;
    const views = Number(s.viewCount) || 0;
    const videos = Number(s.videoCount) || 0;

    const now = new Date().toISOString();
    const today = now.slice(0, 10);
    const admin = createAdminClient();

    // Dagens omkostning til snapshottet (samme som competitors-cron)
    const { data: costRows } = await admin
      .from("costlog").select("usd_cost").gte("ts", today + "T00:00:00.000Z");
    const costToday = Math.round((costRows || []).reduce((a, x) => a + (Number(x.usd_cost) || 0), 0) * 10000) / 10000;

    const snap = { date: today, subs, views, videos, cost_usd: costToday };
    const { error } = await admin.from("channel_daily").upsert(snap, { onConflict: "date" });
    if (error) return NextResponse.json({ error: "channel_daily: " + error.message }, { status: 500 });

    // Hold også Overblik (competitors self-række) i sync — ellers læser Overblik
    // og Udvikling to forskellige tabeller og Overblik bliver hængende indtil den
    // daglige competitors-cron kører. Best-effort: bryder ikke channel_daily-svaret.
    await admin.from("competitors").upsert(
      { handle: SELF_HANDLE, name, channel_id: channelId, subs, views, videos, is_self: true, updated_at: now },
      { onConflict: "handle" }
    );

    return NextResponse.json({ ok: true, refreshedAt: now, snapshot: { date: today, subs, views, videos } });
  } catch (e) {
    return NextResponse.json({ error: String((e && e.message) || e) }, { status: 500 });
  }
}
