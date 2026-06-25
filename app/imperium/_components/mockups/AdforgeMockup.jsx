"use client";
// AdForge "hook-matrix" mockup — interaktiv shuffle (re-staggrer + flytter winners).
// Scoped <style> med unikt prefix "adforgem-". Arver --accent fra siden.
import { useState } from "react";

// Basis-cellerne (hook + grund-metrik). Winner-status + winner-metrikker
// beregnes pr. run, så "overproducér og find vindere" føles levende.
const BASE = [
  { hook: "POV: you found it", ctr: "2.1%", cpa: "-31%" },
  { hook: "I was skeptical until…", ctr: "1.9%", cpa: "-24%" },
  { hook: "3 reasons you need this", ctr: "1.4%", cpa: "-12%" },
  { hook: "Stop scrolling", ctr: "2.4%", cpa: "-29%" },
  { hook: "POV: you found it", ctr: "2.0%", cpa: "-33%" },
  { hook: "I was skeptical until…", ctr: "1.6%", cpa: "-18%" },
  { hook: "3 reasons you need this", ctr: "1.7%", cpa: "-21%" },
  { hook: "Stop scrolling", ctr: "1.5%", cpa: "-15%" },
  { hook: "POV: you found it", ctr: "2.2%", cpa: "-27%" },
];

// Winner-par pr. run-rotation. Run 0 = hvile-look (celle 1 & 4 — samme som før).
const WINNER_PAIRS = [
  [1, 4],
  [3, 8],
  [0, 6],
  [2, 7],
  [5, 1],
  [8, 3],
];

// Vindende celler får et løft i tallene, så CTR/CPA visuelt "flytter sig".
const WIN_METRICS = [
  { ctr: "3.0%", cpa: "-38%" },
  { ctr: "2.8%", cpa: "-41%" },
  { ctr: "3.2%", cpa: "-36%" },
  { ctr: "2.9%", cpa: "-44%" },
];

