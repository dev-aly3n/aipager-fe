"use client";

// Ask vs Auto permission modes as a flippable switch. It flips itself every
// few seconds until the visitor touches it, then it's theirs. Both states
// stay mounted in one grid cell (the inactive one visibility-hidden), so
// flipping never changes the section's height — no layout shift.

import { useEffect, useState } from "react";
import { ChatCard } from "./chat-card";

const CAPTION: Record<"ask" | "auto", string> = {
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

  const layer = (active: boolean) =>
    `col-start-1 row-start-1 transition-opacity duration-300 ${
      active ? "visible opacity-100" : "invisible opacity-0"
    }`;

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

        {/* the consequence — both states overlaid so height never changes */}
        <div className="mt-8 w-full max-w-md text-left text-[13px]">
          <ChatCard>
            <div className="grid">
              <div className={layer(mode === "ask")} aria-hidden={mode !== "ask"}>
                <div className="max-w-full rounded-2xl rounded-bl-md bg-[var(--tg-in)] px-3.5 py-2.5">
                  <div className="font-semibold text-[var(--tg-fg)]">🔐 api — Bash</div>
                  <div className="mt-1.5 rounded-md bg-black/30 px-2.5 py-1.5 font-mono text-xs text-[var(--tg-accent)]">
                    pnpm prisma migrate dev --name add_users
                  </div>
                </div>
                <div className="mt-[3px] grid grid-cols-2 gap-[3px]">
                  <span className="tg-btn">✅ Allow</span>
                  <span className="tg-btn">❌ Deny</span>
                  <span className="tg-btn">🟢 Allow always</span>
                  <span className="tg-btn">⏹ Stop</span>
                </div>
              </div>
              <div className={layer(mode === "auto")} aria-hidden={mode !== "auto"}>
                <div className="max-w-full rounded-2xl rounded-bl-md bg-[var(--tg-in)] px-3.5 py-2.5">
                  <div className="font-semibold text-[var(--tg-fg)]">⚙️ api · Working… · 41s</div>
                  <div className="mt-2 space-y-1 font-mono text-xs">
                    <div>
                      <span className="text-warning">⚡</span>{" "}
                      <span className="text-[var(--tg-fg)]">Bash</span>{" "}
                      <span className="text-[var(--tg-dim)]">pnpm test — auto-approved</span>
                    </div>
                    <div>
                      <span className="text-warning">⚡</span>{" "}
                      <span className="text-[var(--tg-fg)]">Edit</span>{" "}
                      <span className="text-[var(--tg-dim)]">src/db/schema.ts — auto-approved</span>
                    </div>
                    <div>
                      <span className="text-warning">⚡</span>{" "}
                      <span className="text-[var(--tg-fg)]">Write</span>{" "}
                      <span className="text-[var(--tg-dim)]">migrations/0012.sql — auto-approved</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ChatCard>
        </div>

        {/* fixed-height caption block, so swapping text can't shift the page */}
        <div className="mt-5 flex min-h-[3.5rem] max-w-md flex-col justify-start">
          <p className="text-sm text-dim">{CAPTION[mode]}</p>
        </div>
        <p className="text-xs text-dim">
          Switch per session, any time —{" "}
          <code className="rounded bg-surface px-1.5 py-0.5 font-mono">/perms</code> in chat or
          one tap in the Mini App.
        </p>
      </div>
    </section>
  );
}
