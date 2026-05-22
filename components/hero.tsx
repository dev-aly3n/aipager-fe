"use client";

import { useEffect, useState } from "react";
import { Icon, CopyButton, PhoneFrame } from "@/components/landing/ui";

// Hero — synced terminal + telegram pair with a looping micro-story

interface HeroTerm {
  kind: "cmd" | "out";
  text: string;
  cls?: string;
}

interface HeroMsg {
  kind: "system" | "status" | "bot" | "me" | "permission";
  text?: string;
  state?: string;
  cmd?: string;
  show?: boolean;
}

interface HeroStep {
  t: number;
  term: HeroTerm | null;
  msg: HeroMsg | null;
}

// One looping story step: a terminal event and the matching telegram message it produces.
const HERO_STEPS: HeroStep[] = [
  {
    t: 600,
    term: { kind: "cmd", text: "claude --resume dev" },
    msg: null,
  },
  {
    t: 1100,
    term: { kind: "out", text: "● Loading session dev (sonnet 4.5)…" },
    msg: null,
  },
  {
    t: 1700,
    term: { kind: "out", text: "✓ Hooks attached. Session live.", cls: "t-ok" },
    msg: { kind: "system", text: "dev — session started · sonnet" },
  },
  {
    t: 2400,
    term: { kind: "out", text: "› Reading src/server/handlers.ts", cls: "t-dim" },
    msg: { kind: "status", state: "busy", text: "reading handlers.ts" },
  },
  {
    t: 3100,
    term: { kind: "out", text: "› Editing src/server/handlers.ts:142", cls: "t-dim" },
    msg: null,
  },
  {
    t: 3900,
    term: { kind: "out", text: "⚠ Permission required: Bash", cls: "t-warn" },
    msg: { kind: "permission", cmd: "pnpm test --filter server", show: true },
  },
  {
    t: 5200,
    term: null,
    msg: { kind: "me", text: "Allow" },
  },
  {
    t: 5800,
    term: { kind: "out", text: "› Bash: pnpm test --filter server", cls: "t-key" },
    msg: { kind: "status", state: "busy", text: "running pnpm test" },
  },
  {
    t: 7000,
    term: { kind: "out", text: "✓ 142 passed · 0 failed · 8.3s", cls: "t-ok" },
    msg: { kind: "bot", text: "✓ tests passed · 142/142 · 8.3s" },
  },
  {
    t: 7800,
    term: { kind: "out", text: "● Idle. Context 32% · $0.18 · 412 lines", cls: "t-dim" },
    msg: { kind: "status", state: "idle", text: "idle · ctx 32% · $0.18" },
  },
];

function useLoopedStory(steps: HeroStep[], totalCycle = 11000): number {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) % totalCycle;
      let p = 0;
      for (let i = 0; i < steps.length; i++) {
        if (t >= steps[i].t) p = i + 1;
      }
      setPhase(p);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [steps, totalCycle]);
  return phase;
}

function HeroTerminal({ phase }: { phase: number }) {
  const lines = [];
  for (let i = 0; i < phase; i++) {
    const e = HERO_STEPS[i];
    if (!e?.term) continue;
    if (e.term.kind === "cmd") {
      lines.push(
        <div className="t-line" key={`l${i}`}>
          <span className="t-prompt">$</span>
          <span className="t-cmd">{e.term.text}</span>
        </div>
      );
    } else {
      lines.push(
        <div className="t-line" key={`l${i}`}>
          <span className={`t-out ${e.term.cls || ""}`}>{e.term.text}</span>
        </div>
      );
    }
  }
  return (
    <div className="terminal">
      <div className="terminal-bar">
        <div className="terminal-dots"><span></span><span></span><span></span></div>
        <span className="terminal-title">~/work/dev · claude code</span>
      </div>
      <div className="terminal-body">
        {lines}
        <div className="t-line">
          <span className="t-prompt">$</span>
          <span className="t-cursor"></span>
        </div>
      </div>
    </div>
  );
}

