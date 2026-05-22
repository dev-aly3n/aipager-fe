"use client";

// Multi-session orchestration section
import { useEffect, useState } from "react";
import { Icon, PhoneFrame, PersistentKeyboard, TapPing, ChatMessageView, type ChatMsg, type StatusMsg } from "@/components/landing/ui";

// Gerunds the busy session's status cycles through, in place — same idea as the
// hero/demo "Thinking…" bubble (the real bot edits one message, it never stacks).
const BUSY_VERBS = ["Editing", "Analyzing", "Reasoning", "Editing"] as const;

type SessionStatus = "busy" | "idle" | "live";

type SessionTile = {
  name: string;
  status: SessionStatus;
  statusLabel: string;
  model: string;
  activity: string;
  ctx: string;
};

const SESSION_TILES: SessionTile[] = [
  {
    name: "jim",
    status: "busy",
    statusLabel: "busy",
    model: "sonnet 4.5",
    activity: "Editing src/server/handlers.ts",
    ctx: "ctx 42% · $0.31",
  },
  {
    name: "john",
    status: "idle",
    statusLabel: "idle",
    model: "opus 4.5",
    activity: "Waiting for next prompt",
    ctx: "ctx 12% · $0.04",
  },
  {
    name: "tim",
    status: "live",
    statusLabel: "ready",
    model: "haiku 4.5",
    activity: "Permission requested: bash",
    ctx: "needs you",
  },
];

// One dashboard-style status bubble per session (matches real aipager:
// one rich status message per session, not stacked plain bot bubbles).
const SESSION_CHAT_FRAMES: { pick: string; msgs: ChatMsg[] }[] = [
  {
    pick: "jim",
    msgs: [
      { id: "jim-sys", kind: "system", text: "switched → jim" },
      {
        id: "jim-st",
        kind: "status",
        emoji: "gear",
        session: "jim",
        verb: "busy · sonnet 4.5",
        spinner: true,
        tools: [
          { status: "done", verb: "Edit", target: "src/server/handlers.ts:142" },
          { status: "pending", verb: "Edit", target: "src/server/handlers.ts:201" },
        ],
      } satisfies StatusMsg,
    ],
  },
  {
    pick: "john",
    msgs: [
      { id: "john-sys", kind: "system", text: "switched → john" },
      {
        id: "john-st",
        kind: "status",
        emoji: "check",
        session: "john",
        verb: "idle · opus 4.5",
        spinner: false,
        summary: "ctx 12% · $0.04 · 88 lines\nwaiting for next prompt",
      } satisfies StatusMsg,
    ],
  },
  {
    pick: "tim",
    msgs: [
      { id: "tim-sys", kind: "system", text: "switched → tim" },
      {
        id: "tim-st",
        kind: "status",
        emoji: "lock",
        session: "tim",
        verb: "needs you · haiku 4.5",
        spinner: false,
        permissionCmd: "rm -rf node_modules",
        hasKeyboard: true,
      } satisfies StatusMsg,
    ],
  },
];

