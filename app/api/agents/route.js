import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Live agent-status: henter n8n-executions via n8n's public API og mapper dem pr.
// workflow, så Agenter-fanen kan vise rigtig status (kører/ok/fejlet) + sidste kørsel
// + success-rate i stedet for demo-data.
//
// Kræver env N8N_API_KEY (oprettes i n8n → Settings → n8n API). Mangler nøglen,
// returneres hasLive:false og UI'et falder tilbage til demo-status (intet brydes).

function mapStatus(ex) {
  const s = ex.status;
  if (s === "running" || s === "new" || s === "waiting") return "running";
  if (s === "error" || s === "crashed" || s === "canceled") return "failed";
  if (s === "success") return "ok";
  if (ex.finished === false && !ex.stoppedAt) return "running";
  if (ex.finished === true) return "ok";
  return "idle";
}

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const key = process.env.N8N_API_KEY;
  const base = process.env.N8N_BASE_URL || "https://madsvalby.app.n8n.cloud";
  if (!key) return NextResponse.json({ hasLive: false, reason: "N8N_API_KEY mangler" });

  let executions = [];
  try {
    const res = await fetch(`${base}/api/v1/executions?limit=250&includeData=false`, {
      headers: { "X-N8N-API-KEY": key, accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return NextResponse.json({ hasLive: false, reason: `n8n API ${res.status}` });
    const json = await res.json();
    executions = json.data || [];
  } catch (e) {
    return NextResponse.json({ hasLive: false, reason: "n8n API utilgængelig" });
  }

  // Grupper pr. workflow
  const byWorkflow = {};
  for (const ex of executions) {
    const wf = ex.workflowId;
    if (!wf) continue;
    if (!byWorkflow[wf]) byWorkflow[wf] = { runs: [] };
    byWorkflow[wf].runs.push(ex);
  }

  const out = {};
  for (const [wf, g] of Object.entries(byWorkflow)) {
    const runs = g.runs
      .slice()
      .sort((a, b) => String(b.startedAt || "").localeCompare(String(a.startedAt || "")));
    const last = runs[0];
    const terminal = runs.filter((r) => ["success", "error", "crashed", "canceled"].includes(r.status));
    const ok = terminal.filter((r) => r.status === "success").length;
    out[wf] = {
      status: last ? mapStatus(last) : "idle",
      lastRun: last ? last.startedAt || last.stoppedAt || null : null,
      successRate: terminal.length ? Math.round((ok / terminal.length) * 100) : null,
      total: runs.length,
    };
  }

  return NextResponse.json({ hasLive: true, generatedAt: new Date().toISOString(), byWorkflow: out });
}
