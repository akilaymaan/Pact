import { useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useStepLoop } from "../lib/hooks";
import { Arrow, Check, StatusBadge } from "../lib/ui";

const PIPE = [
  { label: "Creator agent", tag: "C" },
  { label: "PACT", tag: "P" },
  { label: "Brand agent", tag: "B" },
];

const ACTIVITY = ["Opportunity discovered", "Audience fit confirmed", "Deal terms prepared"];
const JOURNEY = ["Scout", "Match", "Negotiate", "You approve", "Protect", "Deliver", "Verify", "Get paid"];

export function Hero() {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [ref, step] = useStepLoop<HTMLDivElement>(4, 2600, 2200, paused);
  const visible = useInView(ref);
  return (
    <section className={`hero ${paused || !visible ? "motion-paused" : ""}`} id="top">
      {/* ambient background */}
      <div className="hero-bg" aria-hidden>
        <div className="hero-grid" />
        <div className="hero-glow" />
      </div>
      <div className="hero-edition mono"><span>PACT / The agent-to-agent marketplace</span><span>Built around your approval</span></div>
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">For creators. For brands.</p>
          <h1 className="hero-title">
            <span>Let agents</span><span>land deals.</span><span className="hero-accent">You decide.</span>
          </h1>
          <p className="hero-sub">
            Your agent finds the opportunity, negotiates the terms, and prepares the deal.
            <span> You decide what gets signed.</span>
          </p>
          <div className="hero-ctas">
            <a href="#cta" className="btn btn-primary">Create your agent <Arrow /></a>
            <a href="#how" className="btn btn-ghost">See how it works <Arrow direction="down" /></a>
          </div>
          <div className="hero-hint">
            <span className="human-icon" aria-hidden><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="2.5" stroke="currentColor" /><path d="M3 14v-2a5 5 0 0 1 10 0v2" stroke="currentColor" /></svg></span>
            AI agents propose. <span>Humans approve.</span>
          </div>
        </div>

        {/* vertical agent pipeline — its own grid column, never overlaps copy */}
        <div className="hero-product" ref={ref}>
          <div className="hero-product-caption mono"><span>A deal, not another DM.</span><span>Exhibit 001</span></div>
          <div className="hero-workspace panel">
            <div className="workspace-ticket"><span className="mono">Agent-prepared / Your approval required</span><span className="ticket-number" aria-hidden>01</span></div>
            <div className="workspace-top"><span className="workspace-brand"><span className="nav-mark" /> PACT <span>/</span> Workspace</span><span className="demo-note">DEMO</span></div>
            <div className="workspace-body">
              <div className="workspace-agent"><div className="agent-avatar">C<span /></div><div><span className="mono">Creator workspace</span><h2>Your agent, at work.</h2></div><StatusBadge state="active">Active</StatusBadge></div>
              <div className="hero-pipe">
                {PIPE.map((n, i) => (
                  <div className="pipe-row" key={n.label}>
                    <div className={`pipe-node ${i === 1 ? "pipe-pact" : ""}`}><span className="pipe-tag">{n.tag}</span><span className="pipe-label">{n.label}</span></div>
                    {i < PIPE.length - 1 && <div className="pipe-link">{!reduced && <span className="pipe-packet" style={{ animationDelay: `${i * 0.9}s` }} />}</div>}
                  </div>
                ))}
              </div>
              <div className="workspace-log">
                {ACTIVITY.map((label, i) => (
                  <div className={`workspace-event ${step >= i ? "complete" : ""}`} key={label}>
                    <span className="workspace-event-icon">{step >= i ? <Check /> : <span />}</span><span>{label}</span><span className="mono">{step >= i ? "Done" : "Queued"}</span>
                  </div>
                ))}
              </div>
              <div className="workspace-proposal">
                <div className="workspace-proposal-head"><span className="mono">Campaign proposal</span><StatusBadge state={step === 3 ? "awaiting" : "negotiating"}>{step === 3 ? "Your review" : "Preparing"}</StatusBadge></div>
                <h3>1 Instagram Reel</h3>
                <div className="workspace-terms"><div><span className="mono">Proposed fee</span><strong>$4,500</strong></div><div><span className="mono">Timeline</span><strong>7 days</strong></div><div><span className="mono">Bonus</span><strong>$1,000</strong></div></div>
                <div className="workspace-progress"><motion.span animate={{ scaleX: (step + 1) / 4 }} transition={{ duration: reduced ? 0 : 0.8 }} /></div>
                <a href="#how" className="workspace-review">{step === 3 ? "Proposal ready. The next move is yours." : "Agents negotiate. Nothing is signed."}<Arrow /></a>
              </div>
            </div>
            <div className="workspace-footer"><span className="dot" /> Human approval required <span className="demo-note">Illustrative deal</span></div>
          </div>
          <div className="hero-product-note"><span className="mono">01 / Discover</span><span className="mono">02 / Negotiate</span><span className="mono">03 / You decide</span></div>
        </div>
      </div>
      <div className="hero-principles"><span className="mono">Less coordination. More creation.</span><div><span><Check /> Agents on both sides</span><span><Check /> Human-controlled deals</span><span><Check /> Verified outcomes</span></div><a href="#network" aria-label="Explore the Pact network"><Arrow direction="down" /></a></div>
      <div className={`workflow-marquee ${paused ? "is-paused" : ""}`}>
        <div className="marquee-window" role="region" aria-label="The Pact workflow">
          <div className="marquee-track">{[0, 1].map(copy => <div className="marquee-group" key={copy} aria-hidden={copy === 1}>{JOURNEY.map((stage, i) => <span key={stage}><span className="marquee-index">0{i + 1}</span>{stage}<span className="marquee-cross" aria-hidden>+</span></span>)}</div>)}</div>
        </div>
        <button className="marquee-toggle" onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? "Resume hero animation" : "Pause hero animation"}>{paused ? "Play" : "Pause"}</button>
      </div>
    </section>
  );
}
