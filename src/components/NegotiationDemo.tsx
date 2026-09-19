import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section, Reveal, AgentTag, Arrow, Check, StatusBadge } from "../lib/ui";
import { useStepLoop } from "../lib/hooks";

/* timed negotiation sequence (demo data) */

type Msg = { from: "creator" | "brand"; text: string; step: number };
const MSGS: Msg[] = [
  { from: "brand", text: "Opening terms prepared", step: 0 },
  { from: "creator", text: "Fee and timeline revised", step: 1 },
  { from: "brand", text: "Performance incentive added", step: 2 },
  { from: "creator", text: "Terms ready for human review", step: 3 },
];

function Term({ label, value, before, changed }: { label: string; value: string; before?: string; changed?: boolean }) {
  return (
    <div className={`nd-term ${changed ? "flash" : ""}`}>
      <span className="mono">{label}</span>
      <span className="nd-term-values">
        {before && changed && <span className="nd-term-before">{before}<Arrow /></span>}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={value} className="nd-term-val" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.2 }}>{value}</motion.span>
        </AnimatePresence>
      </span>
      <span className="nd-term-check" aria-label={changed ? "Updated" : "Unchanged"}>{changed ? <Check /> : "—"}</span>
    </div>
  );
}

export function NegotiationDemo() {
  const [paused, setPaused] = useState(false);
  const [ref, step] = useStepLoop<HTMLDivElement>(5, 2400, 1800, paused);
  const agreed = step >= 4;
  return (
    <Section id="negotiation" className="negotiation-section" eyebrow="A shared deal workspace" title={<>Less back-and-forth.<br />Better terms.</>} sub="Two agents work through the details in a structured negotiation. Not another chat thread. A proposal you can actually review.">
      <Reveal>
        <div className="nd panel" ref={ref}>
          <div className="nd-head"><div><span className="nd-session-mark" /><span className="mono">Negotiation session</span><span className="nd-session-id">/ Example deal</span></div><button className="demo-control" onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? "Resume demo" : "Pause demo"}</button></div>
          <div className="nd-grid">
            {/* creator side */}
            <div className="nd-side">
              <span className="mono">Participants</span>
              <div className="nd-participant"><AgentTag kind="creator" label="Creator agent" /><p>Protecting your creative value.</p><StatusBadge state="active">Connected</StatusBadge></div>
              <div className="nd-participant-link" aria-hidden><span /></div>
              <div className="nd-participant"><AgentTag kind="brand" label="Brand agent" /><p>Finding the right campaign fit.</p><StatusBadge state="active">Connected</StatusBadge></div>
              <div className="nd-policy"><span className="mono">Approval policy</span><p>Both humans review.<br />No automatic commitments.</p></div>
            </div>
            {/* terms */}
            <div className="nd-terms">
              <div className="nd-terms-title"><div><span className="mono">Proposed terms</span><h3>Campaign agreement</h3></div><span className="chip">Rev. 0{Math.min(step + 1, 3)}</span></div>
              <Term label="Deliverable" value="1 Instagram Reel" />
              <Term label="Fee" value={step >= 1 ? "$4,500" : "$4,000"} before="$4,000" changed={step >= 1} />
              <Term label="Timeline" value={step >= 1 ? "7 days" : "5 days"} before="5 days" changed={step >= 1} />
              <Term label="Usage rights" value="Organic" />
              <Term label="Performance bonus" value={step >= 2 ? "$1,000" : "None"} before="None" changed={step >= 2} />
              <div className="nd-agreement"><StatusBadge state={agreed ? "success" : "negotiating"}>{agreed ? "Agreement ready" : "Negotiating terms"}</StatusBadge><span>Subject to your approval</span></div>
            </div>
            {/* brand side */}
            <div className="nd-side nd-audit">
              <span className="mono">Session activity</span>
              <div className="nd-msgs">
                {MSGS.map((m, i) => (
                  <div key={m.text} className={`nd-audit-row ${step >= m.step ? "on" : ""}`}><span className="nd-audit-dot" /><div><span className="mono">{m.from} agent</span><p>{m.text}</p></div><span className="nd-audit-index">0{i + 1}</span></div>
                ))}
              </div>
              <a href="#human-approval" className={`nd-review ${agreed ? "ready" : ""}`}>You make the next move <Arrow /></a>
            </div>
          </div>
          <div className="nd-foot"><span className="demo-note">Illustrative negotiation · Not real deal data</span><span className="mono">Agents propose. Humans approve.</span></div>
        </div>
      </Reveal>
    </Section>
  );
}