export function Sessions() {
  const [pick, setPick] = useState(0);
  // Bumped on every switch (auto or tap) to replay the tap-feedback ping.
  const [tapKey, setTapKey] = useState(0);
  // Live animation for the active busy session.
  const [elapsed, setElapsed] = useState(0);
  const [verbIdx, setVerbIdx] = useState(0);

  // Auto-rotate the active session unless user interacts
  const [userPicked, setUserPicked] = useState(false);
  useEffect(() => {
    if (userPicked) return;
    const id = setInterval(() => {
      setPick((p) => (p + 1) % SESSION_CHAT_FRAMES.length);
      setTapKey((k) => k + 1);
    }, 3600);
    return () => clearInterval(id);
  }, [userPicked]);

  const frame = SESSION_CHAT_FRAMES[pick];
  const activeName = frame.pick;
  const activeBusy =
    SESSION_TILES.find((t) => t.name === activeName)?.status === "busy";

  // Animate the busy session's status in place — rotating verb + ticking
  // elapsed — exactly like a live "Thinking…" bubble. Idle / needs-you
  // sessions stay still (they aren't working).
  useEffect(() => {
    setElapsed(0);
    setVerbIdx(0);
    if (!activeBusy) return;
    const e = setInterval(() => setElapsed((s) => s + 1), 1000);
    const v = setInterval(() => setVerbIdx((i) => i + 1), 1500);
    return () => {
      clearInterval(e);
      clearInterval(v);
    };
  }, [pick, activeBusy]);

  // Inject the live verb/elapsed into the active busy session's bubble.
  const msgs: ChatMsg[] = frame.msgs.map((m) =>
    m.kind === "status" && activeBusy
      ? { ...m, verb: BUSY_VERBS[verbIdx % BUSY_VERBS.length], elapsed, spinner: true }
      : m,
  );

  return (
    <section className="section" id="sessions">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Multi-session</span>
          <h2 className="h2">Run a whole team of agents.<br/>From one chat.</h2>
          <p className="lead">
            Launch parallel Claude sessions with <code style={{ fontFamily: "var(--font-mono)", color: "var(--fg-2)", background: "var(--bg-elev)", padding: "1px 6px", borderRadius: 5, border: "1px solid var(--line-2)" }}>/new</code>, each with its own context and model. Tap a name to switch. Prefix any message with the session name to DM it without switching.
          </p>
        </div>

        <div className="sessions-grid">
          <div className="sessions-stage">
            <div className="session-cluster">
              {SESSION_TILES.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  className={`session-tile ${activeName === s.name ? "active" : ""}`}
                  onClick={() => {
                    setUserPicked(true);
                    const idx = SESSION_CHAT_FRAMES.findIndex((f) => f.pick === s.name);
                    if (idx >= 0) setPick(idx);
                    setTapKey((k) => k + 1);
                  }}
                  style={{ textAlign: "left", cursor: "pointer" }}
                >
                  <div className="name">
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: s.status === "busy" ? "var(--warn)" : s.status === "idle" ? "var(--fg-4)" : "var(--live)" }}></span>
                    {s.name}
                    <span className="pill" style={{ marginLeft: "auto" }}>{s.model}</span>
                  </div>
                  <span className={`pill ${s.status}`} style={{ width: "max-content" }}>{s.statusLabel}</span>
                  <span className="activity">{s.activity}</span>
                  <span className="model">{s.ctx}</span>
                  {activeName === s.name && tapKey > 0 && <TapPing key={tapKey} />}
                </button>
              ))}
            </div>

            <div className="session-flow">
              <span className="flow-chip">/new jim</span>
              <span className="flow-arrow">→</span>
              <span className="flow-chip">/jim ship the docs</span>
              <span className="flow-arrow">→</span>
              <span className="flow-chip">tap john to switch</span>
              <span className="flow-arrow">→</span>
              <span className="flow-chip">/kill tim</span>
            </div>
          </div>

          <PhoneFrame sessionName={`aipager · ${activeName}`} status={`${SESSION_TILES.find((t) => t.name === activeName)?.statusLabel}`}>
            <div className="chat-body" style={{ minHeight: 280, paddingBottom: 6 }}>
              <div className="chat-day">Today</div>
              {msgs.map((m) => (
                <ChatMessageView key={m.id} msg={m} />
              ))}
            </div>
            <div className="reply-bar">
              <span className="icon"><Icon name="paperclip" size={16} /></span>
              <div className="reply-input" style={{ color: "var(--fg-4)" }}>Message</div>
              <span className="icon"><Icon name="mic" size={16} /></span>
            </div>
            <PersistentKeyboard activeName={activeName} tapTrigger={tapKey} />
          </PhoneFrame>
        </div>
      </div>
    </section>
  );
}
