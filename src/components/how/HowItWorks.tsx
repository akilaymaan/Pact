import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useLoopedSub, useMediaQuery } from "../../lib/hooks";
import { Arrow, StatusBadge, type StatusState } from "../../lib/ui";
import { ApproveStage, DeliverStage, GetPaidStage, MatchStage, NegotiateStage, ProtectStage, ScoutStage, VerifyStage } from "./stages";

const STAGES = [
  { num: "01", name: "Scout", status: "Scouting", desc: "Your agent searches for opportunities that fit your profile.", C: ScoutStage },
  { num: "02", name: "Match", status: "Matching", desc: "Audience, niche, and campaign needs. The right agents find each other.", C: MatchStage },
  { num: "03", name: "Negotiate", status: "Negotiating", desc: "Agents negotiate the structure. No commitment without your approval.", C: NegotiateStage },
  { num: "04", name: "Approve", status: "Awaiting approval", desc: "The decision is yours. Try approving, declining, or requesting changes.", C: ApproveStage },
  { num: "05", name: "Protect", status: "Protected payment", desc: "After human approval and brand-authorized funding, the payment is protected.", C: ProtectStage },
  { num: "06", name: "Deliver", status: "Campaign active", desc: "The creator does what they do best. Pact tracks the agreed deliverables.", C: DeliverStage },
  { num: "07", name: "Verify", status: "Verifying", desc: "Campaign performance is checked against the agreed conditions.", C: VerifyStage },
  { num: "08", name: "Get paid", status: "Settled", desc: "Verified conditions enable settlement. The completed deal builds reputation.", C: GetPaidStage },
];
const STATES: StatusState[] = ["scouting", "active", "negotiating", "awaiting", "active", "active", "verifying", "settled"];
const BOUNDARIES = [0, 0.1, 0.2, 0.34, 0.52, 0.64, 0.76, 0.88, 1];
const N = STAGES.length;

export function HowItWorks() {
  const compact = useMediaQuery("(max-width: 1023px), (max-height: 700px)");
  const reduced = useReducedMotion();
  return compact || reduced ? <Mobile /> : <Desktop />;
}

/* ================= DESKTOP — sticky scroll ================= */
function Desktop() {
  const track = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1200);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  useEffect(() => {
    if (!viewport.current) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(viewport.current);
    return () => observer.disconnect();
  }, []);

  /* 0 → N continuous stage position */
  const stageFloat = useTransform(scrollYProgress, BOUNDARIES, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(stageFloat, "change", (v) => setActive(Math.min(N - 1, Math.max(0, Math.floor(v)))));

  /* progress inside the current stage */
  const cardWidth = Math.min(820, width * 0.76);
  const targetX = useTransform(stageFloat, (v) => (width - cardWidth) / 2 - Math.min(N - 1, Math.floor(v)) * (cardWidth + 24));
  const x = useSpring(targetX, { stiffness: 230, damping: 32, restDelta: 0.2 });

  /* rail fill reaches node i at i/(N-1) */
  const fill = useTransform(stageFloat, (v) => Math.min(1, v / (N - 1)));

  /* loop-back arc draws near the end */
  const loop = useTransform(scrollYProgress, [0.96, 1], [0, 1]);
  const loopOpacity = useTransform(scrollYProgress, [0.96, 0.985], [0, 1]);
  const goTo = (index: number) => {
    if (!track.current) return;
    const target = Math.max(0, Math.min(N - 1, index));
    const progress = BOUNDARIES[target] + (BOUNDARIES[target + 1] - BOUNDARIES[target]) * 0.22;
    window.scrollTo({ top: track.current.getBoundingClientRect().top + window.scrollY + progress * (track.current.offsetHeight - window.innerHeight), behavior: "smooth" });
  };

  return (
    <section id="how" className="how" ref={track} aria-label="How Pact works: interactive product journey">
      <div className="how-sticky">
        {/* header */}
        <div className="how-head"><div><span className="eyebrow">How Pact works</span><h2 className="how-title">Your agent handles the work.<br /><span>You approve the deal.</span></h2></div><div className="how-header-note"><span className="demo-note">Interactive product tour</span><span className="mono">Scroll to follow a deal <Arrow direction="down" /></span></div></div>
        {/* pipeline rail */}
        <div className="rail-wrap">
          <div className="rail">
            <div className="rail-line" /><motion.div className="rail-fill" style={{ scaleX: fill }} />
            <div className="rail-nodes">{STAGES.map((s, i) => <button key={s.num} onClick={() => goTo(i)} aria-label={`View stage ${s.num}: ${s.name}`} aria-current={i === active ? "step" : undefined} className={`rail-node ${i === active ? "active" : ""} ${i < active ? "done" : ""}`}><span className="rail-num mono">{s.num}</span><span className="rail-name">{s.name}</span></button>)}</div>
          </div>
          {/* loop back to scout */}
          <svg className="rail-loop" viewBox="0 0 1000 32" fill="none" aria-hidden><motion.path d="M946 2 C800 34 200 34 54 2" stroke="var(--lime-line)" strokeWidth="1" style={{ pathLength: loop }} /><motion.path d="M50 10 L54 2 L64 6" stroke="var(--lime)" style={{ opacity: loopOpacity }} /></svg>
        </div>
        {/* stage card */}
        <div className="journey-viewport" ref={viewport}>
          <motion.div className="journey-track" style={{ x }}>
            {STAGES.map((stage, i) => <JourneyCard key={stage.num} stage={stage} index={i} active={active === i} stageFloat={stageFloat} width={cardWidth} />)}
          </motion.div>
        </div>
        <div className="journey-controls"><div className="journey-position"><span className="journey-position-number">0{active + 1}<span> / 08</span></span><span className="demo-note">Illustrative deal · Example values</span></div><motion.span className="journey-repeat" style={{ opacity: loopOpacity }}>Then your agent finds the next one.</motion.span><div className="journey-buttons"><button aria-label="Previous stage" onClick={() => goTo(active - 1)} disabled={active === 0}><span className="reverse-arrow"><Arrow /></span></button><button aria-label={active === 7 ? "Back to Scout" : "Next stage"} onClick={() => goTo(active === 7 ? 0 : active + 1)}>{active === 7 ? "↺" : <Arrow />}</button></div></div>
      </div>
    </section>
  );
}

