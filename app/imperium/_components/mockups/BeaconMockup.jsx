// Beacon — AI-citation tracker dashboard mockup. Server component, pure CSS/SVG, no JS runtime.
// Scoped styles prefixed "beaconm-". Uses var(--accent) so it inherits the per-page accent.
export default function BeaconMockup() {
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
        .beaconm-body { padding: 16px; }

        .beaconm-top { display: grid; grid-template-columns: 132px 1fr; gap: 16px; }

        .beaconm-card-label {
          font-family: var(--mono); font-size: 9.5px; letter-spacing: .08em;
          text-transform: uppercase; color: var(--faint); margin-bottom: 8px;
        }
        .beaconm-gauge { position: relative; text-align: center; }
        .beaconm-gauge svg { display: block; }
        .beaconm-arc {
          stroke-dasharray: ${dash} ${CIRC};
          animation: beaconm-draw 1.4s ease-out forwards;
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
        .beaconm-gauge-sub {
          font-size: 10px; color: var(--dim); margin-top: 2px;
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
          transform-origin: left; animation: beaconm-grow 1.1s ease-out forwards;
        }
        .beaconm-fill.you { background: var(--accent); }
        @keyframes beaconm-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .beaconm-sov-pct {
          font-family: var(--mono); font-size: 10.5px; color: var(--dim);
          text-align: right;
        }
        .beaconm-sov-pct.you { color: var(--accent); }

        .beaconm-engines {
          margin-top: 16px; border-top: 1px solid var(--line-soft); padding-top: 14px;
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
        .beaconm-alert-ic { color: #E6B860; font-size: 13px; line-height: 1.3; flex-shrink: 0; }
        .beaconm-alert-txt { font-size: 11px; color: var(--dim); line-height: 1.45; }
        .beaconm-alert-txt b { color: var(--bone); font-weight: 600; }
        .beaconm-fix { color: var(--accent); font-weight: 600; }

        @media (max-width: 420px) {
          .beaconm-top { grid-template-columns: 1fr; }
          .beaconm-eng-row { grid-template-columns: 70px 46px 1fr; }
        }
      ` }} />

      <div className="beaconm-frame">
        <div className="beaconm-bar">
          <span className="beaconm-dot" style={{ background: "#FF5F57" }} />
          <span className="beaconm-dot" style={{ background: "#FEBC2E" }} />
          <span className="beaconm-dot" style={{ background: "#28C840" }} />
          <span className="beaconm-url">beacon.app/dashboard</span>
        </div>

        <div className="beaconm-body">
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
                <div className="beaconm-gauge-val">34%</div>
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
