import { useState } from "react";
import { Section, Reveal, Check, StatusBadge } from "../lib/ui";
import { useStepLoop } from "../lib/hooks";

const STEPS = [
  { label: "Agent working", note: "Discovery · matching · negotiation" },
  { label: "Proposal ready", note: "Structured terms prepared" },
  { label: "Human review", note: "You read every term" },
];

export function HumanApproval() {
  const [ref, step] = useStepLoop<HTMLDivElement>(3, 1500, 1200, false, false);
  const [approved, setApproved] = useState(false);
  return (
    <Section id="human-approval" className="ha-section">
      <div className="ha-grid" ref={ref}>
        <Reveal>
          <span className="eyebrow">You stay in control</span>
          <h2 className="section-title">AI handles the<br />back-and-forth.<br /><span className="lime-text">You make the decision.</span></h2>
          <p className="section-sub" style={{ marginTop: 18 }}>Agents can discover, match, negotiate, and prepare. They never sign, and they never move your money.</p>
        </Reveal>
        <Reveal>
          <div className="ha-flow panel">
            <StatusBadge state={approved ? "success" : "awaiting"}>{approved ? "Demo approved" : "Human approval required"}</StatusBadge>
            {STEPS.map((s, i) => <div key={s.label} className={`ha-step ${step >= i ? "on" : ""}`}><span className="ha-step-dot">{step > i || approved ? <Check /> : i + 1}</span><div><div className="ha-step-label">{s.label}</div><div className="ha-step-note mono">{s.note}</div></div></div>)}
            <div className={`ha-approve ${approved ? "done" : "ready"}`}>
              <button className="pact-btn approve" onClick={() => setApproved(!approved)}>{approved ? "Reset demo" : "Approve demo proposal"}</button>
              <span className="mono" role="status">{approved ? "Approved by you — not your agent" : "Nothing proceeds without you"}</span>
            </div>
            <p className="demo-note">Interactive example only. No contract or payment is created.</p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
