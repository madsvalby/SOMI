import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeWinnerLoop } from "@/lib/winnerLoop";
import {
  buildWinnerPrompt, parseIdeasFromText, anthropicText, buildIdeaRows, WINNER_SOURCE,
} from "@/lib/ideas";

export const dynamic = "force-dynamic";

// Auto-idé-loop (ugentlig cron, se vercel.json). Lukker loop'en automatisk:
//   stats_daily + videos → winner-loop → Claude → ideas-tabel (status='proposed').
// Skrives med service_role (RLS bypass). Forslag auto-produceres IKKE — Mads
// godkender dem. No-op hvis der endnu ikke er views (kanalen er ny) eller hvis
// ANTHROPIC_API_KEY mangler, så cron'en aldrig fejler støjende.

export async function GET(request) {
  const auth = request.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY mangler" }, { status: 500 });
  }

  const admin = createAdminClient();

  try {
    const [statsR, videosR] = await Promise.all([
      admin.from("stats_daily").select("video_id,date,views,watch_time,subs,rpm"),
      admin.from("videos").select("video_id,case_id,title,status,channel_id,created_at"),
    ]);

    const loop = computeWinnerLoop({ stats: statsR.data || [], videos: videosR.data || [] });
    if (!loop.hasData || !loop.winners.length) {
      return NextResponse.json({ ok: true, reason: "ingen winner-signal endnu", inserted: 0 });
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ ok: true, reason: "ANTHROPIC_API_KEY mangler", inserted: 0 });
    }

    const prompt = buildWinnerPrompt({
      titles: loop.winners.map((w) => w.title),
      themes: (loop.winnerPattern?.themes || []).map((t) => t.word),
    });

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!r.ok) {
      return NextResponse.json({ error: "anthropic: " + (await r.text()) }, { status: 502 });
    }
    const raw = parseIdeasFromText(anthropicText(await r.json()));
    if (!raw.length) {
      return NextResponse.json({ ok: true, reason: "ingen brugbare forslag", inserted: 0 });
    }

    const { data: existing, error: readErr } = await admin.from("ideas").select("title");
    if (readErr) return NextResponse.json({ error: readErr.message }, { status: 500 });

    const { rows, skipped } = buildIdeaRows(raw, (existing || []).map((e) => e.title), {
      source: WINNER_SOURCE,
      basePriority: 50,
    });
    if (!rows.length) {
      return NextResponse.json({ ok: true, inserted: 0, skipped });
    }

    const { data: inserted, error: insErr } = await admin.from("ideas").insert(rows).select("id");
    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });

    return NextResponse.json({
      ok: true,
      inserted: (inserted || []).length,
      skipped,
      generatedAt: loop.generatedAt,
    });
  } catch (e) {
    return NextResponse.json({ error: String((e && e.message) || e) }, { status: 500 });
  }
}
