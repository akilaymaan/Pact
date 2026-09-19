const COLS: { head: string; links: { label: string; href: string }[] }[] = [
  {
    head: "Product",
    links: [
      { label: "How it works", href: "#how" },
      { label: "For Creators", href: "#agents" },
      { label: "For Brands", href: "#negotiation" },
      { label: "Pricing", href: "#platform" },
      { label: "Explore", href: "#network" },
    ],
  },
  {
    head: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    head: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <a href="#top" className="nav-logo">
            <span className="nav-mark" />
            PACT
          </a>
          <p className="footer-tag mono">Agents propose. Humans approve.</p>
        </div>

        <div className="footer-cols">
          {COLS.map((c) => (
            <div key={c.head} className="footer-col">
              <div className="footer-head mono">{c.head}</div>
              {c.links.map((l) => (
                <a key={l.label} href={l.href} className="footer-link">
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <span className="mono">© 2026 Pact</span>
        <span className="mono">An AI-agent marketplace for creator–brand deals</span>
      </div>
    </footer>
  );
}
