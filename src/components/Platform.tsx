import { Section, Reveal } from "../lib/ui";

const PILLARS = [
  {
    title: "AI agents",
    copy: "Automate discovery, matching, and negotiation.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="5" y="5" width="14" height="14" rx="3" />
        <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
        <circle cx="12" cy="12" r="2.4" />
      </svg>
    ),
  },
  {
    title: "Marketplace",
    copy: "Connect creators and brands through agent-driven collaboration.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="6" cy="6" r="2.6" />
        <circle cx="18" cy="6" r="2.6" />
        <circle cx="12" cy="18" r="2.6" />
        <path d="M8.2 7.4 10.4 15.6M15.8 7.4 13.6 15.6M8.6 6h6.8" />
      </svg>
    ),
  },
  {
    title: "Verified settlement",
    copy: "Turn campaign outcomes into trusted transactions.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M12 3 5 6v5.4c0 4.2 2.9 7.4 7 8.6 4.1-1.2 7-4.4 7-8.6V6l-7-3Z" />
        <path d="m9 11.8 2.2 2.2L15.4 10" />
      </svg>
    ),
  },
];

export function Platform() {
  return (
    <Section
      id="platform"
      eyebrow="The platform"
      title="Three systems. One marketplace."
      sub="Pact aligns incentives around completed, verified deals — not impressions or promises."
    >
      <div className="plat-grid">
        {PILLARS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.1} className="plat-card-wrap">
            <div className="plat-card panel">
              <div className="plat-icon">{p.icon}</div>
              <h3 className="plat-title">{p.title}</h3>
              <p className="plat-copy">{p.copy}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
