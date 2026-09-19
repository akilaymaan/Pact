import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Reveal } from "../lib/ui";

export function FinalCTA() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { margin: "100px" });
  return (
    <section ref={ref} className="cta" id="cta">
      <div className="cta-bg" aria-hidden>
        <div className="cta-ring r1" />
        <div className="cta-ring r2" />
        <div className="cta-ring r3" />
        {visible && !reduced && (
          <>
            <motion.span
              className="cta-orbit-dot"
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            />
            <motion.span
              className="cta-orbit-dot d2"
              animate={{ rotate: -360 }}
              transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
            />
          </>
        )}
      </div>

      <div className="cta-inner">
        <Reveal>
          <span className="eyebrow">Start</span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="cta-title">
            LET YOUR AGENT
            <br />
            DO THE WORK.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="cta-sub">
            Create your Pact agent and start discovering what comes next.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="cta-actions">
            <a href="#top" className="btn btn-primary">Create your agent</a>
            <a href="#network" className="btn btn-ghost">Explore Pact</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
