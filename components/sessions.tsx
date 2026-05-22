"use client";

// Multi-session orchestration section
import { useEffect, useState } from "react";
import { PhoneFrame, PersistentKeyboard } from "@/components/landing/ui";

type SessionStatus = "busy" | "idle" | "live";

type SessionTile = {
  name: string;
  status: SessionStatus;
  statusLabel: string;
  model: string;
  activity: string;
  ctx: string;
};

type SessionChatFrame = {
  pick: string;
  items: { kind: string; text: string }[];
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

const SESSION_CHAT_FRAMES: SessionChatFrame[] = [
  // Each "frame" is what the chat shows after tapping a session pill
  {
    pick: "jim",
    items: [
      { kind: "system", text: "switched → jim" },
      { kind: "bot", text: "● jim — busy · sonnet 4.5" },
      { kind: "bot", text: "› Editing src/server/handlers.ts:142" },
      { kind: "bot", text: "› Editing src/server/handlers.ts:201" },
    ],
  },
  {
    pick: "john",
    items: [
      { kind: "system", text: "switched → john" },
      { kind: "bot", text: "● john — idle · opus 4.5" },
      { kind: "bot", text: "ctx 12% · $0.04 · 88 lines" },
    ],
  },
  {
    pick: "tim",
    items: [
      { kind: "system", text: "switched → tim" },
      { kind: "bot", text: "● tim — needs you · haiku 4.5" },
      { kind: "bot", text: "⚠ Permission: bash · rm -rf node_modules" },
    ],
  },
];

export function Sessions() {
  const [pick, setPick] = useState(0);

  // Auto-rotate the active session unless user interacts
  const [userPicked, setUserPicked] = useState(false);
  useEffect(() => {
    if (userPicked) return;
    const id = setInterval(() => setPick((p) => (p + 1) % SESSION_CHAT_FRAMES.length), 3200);
    return () => clearInterval(id);
  }, [userPicked]);

  const frame = SESSION_CHAT_FRAMES[pick];
  const activeName = frame.pick;

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
              {frame.items.map((m, i) => {
                if (m.kind === "system") return <div className="msg system" key={i}>{m.text}</div>;
                return (
                  <div className="msg bot" key={i}>
                    <span>{m.text}</span>
                    <span className="time">9:41</span>
                  </div>
                );
              })}
            </div>
            <PersistentKeyboard activeName={activeName} />
          </PhoneFrame>
        </div>
      </div>
    </section>
  );
}
