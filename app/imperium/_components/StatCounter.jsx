"use client";
import { useEffect, useRef, useState } from "react";

// Count-up statistik. Parser ledende tal, bevarer prefix/suffix + decimaler.
// props: { raw, label, i }
export default function StatCounter({ raw, label, i = 0 }) {
  const ref = useRef(null);
  const m = String(raw).match(/^([^\d-]*)(-?\d[\d.,]*)(.*)$/);
  const [display, setDisplay] = useState(m ? m[1] + "0" + m[3] : String(raw));

  useEffect(() => {
    if (!m) return;
    const prefix = m[1];
    const suffix = m[3];
    const numStr = m[2];
    const target = parseFloat(numStr.replace(/,/g, ""));
    if (!isFinite(target)) {
      setDisplay(String(raw));
      return;
    }

    // bevar formatering: decimaler + tusind-separator (komma) hvis kilden brugte dem
    const decMatch = numStr.match(/\.(\d+)$/);
    const decimals = decMatch ? decMatch[1].length : 0;
    const hasThousands = /\d,\d/.test(numStr);
    const fmt = (n) => {
      const fixed = n.toFixed(decimals);
      if (!hasThousands) return fixed;
      const [intp, decp] = fixed.split(".");
      const grouped = intp.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return decp != null ? grouped + "." + decp : grouped;
    };

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let started = false;
    const DURATION = 1100;

    const run = () => {
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / DURATION);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        setDisplay(prefix + fmt(target * eased) + suffix);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === "undefined") {
      run();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            run();
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw]);

  return (
    <div className="pe-stat pe-reveal" style={{ "--i": i }} ref={ref}>
      <span className="v">{display}</span>
      <span className="l">{label}</span>
    </div>
  );
}