function JourneyCard({ stage, index, active, stageFloat, width }: { stage: (typeof STAGES)[number]; index: number; active: boolean; stageFloat: MotionValue<number>; width: number }) {
  const sub = useTransform(stageFloat, (value) => Math.min(1, Math.max(0, (value - index) * 1.1)));
  return (
    <article className={`how-card panel ${active ? "is-active" : ""}`} style={{ width }} inert={!active} aria-hidden={!active}>
      <div className="how-card-head"><div className="how-card-id"><span className="how-num">{stage.num}</span><h3 className="how-name">{stage.name}</h3></div><StatusBadge state={STATES[index]}>{stage.status}</StatusBadge></div>
      <div className="how-card-body"><stage.C sub={sub} /></div>
      <div className="how-card-foot"><p className="how-desc">{stage.desc}</p><span className="how-card-arrow"><Arrow /></span></div>
    </article>
  );
}

/* ================= MOBILE — vertical spine ================= */
function Mobile() {
  return (
    <section id="how" className="how how-mobile">
      <div className="how-m-head"><span className="eyebrow">How Pact works</span><h2 className="section-title">Your agent handles the work.<br />You approve the deal.</h2><span className="demo-note">Product tour · All values are illustrative</span></div>
      <div className="m-flow">{STAGES.map((s, i) => <MStage key={s.num} s={s} index={i} />)}<a href="#how" className="m-loop">↺ Then your agent finds the next one.</a></div>
    </section>
  );
}

function MStage({ s, index }: { s: (typeof STAGES)[number]; index: number }) {
  const [ref, sub] = useLoopedSub<HTMLDivElement>(6.5, 3);
  const inView = useInView(ref, { margin: "-10% 0px" });
  return (
    <div ref={ref} className={`m-stage ${inView ? "is-active" : ""}`}>
      <div className="m-spine"><span className="m-dot" /><span className="m-line" /></div>
      <article className="m-card panel"><div className="how-card-head"><div className="how-card-id"><span className="how-num">{s.num}</span><h3 className="how-name">{s.name}</h3></div><StatusBadge state={STATES[index]}>{s.status}</StatusBadge></div><div className="how-card-body"><s.C sub={sub} /></div><div className="how-card-foot"><p className="how-desc">{s.desc}</p></div></article>
    </div>
  );
}
