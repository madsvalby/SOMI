import { VENTURES } from "../_data/ventures";

// Server-komponent. Cross-linker de ANDRE ventures (filtrerer nuværende fra via brand-navn).
// props: { brand, copy }
export default function Footer({ brand, copy }) {
  const others = VENTURES.filter((v) => v.name !== brand);
  return (
    <footer className="pe-footer">
      <div className="pe-container">
        <div className="pe-footer-inner">
          <span className="pe-footer-brand">{brand}</span>
          <span>{copy}</span>
          <div className="pe-footer-links">
            <a href="/imperium">All ventures</a>
            {others.map((v) => (
              <a key={v.slug} href={"/imperium/" + v.slug}>
                {v.name}
              </a>
            ))}
            <a href="/imperium/privacy">Privacy &amp; terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
