"use client";

// Interactive demo — visitor picks a scenario and watches it play across terminal + telegram
import { useEffect, useRef, useState } from "react";
import { Icon, PhoneFrame } from "@/components/landing/ui";

type DemoEvent = {
  t?: number;
  side: "term" | "msg";
  kind: string;
  text?: string;
  cls?: string;
  cmd?: string;
  session?: string;
};

type ScenarioKey = "permission" | "inject" | "warn";

type Scenario = {
  title: string;
  sub: string;
  duration: number;
  events: DemoEvent[];
};

// Each scenario is a series of timed events with a side (term/msg) and content
const SCENARIOS: Record<ScenarioKey, Scenario> = {
  permission: {
    title: "Approve a permission",
    sub: "Bash request hits Telegram. You tap Allow.",
    duration: 9500,
    events: [
      { t: 200, side: "term", kind: "cmd", text: "claude --resume dev" },
      { t: 700, side: "term", kind: "out", cls: "t-dim", text: "● Editing src/db/migration.ts" },
      { t: 1400, side: "term", kind: "out", cls: "t-warn", text: "⚠ Permission required: Bash" },
      { t: 1600, side: "msg", kind: "permission", cmd: "pnpm prisma migrate dev --name add_users", session: "dev" },
      { t: 3800, side: "msg", kind: "me", text: "Allow" },
      { t: 3900, side: "term", kind: "out", cls: "t-key", text: "✓ Approved via telegram" },
      { t: 4400, side: "term", kind: "out", cls: "t-dim", text: "› Running: pnpm prisma migrate dev …" },
      { t: 5800, side: "term", kind: "out", text: "  Applying migration `20260522_add_users`" },
      { t: 6800, side: "term", kind: "out", cls: "t-ok", text: "✓ Database is in sync (684ms)" },
      { t: 7400, side: "msg", kind: "bot", text: "✓ migration applied · 684ms" },
      { t: 8000, side: "term", kind: "out", cls: "t-dim", text: "● Idle. Ctx 41% · $0.34" },
    ],
  },
  inject: {
    title: "Inject a prompt from your phone",
    sub: "Reply to any bot message — your text becomes the next prompt.",
    duration: 9000,
    events: [
      { t: 200, side: "term", kind: "out", cls: "t-dim", text: "● Idle. Awaiting input." },
      { t: 600, side: "msg", kind: "bot", text: "● dev — idle · ctx 28% · sonnet" },
      { t: 1800, side: "msg", kind: "me", text: "ship the feature flag toggle and write a changelog entry" },
      { t: 2200, side: "msg", kind: "system", text: "↳ injected into dev" },
      { t: 2400, side: "term", kind: "cmd", text: "ship the feature flag toggle and write a changelog entry" },
      { t: 3000, side: "term", kind: "out", cls: "t-dim", text: "› Reading CHANGELOG.md" },
      { t: 3800, side: "term", kind: "out", cls: "t-dim", text: "› Reading src/flags/registry.ts" },
      { t: 4900, side: "term", kind: "out", cls: "t-dim", text: "› Editing src/flags/registry.ts:42" },
      { t: 5900, side: "term", kind: "out", cls: "t-dim", text: "› Editing CHANGELOG.md:1" },
      { t: 6800, side: "term", kind: "out", cls: "t-ok", text: "✓ Done. 2 files changed." },
      { t: 7200, side: "msg", kind: "bot", text: "✓ done · 2 files · +38 / −4" },
    ],
  },
  warn: {
    title: "Context warning + compact",
    sub: "85% full. aipager pings, you reply /compact.",
    duration: 9000,
    events: [
      { t: 200, side: "term", kind: "out", cls: "t-dim", text: "● Working on long-running refactor…" },
      { t: 800, side: "term", kind: "out", cls: "t-dim", text: "› Reading 14 files" },
      { t: 1600, side: "term", kind: "out", cls: "t-warn", text: "⚠ Context 85% — compaction recommended" },
      { t: 1800, side: "msg", kind: "warn", text: "⚠ Context 85% in dev — risk of truncation. Reply /compact to free space." },
      { t: 3600, side: "msg", kind: "me", text: "/compact" },
      { t: 3800, side: "term", kind: "out", cls: "t-key", text: "› /compact (injected via telegram)" },
      { t: 4600, side: "term", kind: "out", cls: "t-dim", text: "› Summarizing prior turns…" },
      { t: 6000, side: "term", kind: "out", cls: "t-ok", text: "✓ Compacted: 85% → 22% · 9 turns kept" },
      { t: 6800, side: "msg", kind: "bot", text: "✓ compacted · 85% → 22%" },
      { t: 7600, side: "term", kind: "out", cls: "t-dim", text: "● Resuming refactor." },
    ],
  },
};

function eventsUpTo(scenario: ScenarioKey, elapsedMs: number): DemoEvent[] {
  const fired: DemoEvent[] = [];
  for (const e of SCENARIOS[scenario].events) {
    if ((e.t ?? 0) <= elapsedMs) fired.push(e);
  }
  return fired;
}

function DemoTerminal({
  events,
  label = "dev · claude code",
}: {
  events: DemoEvent[];
  label?: string;
}) {
  const lines: React.ReactNode[] = [];
  events.forEach((e, i) => {
    if (e.side !== "term") return;
    if (e.kind === "cmd") {
      lines.push(
        <div className="t-line" key={i}>
          <span className="t-prompt">›</span>
          <span className="t-cmd">{e.text}</span>
        </div>
      );
    } else {
      lines.push(
        <div className="t-line" key={i}>
          <span className={`t-out ${e.cls || ""}`}>{e.text}</span>
        </div>
      );
    }
  });
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
        {lines}
        <div className="t-line">
          <span className="t-prompt">$</span>
          <span className="t-cursor"></span>
        </div>
      </div>
    </div>
  );
}

