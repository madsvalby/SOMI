// ListingReel "before → after" mockup: raw listing photos (2x2 grid) → generated 9:16 reel.
// Server-komponent med et klikbart PlayDemo i reel-centeret. Scoped <style> "listingreelm-".
import PlayDemo from "../PlayDemo";

export default function ListingreelMockup() {
  return (
    <div className="listingreelm-wrap">
      <style dangerouslySetInnerHTML={{ __html: `
        .listingreelm-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          max-width: 440px;
          margin: 0 auto;
          width: 100%;
        }

        /* ── LEFT: raw listing photos ── */
        .listingreelm-raw {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 8px;
          flex: 1 1 0;
          min-width: 0;
          max-width: 200px;
        }
        .listingreelm-shot {
          position: relative;
          aspect-ratio: 4 / 3;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid var(--line, #1E2730);
          box-shadow: 0 12px 26px -18px rgba(0,0,0,0.8);
        }
        .listingreelm-shot.s1 { background: linear-gradient(150deg, #2a3848, #131b25); }
        .listingreelm-shot.s2 { background: linear-gradient(150deg, #3a3326, #1a1712); }
        .listingreelm-shot.s3 { background: linear-gradient(150deg, #243a36, #111c1a); }
        .listingreelm-shot.s4 { background: linear-gradient(150deg, #2f3a28, #161c12); }
        /* subtle "scene" shapes per photo */
        .listingreelm-shot::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(60px 40px at 30% 30%, rgba(255,255,255,0.10), transparent 70%),
            linear-gradient(0deg, rgba(0,0,0,0.35), transparent 55%);
        }
        .listingreelm-shot.s1::after,
        .listingreelm-shot.s2::after,
        .listingreelm-shot.s3::after,
        .listingreelm-shot.s4::after {
          content: "";
          position: absolute;
          left: 18%;
          right: 18%;
          bottom: 16%;
          height: 34%;
          border: 1px solid rgba(255,255,255,0.16);
          border-bottom: none;
          border-radius: 4px 4px 0 0;
        }
        .listingreelm-rawtag {
          position: absolute;
          top: 6px;
          left: 6px;
          font-family: var(--mono, monospace);
          font-size: 8px;
          letter-spacing: 0.1em;
          color: rgba(242,242,234,0.78);
          background: rgba(5,8,12,0.6);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 4px;
          padding: 2px 5px;
        }

        /* ── ARROW ── */
        .listingreelm-arrow {
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: var(--accent, #1F9E8F);
          border: 1px solid color-mix(in srgb, var(--accent, #1F9E8F) 50%, transparent);
          background: color-mix(in srgb, var(--accent, #1F9E8F) 14%, transparent);
          font-size: 18px;
          font-weight: 700;
          animation: listingreelm-nudge 2.4s ease-in-out infinite;
        }

        /* ── RIGHT: generated reel in a phone ── */
        .listingreelm-phone {
          flex-shrink: 0;
          width: 168px;
          border-radius: 26px;
          border: 7px solid #05080c;
          background: #05080c;
          box-shadow: 0 36px 80px -38px rgba(0,0,0,0.95), 0 0 0 1px var(--line, #1E2730);
          overflow: hidden;
          animation: listingreelm-float 6s ease-in-out infinite;
        }
        .listingreelm-screen {
          position: relative;
          aspect-ratio: 9 / 19;
          background:
            linear-gradient(165deg, #1a2a34 0%, #0d161d 55%, #08110a 100%);
          overflow: hidden;
        }
        /* a faux interior shot behind the reel UI */
        .listingreelm-screen::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(120px 90px at 60% 22%, rgba(255,255,255,0.10), transparent 70%),
            radial-gradient(90px 70px at 25% 60%, color-mix(in srgb, var(--accent, #1F9E8F) 18%, transparent), transparent 75%);
        }
        /* agent watermark */
        .listingreelm-mark {
          position: absolute;
          top: 9px;
          right: 9px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: var(--mono, monospace);
          font-size: 7.5px;
          letter-spacing: 0.06em;
          color: rgba(242,242,234,0.82);
          background: rgba(5,8,12,0.45);
          padding: 3px 6px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
        }
        .listingreelm-mark i {
          width: 9px;
          height: 9px;
          border-radius: 3px;
          background: var(--accent, #1F9E8F);
          display: inline-block;
        }
        /* play button position (PlayDemo-trigger centreres her; hover-scale på selve knappen) */
        .listingreelm-play {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        /* burned-in captions */
        .listingreelm-caps {
          position: absolute;
          left: 12px;
          right: 12px;
          bottom: 52px;
          text-align: center;
        }
        .listingreelm-caps b {
          display: inline-block;
          font-family: var(--serif, Georgia, serif);
          font-weight: 700;
          font-size: 15px;
          line-height: 1.18;
          color: #fff;
          letter-spacing: 0.01em;
          text-shadow: 0 2px 8px rgba(0,0,0,0.85);
        }
        .listingreelm-caps b em {
          font-style: normal;
          color: var(--accent, #1F9E8F);
        }
        /* voice waveform strip */
        .listingreelm-eq {
          position: absolute;
          left: 12px;
          right: 12px;
          bottom: 18px;
          height: 26px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 3px;
          padding: 0 6px;
          border-radius: 8px;
          background: rgba(5,8,12,0.5);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .listingreelm-eq span {
          width: 3px;
          border-radius: 2px;
          background: var(--accent, #1F9E8F);
          height: 30%;
          animation: listingreelm-eq 1s ease-in-out infinite;
        }
        .listingreelm-eq span:nth-child(2n) { animation-duration: 0.85s; }
        .listingreelm-eq span:nth-child(3n) { animation-duration: 1.25s; opacity: 0.85; }
        .listingreelm-eq span:nth-child(4n) { animation-duration: 0.7s; }
        .listingreelm-eq span:nth-child(5n) { animation-duration: 1.1s; opacity: 0.7; }

        @keyframes listingreelm-eq {
          0%, 100% { height: 22%; }
          50% { height: 100%; }
        }
        @keyframes listingreelm-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes listingreelm-pulse {
          0%, 100% { box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent, #1F9E8F) 24%, transparent); }
          50% { box-shadow: 0 0 0 11px color-mix(in srgb, var(--accent, #1F9E8F) 0%, transparent); }
        }
        @keyframes listingreelm-nudge {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }

        /* responsive: drop the raw grid on very narrow screens, keep the phone */
        @media (max-width: 440px) {
          .listingreelm-wrap { gap: 12px; }
          .listingreelm-raw { max-width: 150px; gap: 6px; }
          .listingreelm-phone { width: 150px; }
        }
        @media (max-width: 360px) {
          .listingreelm-raw { display: none; }
          .listingreelm-arrow { display: none; }
        }
      ` }} />

      {/* LEFT — raw listing photos */}
      <div className="listingreelm-raw" aria-hidden="true">
        <div className="listingreelm-shot s1">
          <span className="listingreelm-rawtag">RAW · LIVING</span>
        </div>
        <div className="listingreelm-shot s2">
          <span className="listingreelm-rawtag">RAW · KITCHEN</span>
        </div>
        <div className="listingreelm-shot s3">
          <span className="listingreelm-rawtag">RAW · FACADE</span>
        </div>
        <div className="listingreelm-shot s4">
          <span className="listingreelm-rawtag">RAW · GARDEN</span>
        </div>
      </div>

      {/* ARROW */}
      <div className="listingreelm-arrow" aria-hidden="true">→</div>

      {/* RIGHT — generated 9:16 reel */}
      <div className="listingreelm-phone">
        <div className="listingreelm-screen">
          <div className="listingreelm-mark">
            <i />
            J. REYES · REALTY
          </div>

          <div className="listingreelm-play">
            <PlayDemo label="ListingReel example reel" accent="#1F9E8F" />
          </div>

          <div className="listingreelm-caps">
            <b>
              3 BED · OCEAN VIEW · <em>$740K</em>
            </b>
          </div>

          <div className="listingreelm-eq">
            {Array.from({ length: 28 }).map((_, i) => (
              <span key={i} style={{ animationDelay: (i * 0.06) + "s" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
