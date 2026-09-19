import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ---------- Section shell ---------- */

export function Section({
  id,
  eyebrow,
  title,
  sub,
  center,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  sub?: ReactNode;
  center?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`section ${className}`}>
      <div className="section-inner">
        {(eyebrow || title) && (
          <div className={`section-head ${center ? "center" : ""}`}>
            {eyebrow && (
              <Reveal>
                <span className="eyebrow">{eyebrow}</span>
              </Reveal>
            )}
            {title && (
              <Reveal delay={0.06}>
                <h2 className="section-title">{title}</h2>
              </Reveal>
            )}
            {sub && (
              <Reveal delay={0.12}>
                <p className="section-sub">{sub}</p>
              </Reveal>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/* ---------- Scroll-into-view reveal ---------- */

export function Reveal({ children, className, delay = 0, y = 18, once = true }: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0.4, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once, amount: 0.1 }} transition={{ duration: reduced ? 0 : 0.65, delay: reduced ? 0 : delay, ease: [0.23, 1, 0.32, 1] }}>{children}</motion.div>;
}

/* ---------- Small shared pieces ---------- */

export function AgentTag({
  kind,
  label,
  active,
}: {
  kind: "creator" | "brand";
  label: string;
  active?: boolean;
}) {
  return (
    <span className={`agent-tag ${kind}`} style={active ? { borderColor: "var(--lime-line)" } : undefined}>
      <span className="glyph">{kind === "creator" ? "C" : "B"}</span>
      {label}
    </span>
  );
}

export type StatusState = "scouting" | "negotiating" | "awaiting" | "active" | "verifying" | "success" | "settled";

export function StatusBadge({ state, children }: { state: StatusState; children: ReactNode }) {
  return (
    <span className={`status-badge status-${state}`}>
      {state === "success" || state === "settled" ? <Check /> : <span className="status-indicator" aria-hidden />}
      {children}
    </span>
  );
}

export function Arrow({ direction = "right" }: { direction?: "right" | "down" }) {
  return (
    <svg className="arrow-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden style={direction === "down" ? { rotate: "90deg" } : undefined}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Check() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2 6.2 4.8 9 10 3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
