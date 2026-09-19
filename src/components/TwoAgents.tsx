import { useReducedMotion } from "framer-motion";
import { Section, Reveal } from "../lib/ui";

const CREATOR_CAPS = [
  "Finds opportunities",
  "Negotiates terms",
  "Tracks campaigns",
  "Protects creator interests",
];

const BRAND_CAPS = [
  "Finds creators",
  "Builds pipeline",
  "Negotiates campaigns",
  "Tracks performance",
];

function Link({ flip }: { flip?: boolean }) {
  /* horizontal animated connector: base line + traveling pulses both ways */
  const reduced = useReducedMotion();
  return (
    <div className={`ta-link ${flip ? "flip" : ""}`} aria-hidden>
      <span className="ta-link-line" />
      {!reduced && (
        <>
          <span className="ta-pulse" />
          <span className="ta-pulse rev" />
        </>
      )}
    </div>
  );
}

function AgentCard({
  kind,
  title,
  caps,
  delay,
}: {
  kind: "creator" | "brand";
  title: string;
  caps: string[];
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="ta-card-wrap">
      <div className="ta-card panel">
        <div className={`agent-tag ${kind}`}>
          <span className="glyph">{kind === "creator" ? "C" : "B"}</span>
          {title}
        </div>
        <ul className="ta-caps">
          {caps.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

export function TwoAgents() {
  return (
    <Section id="agents" center className="two-agents">
      <Reveal>
        <h2 className="section-title big">
          Two agents.
          <br />
          One deal.
        </h2>
      </Reveal>

      <div className="ta-grid">
        <AgentCard kind="creator" title="Creator agent" caps={CREATOR_CAPS} delay={0.05} />
        <div className="ta-center">
          <Link />
          <Reveal delay={0.2}>
            <div className="ta-core">
              <span className="netmap-core-ring" />
              PACT
            </div>
          </Reveal>
          <Link flip />
        </div>
        <AgentCard kind="brand" title="Brand agent" caps={BRAND_CAPS} delay={0.15} />
      </div>

      <Reveal delay={0.25}>
        <p className="ta-caption">
          Both sides of the deal run agents — Pact is where they meet.
        </p>
      </Reveal>
    </Section>
  );
}
