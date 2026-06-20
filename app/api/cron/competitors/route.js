import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { COMPETITORS, SELF_HANDLE } from "@/lib/competitors";

export const dynamic = "force-dynamic";

// Daglig cron (se vercel.json, kaldt via /api/cron/daily): henter offentlige
// kanal-tal for konkurrenterne (+ vores egen kanal via YT_CHANNEL_ID) via
// YouTube Data API og upserter til competitors-tabellen.
//
// Bruger en YOUTUBE_API_KEY (offentlige data — ingen OAuth/scope nødvendig;
// channels.list med forHandle/id virker med en simpel API-nøgle). service_role.

async function fetchChannel(key, query) {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&${query}&key=${key}`;
  const r = await fetch(url);
  if (!r.ok) return { error: await r.text() };
  const j = await r.json();
  const c = (j.items || [])[0];
  if (!c) return { missing: true };
  const s = c.statistics || {};
  return {
    channel_id: c.id || null,
    name: (c.snippet && c.snippet.title) || null,
    subs: s.hiddenSubscriberCount ? null : Number(s.subscriberCount) || 0,
    views: Number(s.viewCount) || 0,
    videos: Number(s.videoCount) || 0,
  };
}

export async function GET(request) {
  const auth = request.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY mangler" }, { status: 500 });
  }
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    // Graceful: feature er valgfri og degraderer pænt indtil nøglen er sat.
    return NextResponse.json({ ok: true, reason: "YOUTUBE_API_KEY mangler", upserted: 0 });
  }

  try {
    const now = new Date().toISOString();
    const rows = [];
    const skipped = [];

    for (const c of COMPETITORS) {
      const data = await fetchChannel(key, `forHandle=${encodeURIComponent(c.handle)}`);
      if (data.error || data.missing) { skipped.push(c.handle); continue; }
      rows.push({ handle: c.handle, name: c.name || data.name, ...data, is_self: false, updated_at: now });
    }

    let selfData = null;
    if (process.env.YT_CHANNEL_ID) {
      const me = await fetchChannel(key, `id=${encodeURIComponent(process.env.YT_CHANNEL_ID)}`);
      if (!me.error && !me.missing) {
        selfData = me;
        rows.push({ handle: SELF_HANDLE, name: me.name || "Paper Empires", ...me, is_self: true, updated_at: now });
      }
    }

    if (!rows.length) {
      return NextResponse.json({ ok: true, upserted: 0, skipped });
    }

    const admin = createAdminClient();
    const { error } = await admin.from("competitors").upsert(rows, { onConflict: "handle" });
    if (error) return NextResponse.json({ error: "competitors: " + error.message }, { status: 500 });

    // Daglig tidsserie til Udvikling-graferne: kanal-totaler (subs/views/videoer)
    // + dagens omkostning → channel_daily. YouTube Data API giver kun et øjebliks-
    // billede, så vi MÅ snapshotte dagligt for at bygge subs/views-historik.
    try {
      const today = now.slice(0, 10);
      const { data: costRows } = await admin.from("costlog").select("usd_cost").gte("ts", today + "T00:00:00.000Z");
      const costToday = Math.round((costRows || []).reduce((a, r) => a + (Number(r.usd_cost) || 0), 0) * 10000) / 10000;
      const snap = { date: today, cost_usd: costToday };
      if (selfData) { snap.subs = selfData.subs; snap.views = selfData.views; snap.videos = selfData.videos; }
      await admin.from("channel_daily").upsert(snap, { onConflict: "date" });
    } catch (e) { /* snapshot er best-effort — bryder ikke competitors-opdateringen */ }

    return NextResponse.json({ ok: true, upserted: rows.length, skipped });
  } catch (e) {
    return NextResponse.json({ error: String((e && e.message) || e) }, { status: 500 });
  }
}
