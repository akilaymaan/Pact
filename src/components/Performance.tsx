import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { Section, Reveal, Check } from "../lib/ui";

function Count({
  to,
  fmt,
  active,
  delay = 0,
}: {
  to: number;
  fmt: (v: number) => string;
  active: boolean;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const mv = useMotionValue(0);
  const text = useTransform(mv, fmt);
  useEffect(() => {
    if (!active) return;
    if (reduced) { mv.set(to); return; }
    const c = animate(mv, to, { duration: 1.9, delay, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [active, mv, to, delay, reduced]);
  return <motion.span>{text}</motion.span>;
}

const FLOW = ["Content", "Performance", "Verification", "Settlement"];
const BARS = [34, 42, 50, 47, 62, 70, 66, 78, 86, 100];

export function Performance() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduced = useReducedMotion();
  const [verified, setVerified] = useState(false);
  useEffect(() => {
    if (!inView) return;
    if (reduced) { setVerified(true); return; }
    const timer = setTimeout(() => setVerified(true), 2300);
    return () => clearTimeout(timer);
  }, [inView, reduced]);

  return (
    <Section
      className="performance-section split-section"
      eyebrow="Verified performance"
      title="Results become part of the deal."
      sub="Campaign delivery is tracked against the agreed terms. Verified outcomes feed settlement — and reputation."
    >
      <Reveal>
        {/* flow */}
        <div className="perf-flow">
          {FLOW.map((f, i) => (
            <div key={f} className="perf-flow-item">
              <span className={`chip ${inView && i === FLOW.length - 1 ? "lime" : ""}`}>{f}</span>
              {i < FLOW.length - 1 && <span className="flow-arrow">→</span>}
            </div>
          ))}
        </div>

        {/* dashboard */}
        <div className="perf-dash panel" ref={ref}>
          <div className="perf-dash-head">
            <span className="mono">Campaign · Instagram Reel</span>
            <span className={`chip ${verified ? "lime" : ""}`}>
              {verified ? <><Check /> Performance verified</> : "Verifying performance"}
            </span>
          </div>

          <div className="perf-metrics">
            <div className="metric">
              <span className="metric-val"><Count to={104} fmt={(v) => `${Math.round(v)}K`} active={inView} /></span>
              <span className="mono">Views</span>
            </div>
            <div className="metric">
              <span className="metric-val"><Count to={8.2} fmt={(v) => `${v.toFixed(1)}K`} active={inView} delay={0.1} /></span>
              <span className="mono">Engagement</span>
            </div>
            <div className="metric">
              <span className="metric-val"><Count to={73} fmt={(v) => `${Math.round(v)}%`} active={inView} delay={0.2} /></span>
              <span className="mono">Completion</span>
            </div>
            <div className="metric">
              <span className="metric-val"><Count to={2.4} fmt={(v) => `${v.toFixed(1)}%`} active={inView} delay={0.3} /></span>
              <span className="mono">CTR</span>
            </div>
          </div>

          <div className="perf-chart">
            {BARS.map((h, i) => (
              <div key={i} className="vbar">
                <motion.div
                  className="vbar-fill"
                  style={{ height: `${h}%` }}
                  initial={{ scaleY: 0 }}
                  animate={inView ? { scaleY: 1 } : {}}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            ))}
          </div>

          <div className="perf-foot demo-note">Illustrative dashboard — example data only</div>
        </div>
      </Reveal>
    </Section>
  );
}
