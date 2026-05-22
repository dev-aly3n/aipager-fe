"use client";

// Interactive demo — visitor picks a scenario and watches it play across terminal + telegram.
// Telegram side mirrors REAL aipager behavior: ONE status message per turn, edited in place
// (rotating verb + ticking elapsed + a GROWING tool list inside the SAME bubble), transforming
// into permission / finished / compacted. The terminal panel stays append-only.
import { useEffect, useRef, useState } from "react";
import {
  Icon,
  PhoneFrame,
  TapPing,
  useChatEngine,
  ChatMessageView,
  ClaudeTerminal,
  typeInto,
  THINKING_VERBS,
  type StatusMsg,
  type ToolEntry,
  type CCLine,
} from "@/components/landing/ui";

type ScenarioKey = "permission" | "inject" | "warn";

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

// Nudge a "1.2k" token string upward each tick so the spinner feels alive.
function bumpTokens(tokens?: string): string | undefined {
  if (!tokens) return tokens;
  const n = parseFloat(tokens);
  if (Number.isNaN(n)) return tokens;
  return `${(n + 0.3).toFixed(1)}k`;
}

export function Demo() {
  const [scenario, setScenario] = useState<ScenarioKey>("permission");
  const [cc, setCc] = useState<CCLine[]>([]);
  const [typed, setTyped] = useState("");
  const [sendPing, setSendPing] = useState(0);

  const engine = useChatEngine();
  const { messages, addMessage, updateMessage, removeMessage, resetChat, schedule, scheduleInterval, clearAllTimers } = engine;

  // Intervals driving the live "turn" bubble (elapsed tick + verb rotation + compaction dots).
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const verbRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dotsRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Claude Code terminal line helpers (append-only, spinner/perm mutable) -
  const addCC = (line: CCLine) => setCc((prev) => [...prev, line]);
  const updateCC = (id: string, patch: Partial<CCLine>) =>
    setCc((prev) =>
      prev.map((l) => (l.id === id ? ({ ...l, ...patch } as CCLine) : l)),
    );
  const removeCC = (id: string) => setCc((prev) => prev.filter((l) => l.id !== id));

  // Auto-scroll chat to bottom on new messages.
  const scrollRef = useRef<HTMLDivElement>(null);
  // Depend on the whole messages array (not just length) so the chat also
  // follows the status bubble as its tool list grows.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

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
      // Keep the terminal spinner's elapsed (and a creeping token count) in sync.
      setCc((prev) =>
        prev.map((l) =>
          l.kind === "spinner" && l.id === "spin"
            ? { ...l, elapsed: secs, tokens: bumpTokens(l.tokens) }
            : l,
        ),
      );
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
    // Inline-keyboard tap is a callback — it resolves the prompt in place
    // (tap feedback on the button, then the keyboard/command card clear). It
    // does NOT post an "Allow" chat message, matching real Telegram.
    setTurn({ resolved: "allow" });
    schedule(() => {
      removeCC("perm");
      // Claude Code just runs the command once approved — it doesn't know or
      // print how the approval arrived.
      addCC({ id: "p-bash", kind: "tool", name: "Bash", args: "prisma migrate dev --name add_users" });
      setTurn({
        emoji: "gear",
        verb: "Applying migration",
        spinner: true,
        hasKeyboard: false,
        permissionCmd: undefined,
      });
    }, 520);
    schedule(() => addCC({ id: "p-applying", kind: "result", text: "Applying migration 20260522_add_users" }), 900);
    schedule(() => addCC({ id: "p-synced", kind: "result", text: "Database is in sync (684ms)" }), 2600);
    schedule(() => {
      // Done: drop the thinking bubble, post the result as a fresh message.
      removeMessage("turn");
      addMessage({
        id: "p-result",
        kind: "result",
        session: "dev",
        stats: "684ms",
        text: "Migration applied — database in sync.",
      });
      addCC({ id: "p-done", kind: "assistant", text: "Migration applied." });
    }, 3000);
  };

  const handleDeny = () => {
    const cur = messages.find((m) => m.id === "turn") as StatusMsg | undefined;
    if (cur?.resolved) return;
    endThinking();
    setTurn({ resolved: "deny" });
    schedule(() => {
      setTurn({
        emoji: "warn",
        verb: "Permission denied",
        spinner: false,
        hasKeyboard: false,
        permissionCmd: undefined,
      });
      removeCC("perm");
      // Claude Code shows the request was declined, then responds.
      addCC({ id: "p-denied", kind: "note", tone: "dim", text: "✗ Command not run." });
      addCC({ id: "p-deny-msg", kind: "assistant", text: "Understood — I won't run that." });
    }, 520);
  };

  // --- scenario scripts ------------------------------------------------------
  const runPermission = () => {
    const prompt = "add a users table migration";
    addCC({ id: "p-welcome", kind: "welcome", text: "Welcome to Claude Code" });
    // The human types the prompt into Telegram, then it sends.
    typeInto(prompt, setTyped, schedule, () => {
      addMessage({ id: "p-user-msg", kind: "user", text: prompt });
      addCC({ id: "p-user", kind: "user", text: prompt });
      schedule(() => addCC({ id: "p-asst", kind: "assistant", text: "I'll create the migration and apply it." }), 200);
      schedule(() => {
        startThinking();
        addCC({ id: "spin", kind: "spinner", verb: "Cogitating", elapsed: 0, tokens: "0.5k" });
        addCC({ id: "p-edit", kind: "tool", name: "Update", args: "prisma/schema.prisma" });
        addCC({ id: "p-edit-res", kind: "result", text: "Added User model" });
        addTool({ status: "pending", verb: "Edit", target: "src/db/migration.ts" });
      }, 400);
      schedule(() => {
        removeCC("spin");
        addCC({
          id: "perm",
          kind: "perm",
          tool: "Bash command",
          cmd: "pnpm prisma migrate dev --name add_users",
          desc: "Apply the database migration",
        });
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
      }, 1200);
      // Auto-resolve if the visitor doesn't tap.
      schedule(() => {
        const cur = messages.find((m) => m.id === "turn") as StatusMsg | undefined;
        if (!cur?.resolved) handleAllow();
      }, 3800);
    });
  };

  const runInject = () => {
    addCC({ id: "i-welcome", kind: "welcome", text: "Welcome to Claude Code" });
    addCC({ id: "i-idle", kind: "note", tone: "dim", text: "Awaiting your next message…" });
    addMessage({
      id: "idle",
      kind: "status",
      emoji: "gear",
      session: "dev",
      verb: "Idle · ctx 28% · sonnet",
      spinner: false,
    });
    const promptText = "ship the feature flag toggle and write a changelog entry";
    // After a beat the human types a fresh prompt into Telegram, then it sends.
    schedule(() => {
      typeInto(promptText, setTyped, schedule, () => {
        removeCC("i-idle");
        addMessage({ id: "u1", kind: "user", text: promptText });
        addMessage({ id: "s1", kind: "system", text: "↳ injected into dev" });
        addCC({ id: "i-user", kind: "user", text: promptText });
        schedule(() => {
          startThinking();
          addCC({ id: "i-asst", kind: "assistant", text: "Updating the flag registry and changelog." });
          addCC({ id: "spin", kind: "spinner", verb: "Synthesizing", elapsed: 0, tokens: "0.6k" });
        }, 300);
        schedule(() => {
          addTool({ status: "done", verb: "Read", target: "CHANGELOG.md" });
          addCC({ id: "i-read1", kind: "tool", name: "Read", args: "CHANGELOG.md" });
          addCC({ id: "i-read1-res", kind: "result", text: "Read 80 lines" });
        }, 900);
        schedule(() => {
          addTool({ status: "done", verb: "Read", target: "src/flags/registry.ts" });
          addCC({ id: "i-read2", kind: "tool", name: "Read", args: "src/flags/registry.ts" });
          addCC({ id: "i-read2-res", kind: "result", text: "Read 120 lines" });
        }, 1600);
        schedule(() => {
          addTool({ status: "pending", verb: "Edit", target: "src/flags/registry.ts:42" });
          addCC({ id: "i-edit1", kind: "tool", name: "Update", args: "src/flags/registry.ts" });
          addCC({ id: "i-edit1-res", kind: "result", text: "Updated with 24 additions" });
        }, 2400);
        schedule(() => {
          addTool({ status: "pending", verb: "Edit", target: "CHANGELOG.md:1" });
          addCC({ id: "i-edit2", kind: "tool", name: "Update", args: "CHANGELOG.md" });
          addCC({ id: "i-edit2-res", kind: "result", text: "Updated with 14 additions and 4 removals" });
        }, 3200);
        schedule(() => {
          endThinking();
          // Done: drop the thinking bubble, post the result as a fresh message.
          removeMessage("turn");
          addMessage({
            id: "i-result",
            kind: "result",
            session: "dev",
            stats: "2 files · +38 −4",
            text: "Shipped the feature flag toggle and added a changelog entry.",
          });
          removeCC("spin");
          addCC({ id: "i-done", kind: "assistant", text: "Done — 2 files changed (+38 −4)." });
        }, 3900);
      });
    }, 1000);
  };

  const runWarn = () => {
    addCC({ id: "w-welcome", kind: "welcome", text: "Welcome to Claude Code" });
    addCC({ id: "w-asst", kind: "assistant", text: "Continuing the refactor across the module." });
    schedule(() => {
      startThinking("Refactoring");
      addCC({ id: "spin", kind: "spinner", verb: "Refactoring", elapsed: 0, tokens: "4.1k" });
      addCC({ id: "w-read", kind: "tool", name: "Read", args: "14 files" });
      addCC({ id: "w-read-res", kind: "result", text: "Read 1,840 lines" });
      addTool({ status: "done", verb: "Read", target: "14 files" });
    }, 200);
    schedule(() => {
      addCC({ id: "w-ctxlow", kind: "note", tone: "warn", text: "⚠ Context low — 85% used" });
      endThinking();
      setTurn({
        emoji: "warn",
        verb: "Context 85%",
        spinner: false,
        summary: "risk of truncation — reply /compact to free space",
      });
    }, 1600);
    // The human reacts to the warning by typing /compact, then it sends.
    schedule(() => {
      typeInto("/compact", setTyped, schedule, () => {
        addMessage({ id: "u-compact", kind: "user", text: "/compact" });
        addCC({ id: "w-user", kind: "user", text: "/compact" });
        addCC({ id: "w-compact-cmd", kind: "note", tone: "key", text: "› /compact" });
        schedule(() => {
          setTurn({ emoji: "refresh", verb: "Compacting", spinner: true });
          const frames = ["Compacting", "Compacting.", "Compacting..", "Compacting..."];
          let di = 0;
          dotsRef.current = scheduleInterval(() => {
            di = (di + 1) % frames.length;
            updateMessage("turn", (m) => ({ ...(m as StatusMsg), verb: frames[di] }));
          }, 500);
          updateCC("spin", { verb: "Compacting" });
          addCC({ id: "w-summarizing", kind: "note", tone: "dim", text: "Summarizing prior turns…" });
        }, 200);
        schedule(() => {
          stopDotsInterval();
          // Done: drop the thinking bubble, post the result as a fresh message.
          removeMessage("turn");
          addMessage({
            id: "w-result",
            kind: "result",
            emoji: "📦",
            session: "dev",
            stats: "85% → 22% · 9 turns kept",
            text: "Context compacted — resuming the refactor.",
          });
          removeCC("spin");
          addCC({ id: "w-compacted", kind: "note", tone: "ok", text: "✓ Compacted: 85% → 22% · 9 turns kept" });
          addCC({ id: "w-resume", kind: "assistant", text: "Context freed — resuming the refactor." });
        }, 2200);
      }, { cps: 12 });
    }, 2400);
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
    const stamp = Date.now();
    addMessage({ id: `u-${stamp}`, kind: "user", text });
    addMessage({ id: `s-${stamp}`, kind: "system", text: "↳ injected into dev" });
    // Drop any idle "Awaiting…" note before the visitor's own prompt lands.
    removeCC("i-idle");
    addCC({ id: `t-user-${stamp}`, kind: "user", text });
    addCC({ id: `t-asst-${stamp}`, kind: "assistant", text: "On it." });
    addCC({ id: "spin", kind: "spinner", verb: "Cogitating", elapsed: 0, tokens: "0.4k" });
    startThinking();
    schedule(() => {
      addTool({ status: "done", verb: "Read", target: "project files" });
      addCC({ id: `t-read-${stamp}`, kind: "tool", name: "Read", args: "project files" });
      addCC({ id: `t-read-res-${stamp}`, kind: "result", text: "Read 240 lines" });
    }, 900);
    schedule(() => {
      addTool({ status: "pending", verb: "Edit", target: "src/…" });
      addCC({ id: `t-edit-${stamp}`, kind: "tool", name: "Update", args: "src/…" });
      addCC({ id: `t-edit-res-${stamp}`, kind: "result", text: "Updated" });
    }, 1800);
    schedule(() => {
      endThinking();
      setTurn({ emoji: "check", verb: "Finished", spinner: false, summary: "done" });
      removeCC("spin");
      addCC({ id: `t-done-${stamp}`, kind: "assistant", text: "Done." });
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
    setCc([]);
    setTyped("");
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
            <ClaudeTerminal title="dev — claude" lines={cc} live />
            <PhoneFrame sessionName="aipager · dev" status="bot · online">
              <div
                className="chat-body"
                style={{ flex: "0 0 auto", height: 360, overflowY: "auto" }}
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
                  if (typed && typed.trim()) {
                    handleTyped(typed.trim());
                    setSendPing((k) => k + 1);
                  }
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
                  {sendPing > 0 && <TapPing key={sendPing} />}
                </button>
              </form>
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
