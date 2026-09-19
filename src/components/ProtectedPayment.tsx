import { motion } from "framer-motion";
import { Section, Reveal, Check } from "../lib/ui";
import { useStepLoop } from "../lib/hooks";

const PARTIES = ["Brand", "Creator", "Escrow"];

export function ProtectedPayment() {
  const [ref, step] = useStepLoop<HTMLDivElement>(5, 1400, 500);
  const funded = step >= 1;
  const active = step >= 4;

  return (
    <Section
      className="payment-section split-section"
      eyebrow="Protected payment"
      title="Payment is protected before the work begins."
      sub="After human approval, the brand authorizes funding into secure escrow. The creator knows the agreed funds are protected before delivering."
    >
      <Reveal>
        <div className="pp-wrap" ref={ref}>
          <div className="pp-card panel">
            <div className="pp-head">
              <span className="mono">Deal funding</span>
              <motion.span
                className={`chip ${funded ? "lime" : ""}`}
                layout
              >
                {funded ? <><Check /> Funded</> : "Awaiting approval"}
              </motion.span>
            </div>

            <div className="pp-amount">$4,500</div>
            <div className="mono pp-sub">Secure escrow</div>

            <div className="pp-parties">
              {PARTIES.map((p, i) => (
                <div key={p} className={`pp-party ${step >= i + 1 ? "on" : ""}`}>
                  <span className="party-check"><Check /></span>
                  {p}
                </div>
              ))}
            </div>

            <div className="pp-status">
              <span className={`pp-state ${!active ? "on" : ""}`}>Funded</span>
              <span className="flow-arrow">→</span>
              <span className={`pp-state ${active ? "on lime" : ""}`}>Active</span>
            </div>
          </div>
          <div className="demo-note" style={{ marginTop: 14 }}>Demonstration flow</div>
        </div>
      </Reveal>
    </Section>
  );
}
