import { Section, Reveal } from "../lib/ui";

const PROBLEMS = [
  {
    key: "01",
    title: "Discovery",
    pain: "Finding the right partner takes time.",
    fix: "Agent finds",
  },
  {
    key: "02",
    title: "Negotiation",
    pain: "Every deal becomes another round of messages.",
    fix: "Agents negotiate",
  },
  {
    key: "03",
    title: "Settlement",
    pain: "Performance and payment are difficult to verify.",
    fix: "Results are verified",
  },
];

export function Problem() {
  return (
    <Section
      id="problem"
      eyebrow="The problem"
      title="Brand deals still run on inboxes, spreadsheets, and guesswork."
    >
      <div className="problem-grid">
        {PROBLEMS.map((p, i) => (
          <Reveal key={p.key} delay={i * 0.1} className="problem-card-wrap">
            <div className="problem-card panel">
              <div className="problem-top">
                <span className="mono">{p.key}</span>
                <h3 className="problem-title">{p.title}</h3>
                <p className="problem-pain">{p.pain}</p>
              </div>
              <Reveal delay={0.4 + i * 0.12} y={10} className="problem-fix">
                <span className="problem-fix-line" />
                <span className="problem-fix-label">
                  <span className="flow-arrow">→</span> {p.fix}
                </span>
              </Reveal>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
