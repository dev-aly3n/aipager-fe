"use client";

// Ask vs Auto permission modes as a flippable switch. It flips itself every
// few seconds until the visitor touches it, then it's theirs.

import { useEffect, useState } from "react";

const CAPTION: Record<"ask", string> & Record<"auto", string> = {
  ask: "Every risky tool call waits for your tap — nothing runs behind your back.",
  auto: "Trust the session? Let it run and watch the tools stream past.",
};

export function Modes() {
  const [mode, setMode] = useState<"ask" | "auto">("ask");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched) return;
    const iv = setInterval(() => setMode((m) => (m === "ask" ? "auto" : "ask")), 4500);
    return () => clearInterval(iv);
  }, [touched]);

  const pick = (m: "ask" | "auto") => {
    setTouched(true);
    setMode(m);
  };

  return (
    <section className="border-y border-border/60 bg-surface/40 py-16 lg:py-24">
      <div className="wrap flex flex-col items-center text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          Permission modes
        </span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Your leash, your length.
        </h2>

        {/* the switch */}
        <div className="relative mt-8 grid grid-cols-2 rounded-full border border-border bg-background p-1 text-sm font-medium">
          <span
            aria-hidden
            className={`absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-accent/20 ring-1 ring-accent/50 transition-transform duration-300 ${
              mode === "auto" ? "translate-x-[calc(100%+4px)]" : "translate-x-0"
            }`}
            style={{ left: 4 }}
          />
          <button
            type="button"
            onClick={() => pick("ask")}
            className={`relative z-10 rounded-full px-6 py-2 transition-colors ${
              mode === "ask" ? "text-foreground" : "text-dim"
            }`}
          >
            🔐 Ask
          </button>
          <button
            type="button"
            onClick={() => pick("auto")}
            className={`relative z-10 rounded-full px-6 py-2 transition-colors ${
              mode === "auto" ? "text-foreground" : "text-dim"
            }`}
          >
            ⚡ Auto
          </button>
        </div>

        {/* the consequence */}
        <div className="mt-8 w-full max-w-md text-left text-[13px]">
          {mode === "ask" ? (
            <div key="ask" className="msg-in rounded-2xl border border-border bg-background px-4 py-3 shadow-xl">
              <div className="font-semibold">🔐 api — Bash</div>
              <div className="mt-1.5 rounded-md bg-terminal-bg px-2.5 py-1.5 font-mono text-xs text-accent">
                pnpm prisma migrate dev --name add_users
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1">
                <span className="rounded-md bg-surface px-2 py-1.5 text-center">✅ Allow</span>
                <span className="rounded-md bg-surface px-2 py-1.5 text-center">❌ Deny</span>
                <span className="rounded-md bg-surface px-2 py-1.5 text-center">🟢 Allow always</span>
                <span className="rounded-md bg-surface px-2 py-1.5 text-center">⏹ Stop</span>
              </div>
            </div>
          ) : (
            <div key="auto" className="msg-in rounded-2xl border border-border bg-background px-4 py-3 shadow-xl">
              <div className="font-semibold">⚙️ api · Working… · 41s</div>
              <div className="mt-2 space-y-1 font-mono text-xs">
                <div><span className="text-warning">⚡</span> Bash <span className="text-dim">pnpm test — auto-approved</span></div>
                <div><span className="text-warning">⚡</span> Edit <span className="text-dim">src/db/schema.ts — auto-approved</span></div>
                <div><span className="text-warning">⚡</span> Write <span className="text-dim">migrations/0012_add_users.sql — auto-approved</span></div>
              </div>
            </div>
          )}
        </div>

        <p className="mt-5 max-w-md text-sm text-dim">{CAPTION[mode]}</p>
        <p className="mt-2 text-xs text-dim">
          Switch per session, any time — <code className="rounded bg-surface px-1.5 py-0.5 font-mono">/perms</code> in
          chat or one tap in the Mini App.
        </p>
      </div>
    </section>
  );
}
