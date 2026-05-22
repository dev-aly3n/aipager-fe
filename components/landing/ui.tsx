"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export function Logo({ size = 22 }: { size?: number }) {
  return (
    <span
      className="logo-mark"
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

export function CopyButton({
  text,
  className = "",
  children,
}: {
  text: string;
  className?: string;
  children?: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={`${className} ${copied ? "copied" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        navigator.clipboard?.writeText(text).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6.5l2.5 2.5L10 3.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Copied
        </>
      ) : (
        children || (
          <>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect
                x="3.5"
                y="3.5"
                width="6.5"
                height="6.5"
                rx="1.2"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M2 8V2.5a.5.5 0 01.5-.5H8"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
            Copy
          </>
        )
      )}
    </button>
  );
}

export type IconName =
  | "github"
  | "arrow"
  | "send"
  | "paperclip"
  | "mic"
  | "telegram"
  | "menu"
  | "chevron";

export function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const s = size;
  switch (name) {
    case "github":
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.33c-2.23.48-2.69-1.07-2.69-1.07-.36-.92-.89-1.17-.89-1.17-.72-.49.06-.48.06-.48.8.06 1.22.83 1.22.83.72 1.22 1.87.87 2.33.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.96 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.08-1.87 3.76-3.65 3.96.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38C13.71 14.53 16 11.54 16 8c0-4.42-3.58-8-8-8z" />
        </svg>
      );
    case "arrow":
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "send":
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 8l12-6-4 14-2.5-5.5L2 8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="currentColor" />
        </svg>
      );
    case "paperclip":
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M11.5 7.5l-4 4a2.5 2.5 0 11-3.5-3.5l5-5a1.5 1.5 0 012 2L6 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "mic":
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="6" y="2.5" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M4 7v.5a4 4 0 008 0V7M8 11.5v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "telegram":
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M14.5 1.5L1.5 6.7c-.6.2-.6.6-.1.8L4.6 8.6l8-5.1c.4-.2.7-.1.4.2L6.4 9.9 6.1 13c.3 0 .4-.1.6-.3l1.6-1.5 3.3 2.4c.6.3 1 .1 1.2-.6l2.2-10.3c.2-.9-.3-1.3-1.5-.2z" />
        </svg>
      );
    case "menu":
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 5h10M3 8h10M3 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "chevron":
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export function PhoneFrame({
  children,
  sessionName = "aipager",
  status = "online",
}: {
  children: ReactNode;
  sessionName?: string;
  status?: string;
}) {
  return (
    <div className="phone">
      <div className="phone-bar">
        <span>9:41</span>
        <div className="phone-bar-right">
          <span>5G</span>
          <div className="phone-bar-icons">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
      <div className="chat-header">
        <button
          type="button"
          style={{ color: "var(--accent)", fontSize: 14, paddingRight: 4 }}
          aria-label="back"
        >
          <Icon name="chevron" size={18} />
        </button>
        <div className="avatar">a</div>
        <div className="meta">
          <span className="name">{sessionName}</span>
          <span className="sub">{status}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

/** A quick expanding ring; mount it (key it to replay) inside a position:relative element. */
export function TapPing() {
  return <span className="tap-ping" aria-hidden="true" />;
}

export function PersistentKeyboard({
  activeName = "jim",
  tapTrigger = 0,
}: {
  activeName?: string;
  tapTrigger?: number;
}) {
  const sessions: { name: string; status: "busy" | "idle" | "live" }[] = [
    { name: "jim", status: "busy" },
    { name: "john", status: "idle" },
    { name: "tim", status: "live" },
  ];
  const activeStyle: CSSProperties = {
    borderColor: "var(--accent)",
    color: "var(--fg)",
  };
  return (
    <div className="persistent-kb">
      {sessions.map((s) => (
        <div
          key={s.name}
          className="k"
          style={s.name === activeName ? activeStyle : undefined}
        >
          <span className={`pip ${s.status}`} />
          {s.name}
          {s.name === activeName && tapTrigger > 0 && <TapPing key={tapTrigger} />}
        </div>
      ))}
      <div className="k">⏹ stop</div>
      <div className="k">☠ kill</div>
      <div className="k">Templates</div>
      <div className="k col-3" style={{ justifyContent: "space-between" }}>
        <span style={{ color: "var(--fg-3)" }}>Commands</span>
        <span style={{ color: "var(--fg-4)" }}>›</span>
      </div>
    </div>
  );
}

/* ===========================================================================
   Claude Code terminal — reproduces the real CLI TUI: ⏺ tool-call dots with
   ⎿ result lines, the animated ✻ spinner with elapsed + tokens, a permission
   box, and the rounded > input box. Driven by an append-only CCLine list.
   =========================================================================== */

const SPINNER_GLYPHS = ["·", "✢", "✳", "∗", "✻", "✽", "✻", "∗", "✳", "✢"] as const;

export type CCLine =
  | { id: string; kind: "welcome"; text: string }
  | { id: string; kind: "user"; text: string }
  | { id: string; kind: "assistant"; text: string }
  | { id: string; kind: "tool"; name: string; args: string }
  | { id: string; kind: "result"; text: string }
  | { id: string; kind: "note"; text: string; tone?: "ok" | "warn" | "dim" | "key" }
  | { id: string; kind: "spinner"; verb: string; elapsed: number; tokens?: string }
  | { id: string; kind: "perm"; tool: string; cmd: string; desc?: string };

export function ClaudeTerminal({
  title,
  lines,
  live = false,
}: {
  title: string;
  lines: CCLine[];
  live?: boolean;
}) {
  const [glyph, setGlyph] = useState(0);
  const hasSpinner = lines.some((l) => l.kind === "spinner");
  useEffect(() => {
    if (!hasSpinner) return;
    const id = setInterval(() => setGlyph((g) => (g + 1) % SPINNER_GLYPHS.length), 110);
    return () => clearInterval(id);
  }, [hasSpinner]);

  return (
    <div className="terminal">
      <div className="terminal-bar">
        <div className="terminal-dots">
          <span />
          <span />
          <span />
        </div>
        <span className="terminal-title">{title}</span>
        {live && (
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--live)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--live)" }} />
            live
          </span>
        )}
      </div>

      <div className="cc-body">
        {lines.map((l) => {
          switch (l.kind) {
            case "welcome":
              return (
                <div className="cc-welcome" key={l.id}>
                  <span className="star">✻</span>
                  <span>{l.text}</span>
                </div>
              );
            case "user":
              return (
                <div className="cc-user" key={l.id}>
                  <span className="caret">&gt;</span>
                  {l.text}
                </div>
              );
            case "assistant":
              return (
                <div className="cc-row" key={l.id}>
                  <span className="cc-dot asst">⏺</span>
                  <span className="cc-asst">{l.text}</span>
                </div>
              );
            case "tool":
              return (
                <div className="cc-row" key={l.id}>
                  <span className="cc-dot tool">⏺</span>
                  <span>
                    <span className="cc-tool-name">{l.name}</span>
                    <span className="cc-tool-args">({l.args})</span>
                  </span>
                </div>
              );
            case "result":
              return (
                <div className="cc-row" key={l.id}>
                  <span className="ind" />
                  <span className="cc-tree">⎿</span>
                  <span className="cc-result">{l.text}</span>
                </div>
              );
            case "note":
              return (
                <div className={`cc-note ${l.tone ?? "dim"}`} key={l.id}>
                  {l.text}
                </div>
              );
            case "spinner":
              return (
                <div className="cc-spin" key={l.id}>
                  <span className="glyph">{SPINNER_GLYPHS[glyph]}</span>
                  <span className="verb">{l.verb}…</span>
                  <span className="meta">
                    ({l.elapsed}s
                    {l.tokens ? ` · ↑ ${l.tokens} tokens` : ""} · esc to interrupt)
                  </span>
                </div>
              );
            case "perm":
              return (
                <div className="cc-box" key={l.id}>
                  <span className="box-title">{l.tool}</span>
                  <span className="box-cmd">{l.cmd}</span>
                  {l.desc && <span className="box-desc">{l.desc}</span>}
                  <span className="box-q">Do you want to proceed?</span>
                  <span className="box-opt sel">
                    <span className="sel-caret">❯</span> 1. Yes
                  </span>
                  <span className="box-opt">&nbsp;&nbsp; 2. Yes, and don&apos;t ask again</span>
                  <span className="box-opt">&nbsp;&nbsp; 3. No, and tell Claude what to do differently</span>
                </div>
              );
          }
        })}
      </div>

      <div className="cc-input">
        <div className="cc-prompt-box">
          <span className="caret">&gt;</span>
          <span className="ph" style={{ flex: 1 }} />
          <span className="t-cursor" />
        </div>
        <div className="cc-hint">
          <span>? for shortcuts</span>
          <span className="mode">⏵⏵ accept edits on</span>
        </div>
      </div>
    </div>
  );
}

/* ===========================================================================
   Chat engine — models the REAL aipager behavior: one status message per turn,
   edited in place (rotating verb + elapsed + a growing tool list), that
   transforms into finished / permission / compacted. NOT a bubble per tool.
   =========================================================================== */

export const THINKING_VERBS = ["Thinking", "Reasoning", "Analyzing", "Pondering"] as const;

export type StatusEmoji = "gear" | "check" | "lock" | "refresh" | "package" | "warn";

export function statusEmojiStr(e: StatusEmoji): string {
  switch (e) {
    case "gear": return "⚙️";
    case "check": return "✅";
    case "lock": return "🔐";
    case "refresh": return "🔄";
    case "package": return "📦";
    case "warn": return "⚠️";
  }
}

export interface ToolEntry {
  status: "done" | "pending";
  verb: string;
  target: string;
}

export interface StatusMsg {
  id: string;
  kind: "status";
  emoji: StatusEmoji;
  session: string;
  verb: string;
  /** show pulsing dot + ellipsis (active thinking) */
  spinner?: boolean;
  /** elapsed seconds; rendered as "… Ns" once >= 2 */
  elapsed?: number;
  tools?: ToolEntry[];
  summary?: string;
  permissionCmd?: string;
  hasKeyboard?: boolean;
  /** interactive demo: which button resolved the permission */
  resolved?: "allow" | "deny";
  onAllow?: () => void;
  onDeny?: () => void;
}

export interface UserMsg {
  id: string;
  kind: "user";
  text: string;
  reaction?: string;
  time?: string;
}

export interface SystemMsg {
  id: string;
  kind: "system";
  text: string;
}

export interface BotTextMsg {
  id: string;
  kind: "bot";
  text: string;
  time?: string;
}

export type ChatMsg = StatusMsg | UserMsg | SystemMsg | BotTextMsg;

export function StatusBubble({ msg }: { msg: StatusMsg }) {
  const showElapsed = msg.elapsed !== undefined && msg.elapsed >= 2;
  return (
    <div className="msg bot" style={{ width: "86%", maxWidth: 320 }}>
      <div className="status-head">
        <span className="label-emoji">{statusEmojiStr(msg.emoji)}</span>
        <span>
          {msg.session} · {msg.verb}
          {showElapsed ? `… ${msg.elapsed}s` : msg.spinner ? "…" : ""}
        </span>
        {msg.spinner && <span className="pip" />}
      </div>

      {msg.tools && msg.tools.length > 0 && (
        <div className="tool-list">
          {msg.tools.map((t, i) => (
            <div className="tool-entry" key={`${t.verb}-${t.target}-${i}`}>
              <span className={`ic ${t.status}`}>{t.status === "done" ? "✓" : "◌"}</span>
              <span className="v">{t.verb}:</span>
              <span className="tgt">{t.target}</span>
            </div>
          ))}
        </div>
      )}

      {msg.summary && <div className="summary">{msg.summary}</div>}

      {msg.permissionCmd && (
        <div className="permission-card" style={{ marginTop: 8 }}>
          <div className="cmd-block">{msg.permissionCmd}</div>
          {msg.hasKeyboard && (
            <div className="kb-row">
              <button
                type="button"
                className={`kb-btn allow ${msg.resolved === "allow" ? "tapped" : ""}`}
                onClick={msg.onAllow}
                disabled={!!msg.resolved || !msg.onAllow}
              >
                {msg.resolved === "allow" ? "✓ Allowed" : "Allow"}
                {msg.resolved === "allow" && <TapPing key="allow" />}
              </button>
              <button
                type="button"
                className={`kb-btn deny ${msg.resolved === "deny" ? "tapped" : ""}`}
                onClick={msg.onDeny}
                disabled={!!msg.resolved || !msg.onDeny}
              >
                {msg.resolved === "deny" ? "✗ Denied" : "Deny"}
                {msg.resolved === "deny" && <TapPing key="deny" />}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ChatMessageView({ msg }: { msg: ChatMsg }) {
  if (msg.kind === "status") return <StatusBubble msg={msg} />;
  if (msg.kind === "system") return <div className="msg system">{msg.text}</div>;
  if (msg.kind === "user") {
    return (
      <div className="msg me">
        <span>{msg.text}</span>
        <span className="time">{msg.time ?? "9:41"}</span>
        {msg.reaction && <span className="reaction">{msg.reaction}</span>}
      </div>
    );
  }
  // bot plain text
  return (
    <div className="msg bot">
      <span>{msg.text}</span>
      <span className="time">{msg.time ?? "9:41"}</span>
    </div>
  );
}

/**
 * useChatEngine — message list + timer-driven mutation helpers, ported from the
 * old (correct) demo components. Mutate ONE status message in place via
 * updateMessage; never push a new bubble per tool call.
 */
export function useChatEngine() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const intervals = useRef<Set<ReturnType<typeof setInterval>>>(new Set());

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
    return id;
  }, []);

  const scheduleInterval = useCallback((fn: () => void, ms: number) => {
    const id = setInterval(fn, ms);
    intervals.current.add(id);
    return id;
  }, []);

  const clearAllTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
    intervals.current.forEach(clearInterval);
    intervals.current.clear();
  }, []);

  const addMessage = useCallback((msg: ChatMsg) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const updateMessage = useCallback(
    (id: string, updater: (m: ChatMsg) => ChatMsg) => {
      setMessages((prev) => prev.map((m) => (m.id === id ? updater(m) : m)));
    },
    [],
  );

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const resetChat = useCallback(() => {
    clearAllTimers();
    setMessages([]);
  }, [clearAllTimers]);

  useEffect(() => clearAllTimers, [clearAllTimers]);

  return {
    messages,
    setMessages,
    addMessage,
    updateMessage,
    removeMessage,
    resetChat,
    schedule,
    scheduleInterval,
    clearAllTimers,
  };
}
