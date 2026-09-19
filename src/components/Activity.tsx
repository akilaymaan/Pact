import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Section, Reveal, Check, StatusBadge } from "../lib/ui";

/* fictional demonstration events */
const EVENTS = [
  "Scouted campaign — skincare launch",
  "Found a strong match · fit 91%",
  "Opened negotiation",
  "Counter received — $4,800",
  "Terms updated — $4,500 + bonus",
  "Proposal ready for review",
  "You approved the proposal",
  "Deal funded — escrow secured",
  "Campaign delivered — Instagram Reel",
  "Performance verified",
  "Reputation updated — Gold",
];

const OFFSETS = [0, 7, 19, 26, 41, 58, 75, 90, 118, 140, 163];
const BASE = 9 * 3600 + 41 * 60; // 09:41:00

function stamp(sec: number) {
  const h = Math.floor(sec / 3600) % 24;
  const m = Math.floor(sec / 60) % 60;
  const s = Math.floor(sec) % 60;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(s)}`;
}

type Item = { id: number; text: string; time: string };

export function Activity() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const [items, setItems] = useState<Item[]>(() => EVENTS.slice(0, 6).map((text, i) => ({ id: i, text, time: stamp(BASE + OFFSETS[i]) })).reverse());
  const [paused, setPaused] = useState(false);
  const idx = useRef(6);

  useEffect(() => {
    if (!inView || reduced || paused) return;
    const push = () => {
      const i = idx.current;
      const loop = Math.floor(i / EVENTS.length);
      const sec = BASE + OFFSETS[i % EVENTS.length] + loop * 190;
      setItems((prev) =>
        [{ id: i, text: EVENTS[i % EVENTS.length], time: stamp(sec) }, ...prev].slice(0, 6)
      );
      idx.current += 1;
    };
    const t = setInterval(push, 3400);
    return () => clearInterval(t);
  }, [inView, reduced, paused]);

  return (
    <Section
      className="activity-section split-section"
      eyebrow="Agent activity"
      title="YOUR AGENT DOESN'T SLEEP."
      sub="While you do the work only you can do, your agent keeps the pipeline moving."
    >
      <Reveal>
        <div className="act panel" ref={ref}>
          <div className="act-head">
            <StatusBadge state={paused ? "awaiting" : "active"}>{paused ? "Demo paused" : "Agent active"}</StatusBadge>
            <div><span className="demo-note">Demo feed</span><button className="demo-control" onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? "Resume" : "Pause"}</button></div>
          </div>
          <div className="act-list">
            <AnimatePresence initial={false}>
              {items.map((it) => (
                <motion.div
                  key={it.id}
                  className="act-row"
                  layout
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="act-check"><Check /></span>
                  <span className="act-text">{it.text}</span>
                  <time className="act-time mono" dateTime={it.time} title={`Example event at ${it.time}`}>{(items[0].id - it.id) * 2 || "Just"}{items[0].id === it.id ? " now" : "m ago"}</time>
                </motion.div>
              ))}
            </AnimatePresence>
            {items.length === 0 && <div className="act-empty mono">Waiting for agent…</div>}
          </div>
          <div className="act-foot"><span className="demo-note">Fictional events · Simulated timing</span><span className="demo-note">Human-controlled workflow</span></div>
        </div>
      </Reveal>
    </Section>
  );
}
