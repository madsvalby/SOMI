"use client";

// Beacon — AI-citation tracker dashboard mockup. Client component for a one-shot "run a query" demo.
// Scoped styles prefixed "beaconm-". Uses var(--accent) so it inherits the per-page accent.
// Idle (run===0): the full dashboard sits calm and finished. Clicking "Run a query" remounts the
// animated body (key={run}) so the whole sequence replays from scratch and ends in the same state.
import { useState } from "react";

export default function BeaconMockup() {
  const [run, setRun] = useState(0);

  // Gauge arc geometry (semi-circle, 34% citation rate).
  const R = 52;
  const CIRC = Math.PI * R; // half-circle length
  const PCT = 0.34;
  const dash = CIRC * PCT;

  const sov = [
    { name: "You", pct: 34, you: true },
    { name: "Rivalo", pct: 27 },
    { name: "Northpeak", pct: 21 },
    { name: "Vexa", pct: 18 },
  ];

  const engines = [
    { name: "ChatGPT", pct: "41%", pts: "0,9 8,7 16,8 24,4 32,5 40,2 48,1" },
    { name: "Gemini", pct: "28%", pts: "0,8 8,8 16,5 24,6 32,4 40,5 48,3" },
    { name: "Perplexity", pct: "19%", pts: "0,7 8,6 16,7 24,5 32,6 40,4 48,4" },
    { name: "Google AIO", pct: "12%", pts: "0,9 8,8 16,9 24,7 32,8 40,6 48,6" },
  ];

  // Idle vs. running. `running` only flips the body into its keyframe-driven sequence.
  const running = run > 0;

  return (
    <div className="beaconm-wrap">
      <style dangerouslySetInnerHTML={{ __html: `
        .beaconm-wrap { max-width: 440px; margin: 0 auto; }
        .beaconm-frame {
          background: var(--panel); border: 1px solid var(--line);
          border-radius: 16px; overflow: hidden;
          box-shadow: 0 40px 80px -40px rgba(0,0,0,0.9);
        }
        .beaconm-bar {
          display: flex; align-items: center; gap: 7px;
          padding: 11px 14px; background: var(--panel-2);
          border-bottom: 1px solid var(--line-soft);
        }
        .beaconm-dot { width: 10px; height: 10px; border-radius: 50%; }
        .beaconm-url {
          font-family: var(--mono); font-size: 11px;
          color: var(--faint); margin-left: 8px;
        }
        .beaconm-runbtn { margin-left: auto; }
        .beaconm-body { padding: 16px; position: relative; }

        /* Prompt overlay — reserves no layout space (absolutely positioned), fades+types in then out. */
        .beaconm-prompt {
          position: absolute; top: 8px; left: 16px; right: 16px; z-index: 3;
          display: flex; align-items: center; gap: 8px;
          padding: 9px 12px; border-radius: 10px;
          background: color-mix(in srgb, var(--panel-2) 92%, var(--accent));
          border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--line));
          box-shadow: 0 14px 30px -18px rgba(0,0,0,0.9);
          opacity: 0; pointer-events: none;
        }
        .beaconm-running .beaconm-prompt {
          animation: beaconm-prompt-life 2.1s ease-out forwards;
        }
        .beaconm-prompt-ic {
          font-family: var(--mono); font-size: 12px; color: var(--accent); flex-shrink: 0;
        }
        .beaconm-prompt-txt {
          font-family: var(--mono); font-size: 11.5px; color: var(--bone);
          white-space: nowrap; overflow: hidden; max-width: 0;
        }
        .beaconm-running .beaconm-prompt-txt {
          animation: beaconm-type 1.1s steps(22, end) 0.15s forwards;
          border-right: 1.5px solid var(--accent);
        }
        @keyframes beaconm-prompt-life {
          0%   { opacity: 0; transform: translateY(-4px); }
          12%  { opacity: 1; transform: translateY(0); }
          78%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-4px); }
        }
        @keyframes beaconm-type {
          from { max-width: 0; }
          to   { max-width: 100%; }
        }

        .beaconm-top { display: grid; grid-template-columns: 132px 1fr; gap: 16px; }

        .beaconm-card-label {
          font-family: var(--mono); font-size: 9.5px; letter-spacing: .08em;
          text-transform: uppercase; color: var(--faint); margin-bottom: 8px;
        }
        .beaconm-gauge { position: relative; text-align: center; }
        .beaconm-gauge svg { display: block; }

        /* Idle: arc already drawn to its final length, no animation. */
        .beaconm-arc { stroke-dasharray: ${dash} ${CIRC}; }
        .beaconm-running .beaconm-arc {
          animation: beaconm-draw 1.4s ease-out 1.15s backwards;
        }
        @keyframes beaconm-draw {
          from { stroke-dasharray: 0 ${CIRC}; }
          to   { stroke-dasharray: ${dash} ${CIRC}; }
        }
        .beaconm-gauge-val {
          position: absolute; left: 0; right: 0; top: 44px;
          font-family: var(--serif); font-weight: 700; font-size: 26px;
          color: var(--bone); line-height: 1;
        }
        /* Count-up using an animatable custom property fed into a CSS counter.
           Fallback: where @property is unsupported, the static <span> "34" simply stays. */
        @property --beaconm-n {
          syntax: "<integer>"; initial-value: 34; inherits: false;
        }
        .beaconm-running .beaconm-gauge-val .beaconm-count {
          /* Hide the literal text; show the animated counter via ::after instead.
             The var() carries an explicit 34 fallback so that where @property is
             NOT registered, counter-reset stays valid and the counter resolves to
             34 (a static final value) rather than an invalid/0 reading. */
          font-size: 0;
          counter-reset: beaconm-n var(--beaconm-n, 34);
          animation: beaconm-tick 1.3s cubic-bezier(.2,.7,.2,1) 1.15s backwards;
        }
        .beaconm-running .beaconm-gauge-val .beaconm-count::after {
          content: counter(beaconm-n);
          font-size: 26px;
        }
        @keyframes beaconm-tick {
          from { --beaconm-n: 0; }
          to   { --beaconm-n: 34; }
        }
        .beaconm-gauge-sub {
          font-size: 10px; color: var(--dim); margin-top: 2px;
        }
        .beaconm-running .beaconm-gauge-sub {
          animation: beaconm-fade-in 0.4s ease-out 2.5s backwards;
        }

        .beaconm-sov-row {
          display: grid; grid-template-columns: 64px 1fr 30px;
          align-items: center; gap: 8px; margin-bottom: 9px;
        }
        .beaconm-sov-name { font-size: 11px; color: var(--dim); }
        .beaconm-sov-name.you { color: var(--bone); font-weight: 600; }
        .beaconm-track {
          height: 7px; border-radius: 4px; background: var(--line); overflow: hidden;
        }
        .beaconm-fill {
          height: 100%; border-radius: 4px;
          background: color-mix(in srgb, var(--accent) 28%, var(--line));
          transform-origin: left;
        }
        .beaconm-fill.you { background: var(--accent); }
        /* Idle: bars already grown. Running: stagger them in after the gauge. */
        .beaconm-running .beaconm-fill {
          animation: beaconm-grow 1.1s ease-out backwards;
        }
        .beaconm-running .beaconm-sov-row:nth-child(2) .beaconm-fill { animation-delay: 1.6s; }
        .beaconm-running .beaconm-sov-row:nth-child(3) .beaconm-fill { animation-delay: 1.75s; }
        .beaconm-running .beaconm-sov-row:nth-child(4) .beaconm-fill { animation-delay: 1.9s; }
        .beaconm-running .beaconm-sov-row:nth-child(5) .beaconm-fill { animation-delay: 2.05s; }
        @keyframes beaconm-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .beaconm-sov-pct {
          font-family: var(--mono); font-size: 10.5px; color: var(--dim);
          text-align: right;
        }
        .beaconm-sov-pct.you { color: var(--accent); }

        .beaconm-engines {
          margin-top: 16px; border-top: 1px solid var(--line-soft); padding-top: 14px;
        }
        .beaconm-running .beaconm-engines {
          animation: beaconm-fade-in 0.5s ease-out 2.3s backwards;
        }
        .beaconm-eng-row {
          display: grid; grid-template-columns: 78px 52px 1fr;
          align-items: center; gap: 10px; padding: 5px 0;
        }
        .beaconm-eng-name { font-size: 11.5px; color: var(--bone); }
        .beaconm-eng-pct {
          font-family: var(--mono); font-size: 11px; color: var(--accent);
        }
        .beaconm-spark { width: 100%; height: 16px; }

        .beaconm-alert {
          margin-top: 14px; display: flex; gap: 9px; align-items: flex-start;
          padding: 10px 12px; border-radius: 10px;
          background: color-mix(in srgb, #E0A34E 12%, transparent);
          border: 1px solid color-mix(in srgb, #E0A34E 38%, var(--line));
        }
        /* Idle: alert sits in place. Running: slide it in last. */
        .beaconm-running .beaconm-alert {
          animation: beaconm-slide-in 0.55s cubic-bezier(.2,.8,.2,1) 2.7s backwards;
        }
        .beaconm-alert-ic { color: #E6B860; font-size: 13px; line-height: 1.3; flex-shrink: 0; }
        .beaconm-alert-txt { font-size: 11px; color: var(--dim); line-height: 1.45; }
        .beaconm-alert-txt b { color: var(--bone); font-weight: 600; }
        .beaconm-fix { color: var(--accent); font-weight: 600; }

        @keyframes beaconm-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes beaconm-slide-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 420px) {
          .beaconm-top { grid-template-columns: 1fr; }
          .beaconm-eng-row { grid-template-columns: 70px 46px 1fr; }
        }

        /* Respect reduced-motion: kill every demo animation, land on the final state instantly. */
        @media (prefers-reduced-motion: reduce) {
          .beaconm-running .beaconm-prompt { display: none; }
          .beaconm-arc,
          .beaconm-running .beaconm-arc,
          .beaconm-running .beaconm-prompt-txt,
          .beaconm-running .beaconm-gauge-val .beaconm-count,
          .beaconm-running .beaconm-gauge-sub,
          .beaconm-running .beaconm-fill,
          .beaconm-running .beaconm-engines,
          .beaconm-running .beaconm-alert {
            animation: none !important;
          }
          /* Show the plain "34" text, not the counter pseudo-element. */
          .beaconm-running .beaconm-gauge-val .beaconm-count { font-size: 26px; }
          .beaconm-running .beaconm-gauge-val .beaconm-count::after { content: none; }
        }
      ` }} />

      <div className="beaconm-frame">
        <div className="beaconm-bar">
          <span className="beaconm-dot" style={{ background: "#FF5F57" }} />
          <span className="beaconm-dot" style={{ background: "#FEBC2E" }} />
          <span className="beaconm-dot" style={{ background: "#28C840" }} />
          <span className="beaconm-url">beacon.app/dashboard</span>
          <button
            type="button"
            className="pe-demo-btn beaconm-runbtn"
            aria-label="Run a sample AI-visibility query to replay the dashboard"
            onClick={() => setRun((r) => r + 1)}
          >
            ▶ Run a query
          </button>
        </div>

        {/* Animated body — remounted on each run via key so the one-shot sequence replays. */}
        <div
          key={run}
          className={"beaconm-body" + (running ? " beaconm-running" : "")}
        >
          {/* Sample-prompt overlay (only meaningful while running; absolutely positioned → no layout shift). */}
          {running && (
            <div className="beaconm-prompt" aria-hidden="true">
              <span className="beaconm-prompt-ic">›_</span>
              <span className="beaconm-prompt-txt">best AI-visibility tool?</span>
            </div>
          )}

          <div className="beaconm-top">
            {/* Citation rate gauge */}
            <div>
              <div className="beaconm-card-label">Citation rate</div>
              <div className="beaconm-gauge">
                <svg viewBox="0 0 124 70" width="124" height="70">
                  <path
                    d="M 10 62 A 52 52 0 0 1 114 62"
                    fill="none"
                    stroke="var(--line)"
                    strokeWidth="9"
                    strokeLinecap="round"
                  />
                  <path
                    className="beaconm-arc"
                    d="M 10 62 A 52 52 0 0 1 114 62"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="9"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="beaconm-gauge-val">
                  <span className="beaconm-count">34</span>%
                </div>
                <div className="beaconm-gauge-sub">+6 pts / 30d</div>
              </div>
            </div>

            {/* Share of voice */}
            <div>
              <div className="beaconm-card-label">Share of voice</div>
              {sov.map((s) => (
                <div className="beaconm-sov-row" key={s.name}>
                  <span className={"beaconm-sov-name" + (s.you ? " you" : "")}>
                    {s.name}
                  </span>
                  <span className="beaconm-track">
                    <span
                      className={"beaconm-fill" + (s.you ? " you" : "")}
                      style={{ width: s.pct + "%" }}
                    />
                  </span>
                  <span className={"beaconm-sov-pct" + (s.you ? " you" : "")}>
                    {s.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Engine breakdown with sparklines */}
          <div className="beaconm-engines">
            <div className="beaconm-card-label">Citations by engine</div>
            {engines.map((e) => (
              <div className="beaconm-eng-row" key={e.name}>
                <span className="beaconm-eng-name">{e.name}</span>
                <span className="beaconm-eng-pct">{e.pct}</span>
                <svg className="beaconm-spark" viewBox="0 0 48 12" preserveAspectRatio="none">
                  <polyline
                    points={e.pts}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.85"
                  />
                </svg>
              </div>
            ))}
          </div>

          {/* Brand-accuracy alert */}
          <div className="beaconm-alert">
            <span className="beaconm-alert-ic">⚠</span>
            <span className="beaconm-alert-txt">
              <b>ChatGPT</b> says you were founded 2019 — actual 2021 ·{" "}
              <span className="beaconm-fix">fix source</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
