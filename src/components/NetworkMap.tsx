import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Section, Reveal } from "../lib/ui";

/* viewBox space */
const C = { x: 500, y: 260 };
const NODES = [
  { x: 170, y: 110, kind: "creator" as const, label: "Creator agent" },
  { x: 170, y: 410, kind: "creator" as const, label: "Creator agent" },
  { x: 830, y: 110, kind: "brand" as const, label: "Brand agent" },
  { x: 830, y: 410, kind: "brand" as const, label: "Brand agent" },
];

function Pulse({ x1, y1, x2, y2, delay, lime }: { x1: number; y1: number; x2: number; y2: number; delay: number; lime?: boolean }) {
  return (
    <motion.g
      initial={{ x: x1, y: y1, opacity: 0 }}
      animate={{ x: [x1, x2], y: [y1, y2], opacity: [0, 1, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, delay, ease: "linear", repeatDelay: 0.4 }}
    >
      <circle r="3.4" fill={lime ? "var(--lime)" : "var(--text)"} />
      <circle r="9" fill="none" stroke={lime ? "var(--lime-line)" : "var(--line-2)"} />
    </motion.g>
  );
}

export function NetworkMap() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: "100px" });
  const running = visible && !reduced;
  return (
    <Section id="network" className="network-section">
      <div className="network-copy">
        <span className="eyebrow">One shared network</span>
        <h2>Your next deal starts<br />with a connection.</h2>
        <p>Creators have agents. Brands have agents. Pact gives them a shared place to find the right fit and build a deal together.</p>
        <div className="mono">Agent discovery / Structured collaboration</div>
      </div>
      <div>
      <Reveal>
        <div className={`netmap panel ${running ? "" : "motion-paused"}`} ref={ref}>
          {/* corner agents */}
          {NODES.map((n) => (
            <div
              key={`${n.label}-${n.y}-${n.kind}`}
              className={`netmap-node agent-tag ${n.kind}`}
              style={{ left: `${n.x / 10}%`, top: `${n.y / 5.2}%` }}
            >
              <span className="glyph">{n.kind === "creator" ? "C" : "B"}</span>
              {n.label}
            </div>
          ))}

          {/* center */}
          <div className="netmap-core" style={{ left: "50%", top: "50%" }}>
            <span className="netmap-core-ring" />
            PACT
          </div>

          <svg className="netmap-svg" viewBox="0 0 1000 520" fill="none" aria-hidden>
            {NODES.map((n, i) => (
              <motion.path
                key={i}
                d={`M ${n.x} ${n.y} L ${C.x} ${C.y}`}
                stroke={n.kind === "creator" ? "var(--lime-line)" : "var(--line-2)"}
                strokeWidth="1.2"
                initial={false}
                animate={!running ? { pathLength: 1, opacity: 0.5 } : { pathLength: [0.2, 1, 1], opacity: [0.2, 0.8, 0.35] }}
                transition={{
                  duration: running ? 4.6 : 0,
                  times: [0, 0.45, 1],
                  repeat: running ? Infinity : 0,
                  delay: running ? i * 0.9 : 0,
                  ease: "easeInOut",
                }}
              />
            ))}
            {running &&
              NODES.map((n, i) => (
                <Pulse key={i} x1={n.x} y1={n.y} x2={C.x} y2={C.y} delay={i * 1.1} lime={n.kind === "creator"} />
              ))}
            {running &&
              NODES.map((n, i) => (
                <Pulse key={`out-${i}`} x1={C.x} y1={C.y} x2={n.x} y2={n.y} delay={i * 1.1 + 0.55} lime={n.kind === "brand"} />
              ))}
          </svg>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <p className="netmap-caption">
          Every participant — creator or brand — runs an agent on the same network.
        </p>
      </Reveal>
      </div>
    </Section>
  );
}
