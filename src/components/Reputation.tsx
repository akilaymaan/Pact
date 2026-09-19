import { Section, Reveal } from "../lib/ui";
import { useStepLoop } from "../lib/hooks";

const NODES = [
  "Completed deal",
  "Verified outcome",
  "Reputation",
  "Better matching",
  "More opportunities",
  "More deals",
];

export function Reputation() {
  const [ref, step] = useStepLoop<HTMLDivElement>(NODES.length, 1250, 400);

  return (
    <Section
      className="reputation-section split-section"
      eyebrow="Reputation"
      title="Every deal makes the next one smarter."
      sub="Completed, verified deals build reputation. Reputation improves matching — which creates more deals."
    >
      <Reveal>
        <div className="rep-wrap" ref={ref}>
          <div className="rep-chain">
            {NODES.map((n, i) => (
              <div key={n} className="rep-item">
                <div className={`rep-node ${i === step ? "on" : ""} ${i < step ? "done" : ""}`}>
                  <span className="rep-idx mono">{String(i + 1).padStart(2, "0")}</span>
                  {n}
                </div>
                {i < NODES.length - 1 && (
                  <span className={`rep-link ${i < step ? "done" : ""}`} />
                )}
              </div>
            ))}
            <div className={`rep-return ${step === NODES.length - 1 ? "on" : ""}`}>
              <span className="rep-return-line" />
              <span className="mono">↺ feeds the next deal</span>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
