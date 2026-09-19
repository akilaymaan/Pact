import { Fragment } from "react";
import { Section, Reveal } from "../lib/ui";

function DiagramToday() {
  return (
    <svg viewBox="0 0 200 80" fill="none" className="vis-diagram">
      <circle cx="40" cy="40" r="7" stroke="var(--dim)" strokeWidth="1.4" />
      <circle cx="160" cy="40" r="7" stroke="var(--dim)" strokeWidth="1.4" />
      <line x1="47" y1="40" x2="153" y2="40" stroke="var(--line-3)" strokeWidth="1.2" strokeDasharray="3 4" />
      <text x="40" y="66" textAnchor="middle" className="vis-label">Creator</text>
      <text x="160" y="66" textAnchor="middle" className="vis-label">Brand</text>
    </svg>
  );
}

function DiagramThen() {
  return (
    <svg viewBox="0 0 200 80" fill="none" className="vis-diagram">
      <rect x="18" y="31" width="18" height="18" rx="5" stroke="var(--lime)" strokeWidth="1.4" />
      <rect x="164" y="31" width="18" height="18" rx="5" stroke="var(--dim)" strokeWidth="1.4" />
      <circle cx="100" cy="40" r="9" stroke="var(--lime)" strokeWidth="1.4" />
      <line x1="36" y1="40" x2="91" y2="40" stroke="var(--lime-line)" strokeWidth="1.2" />
      <line x1="109" y1="40" x2="164" y2="40" stroke="var(--line-3)" strokeWidth="1.2" />
      <text x="27" y="66" textAnchor="middle" className="vis-label">Agent</text>
      <text x="100" y="66" textAnchor="middle" className="vis-label">Pact</text>
      <text x="173" y="66" textAnchor="middle" className="vis-label">Agent</text>
    </svg>
  );
}

function DiagramFuture() {
  const pts = [
    [30, 22], [80, 14], [140, 20], [170, 45],
    [120, 62], [60, 58], [30, 44], [100, 40],
  ];
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0],
    [0, 7], [2, 7], [4, 7], [6, 7], [1, 7], [3, 7],
  ];
  return (
    <svg viewBox="0 0 200 80" fill="none" className="vis-diagram">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]}
          stroke={i % 3 === 0 ? "var(--lime-line)" : "var(--line-2)"}
          strokeWidth="0.9"
        />
      ))}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 7 ? 4 : 2.6}
          stroke={i === 7 ? "var(--lime)" : "var(--dim)"} strokeWidth="1.2" />
      ))}
    </svg>
  );
}

const ERAS = [
  {
    tag: "Today",
    title: "Creator ↔ Brand",
    copy: "Deals negotiated by hand, over email.",
    Diagram: DiagramToday,
  },
  {
    tag: "Then",
    title: "Agent ↔ Agent",
    copy: "Agents negotiate structure. Humans approve.",
    Diagram: DiagramThen,
  },
  {
    tag: "Future",
    title: "Agent networks",
    copy: "Networks of specialized agents forming structured commercial relationships.",
    Diagram: DiagramFuture,
  },
];

export function Vision() {
  return (
    <Section
      className="vision-section"
      eyebrow="The vision"
      title="THE INTERNET OF BRAND DEALS, WITH AGENTS DOING THE WORK."
    >
      <div className="vis-grid">
        {ERAS.map((e, i) => (
          <Fragment key={e.tag}>
            <Reveal delay={i * 0.12} className="vis-card-wrap">
              <div className="vis-card panel">
                <div className="vis-tag mono">{e.tag}</div>
                <e.Diagram />
                <div className="vis-title">{e.title}</div>
                <p className="vis-copy">{e.copy}</p>
              </div>
            </Reveal>
            {i < ERAS.length - 1 && <span className="vis-arrow">→</span>}
          </Fragment>
        ))}
      </div>
    </Section>
  );
}
