"use client";

// Interactive demo — visitor picks a scenario and watches it play across terminal + telegram.
// Telegram side mirrors REAL aipager behavior: ONE status message per turn, edited in place
// (rotating verb + ticking elapsed + a GROWING tool list inside the SAME bubble), transforming
// into permission / finished / compacted. The terminal panel stays append-only.
import { useEffect, useRef, useState } from "react";
import {
  Icon,
  PhoneFrame,
  useChatEngine,
  ChatMessageView,
  THINKING_VERBS,
  type StatusMsg,
  type ToolEntry,
} from "@/components/landing/ui";

type ScenarioKey = "permission" | "inject" | "warn";

type TermLine = { kind: "cmd" | "out"; text: string; cls?: string };

const SCENARIO_META: Record<ScenarioKey, { title: string; sub: string }> = {
  permission: {
    title: "Approve a permission",
    sub: "Bash request hits Telegram. You tap Allow.",
  },
  inject: {
    title: "Inject a prompt from your phone",
    sub: "Reply to any bot message — your text becomes the next prompt.",
  },
  warn: {
    title: "Context warning + compact",
    sub: "85% full. aipager pings, you reply /compact.",
  },
};

function DemoTerminal({
  lines,
  label = "dev · claude code",
}: {
  lines: TermLine[];
  label?: string;
}) {
  return (
    <div className="terminal" style={{ minHeight: 280 }}>
      <div className="terminal-bar">
        <div className="terminal-dots"><span></span><span></span><span></span></div>
        <span className="terminal-title">{label}</span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--live)", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--live)" }}></span>
          live
        </span>
      </div>
      <div className="terminal-body" style={{ minHeight: 220, maxHeight: 420 }}>
        {lines.map((l, i) =>
          l.kind === "cmd" ? (
            <div className="t-line" key={i}>
              <span className="t-prompt">›</span>
              <span className="t-cmd">{l.text}</span>
            </div>
          ) : (
            <div className="t-line" key={i}>
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

export function Demo() {
  const [scenario, setScenario] = useState<ScenarioKey>("permission");
  const [termLines, setTermLines] = useState<TermLine[]>([]);
  const [typed, setTyped] = useState("");

  const engine = useChatEngine();
  const { messages, addMessage, updateMessage, removeMessage, resetChat, schedule, scheduleInterval, clearAllTimers } = engine;

  // Intervals driving the live "turn" bubble (elapsed tick + verb rotation + compaction dots).
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const verbRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dotsRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addTerm = (line: TermLine) => setTermLines((prev) => [...prev, line]);

  // Auto-scroll chat to bottom on new messages.
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);

  // --- thinking turn helpers -------------------------------------------------
  const stopVerbInterval = () => {
    if (verbRef.current) { clearInterval(verbRef.current); verbRef.current = null; }
  };
  const stopElapsedInterval = () => {
    if (elapsedRef.current) { clearInterval(elapsedRef.current); elapsedRef.current = null; }
  };
  const stopDotsInterval = () => {
    if (dotsRef.current) { clearInterval(dotsRef.current); dotsRef.current = null; }
  };

  const startThinking = (baseVerb: string = THINKING_VERBS[0]) => {
    addMessage({
      id: "turn",
      kind: "status",
      emoji: "gear",
      session: "dev",
      verb: baseVerb,
      spinner: true,
      elapsed: 0,
      tools: [],
    });
    let secs = 0;
    elapsedRef.current = scheduleInterval(() => {
      secs += 1;
      updateMessage("turn", (m) => ({ ...(m as StatusMsg), elapsed: secs }));
    }, 1000);
    if (baseVerb === THINKING_VERBS[0]) {
      let vi = 0;
      verbRef.current = scheduleInterval(() => {
        vi = (vi + 1) % THINKING_VERBS.length;
        updateMessage("turn", (m) => ({ ...(m as StatusMsg), verb: THINKING_VERBS[vi] }));
      }, 1500);
    } else {
      // custom base verb: keep cycling "Verb" with the thinking verbs as suffix-free rotation
      let vi = 0;
      const cycle = [baseVerb, ...THINKING_VERBS];
      verbRef.current = scheduleInterval(() => {
        vi = (vi + 1) % cycle.length;
        updateMessage("turn", (m) => ({ ...(m as StatusMsg), verb: cycle[vi] }));
      }, 1500);
    }
  };

  const endThinking = () => {
    stopElapsedInterval();
    stopVerbInterval();
  };

  const addTool = (entry: ToolEntry) => {
    updateMessage("turn", (m) => {
      const s = m as StatusMsg;
      return { ...s, tools: [...(s.tools ?? []), entry] };
    });
  };

  const setTurn = (patch: Partial<StatusMsg>) => {
    updateMessage("turn", (m) => ({ ...(m as StatusMsg), ...patch }));
  };

  // --- permission handlers (wired into the StatusBubble keyboard) ------------
  const handleAllow = () => {
    const cur = messages.find((m) => m.id === "turn") as StatusMsg | undefined;
    if (cur?.resolved) return;
    endThinking();
    setTurn({ resolved: "allow" });
    addTerm({ kind: "out", text: "✓ Approved via telegram", cls: "t-key" });
    schedule(() => {
      setTurn({ emoji: "gear", verb: "Applying migration", spinner: true });
    }, 400);
    schedule(() => addTerm({ kind: "out", text: "› Running: pnpm prisma migrate dev …", cls: "t-dim" }), 900);
    schedule(() => addTerm({ kind: "out", text: "  Applying migration 20260522_add_users" }), 1800);
    schedule(() => addTerm({ kind: "out", text: "✓ Database is in sync (684ms)", cls: "t-ok" }), 2600);
    schedule(() => {
      setTurn({
        emoji: "check",
        verb: "Finished · migration applied",
        spinner: false,
        summary: "684ms · database in sync",
      });
      addTerm({ kind: "out", text: "● Idle. Ctx 41% · $0.34", cls: "t-dim" });
    }, 3000);
  };

  const handleDeny = () => {
    const cur = messages.find((m) => m.id === "turn") as StatusMsg | undefined;
    if (cur?.resolved) return;
    endThinking();
    setTurn({
      resolved: "deny",
      emoji: "warn",
      verb: "Denied via telegram",
      spinner: false,
    });
    addTerm({ kind: "out", text: "✗ Denied via telegram", cls: "t-warn" });
  };

  // --- scenario scripts ------------------------------------------------------
  const runPermission = () => {
    addTerm({ kind: "cmd", text: "claude --resume dev" });
    schedule(() => addTerm({ kind: "out", text: "● Editing src/db/migration.ts", cls: "t-dim" }), 400);
    schedule(() => {
      startThinking();
      addTool({ status: "pending", verb: "Edit", target: "src/db/migration.ts" });
    }, 600);
    schedule(() => {
      addTerm({ kind: "out", text: "⚠ Permission required: Bash", cls: "t-warn" });
      endThinking();
      setTurn({
        emoji: "lock",
        verb: "Permission needed",
        spinner: false,
        permissionCmd: "pnpm prisma migrate dev --name add_users",
        hasKeyboard: true,
        onAllow: handleAllow,
        onDeny: handleDeny,
      });
    }, 1400);
    // Auto-resolve if the visitor doesn't tap.
    schedule(() => {
      const cur = messages.find((m) => m.id === "turn") as StatusMsg | undefined;
      if (!cur?.resolved) handleAllow();
    }, 4000);
  };

  const runInject = () => {
    addTerm({ kind: "out", text: "● Idle. Awaiting input.", cls: "t-dim" });
    addMessage({
      id: "idle",
      kind: "status",
      emoji: "gear",
      session: "dev",
      verb: "Idle · ctx 28% · sonnet",
      spinner: false,
    });
    const promptText = "ship the feature flag toggle and write a changelog entry";
    schedule(() => {
      addMessage({ id: "u1", kind: "user", text: promptText });
      addMessage({ id: "s1", kind: "system", text: "↳ injected into dev" });
      addTerm({ kind: "cmd", text: promptText });
    }, 1600);
    schedule(() => startThinking(), 2000);
    schedule(() => {
      addTool({ status: "done", verb: "Read", target: "CHANGELOG.md" });
      addTerm({ kind: "out", text: "› Reading CHANGELOG.md", cls: "t-dim" });
    }, 2600);
    schedule(() => {
      addTool({ status: "done", verb: "Read", target: "src/flags/registry.ts" });
      addTerm({ kind: "out", text: "› Reading src/flags/registry.ts", cls: "t-dim" });
    }, 3300);
    schedule(() => {
      addTool({ status: "pending", verb: "Edit", target: "src/flags/registry.ts:42" });
      addTerm({ kind: "out", text: "› Editing src/flags/registry.ts:42", cls: "t-dim" });
    }, 4100);
    schedule(() => {
      addTool({ status: "pending", verb: "Edit", target: "CHANGELOG.md:1" });
      addTerm({ kind: "out", text: "› Editing CHANGELOG.md:1", cls: "t-dim" });
    }, 4900);
    schedule(() => {
      endThinking();
      setTurn({
        emoji: "check",
        verb: "Finished · 2 files · +38 −4",
        spinner: false,
        summary: "feature flag toggle shipped\n+ changelog entry",
      });
      addTerm({ kind: "out", text: "✓ Done. 2 files changed.", cls: "t-ok" });
    }, 5600);
  };

  const runWarn = () => {
    addTerm({ kind: "out", text: "● Working on long-running refactor…", cls: "t-dim" });
    schedule(() => addTerm({ kind: "out", text: "› Reading 14 files", cls: "t-dim" }), 600);
    schedule(() => {
      startThinking("Refactoring");
      addTool({ status: "done", verb: "Read", target: "14 files" });
    }, 200);
    schedule(() => {
      addTerm({ kind: "out", text: "⚠ Context 85% — compaction recommended", cls: "t-warn" });
      endThinking();
      setTurn({
        emoji: "warn",
        verb: "Context 85%",
        spinner: false,
        summary: "risk of truncation — reply /compact to free space",
      });
    }, 1600);
    schedule(() => {
      addMessage({ id: "u-compact", kind: "user", text: "/compact" });
      addTerm({ kind: "out", text: "› /compact (injected via telegram)", cls: "t-key" });
    }, 3000);
    schedule(() => {
      setTurn({ emoji: "refresh", verb: "Compacting", spinner: true });
      const frames = ["Compacting", "Compacting.", "Compacting..", "Compacting..."];
      let di = 0;
      dotsRef.current = scheduleInterval(() => {
        di = (di + 1) % frames.length;
        updateMessage("turn", (m) => ({ ...(m as StatusMsg), verb: frames[di] }));
      }, 500);
      addTerm({ kind: "out", text: "› Summarizing prior turns…", cls: "t-dim" });
    }, 3600);
    schedule(() => {
      stopDotsInterval();
      setTurn({
        emoji: "package",
        verb: "Compacted: 85% → 22%",
        spinner: false,
        summary: "9 turns kept",
      });
      addTerm({ kind: "out", text: "✓ Compacted: 85% → 22% · 9 turns kept", cls: "t-ok" });
      addTerm({ kind: "out", text: "● Resuming refactor.", cls: "t-dim" });
    }, 5600);
  };

  const runScenario = (key: ScenarioKey) => {
    if (key === "permission") runPermission();
    else if (key === "inject") runInject();
    else runWarn();
  };

  // --- visitor types their own prompt (any scenario) -------------------------
  const handleTyped = (text: string) => {
    // Stop any in-flight turn so the new prompt owns the bubble.
    endThinking();
    stopDotsInterval();
    removeMessage("turn");
    removeMessage("idle");
    addMessage({ id: `u-${Date.now()}`, kind: "user", text });
    addMessage({ id: `s-${Date.now()}`, kind: "system", text: "↳ injected into dev" });
    addTerm({ kind: "cmd", text });
    startThinking();
    schedule(() => addTool({ status: "done", verb: "Read", target: "project files" }), 900);
    schedule(() => addTool({ status: "pending", verb: "Edit", target: "src/…" }), 1800);
    schedule(() => {
      endThinking();
      setTurn({ emoji: "check", verb: "Finished", spinner: false, summary: "done" });
    }, 2600);
    setTyped("");
  };

  // --- lifecycle: (re)play on scenario change --------------------------------
  const resetAndPlay = (key: ScenarioKey) => {
    clearAllTimers();
    stopElapsedInterval();
    stopVerbInterval();
    stopDotsInterval();
    resetChat();
    setTermLines([]);
    // Defer running the script so reset state lands first.
    schedule(() => runScenario(key), 0);
  };

  useEffect(() => {
    resetAndPlay(scenario);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario]);

  const scenarioKeys: ScenarioKey[] = ["permission", "inject", "warn"];

  return (
    <section className="section" id="demo">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Live demo</span>
          <h2 className="h2">Pick a moment. Watch it cross over.</h2>
          <p className="lead">
            Every Claude Code hook becomes a Telegram event, and every Telegram reply lands back in your session. Try one — or type your own prompt into the chat.
          </p>
        </div>

        <div className="demo-grid">
          <div className="demo-controls">
            <h4>Scenarios</h4>
            {scenarioKeys.map((k, i) => (
              <button
                key={k}
                type="button"
                className={`scenario-btn ${scenario === k ? "active" : ""}`}
                onClick={() => setScenario(k)}
              >
                <span className="num">0{i + 1}</span>
                <span className="meta">
                  <span className="title">{SCENARIO_META[k].title}</span>
                  <span className="sub">{SCENARIO_META[k].sub}</span>
                </span>
              </button>
            ))}
            <div style={{ borderTop: "1px solid var(--line-2)", paddingTop: 14, marginTop: 6, display: "flex", flexDirection: "column", gap: 10 }}>
              <h4 style={{ marginBottom: 0 }}>Yours</h4>
              <p style={{ margin: 0, fontSize: 13, color: "var(--fg-3)", lineHeight: 1.5 }}>
                Type anything into the Telegram input on the right — it&apos;ll inject as a prompt and flow into the terminal.
              </p>
              <button
                type="button"
                className="scenario-btn"
                style={{ background: "transparent" }}
                onClick={() => resetAndPlay(scenario)}
              >
                <span className="num">↻</span>
                <span className="meta">
                  <span className="title">Replay</span>
                  <span className="sub">Reset and play this scenario from the start.</span>
                </span>
              </button>
            </div>
          </div>
          <div className="demo-stage">
            <DemoTerminal lines={termLines} />
            <PhoneFrame sessionName="aipager · dev" status="bot · online">
              <div
                className="chat-body"
                style={{ minHeight: 300, maxHeight: 400, overflowY: "auto" }}
                ref={scrollRef}
              >
                <div className="chat-day">Today</div>
                {messages.map((m) => (
                  <ChatMessageView key={m.id} msg={m} />
                ))}
              </div>
              <form
                className="reply-bar"
                onSubmit={(ev) => {
                  ev.preventDefault();
                  if (typed && typed.trim()) handleTyped(typed.trim());
                }}
              >
                <span className="icon"><Icon name="paperclip" size={16} /></span>
                <input
                  className="reply-input"
                  placeholder="Reply to dev…"
                  value={typed}
                  onChange={(ev) => setTyped(ev.target.value)}
                />
                <button type="submit" className="reply-send" aria-label="send">
                  <Icon name="send" size={14} />
                </button>
              </form>
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