function HeroChat({ phase }: { phase: number }) {
  // Render messages produced up to phase
  const msgs = [];
  let permissionResolved = false;
  for (let i = 0; i < phase; i++) {
    const e = HERO_STEPS[i];
    if (!e?.msg) continue;
    const m = e.msg;
    // If user has already replied "Allow", swap the permission card for the resolved state
    if (m.kind === "me" && m.text === "Allow") permissionResolved = true;
  }

  msgs.push(<div className="chat-day" key="day">Today</div>);

  for (let i = 0; i < phase; i++) {
    const e = HERO_STEPS[i];
    if (!e?.msg) continue;
    const m = e.msg;
    const time = "9:41";

    if (m.kind === "system") {
      msgs.push(<div className="msg system" key={`m${i}`}>{m.text}</div>);
    } else if (m.kind === "status") {
      msgs.push(
        <div className="msg bot" key={`m${i}`}>
          <div className="status-line">
            <span className={`dot ${m.state}`}></span>
            <span className="mono">{m.text}</span>
          </div>
        </div>
      );
    } else if (m.kind === "bot") {
      msgs.push(
        <div className="msg bot" key={`m${i}`}>
          <span>{m.text}</span>
          <span className="time">{time}</span>
        </div>
      );
    } else if (m.kind === "me") {
      msgs.push(
        <div className="msg me" key={`m${i}`}>
          <span>{m.text}</span>
          <span className="time">{time}</span>
        </div>
      );
    } else if (m.kind === "permission" && m.show) {
      msgs.push(
        <div className="msg bot" key={`m${i}`} style={{ width: "86%" }}>
          <div className="permission-card">
            <span className="label">Permission · bash</span>
            <span className="desc">Claude wants to run a shell command in <strong style={{ color: "var(--fg)" }}>dev</strong>.</span>
            <div className="cmd-block">pnpm test --filter server</div>
            <div className="kb-row">
              <button type="button" className={`kb-btn allow ${permissionResolved ? "" : ""}`} disabled>
                {permissionResolved ? "✓ Allowed" : "Allow"}
              </button>
              <button type="button" className="kb-btn deny" disabled>Deny</button>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <PhoneFrame sessionName="aipager · dev" status="bot · online">
      <div className="chat-body" style={{ minHeight: 320 }}>
        {msgs}
      </div>
      <div className="reply-bar">
        <span className="icon"><Icon name="paperclip" size={16} /></span>
        <div className="reply-input" style={{ color: "var(--fg-4)" }}>Message</div>
        <span className="icon"><Icon name="mic" size={16} /></span>
      </div>
    </PhoneFrame>
  );
}

export function Hero() {
  const phase = useLoopedStory(HERO_STEPS, 11000);
  return (
    <section className="hero">
      <div className="hero-grid"></div>
      <div className="wrap">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="hero-tag">
              <span className="hero-tag-pill">v0.4.4</span>
              Telegram remote-control for Claude Code
            </span>
            <h1 className="h1">
              Page Claude Code<br />
              from <span className="accent">anywhere</span>.
            </h1>
            <p className="lead">
              Every state change, every permission prompt, every completion — mirrored to Telegram in real time. Reply to inject prompts. Approve commands without touching your laptop.
            </p>
            <div className="hero-install">
              <span className="dollar">$</span>
              <span className="cmd">curl -fsSL aipager.run/install | sh</span>
              <CopyButton text="curl -fsSL aipager.run/install | sh" className="copy" />
            </div>
            <div className="hero-actions">
              <a href="#demo" className="btn btn-primary">
                Try the demo
                <span className="btn-arrow"><Icon name="arrow" size={14} /></span>
              </a>
              <a href="https://github.com/dev-aly3n/aipager" className="btn btn-ghost">
                <Icon name="github" size={14} />
                Source
              </a>
            </div>
            <div className="hero-meta">
              <span>MIT licensed</span>
              <span className="dot"></span>
              <span>Python · pipx · brew</span>
              <span className="dot"></span>
              <span className="live">Stays on your machine</span>
            </div>
          </div>
          <div className="hero-visual">
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 0.95fr)", gap: 18, alignItems: "stretch" }}>
              <HeroTerminal phase={phase} />
              <HeroChat phase={phase} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
