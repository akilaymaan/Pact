import { useEffect, useState } from "react";
import {
  motion,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { AgentTag, Check } from "../../lib/ui";

/* ---------- helpers ---------- */

/** boolean flag that flips when sub crosses threshold */
export function useSubFlag(sub: MotionValue<number>, t: number) {
  const [on, setOn] = useState(false);
  useMotionValueEvent(sub, "change", (v) => {
    const b = v >= t;
    if (b !== on) setOn(b);
  });
  useEffect(() => {
    setOn(sub.get() >= t);
  }, [sub, t]);
  return on;
}

/** reveals children once sub passes `at` */
function At({
  sub,
  at,
  span = 0.1,
  y = 4,
  className,
  children,
}: {
  sub: MotionValue<number>;
  at: number;
  span?: number;
  y?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const opacity = useTransform(sub, [at, at + span], [0.35, 1], { clamp: true });
  const yy = useTransform(sub, [at, at + span], [y, 0], { clamp: true });
  return (
    <motion.div className={className} style={{ opacity, y: yy }}>
      {children}
    </motion.div>
  );
}

function GrowX({ sub, at, span = 0.18, className }: { sub: MotionValue<number>; at: number; span?: number; className?: string }) {
  const scaleX = useTransform(sub, [at, at + span], [0, 1], { clamp: true });
  return <motion.div className={className} style={{ scaleX }} />;
}

/* ============================================================
   01 — SCOUT
============================================================ */

const SCOUT_ROWS = [
  { name: "Skincare launch — Q3", fit: "91%" },
  { name: "Audio brand — creator push", fit: "88%" },
  { name: "Fitness app — reels program", fit: "86%" },
];

export function ScoutStage({ sub }: { sub: MotionValue<number> }) {
  const found = useSubFlag(sub, 0.62);
  return (
    <div className="stage-body scout">
      <div className="scan-list">
        <div className="scan-beam" />
        {SCOUT_ROWS.map((r, i) => (
          <At key={r.name} sub={sub} at={0.08 + i * 0.14} className={`scan-row ${found && i === 1 ? "hit" : ""}`}>
            <span className="scan-dot" />
            <span className="scan-name">{r.name}</span>
            <span className="scan-fit mono">fit {r.fit}</span>
          </At>
        ))}
        <At sub={sub} at={0.62} className="scan-found">
          <span className="chip lime"><Check /> Opportunity found</span>
        </At>
      </div>
      <div className="scan-side mono">
        <span className="scan-agent-title">Your agent</span>
        <At sub={sub} at={0.05}>Scanning campaigns…</At>
        <At sub={sub} at={0.2}>Finding relevant brands…</At>
        <At sub={sub} at={0.35}>Filtering opportunities…</At>
      </div>
    </div>
  );
}

/* ============================================================
   02 — MATCH
============================================================ */

const MATCH_ATTRS = ["Audience fit", "Niche", "Engagement", "Campaign requirements"];

export function MatchStage({ sub }: { sub: MotionValue<number> }) {
  const matched = useSubFlag(sub, 0.8);
  return (
    <div className="stage-body match">
      <div className="match-agents">
        <At sub={sub} at={0.05}>
          <AgentTag kind="creator" label="Creator agent" active={matched} />
        </At>
        <div className="match-link">
          <GrowX sub={sub} at={0.2} span={0.25} className="match-line" />
        </div>
        <At sub={sub} at={0.12}>
          <AgentTag kind="brand" label="Brand agent" active={matched} />
        </At>
      </div>
      <div className="match-attrs">
        {MATCH_ATTRS.map((a, i) => (
          <At key={a} sub={sub} at={0.38 + i * 0.1}>
            <span className="match-attribute"><Check /> {a}</span>
          </At>
        ))}
      </div>
      <At sub={sub} at={0.8} className="match-result">
        <span className="chip lime"><Check /> Match found</span>
      </At>
    </div>
  );
}

/* ============================================================
   03 — NEGOTIATE
============================================================ */

const OFFERS = [
  { from: "brand", text: "$4,000", at: 0.1 },
  { from: "creator", text: "$4,800", at: 0.3 },
  { from: "brand", text: "$4,500 + performance bonus", at: 0.5 },
];

export function NegotiateStage({ sub }: { sub: MotionValue<number> }) {
  const agreed = useSubFlag(sub, 0.72);
  return (
    <div className="stage-body negotiate">
      <div className="neg-wire">
        <div className="neg-heads">
          <AgentTag kind="creator" label="Creator agent" active={agreed} />
          <AgentTag kind="brand" label="Brand agent" active={agreed} />
        </div>
        <div className="neg-stream">
          {OFFERS.map((o) => (
            <At key={o.text} sub={sub} at={o.at} className={`neg-offer ${o.from}`}>
              <span className="mono">{o.from === "brand" ? "Brand offer" : "Creator counter"}</span><span className="neg-bubble">{o.text}</span>
            </At>
          ))}
          <At sub={sub} at={0.72} className="neg-offer center">
            <span className="neg-bubble agreed"><Check /> Terms agreed</span>
          </At>
        </div>
      </div>
      <div className="neg-transcript">
        <span className="mono">Structured proposal</span>
        <At sub={sub} at={0.3}><span className="mono">Deliverable</span><strong>1 Instagram Reel</strong></At>
        <At sub={sub} at={0.5}><span className="mono">Timeline / Usage</span><strong>7 days / Organic</strong></At>
        <At sub={sub} at={0.72}><span className="mono">Next step</span><strong>Human review required</strong></At>
      </div>
    </div>
  );
}

/* ============================================================
   04 — APPROVE
============================================================ */

const PROPOSAL: [string, string][] = [
  ["Creator", "@creator"],
  ["Brand", "Brand"],
  ["Deliverable", "1 Instagram Reel"],
  ["Fee", "$4,500"],
  ["Performance bonus", "$1,000"],
  ["Deadline", "7 days"],
];

export function ApproveStage({ sub }: { sub: MotionValue<number> }) {
  const glow = useSubFlag(sub, 0.55);
  const [decision, setDecision] = useState<"pending" | "approved" | "declined" | "changes">("pending");
  const approved = decision === "approved";
  const feedback = { pending: "Demo only. No deal is signed and no funds move.", approved: "Demo approved by you. No real commitment was made.", declined: "Demo declined. Your agent will look for another fit.", changes: "Changes requested. Your agent would revise the terms." };
  return (
    <div className="stage-body approve">
      <div className="proposal">
        <div className="proposal-head mono">
          Proposal ready
          <span className={`chip ${approved ? "lime stamp" : ""}`}>{approved ? <><Check /> Approved by you</> : "Your decision"}</span>
        </div>
        <div className="proposal-rows">
          {PROPOSAL.map(([k, v], i) => (
            <At key={k} sub={sub} at={0.04 + i * 0.05} span={0.07} className="proposal-row">
              <span className="mono">{k}</span>
              <span className="proposal-val">{v}</span>
            </At>
          ))}
        </div>
        <div className="proposal-actions">
          <button className="pact-btn ghost" onClick={() => setDecision("declined")}>Decline</button>
          <button className="pact-btn ghost" onClick={() => setDecision("changes")}>Request changes</button>
          <span className={`approve-wrap ${glow && !approved ? "glow" : ""}`}>
            <button className="pact-btn approve" onClick={() => setDecision("approved")} disabled={approved}>{approved ? "Approved" : "Approve deal"}</button>
          </span>
        </div>
        <p className="proposal-feedback" role="status">{feedback[decision]}</p>
        {decision !== "pending" && <button className="proposal-reset" onClick={() => setDecision("pending")}>Reset demo</button>}
      </div>
      <div className="approve-statement">
        <At sub={sub} at={0.3}>
          <p>AI proposes.</p>
        </At>
        <At sub={sub} at={0.45}>
          <p className="lime-text">You approve.</p>
        </At>
      </div>
    </div>
  );
}

/* ============================================================
   05 — PROTECT
============================================================ */

export function ProtectStage({ sub }: { sub: MotionValue<number> }) {
  const funded = useSubFlag(sub, 0.72);
  return (
    <div className="stage-body protect">
      <div className="protect-card">
        <At sub={sub} at={0.08} className="protect-head">
          <span className="mono">Protected payment</span>
          <span className={`chip ${funded ? "lime" : ""}`}>{funded ? "✓ Funded" : "Funding…"}</span>
        </At>
        <At sub={sub} at={0.18} className="protect-amount">
          $4,500
        </At>
        <At sub={sub} at={0.28} className="protect-escrow mono">
          Secure escrow
        </At>
        <div className="protect-parties">
          {["Brand", "Creator", "Escrow"].map((p, i) => (
            <At key={p} sub={sub} at={0.42 + i * 0.1} className="protect-party">
              <span className="party-check"><Check /></span>
              {p}
            </At>
          ))}
        </div>
      </div>
      <At sub={sub} at={0.5} className="protect-note">
        Funds are protected before the creator delivers.
      </At>
    </div>
  );
}

/* ============================================================
   06 — DELIVER
============================================================ */

export function DeliverStage({ sub }: { sub: MotionValue<number> }) {
  const done = useSubFlag(sub, 0.66);
  return (
    <div className="stage-body deliver">
      <div className="deliver-card">
        <div className="deliver-head">
          <span className={`chip ${done ? "lime" : ""}`}>{done ? "Delivered" : "Campaign active"}</span>
          <span className="mono">Deadline · 7 days</span>
        </div>
        <At sub={sub} at={0.1} className="deliver-item">
          <span className="deliver-thumb">Reel</span>
          <div className="deliver-meta">
            <span className="deliver-name">Instagram Reel</span>
            <At sub={sub} at={0.4} className="deliver-auth mono">
              <Check /> Authenticity verified
            </At>
          </div>
        </At>
        <div className="delivery-progress"><GrowX sub={sub} at={0.15} span={0.55} className="delivery-progress-fill" /></div>
        <div className="deliver-checklist">
          <At sub={sub} at={0.55} className="deliver-check">
            <span className="party-check"><Check /></span> Deliverable submitted
          </At>
          <At sub={sub} at={0.68} className="deliver-check">
            <span className="party-check"><Check /></span> Tracked against agreed terms
          </At>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   07 — VERIFY
============================================================ */

function Metric({
  sub,
  label,
  to,
  fmt,
  at,
}: {
  sub: MotionValue<number>;
  label: string;
  to: number;
  fmt: (v: number) => string;
  at: number;
}) {
  const v = useTransform(sub, [at, 0.78], [label === "Views" ? 73 : to * 0.7, to], { clamp: true });
  const text = useTransform(v, fmt);
  const o = useTransform(sub, [at, at + 0.08], [0.6, 1], { clamp: true });
  return (
    <motion.div className="metric" style={{ opacity: o }}>
      <motion.span className="metric-val"><motion.span>{text}</motion.span></motion.span>
      <span className="mono">{label}</span>
    </motion.div>
  );
}

export function VerifyStage({ sub }: { sub: MotionValue<number> }) {
  const verified = useSubFlag(sub, 0.85);
  const bars = [38, 52, 44, 63, 71, 82, 90, 100];
  return (
    <div className="stage-body verify">
      <div className="verify-metrics">
        <Metric sub={sub} at={0.1} to={104} fmt={(v) => `${Math.round(v)}K`} label="Views" />
        <Metric sub={sub} at={0.2} to={8.2} fmt={(v) => `${v.toFixed(1)}K`} label="Engagement" />
        <Metric sub={sub} at={0.3} to={73} fmt={(v) => `${Math.round(v)}%`} label="Completion" />
        <Metric sub={sub} at={0.4} to={2.4} fmt={(v) => `${v.toFixed(1)}%`} label="CTR" />
      </div>
      <div className="verify-chart">
        {bars.map((h, i) => {
          return <Bar key={i} sub={sub} at={0.25 + i * 0.05} h={h} />;
        })}
      </div>
      <At sub={sub} at={0.85} className="verify-result">
        <span className={`chip ${verified ? "lime" : ""}`}><Check /> Performance verified</span>
      </At>
    </div>
  );
}

function Bar({ sub, at, h }: { sub: MotionValue<number>; at: number; h: number }) {
  const scaleY = useTransform(sub, [at, at + 0.15], [0, 1], { clamp: true });
  return (
    <div className="vbar">
      <motion.div className="vbar-fill" style={{ scaleY, height: `${h}%` }} />
    </div>
  );
}

/* ============================================================
   08 — GET PAID
============================================================ */

const TIERS = ["Bronze", "Silver", "Gold"];

export function GetPaidStage({ sub }: { sub: MotionValue<number> }) {
  const complete = useSubFlag(sub, 0.15);
  const tier = useSubFlag(sub, 0.55);
  return (
    <div className="stage-body getpaid">
      <div className="getpaid-main">
        <At sub={sub} at={0.08}>
          <span className={`chip ${complete ? "lime" : ""}`}><Check /> Deal complete</span>
        </At>
        <At sub={sub} at={0.2} className="getpaid-amount">
          $4,500
        </At>
        <At sub={sub} at={0.3} className="getpaid-sub mono">
          Performance verified · Creator paid
        </At>
      </div>
      <div className="getpaid-rep">
        <span className="mono">Reputation</span>
        <div className="rep-tiers">
          {TIERS.map((t, i) => (
            <At key={t} sub={sub} at={0.45 + i * 0.1}>
              <span className={`chip ${tier && i === 2 ? "lime" : ""}`}>{t}</span>
            </At>
          ))}
        </div>
      </div>
      <At sub={sub} at={0.8} className="getpaid-loop">
        <span className="loop-arrow">↺</span> Then your agent finds the next one.
      </At>
    </div>
  );
}
