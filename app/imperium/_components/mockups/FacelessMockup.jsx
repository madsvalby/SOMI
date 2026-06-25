import { Check } from "lucide-react";

// Faceless Foundry — "production pipeline tracker" mockup.
// Ren CSS/SVG, server-komponent (ingen JS-runtime). Scoped <style>, unikt prefix "facelessm-".
// Arver per-side accent via var(--accent). REDIGÉRER ALDRIG imperium.css.
export default function FacelessMockup() {
  const stages = [
    { name: "Queued", state: "done" },
    { name: "Scripting", state: "done" },
    { name: "Human review", state: "done" },
    { name: "Voicing", state: "active" },
    { name: "Rendering", state: "soon" },
    { name: "Ready", state: "soon" },
    { name: "Delivered", state: "soon" },
  ];

  return (
    <div className="pe-frame facelessm-frame">
      <div className="pe-frame-bar">
        <span className="pe-frame-dot" style={{ background: "#FF5F57" }} />
        <span className="pe-frame-dot" style={{ background: "#FEBC2E" }} />
        <span className="pe-frame-dot" style={{ background: "#28C840" }} />
        <span className="pe-frame-url">studio · production pipeline</span>
      </div>

      <div className="pe-frame-body facelessm-body">
        <div className="facelessm-top">
          {/* Noir cinematic thumbnail-kort */}
          <div className="facelessm-thumb">
            <div className="facelessm-thumb-grain" />
            <div className="facelessm-thumb-tag">DOCUMENTARY</div>
            <div className="facelessm-thumb-title">
              The&nbsp;$47B
              <br />
              Collapse
            </div>
            <div className="facelessm-thumb-foot">
              <span className="facelessm-rec" /> 23:14 · 4K
            </div>
          </div>

          {/* Render status-kort */}
          <div className="facelessm-status">
            <div className="facelessm-status-label">NOW VOICING</div>
            <div className="facelessm-wave">
              <span /><span /><span /><span /><span /><span /><span />
            </div>
            <div className="facelessm-render">
              <div className="facelessm-render-head">
                <span>Rendering</span>
                <span className="facelessm-pct">62%</span>
              </div>
              <div className="facelessm-bar">
                <div className="facelessm-bar-fill" />
                <div className="facelessm-shimmer" />
              </div>
            </div>
          </div>
        </div>

        {/* Horisontal stepper-strip */}
        <div className="facelessm-stepper">
          {stages.map((s, i) => (
            <div key={s.name} className={"facelessm-step facelessm-" + s.state}>
              {i > 0 && <span className="facelessm-conn" aria-hidden />}
              <span className="facelessm-node">
                {s.state === "done" ? (
                  <Check size={12} strokeWidth={3} className="facelessm-check" />
                ) : s.state === "active" ? (
                  <span className="facelessm-pulse" />
                ) : (
                  <span className="facelessm-empty" />
                )}
              </span>
              <span className="facelessm-step-label">{s.name}</span>
            </div>
          ))}
        </div>

        {/* Cost-badge */}
        <div className="facelessm-badge">
          <span className="facelessm-badge-dot" />
          this video:&nbsp;
          <b>€3.10 cost</b>
          &nbsp;·&nbsp;
          <b className="facelessm-badge-accent">€50 your price</b>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .facelessm-frame { width: 100%; max-width: 440px; margin-inline: auto; }
        .facelessm-body { display: flex; flex-direction: column; gap: 18px; }

        .facelessm-top { display: grid; grid-template-columns: 132px 1fr; gap: 14px; }

        /* ── noir thumbnail ── */
        .facelessm-thumb {
          position: relative; border-radius: 12px; overflow: hidden;
          aspect-ratio: 4 / 5;
          background:
            radial-gradient(120% 80% at 25% 0%, rgba(201,161,78,0.10), transparent 55%),
            linear-gradient(165deg, #141b24 0%, #0a0e13 70%, #05080c 100%);
          border: 1px solid var(--line);
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 12px; box-shadow: inset 0 0 60px rgba(0,0,0,0.6);
        }
        .facelessm-thumb-grain {
          position: absolute; inset: 0; opacity: 0.5; mix-blend-mode: overlay;
          background-image: radial-gradient(rgba(255,255,255,0.05) 0.5px, transparent 0.5px);
          background-size: 3px 3px;
        }
        .facelessm-thumb-tag {
          position: absolute; top: 10px; left: 10px;
          font-family: var(--mono); font-size: 8px; letter-spacing: 0.18em;
          color: var(--accent); border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
          padding: 2px 5px; border-radius: 4px; background: rgba(0,0,0,0.3);
        }
        .facelessm-thumb-title {
          position: relative; font-family: var(--serif); font-weight: 600;
          font-size: 20px; line-height: 1.02; letter-spacing: -0.01em;
          color: var(--bone); text-shadow: 0 2px 18px rgba(0,0,0,0.8);
        }
        .facelessm-thumb-foot {
          position: relative; margin-top: 8px; display: flex; align-items: center; gap: 6px;
          font-family: var(--mono); font-size: 9px; color: var(--dim);
        }
        .facelessm-rec {
          width: 6px; height: 6px; border-radius: 50%; background: #FF5F57;
          box-shadow: 0 0 8px #FF5F57; animation: facelessm-blink 1.6s ease-in-out infinite;
        }

        /* ── status card ── */
        .facelessm-status {
          display: flex; flex-direction: column; justify-content: center; gap: 12px;
          background: var(--panel-2, #0d131a); border: 1px solid var(--line);
          border-radius: 12px; padding: 14px;
        }
        .facelessm-status-label {
          font-family: var(--mono); font-size: 9px; letter-spacing: 0.16em;
          color: var(--accent);
        }
        .facelessm-wave { display: flex; align-items: flex-end; gap: 3px; height: 26px; }
        .facelessm-wave span {
          width: 4px; border-radius: 2px; background: var(--accent);
          animation: facelessm-wave 1s ease-in-out infinite;
        }
        .facelessm-wave span:nth-child(1) { height: 40%; animation-delay: 0s; }
        .facelessm-wave span:nth-child(2) { height: 80%; animation-delay: .12s; }
        .facelessm-wave span:nth-child(3) { height: 55%; animation-delay: .24s; }
        .facelessm-wave span:nth-child(4) { height: 100%; animation-delay: .36s; }
        .facelessm-wave span:nth-child(5) { height: 60%; animation-delay: .48s; }
        .facelessm-wave span:nth-child(6) { height: 85%; animation-delay: .6s; }
        .facelessm-wave span:nth-child(7) { height: 45%; animation-delay: .72s; }

        .facelessm-render-head {
          display: flex; justify-content: space-between; align-items: baseline;
          font-size: 11px; color: var(--dim); margin-bottom: 5px;
        }
        .facelessm-pct { font-family: var(--mono); font-size: 10px; color: var(--bone); }
        .facelessm-bar {
          position: relative; height: 6px; border-radius: 999px;
          background: var(--line); overflow: hidden;
        }
        .facelessm-bar-fill {
          position: absolute; inset: 0 38% 0 0; border-radius: 999px;
          background: linear-gradient(90deg, color-mix(in srgb, var(--accent) 55%, transparent), var(--accent));
        }
        .facelessm-shimmer {
          position: absolute; top: 0; bottom: 0; width: 38%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent);
          animation: facelessm-shimmer 1.8s linear infinite;
        }

        /* ── stepper strip ── */
        .facelessm-stepper {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 4px 2px 2px;
        }
        .facelessm-step {
          position: relative; flex: 1; display: flex; flex-direction: column;
          align-items: center; gap: 7px; min-width: 0;
        }
        .facelessm-conn {
          position: absolute; top: 9px; right: 50%; width: 100%; height: 2px;
          background: var(--line); z-index: 0;
        }
        .facelessm-done .facelessm-conn { background: color-mix(in srgb, var(--accent) 45%, var(--line)); }
        .facelessm-node {
          position: relative; z-index: 1; width: 20px; height: 20px; border-radius: 50%;
          display: grid; place-items: center; border: 1.5px solid var(--line);
          background: var(--panel);
        }
        .facelessm-done .facelessm-node {
          border-color: var(--accent);
          background: color-mix(in srgb, var(--accent) 18%, var(--panel));
        }
        .facelessm-check { color: var(--accent); }
        .facelessm-active .facelessm-node {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
        }
        .facelessm-pulse {
          width: 8px; height: 8px; border-radius: 50%; background: var(--accent);
          animation: facelessm-pulse 1.4s ease-in-out infinite;
        }
        .facelessm-empty { width: 6px; height: 6px; border-radius: 50%; background: var(--line); }
        .facelessm-step-label {
          font-size: 9px; line-height: 1.15; text-align: center; color: var(--faint);
          max-width: 56px;
        }
        .facelessm-done .facelessm-step-label { color: var(--dim); }
        .facelessm-active .facelessm-step-label { color: var(--accent); font-weight: 600; }

        /* ── cost badge ── */
        .facelessm-badge {
          display: flex; align-items: center; flex-wrap: wrap;
          font-size: 11px; color: var(--dim);
          background: var(--accent-soft); border: 1px solid color-mix(in srgb, var(--accent) 30%, var(--line));
          border-radius: 999px; padding: 7px 13px; align-self: flex-start;
        }
        .facelessm-badge b { color: var(--bone); font-weight: 600; }
        .facelessm-badge-accent { color: var(--accent) !important; }
        .facelessm-badge-dot {
          width: 7px; height: 7px; border-radius: 50%; background: var(--accent);
          margin-right: 8px; box-shadow: 0 0 8px var(--accent);
        }

        @keyframes facelessm-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.55; }
        }
        @keyframes facelessm-shimmer {
          0% { transform: translateX(-160%); }
          100% { transform: translateX(420%); }
        }
        @keyframes facelessm-wave {
          0%, 100% { transform: scaleY(0.5); opacity: 0.7; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes facelessm-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }

        @media (max-width: 520px) {
          .facelessm-top { grid-template-columns: 110px 1fr; }
          .facelessm-thumb-title { font-size: 17px; }
          .facelessm-step-label { font-size: 8px; max-width: 46px; }
          .facelessm-node { width: 18px; height: 18px; }
          .facelessm-conn { top: 8px; }
        }
        @media (max-width: 400px) {
          .facelessm-wave { display: none; }
        }
      ` }} />
    </div>
  );
}
