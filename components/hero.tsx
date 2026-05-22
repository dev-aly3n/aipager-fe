"use client";

import { useEffect, useRef, useState } from "react";
import {
  Icon,
  CopyButton,
  PhoneFrame,
  useChatEngine,
  ChatMessageView,
  ClaudeTerminal,
  THINKING_VERBS,
  type StatusMsg,
  type CCLine,
} from "@/components/landing/ui";

// Hero — synced terminal + telegram pair with a looping micro-story.
// The Telegram side mirrors the real bot: ONE status message per turn, edited
// in place (rotating verb + ticking elapsed + a growing tool list inside the
// same bubble) that transforms into permission / finished. The terminal panel
// stays append-only.

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

  const [cc, setCc] = useState<CCLine[]>([]);
  const mounted = useRef(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Refs for the two per-turn intervals (elapsed/verb) so step 7 can clear
  // just those without killing the scheduled story steps.
  const elapsedIv = useRef<ReturnType<typeof setInterval> | null>(null);
  const verbIv = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    mounted.current = true;

    const addCC = (line: CCLine) => {
      if (!mounted.current) return;
      setCc((prev) => [...prev, line]);
    };
    const updateCC = (id: string, patch: Partial<CCLine>) => {
      if (!mounted.current) return;
      setCc((prev) =>
        prev.map((l) => (l.id === id ? ({ ...l, ...patch } as CCLine) : l))
      );
    };
    const removeCC = (id: string) => {
      if (!mounted.current) return;
      setCc((prev) => prev.filter((l) => l.id !== id));
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

      // 1 — welcome + the user prompt
      schedule(() => {
        addCC({ id: "welcome", kind: "welcome", text: "Welcome to Claude Code" });
        addCC({ id: "prompt", kind: "user", text: "harden the auth middleware" });
      }, 0);
      // 2 — assistant prose
      schedule(() => {
        addCC({
          id: "asst-plan",
          kind: "assistant",
          text: "I'll review the handlers, then run the tests.",
        });
      }, 600);
      // 3 — the single status message for this turn + the two intervals;
      //     terminal gets the matching ✻ spinner.
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
        addCC({ id: "spin", kind: "spinner", verb: "Cogitating", elapsed: 0, tokens: "0.4k" });
        let elapsed = 0;
        let vi = 0;
        elapsedIv.current = scheduleInterval(() => {
          elapsed += 1;
          patchTurn({ elapsed });
          updateCC("spin", {
            elapsed,
            tokens: `${(0.4 + elapsed * 0.3).toFixed(1)}k`,
          } as Partial<CCLine>);
        }, 1000);
        verbIv.current = scheduleInterval(() => {
          vi = (vi + 1) % THINKING_VERBS.length;
          patchTurn({ verb: THINKING_VERBS[vi] });
        }, 1500);
      }, 1700);
      // 4 — Read tool, grow the tool list in place
      schedule(() => {
        addCC({ id: "tool-read", kind: "tool", name: "Read", args: "src/server/handlers.ts" });
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
      schedule(() => {
        addCC({ id: "res-read", kind: "result", text: "Read 142 lines" });
      }, 2350);
      // 5 — Update tool
      schedule(() => {
        addCC({ id: "tool-edit", kind: "tool", name: "Update", args: "src/server/handlers.ts" });
        addCC({
          id: "res-edit",
          kind: "result",
          text: "Updated with 12 additions and 3 removals",
        });
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
      // 6 — transform into permission; stop just the per-turn intervals,
      //     drop the spinner and show the permission box.
      schedule(() => {
        removeCC("spin");
        addCC({
          id: "perm",
          kind: "perm",
          tool: "Bash command",
          cmd: "pnpm test --filter server",
          desc: "Run the server test suite",
        });
        stopTurnIntervals();
        patchTurn({
          emoji: "lock",
          verb: "Permission needed",
          spinner: false,
          permissionCmd: "pnpm test --filter server",
          hasKeyboard: true,
        });
      }, 3900);
      // 7 — user taps the inline "Allow" button: a callback that resolves the
      //     prompt in place (tap feedback on the button), NOT a chat message.
      schedule(() => {
        patchTurn({ resolved: "allow" });
      }, 5200);
      // 8 — approval clears the box, run tests, status back to busy
      schedule(() => {
        removeCC("perm");
        addCC({ id: "note-approved", kind: "note", text: "✓ Approved via Telegram", tone: "key" });
        addCC({ id: "tool-bash", kind: "tool", name: "Bash", args: "pnpm test --filter server" });
        addCC({ id: "spin2", kind: "spinner", verb: "Running tests", elapsed: 0 });
        patchTurn({
          emoji: "gear",
          verb: "Running tests",
          spinner: true,
          hasKeyboard: false,
          permissionCmd: undefined,
        });
      }, 5800);
      // 9 — test result
      schedule(() => {
        removeCC("spin2");
        addCC({ id: "res-test", kind: "result", text: "142 passed · 0 failed · 8.3s" });
      }, 7000);
      // 10 — finished
      schedule(() => {
        patchTurn({
          emoji: "check",
          verb: "Finished (8.3s · 142/142)",
          spinner: false,
          summary: "All tests green.\nctx 32% · $0.18 · 412 lines",
        });
        addCC({
          id: "asst-done",
          kind: "assistant",
          text: "All green — auth middleware hardened.",
        });
      }, 7600);
      // 11 — reset and loop
      schedule(() => {
        stopTurnIntervals();
        resetChat();
        setCc([]);
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

  // Keep the chat pinned to the newest message (it scrolls inside a fixed
  // height — the phone never grows).
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 0.95fr)",
        gap: 18,
        alignItems: "stretch",
      }}
    >
      <ClaudeTerminal title="~/work/dev — claude" lines={cc} />
      <PhoneFrame sessionName="aipager · dev" status="bot · online">
        <div className="chat-body" style={{ flex: "0 0 auto", height: 340, overflowY: "auto" }} ref={scrollRef}>
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