export default function AdforgeMockup() {
  const [run, setRun] = useState(0);

  const pair = WINNER_PAIRS[run % WINNER_PAIRS.length];
  const cells = BASE.map((c, idx) => {
    const winSlot = pair.indexOf(idx);
    if (winSlot === -1) return { ...c, win: false };
    const m = WIN_METRICS[(run + winSlot) % WIN_METRICS.length];
    // Hvile-look (run 0) bevarer de oprindelige tal på winner-cellerne.
    return run === 0
      ? { ...c, win: true }
      : { ...c, win: true, ctr: m.ctr, cpa: m.cpa };
  });

  return (
    <div className="adforgem-wrap pe-float">
      <div className="pe-frame">
        <div className="pe-frame-bar">
          <span className="pe-frame-dot" style={{ background: "#E5534B" }} />
          <span className="pe-frame-dot" style={{ background: "#E8B84B" }} />
          <span className="pe-frame-dot" style={{ background: "#3FA66A" }} />
          <span className="pe-frame-url">adforge.studio/matrix</span>
          <button
            type="button"
            className="pe-demo-btn adforgem-trigger"
            onClick={() => setRun((r) => r + 1)}
            aria-label="Shuffle ad variants and re-pick winners"
          >
            ▶ Shuffle variants
          </button>
        </div>
        <div className="pe-frame-body adforgem-body">
          <div className="adforgem-filters">
            <span className="adforgem-chip adforgem-chip--on">Hook</span>
            <span className="adforgem-chip">Angle</span>
            <span className="adforgem-chip">CTA</span>
            <span className="adforgem-chip">Language</span>
            <span className="adforgem-compliance">AI-disclosed · C2PA</span>
          </div>

          <div className="adforgem-grid" key={run}>
            {cells.map((c, idx) => (
              <div
                key={idx}
                className={"adforgem-cell" + (c.win ? " adforgem-cell--win" : "")}
                style={{ "--d": idx * 0.06 + "s" }}
              >
                <div className="adforgem-caption">{c.hook}</div>
                <div className="adforgem-presenter" />
                {c.win && <div className="adforgem-winner">WINNER</div>}
                <div className="adforgem-metrics">
                  <span>CTR {c.ctr}</span>
                  <span className="adforgem-cpa">CPA {c.cpa}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .adforgem-wrap { width: 100%; max-width: 440px; margin: 0 auto; }
        .adforgem-body { padding: 16px; }

        .adforgem-trigger { margin-left: 10px; }

        .adforgem-filters {
          display: flex; align-items: center; gap: 8px;
          flex-wrap: wrap; margin-bottom: 14px;
        }
        .adforgem-chip {
          font-family: var(--mono); font-size: 10px; letter-spacing: 0.06em;
          text-transform: uppercase; padding: 4px 10px; border-radius: 999px;
          border: 1px solid var(--line); color: var(--dim);
          background: var(--panel-2);
        }
        .adforgem-chip--on {
          color: var(--accent);
          border-color: color-mix(in srgb, var(--accent) 45%, var(--line));
          background: var(--accent-soft);
        }
        .adforgem-compliance {
          margin-left: auto; font-family: var(--mono); font-size: 9px;
          letter-spacing: 0.05em; padding: 4px 9px; border-radius: 6px;
          color: var(--accent);
          border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--line));
          background: var(--accent-soft);
          white-space: nowrap;
        }

        .adforgem-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
        }
        .adforgem-cell {
          position: relative; aspect-ratio: 9 / 16; border-radius: 10px;
          overflow: hidden; border: 1px solid var(--line);
          background: linear-gradient(180deg, var(--panel-2), var(--panel));
          opacity: 0; transform: translateY(10px) scale(0.97);
          animation: adforgem-rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: var(--d);
        }
        /* Winner-rammen toner ind, så den ikke "popper" hårdt ved shuffle. */
        .adforgem-cell--win {
          box-shadow: 0 0 0 2px var(--accent);
          border-color: transparent;
        }

        .adforgem-caption {
          position: relative; z-index: 2;
          font-size: 8.5px; font-weight: 600; line-height: 1.2;
          color: var(--bone); padding: 7px 7px 6px;
          background: linear-gradient(180deg, rgba(0,0,0,0.55), transparent);
        }
        .adforgem-presenter {
          position: absolute; inset: 0; z-index: 1;
          background:
            radial-gradient(60% 42% at 50% 34%, color-mix(in srgb, var(--accent) 55%, transparent), transparent 70%),
            radial-gradient(85% 55% at 50% 100%, color-mix(in srgb, var(--accent) 28%, transparent), transparent 72%),
            linear-gradient(180deg, #11171F, #0B0F14);
        }
        .adforgem-presenter::after {
          content: ""; position: absolute; left: 50%; top: 30%;
          width: 34%; aspect-ratio: 1; transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(circle at 50% 38%, color-mix(in srgb, var(--accent) 75%, #fff), color-mix(in srgb, var(--accent) 35%, transparent) 70%);
          filter: blur(0.5px);
        }

        .adforgem-winner {
          position: absolute; z-index: 3; top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotate(-6deg);
          font-family: var(--mono); font-size: 9px; font-weight: 700;
          letter-spacing: 0.12em; color: var(--ink);
          background: var(--accent); padding: 3px 8px; border-radius: 5px;
          box-shadow: 0 6px 16px -6px var(--glow);
          animation: adforgem-stamp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
          animation-delay: calc(var(--d) + 0.18s);
        }

        .adforgem-metrics {
          position: absolute; z-index: 2; bottom: 6px; left: 6px; right: 6px;
          display: flex; justify-content: space-between; gap: 4px;
          font-family: var(--mono); font-size: 8px; color: var(--bone);
        }
        .adforgem-metrics span {
          background: rgba(11,15,20,0.7); padding: 2px 5px; border-radius: 4px;
          backdrop-filter: blur(2px);
        }
        .adforgem-cpa { color: var(--accent); }

        @keyframes adforgem-rise {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes adforgem-stamp {
          from { opacity: 0; transform: translate(-50%, -50%) rotate(-6deg) scale(0.6); }
          to { opacity: 1; transform: translate(-50%, -50%) rotate(-6deg) scale(1); }
        }

        @media (max-width: 480px) {
          .adforgem-compliance { display: none; }
          .adforgem-grid { gap: 7px; }
          .adforgem-caption { font-size: 7.5px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .adforgem-cell {
            animation: none; opacity: 1;
            transform: translateY(0) scale(1);
          }
          .adforgem-winner { animation: none; opacity: 1; }
          .adforgem-wrap { animation: none; }
        }
      ` }} />
    </div>
  );
}
