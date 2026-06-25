// Ringback AI — "live call card" mockup. Server-komponent, ren CSS/SVG, ingen JS-runtime.
// Scoped <style> med unikt prefix "ringbackm-". Arver per-side accent via var(--accent).
export default function RingbackMockup() {
  return (
    <div className="ringbackm-wrap">
      <style dangerouslySetInnerHTML={{ __html: `
        .ringbackm-wrap { width: 100%; max-width: 440px; margin: 0 auto; }
        .ringbackm-frame .pe-frame-body { padding: 16px; }

        /* top: live status + waveform */
        .ringbackm-top {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; margin-bottom: 14px;
        }
        .ringbackm-live {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: var(--mono); font-size: 11px; letter-spacing: 0.06em;
          color: var(--bone);
        }
        .ringbackm-live .dot {
          width: 8px; height: 8px; border-radius: 50%; background: var(--accent);
          box-shadow: 0 0 10px var(--accent);
          animation: ringbackm-pulse 1.6s ease-in-out infinite;
        }
        .ringbackm-live .t { color: var(--faint); }
        .ringbackm-wave {
          display: flex; align-items: flex-end; gap: 3px; height: 26px;
        }
        .ringbackm-wave span {
          width: 4px; border-radius: 2px; background: var(--accent);
          animation: ringbackm-eq 0.9s ease-in-out infinite;
        }
        .ringbackm-wave span:nth-child(1) { animation-delay: -0.9s; }
        .ringbackm-wave span:nth-child(2) { animation-delay: -0.7s; }
        .ringbackm-wave span:nth-child(3) { animation-delay: -0.5s; }
        .ringbackm-wave span:nth-child(4) { animation-delay: -0.3s; }
        .ringbackm-wave span:nth-child(5) { animation-delay: -0.6s; }
        .ringbackm-wave span:nth-child(6) { animation-delay: -0.2s; }
        .ringbackm-wave span:nth-child(7) { animation-delay: -0.8s; }
        .ringbackm-wave span:nth-child(8) { animation-delay: -0.4s; }

        /* transcript stream */
        .ringbackm-stream { display: flex; flex-direction: column; gap: 9px; }
        .ringbackm-row { display: flex; }
        .ringbackm-row.ai { justify-content: flex-start; }
        .ringbackm-row.caller { justify-content: flex-end; }
        .ringbackm-bubble {
          max-width: 80%; padding: 9px 12px; border-radius: 13px;
          font-size: 12.5px; line-height: 1.45;
        }
        .ringbackm-row.caller .ringbackm-bubble {
          background: var(--ink); border: 1px solid var(--line);
          color: var(--bone); border-bottom-right-radius: 4px;
        }
        .ringbackm-row.ai .ringbackm-bubble {
          background: var(--accent-soft);
          border: 1px solid color-mix(in srgb, var(--accent) 38%, var(--line));
          color: var(--bone); border-bottom-left-radius: 4px;
        }
        .ringbackm-who {
          font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--faint); margin-bottom: 3px;
        }
        .ringbackm-row.ai .ringbackm-who { color: var(--accent); }

        /* typing dots on latest AI bubble */
        .ringbackm-typing { display: inline-flex; gap: 3px; margin-left: 4px; vertical-align: middle; }
        .ringbackm-typing i {
          width: 4px; height: 4px; border-radius: 50%; background: var(--accent);
          display: inline-block; animation: ringbackm-type 1.2s ease-in-out infinite;
        }
        .ringbackm-typing i:nth-child(2) { animation-delay: 0.18s; }
        .ringbackm-typing i:nth-child(3) { animation-delay: 0.36s; }

        /* auto-filled lead card */
        .ringbackm-lead {
          margin-top: 14px; background: linear-gradient(180deg, var(--panel-2), transparent);
          border: 1px solid var(--line); border-radius: 13px; padding: 13px 14px;
        }
        .ringbackm-lead-head {
          display: flex; align-items: center; justify-content: space-between;
          gap: 10px; margin-bottom: 10px;
        }
        .ringbackm-lead-title {
          font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--faint);
        }
        .ringbackm-badge {
          font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--accent);
          border: 1px solid color-mix(in srgb, var(--accent) 45%, var(--line));
          background: var(--accent-soft); border-radius: 999px; padding: 3px 8px;
          white-space: nowrap;
        }
        .ringbackm-kv { display: flex; flex-direction: column; gap: 7px; }
        .ringbackm-kv .r {
          display: flex; align-items: baseline; justify-content: space-between;
          gap: 12px; font-size: 12px;
        }
        .ringbackm-kv .k { color: var(--faint); }
        .ringbackm-kv .v { color: var(--bone); font-weight: 600; }
        .ringbackm-kv .v.accent { color: var(--accent); }

        /* compliance stripe */
        .ringbackm-comply {
          margin-top: 12px; display: flex; align-items: center; gap: 8px;
          font-family: var(--mono); font-size: 10px; letter-spacing: 0.04em;
          color: var(--faint); border-top: 1px solid var(--line-soft);
          padding-top: 11px;
        }
        .ringbackm-comply .shield {
          width: 12px; height: 12px; flex-shrink: 0; color: var(--accent);
        }

        @keyframes ringbackm-eq { 0%,100% { height: 22%; } 50% { height: 100%; } }
        @keyframes ringbackm-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .45; transform: scale(.8); } }
        @keyframes ringbackm-type { 0%,100% { opacity: .25; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-2px); } }

        @media (max-width: 540px) {
          .ringbackm-bubble { max-width: 88%; font-size: 12px; }
          .ringbackm-wave { height: 22px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ringbackm-wave span, .ringbackm-live .dot, .ringbackm-typing i { animation: none !important; }
        }
      ` }} />

      <div className="pe-frame pe-float ringbackm-frame">
        <div className="pe-frame-bar">
          <span className="pe-frame-dot" style={{ background: "#E0795E" }} />
          <span className="pe-frame-dot" style={{ background: "#E6C877" }} />
          <span className="pe-frame-dot" style={{ background: "#3FA66A" }} />
          <span className="pe-frame-url">ringback · live call</span>
        </div>

        <div className="pe-frame-body">
          {/* top: live status + waveform */}
          <div className="ringbackm-top">
            <span className="ringbackm-live">
              <span className="dot" />
              Live <span className="t">· 0:42</span>
            </span>
            <div className="ringbackm-wave" aria-hidden="true">
              <span style={{ height: "40%" }} />
              <span style={{ height: "75%" }} />
              <span style={{ height: "55%" }} />
              <span style={{ height: "95%" }} />
              <span style={{ height: "60%" }} />
              <span style={{ height: "85%" }} />
              <span style={{ height: "45%" }} />
              <span style={{ height: "70%" }} />
            </div>
          </div>

          {/* transcript stream */}
          <div className="ringbackm-stream">
            <div className="ringbackm-row caller">
              <div className="ringbackm-bubble">
                <div className="ringbackm-who">Caller</div>
                My sink is flooding
              </div>
            </div>
            <div className="ringbackm-row ai">
              <div className="ringbackm-bubble">
                <div className="ringbackm-who">Ringback AI</div>
                I can get a plumber to you today at 2pm — booking now…
                <span className="ringbackm-typing" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            </div>
          </div>

          {/* auto-filled lead card */}
          <div className="ringbackm-lead">
            <div className="ringbackm-lead-head">
              <span className="ringbackm-lead-title">Lead captured</span>
              <span className="ringbackm-badge">Texted to you</span>
            </div>
            <div className="ringbackm-kv">
              <div className="r">
                <span className="k">Name</span>
                <span className="v">—</span>
              </div>
              <div className="r">
                <span className="k">Number</span>
                <span className="v">+1 (415) 555-0147</span>
              </div>
              <div className="r">
                <span className="k">Reason</span>
                <span className="v accent">Emergency leak</span>
              </div>
              <div className="r">
                <span className="k">Booked</span>
                <span className="v">Today 2:00pm</span>
              </div>
            </div>
          </div>

          {/* compliance stripe */}
          <div className="ringbackm-comply">
            <svg
              className="shield"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            AI-assisted call disclosed · Inbound (TCPA-safe)
          </div>
        </div>
      </div>
    </div>
  );
}
