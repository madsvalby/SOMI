// Northgate Automation — self-hosted automation canvas mockup.
// Server-komponent: ren CSS/SVG, ingen JS-runtime. Scoped <style> m. unikt prefix "automationm-".
// Arver per-side accent via var(--accent). REDIGÉR ALDRIG imperium.css.
export default function AutomationMockup() {
  return (
    <div className="automationm-wrap">
      <style dangerouslySetInnerHTML={{ __html: `
        .automationm-wrap { width: 100%; max-width: 460px; margin-left: auto; }
        .automationm-frame { background: var(--panel); border: 1px solid var(--line); border-radius: 16px; overflow: hidden; box-shadow: 0 40px 80px -40px rgba(0,0,0,0.9); }
        .automationm-bar { display: flex; align-items: center; gap: 7px; padding: 10px 13px; background: var(--panel-2); border-bottom: 1px solid var(--line-soft); }
        .automationm-dot { width: 10px; height: 10px; border-radius: 50%; }
        .automationm-url { font-family: var(--mono); font-size: 10.5px; color: var(--faint); margin-left: 6px; display: flex; align-items: center; gap: 5px; }
        .automationm-badge { margin-left: auto; display: inline-flex; align-items: center; gap: 5px; font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent); border: 1px solid color-mix(in srgb, var(--accent) 45%, var(--line)); background: var(--accent-soft); padding: 3px 8px; border-radius: 999px; white-space: nowrap; }
        .automationm-body { padding: 16px; }
        .automationm-canvas { position: relative; border: 1px solid var(--line-soft); border-radius: 12px; background:
            radial-gradient(420px 200px at 80% -20%, var(--glow), transparent 60%),
            linear-gradient(var(--line-soft) 1px, transparent 1px) 0 0 / 22px 22px,
            linear-gradient(90deg, var(--line-soft) 1px, transparent 1px) 0 0 / 22px 22px,
            var(--ink);
          padding: 14px; overflow: hidden; }
        .automationm-svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
        .automationm-flow { position: relative; display: flex; flex-direction: column; gap: 13px; z-index: 1; }
        .automationm-node { display: inline-flex; align-items: center; gap: 9px; align-self: flex-start; background: var(--panel); border: 1px solid var(--line); border-radius: 11px; padding: 9px 12px; min-width: 150px; box-shadow: 0 8px 20px -14px rgba(0,0,0,0.9); }
        .automationm-node.r1 { margin-left: 0; }
        .automationm-node.r2 { margin-left: 44px; }
        .automationm-node.r3 { margin-left: 14px; }
        .automationm-node.r4 { margin-left: 58px; }
        .automationm-node.pulse { border-color: color-mix(in srgb, var(--accent) 55%, var(--line)); animation: automationm-pulse 2.2s ease-in-out infinite; }
        .automationm-ic { width: 26px; height: 26px; border-radius: 8px; display: grid; place-items: center; flex-shrink: 0; color: var(--accent); background: var(--accent-soft); }
        .automationm-ic svg { display: block; }
        .automationm-nlabel { display: flex; flex-direction: column; line-height: 1.2; }
        .automationm-nlabel b { font-size: 12.5px; color: var(--bone); font-weight: 600; }
        .automationm-nlabel span { font-family: var(--mono); font-size: 9px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--faint); margin-top: 2px; }
        .automationm-edge { stroke: var(--line); stroke-width: 1.6; fill: none; }
        .automationm-edge.active { stroke: var(--accent); stroke-width: 2; stroke-dasharray: 6 5; animation: automationm-dash 0.9s linear infinite; filter: drop-shadow(0 0 4px var(--glow)); }
        .automationm-kpi { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
        .automationm-chip { flex: 1; min-width: 96px; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); padding: 9px 11px; }
        .automationm-chip .v { font-family: var(--serif); font-size: 17px; font-weight: 600; color: var(--bone); letter-spacing: -0.01em; }
        .automationm-chip .v.accent { color: var(--accent); }
        .automationm-chip .l { font-size: 9.5px; color: var(--faint); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.05em; }
        @keyframes automationm-dash { to { stroke-dashoffset: -22; } }
        @keyframes automationm-pulse {
          0%, 100% { box-shadow: 0 8px 20px -14px rgba(0,0,0,0.9), 0 0 0 0 var(--glow); }
          50% { box-shadow: 0 8px 20px -14px rgba(0,0,0,0.9), 0 0 0 6px transparent; border-color: var(--accent); }
        }
        @media (max-width: 540px) {
          .automationm-wrap { max-width: 100%; }
          .automationm-node { min-width: 0; }
          .automationm-node.r2 { margin-left: 26px; }
          .automationm-node.r3 { margin-left: 10px; }
          .automationm-node.r4 { margin-left: 36px; }
          .automationm-nlabel span { display: none; }
          .automationm-chip .l { font-size: 8.5px; }
        }
      ` }} />

      <div className="automationm-frame">
        <div className="automationm-bar">
          <span className="automationm-dot" style={{ background: "#FF5F57" }} />
          <span className="automationm-dot" style={{ background: "#FEBC2E" }} />
          <span className="automationm-dot" style={{ background: "#28C840" }} />
          <span className="automationm-url">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
              <rect x="4" y="11" width="16" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            n8n.northgate.internal
          </span>
          <span className="automationm-badge">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
              <rect x="4" y="11" width="16" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            on your server
          </span>
        </div>

        <div className="automationm-body">
          <div className="automationm-canvas">
            {/* bezier-forbindelser bag noderne */}
            <svg className="automationm-svg" viewBox="0 0 400 230" preserveAspectRatio="none" aria-hidden="true">
              {/* Webhook → Enrich (aktiv "marching ants") */}
              <path className="automationm-edge active" d="M60 40 C 60 70, 150 60, 150 92" />
              {/* Enrich → Classify */}
              <path className="automationm-edge" d="M150 118 C 150 142, 92 140, 92 162" />
              {/* Classify → CRM */}
              <path className="automationm-edge" d="M92 188 C 92 208, 210 206, 210 230" />
            </svg>

            <div className="automationm-flow">
              <div className="automationm-node r1">
                <span className="automationm-ic">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <path d="M5 12h6m0 0 4-7m-4 7 4 7m0-7h4" />
                    <circle cx="5" cy="12" r="2" />
                  </svg>
                </span>
                <span className="automationm-nlabel"><b>Webhook</b><span>Trigger</span></span>
              </div>

              <div className="automationm-node r2 pulse">
                <span className="automationm-ic">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <path d="M12 3v3m0 12v3M3 12h3m12 0h3" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </span>
                <span className="automationm-nlabel"><b>Enrich</b><span>AI</span></span>
              </div>

              <div className="automationm-node r3">
                <span className="automationm-ic">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <path d="M4 6h16M7 12h10m-7 6h4" />
                  </svg>
                </span>
                <span className="automationm-nlabel"><b>Classify</b><span>Route</span></span>
              </div>

              <div className="automationm-node r4">
                <span className="automationm-ic">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <path d="M4 7c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3Z" />
                    <path d="M4 7v10c0 1.7 3.6 3 8 3s8-1.3 8-3V7" />
                    <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
                  </svg>
                </span>
                <span className="automationm-nlabel"><b>CRM</b><span>Sync</span></span>
              </div>
            </div>
          </div>

          <div className="automationm-kpi">
            <div className="automationm-chip">
              <div className="v">1,240</div>
              <div className="l">Leads qualified</div>
            </div>
            <div className="automationm-chip">
              <div className="v">86</div>
              <div className="l">Hours saved/mo</div>
            </div>
            <div className="automationm-chip">
              <div className="v accent">€0</div>
              <div className="l">Cost per task</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
