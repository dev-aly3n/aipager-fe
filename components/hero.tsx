"use client";

import { useEffect, useRef, useState } from "react";
import {
  Icon,
  CopyButton,
  PhoneFrame,
  useChatEngine,
  ChatMessageView,
  THINKING_VERBS,
  type StatusMsg,
} from "@/components/landing/ui";

// Hero — synced terminal + telegram pair with a looping micro-story.
// The Telegram side mirrors the real bot: ONE status message per turn, edited
// in place (rotating verb + ticking elapsed + a growing tool list inside the
// same bubble) that transforms into permission / finished. The terminal panel
// stays append-only.

interface TermLine {
  kind: "cmd" | "out";
  text: string;
  cls?: string;
}

function HeroTerminal({ lines }: { lines: TermLine[] }) {
  return (
    <div className="terminal">
      <div className="terminal-bar">
        <div className="terminal-dots"><span></span><span></span><span></span></div>
        <span className="terminal-title">~/work/dev · claude code</span>
      </div>
      <div className="terminal-body">
        {lines.map((l, i) =>
          l.kind === "cmd" ? (
            <div className="t-line" key={`l${i}`}>
              <span className="t-prompt">$</span>
              <span className="t-cmd">{l.text}</span>
            </div>
          ) : (
            <div className="t-line" key={`l${i}`}>
              <span className={`t-out ${l.cls || ""}`}>{l.text}</span>
            </div>
          )
        )}
        <div className="t-line">
          <span className="t-prompt">$</span>
          <span className="t-cursor"></span>
        </div>
      </div>
    </div>
  );
}

function HeroChat() {
  const {
    messages,
    addMessage,
    updateMessage,
    resetChat,
    schedule,
    scheduleInterval,
    clearAllTimers,
  } = useChatEngine();

  const [termLines, setTermLines] = useState<TermLine[]>([]);
  const mounted = useRef(true);
  // Refs for the two per-turn intervals (elapsed/verb) so step 7 can clear
  // just those without killing the scheduled story steps.
  const elapsedIv = useRef<ReturnType<typeof setInterval> | null>(null);
  const verbIv = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    mounted.current = true;

    const addTerm = (line: TermLine) => {
      if (!mounted.current) return;
      setTermLines((prev) => [...prev, line]);
    };

    const patchTurn = (patch: Partial<StatusMsg>) =>
      updateMessage("turn", (m) => ({ ...(m as StatusMsg), ...patch }));

    const stopTurnIntervals = () => {
      if (elapsedIv.current) clearInterval(elapsedIv.current);
      if (verbIv.current) clearInterval(verbIv.current);
      elapsedIv.current = null;
      verbIv.current = null;
    };

    const runStory = () => {
      if (!mounted.current) return;

      // 1
      schedule(() => addTerm({ kind: "cmd", text: "claude --resume dev" }), 0);
      // 2
      schedule(
        () => addTerm({ kind: "out", text: "● Loading session dev (sonnet 4.5)…", cls: "t-dim" }),
        600
      );
      // 3
      schedule(() => {
        addTerm({ kind: "out", text: "✓ Hooks attached. Session live.", cls: "t-ok" });
        addMessage({ id: "sys", kind: "system", text: "dev — session started · sonnet" });
      }, 1200);
      // 4 — the single status message for this turn + the two intervals
      schedule(() => {
        addMessage({
          id: "turn",
          kind: "status",
          emoji: "gear",
          session: "dev",
          verb: THINKING_VERBS[0],
          spinner: true,
          elapsed: 0,
          tools: [],
        });
        let elapsed = 0;
        let vi = 0;
        elapsedIv.current = scheduleInterval(() => {
          elapsed += 1;
          patchTurn({ elapsed });
        }, 1000);
        verbIv.current = scheduleInterval(() => {
          vi = (vi + 1) % THINKING_VERBS.length;
          patchTurn({ verb: THINKING_VERBS[vi] });
        }, 1500);
      }, 1700);
      // 5 — grow the tool list in place
      schedule(() => {
        addTerm({ kind: "out", text: "› Reading src/server/handlers.ts", cls: "t-dim" });
        updateMessage("turn", (m) => {
          const s = m as StatusMsg;
          return {
            ...s,
            tools: [
              ...(s.tools ?? []),
              { status: "done", verb: "Read", target: "src/server/handlers.ts" },
            ],
          };
        });
      }, 2200);
      // 6
      schedule(() => {
        addTerm({ kind: "out", text: "› Editing src/server/handlers.ts:142", cls: "t-dim" });
        updateMessage("turn", (m) => {
          const s = m as StatusMsg;
          return {
            ...s,
            tools: [
              ...(s.tools ?? []),
              { status: "pending", verb: "Edit", target: "src/server/handlers.ts:142" },
            ],
          };
        });
      }, 3000);
      // 7 — transform into permission; stop just the per-turn intervals
      schedule(() => {
        addTerm({ kind: "out", text: "⚠ Permission required: Bash", cls: "t-warn" });
        stopTurnIntervals();
        patchTurn({
          emoji: "lock",
          verb: "Permission needed",
          spinner: false,
          permissionCmd: "pnpm test --filter server",
          hasKeyboard: true,
        });
      }, 3900);
      // 8 — user replies "Allow", turn resolves, reaction lands
      schedule(() => {
        addMessage({ id: "u-allow", kind: "user", text: "Allow", time: "9:41" });
        patchTurn({ resolved: "allow" });
      }, 5200);
      schedule(() => {
        updateMessage("u-allow", (m) => ({ ...m, reaction: "👀" }));
      }, 5700);
      // 9 — run tests, status back to busy
      schedule(() => {
        addTerm({ kind: "out", text: "› Bash: pnpm test --filter server", cls: "t-key" });
        patchTurn({ emoji: "gear", verb: "Running tests", spinner: true });
      }, 5800);
      // 10
      schedule(
        () => addTerm({ kind: "out", text: "✓ 142 passed · 0 failed · 8.3s", cls: "t-ok" }),
        7000
      );
      // 11 — finished
      schedule(() => {
        patchTurn({
          emoji: "check",
          verb: "Finished (8.3s · 142/142)",
          spinner: false,
          summary: "All tests green.\nctx 32% · $0.18 · 412 lines",
        });
        addTerm({ kind: "out", text: "● Idle. Context 32% · $0.18 · 412 lines", cls: "t-dim" });
      }, 7600);
      // 12 — reset and loop
      schedule(() => {
        stopTurnIntervals();
        resetChat();
        setTermLines([]);
        schedule(runStory, 800);
      }, 10300);
    };

    runStory();

    return () => {
      mounted.current = false;
      stopTurnIntervals();
      clearAllTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 0.95fr)",
        gap: 18,
        alignItems: "stretch",
      }}
    >
      <HeroTerminal lines={termLines} />
      <PhoneFrame sessionName="aipager · dev" status="bot · online">
        <div className="chat-body" style={{ minHeight: 320 }}>
          <div className="chat-day">Today</div>
          {messages.map((m) => (
            <ChatMessageView key={m.id} msg={m} />
          ))}
        </div>
        <div className="reply-bar">
          <span className="icon"><Icon name="paperclip" size={16} /></span>
          <div className="reply-input" style={{ color: "var(--fg-4)" }}>Message</div>
          <span className="icon"><Icon name="mic" size={16} /></span>
        </div>
      </PhoneFrame>
    </div>
  );
}

export function Hero() {
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
            <HeroChat />
          </div>
        </div>
      </div>
    </section>
  );
}
