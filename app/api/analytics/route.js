import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { computeWinnerLoop } from "@/lib/winnerLoop";

export const dynamic = "force-dynamic";

// Winner-loop (Analytics-agentens hjerne). Henter stats_daily + videos og lader
// lib/winnerLoop udlede vindere, underperformere, repurpose-kandidater, watchlist
// og winner-pattern. Samme beregning bruges af /api/cron/ideas (auto-idé-loop),
// så de aldrig kommer ud af sync. Idé-forslag fra vindere laves separat via
// /api/anthropic + /api/ideas, så denne route holder sig deterministisk og billig.

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const [statsR, videosR] = await Promise.all([
    supabase.from("stats_daily").select("video_id,date,views,watch_time,subs,rpm"),
    supabase.from("videos").select("video_id,case_id,title,status,channel_id,created_at,urls"),
  ]);

  const result = computeWinnerLoop({
    stats: statsR.data || [],
    videos: videosR.data || [],
  });

  return NextResponse.json(result);
}
