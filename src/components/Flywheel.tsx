import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Section, Reveal } from "../lib/ui";

/* 7 nodes around a circle (600×600 viewBox, r=215, center 300) */
const NODES = [
  { label: "AI agents", x: 50.0, y: 14.2 },
  { label: "Matching", x: 78.0, y: 27.7 },
  { label: "Negotiation", x: 84.9, y: 58.0 },
  { label: "Verified outcomes", x: 65.6, y: 82.3 },
  { label: "Reputation", x: 34.4, y: 82.3 },
  { label: "Better matches", x: 15.1, y: 58.0 },
  { label: "More deals", x: 22.0, y: 27.7 },
];

const PERIOD = 9; // seconds per revolution

export function Flywheel() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: "100px" });
  const running = visible && !reduced;
  return (
    <Section
      className="flywheel-section split-section"
      eyebrow="The flywheel"
      title="Good deals make a better network."
      sub="Every verified deal strengthens the system that produced it — better matching, better deals, more agents."
      center
    >
      <Reveal>
        <div ref={ref} className={`fw ${running ? "" : "motion-paused"}`} role="img" aria-label="Conceptual network flywheel: AI agents, matching, negotiation, verified outcomes, reputation, better matches, more deals, and back to AI agents.">
          <svg className="fw-svg" viewBox="0 0 600 600" fill="none">
            {/* base ring */}
            <circle cx="300" cy="300" r="215" stroke="var(--line-2)" strokeWidth="1" />
            {/* rotating dashes */}
            <motion.g
              style={{ transformOrigin: "300px 300px" }}
              animate={running ? { rotate: -360 } : { rotate: 0 }}
              transition={{ duration: running ? 60 : 0, repeat: running ? Infinity : 0, ease: "linear" }}
            >
              <circle
                cx="300" cy="300" r="215"
                stroke="var(--lime-line)" strokeWidth="1"
                strokeDasharray="2 14"
              />
            </motion.g>
            {/* orbiting pulse */}
            {running && (
              <motion.g
                style={{ transformOrigin: "300px 300px" }}
                animate={{ rotate: 360 }}
                transition={{ duration: PERIOD, repeat: Infinity, ease: "linear" }}
              >
                <circle cx="300" cy="85" r="5" fill="var(--lime)" />
                <circle cx="300" cy="85" r="12" fill="none" stroke="var(--lime-line)" />
              </motion.g>
            )}
            {/* inner ring */}
            <circle cx="300" cy="300" r="120" stroke="var(--line)" strokeWidth="1" strokeDasharray="1 6" />
          </svg>

          {/* nodes */}
          {NODES.map((n, i) => (
            <div
              key={n.label}
              className="fw-node"
              style={{
                left: `${n.x}%`,
                top: `${n.y}%`,
                animationDelay: `${(i * PERIOD) / NODES.length}s`,
              }}
            >
              {n.label}
            </div>
          ))}

          {/* center */}
          <div className="fw-center">
            <span className="fw-brand">PACT</span>
            <span className="mono">compounding network</span>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