function DemoPhone({
  events,
  onAllow,
  onDeny,
  permResolved,
  onTypedSend,
  typedValue,
  onTypedChange,
}: {
  events: DemoEvent[];
  onAllow: () => void;
  onDeny: () => void;
  permResolved: boolean;
  onTypedSend: (text: string) => void;
  typedValue: string;
  onTypedChange: (value: string) => void;
}) {
  const items: React.ReactNode[] = [<div className="chat-day" key="day">Today</div>];
  events.forEach((e, i) => {
    if (e.side !== "msg") return;
    if (e.kind === "system") {
      items.push(<div className="msg system" key={i}>{e.text}</div>);
    } else if (e.kind === "bot") {
      items.push(
        <div className="msg bot" key={i}>
          <span>{e.text}</span>
          <span className="time">9:41</span>
        </div>
      );
    } else if (e.kind === "warn") {
      items.push(
        <div className="msg bot" key={i} style={{ borderLeft: "3px solid var(--warn)", paddingLeft: 10 }}>
          <span>{e.text}</span>
          <span className="time">9:41</span>
        </div>
      );
    } else if (e.kind === "me") {
      items.push(
        <div className="msg me" key={i}>
          <span>{e.text}</span>
          <span className="time">9:41</span>
        </div>
      );
    } else if (e.kind === "permission") {
      items.push(
        <div className="msg bot" key={i} style={{ width: "92%" }}>
          <div className="permission-card">
            <span className="label">Permission · bash · {e.session}</span>
            <span className="desc">Claude wants to run a shell command.</span>
            <div className="cmd-block">{e.cmd}</div>
            <div className="kb-row">
              <button type="button" className="kb-btn allow" onClick={onAllow} disabled={permResolved}>
                {permResolved ? "✓ Allowed" : "Allow"}
              </button>
              <button type="button" className="kb-btn deny" onClick={onDeny} disabled={permResolved}>
                Deny
              </button>
            </div>
          </div>
        </div>
      );
    }
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [events.length]);

  return (
    <PhoneFrame sessionName="aipager · dev" status="bot · online">
      <div className="chat-body" style={{ minHeight: 300, maxHeight: 400, overflowY: "auto" }} ref={scrollRef}>
        {items}
      </div>
      <form
        className="reply-bar"
        onSubmit={(ev) => {
          ev.preventDefault();
          if (typedValue && typedValue.trim()) onTypedSend(typedValue.trim());
        }}
      >
        <span className="icon"><Icon name="paperclip" size={16} /></span>
        <input
          className="reply-input"
          placeholder="Reply to dev…"
          value={typedValue}
          onChange={(ev) => onTypedChange(ev.target.value)}
        />
        <button type="submit" className="reply-send" aria-label="send">
          <Icon name="send" size={14} />
        </button>
      </form>
    </PhoneFrame>
  );
}

export function Demo() {
  const [scenario, setScenario] = useState<ScenarioKey>("permission");
  const [t, setT] = useState(0);
  const [permResolved, setPermResolved] = useState(false);
  const [extraEvents, setExtraEvents] = useState<DemoEvent[]>([]);
  const [typed, setTyped] = useState("");
  const startRef = useRef<number>(performance.now());

  // Reset and play whenever scenario changes
  useEffect(() => {
    startRef.current = performance.now();
    setT(0);
    setPermResolved(false);
    setExtraEvents([]);
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      setT(Math.min(elapsed, SCENARIOS[scenario].duration + 1000));
      if (elapsed < SCENARIOS[scenario].duration + 1500) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scenario]);

  const baseEvents = eventsUpTo(scenario, t);
  const events = [...baseEvents, ...extraEvents];

  // Sorted view-events (so user-typed events stick to end of timeline visually)
  const handleAllow = () => {
    if (permResolved) return;
    setPermResolved(true);
    setExtraEvents((arr) => [
      ...arr,
      { side: "msg", kind: "me", text: "Allow" },
      { side: "term", kind: "out", cls: "t-key", text: "✓ Approved via telegram" },
    ]);
  };
  const handleDeny = () => {
    if (permResolved) return;
    setPermResolved(true);
    setExtraEvents((arr) => [
      ...arr,
      { side: "msg", kind: "me", text: "Deny" },
      { side: "term", kind: "out", cls: "t-warn", text: "✗ Denied via telegram" },
    ]);
  };
  const handleTyped = (text: string) => {
    setExtraEvents((arr) => [
      ...arr,
      { side: "msg", kind: "me", text },
      { side: "msg", kind: "system", text: "↳ injected into dev" },
      { side: "term", kind: "cmd", text },
      { side: "term", kind: "out", cls: "t-dim", text: "› Working on it…" },
    ]);
    setTyped("");
  };

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
                  <span className="title">{SCENARIOS[k].title}</span>
                  <span className="sub">{SCENARIOS[k].sub}</span>
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
                onClick={() => { setScenario(scenario); /* refresh */ startRef.current = performance.now(); setT(0); setPermResolved(false); setExtraEvents([]); }}
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
            <DemoTerminal events={events} />
            <DemoPhone
              events={events}
              onAllow={handleAllow}
              onDeny={handleDeny}
              permResolved={permResolved}
              onTypedSend={handleTyped}
              typedValue={typed}
              onTypedChange={setTyped}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
