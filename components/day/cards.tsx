"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Mark } from "@/components/brand";
import type { Card } from "./timeline";

/** Milliseconds since this card appeared, for its own small beats. */
function useSince(): number {
  const [t, setT] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setT(1e9);
      return;
    }
    const id = window.setInterval(() => setT(performance.now() - start), 100);
    return () => window.clearInterval(id);
  }, []);
  return t;
}

/** A Telegram notification from the aipager bot, opened far enough to show its buttons. */
function Banner({ children, when = "now", className = "" }: { children: ReactNode; when?: string; className?: string }) {
  return (
    <div className={`rounded-[22px] border border-[var(--glass-line)] bg-[var(--glass)] p-3.5 text-[var(--glass-ink)] shadow-[0_18px_50px_-18px_rgb(0_0_0/0.35)] backdrop-blur-xl ${className}`}>
      <div className="mb-1.5 flex items-center gap-2 text-[11.5px]">
        <Mark size={18} />
        <span className="font-semibold">aipager</span>
        <span className="text-[var(--glass-muted)]">· Telegram</span>
        <span className="ml-auto text-[var(--glass-muted)]">{when}</span>
      </div>
      <div className="text-[13.5px] leading-snug">{children}</div>
    </div>
  );
}

const pop = {
  initial: { opacity: 0, y: 12, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { type: "spring" as const, stiffness: 320, damping: 28 },
};

function Hero() {
  return (
    <div className="flex flex-col items-center text-center">
      <Mark size={64} />
      <div className="mt-4 font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--muted)]">pinned</div>
      <div className="mt-1 text-[15px] text-[var(--ink)]">💤 all idle</div>
    </div>
  );
}

function Terminal({ lines }: { lines: Extract<Card, { kind: "terminal" }>["lines"] }) {
  const t = useSince();
  const tone = { dim: "text-[#7f8791]", claude: "text-[#d97757]", live: "text-[#4fd693]", accent: "text-[#3fa9f5]" } as const;
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0e11] font-mono text-[11.5px] leading-relaxed text-[#d5d9de] shadow-[0_24px_60px_-20px_rgb(0_0_0/0.6)]">
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
        <span className="ml-2 text-[10.5px] text-[#7f8791]">claude-api · dtach</span>
      </div>
      <div className="space-y-0.5 px-3.5 py-3">
        {lines.map((l, i) =>
          t > i * 420 ? (
            <div key={i} className={l.tone ? tone[l.tone] : ""}>
              {l.text}
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}

function Chat({ busy, text }: { busy: string; text: string }) {
  const t = useSince();
  const reaction = t > 2600 ? "👍" : t > 1100 ? "👀" : "";
  return (
    <div className="space-y-3">
      <Banner when="now">{busy}</Banner>
      <div className="flex justify-end">
        <motion.div {...pop} className="max-w-[85%] rounded-2xl rounded-br-md bg-[#3d7fc2] px-3.5 py-2 text-[13.5px] text-white shadow-lg">
          {text}
          <span className="ml-2 text-[10.5px] text-white/60">08:41 ✓✓</span>
          {reaction && (
            <motion.div key={reaction} initial={{ scale: 0.4 }} animate={{ scale: 1 }} className="mt-1 w-fit rounded-full bg-white/20 px-1.5 text-[12px]">
              {reaction}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function Notify({ c }: { c: Extract<Card, { kind: "notify" }> }) {
  const t = useSince();
  const [picked, setPicked] = useState<number | null>(null);
  const done = picked !== null ? c.done.replace("{choice}", c.buttons[picked]) : null;
  return (
    <div>
      <Banner>
        <div className="font-semibold">{c.title}</div>
        {c.body && <div className="mt-1">{c.body}</div>}
        {c.code && <code className="mt-1.5 block rounded-lg bg-[var(--glass-line)] px-2 py-1 font-mono text-[12px]">{c.code}</code>}
      </Banner>
      <div className={`mt-2 grid gap-1.5 ${c.cols === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
        {c.buttons.map((b, i) => (
          <button
            key={b}
            type="button"
            disabled={picked !== null}
            onClick={() => setPicked(i)}
            className={`rounded-xl border border-[var(--glass-line)] px-3 py-2 text-[13px] font-medium text-[var(--glass-ink)] backdrop-blur-xl transition ${
              picked === i ? "bg-[#35c07f]/30" : "bg-[var(--glass)] hover:brightness-110"
            } ${picked === null && i === c.main && t > 900 ? "tap-me" : ""} disabled:cursor-default`}
          >
            {b}
          </button>
        ))}
      </div>
      <div className="mt-2 h-5 text-center text-[12.5px] text-[var(--ink)]">
        {done ? (
          <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
            {done}
          </motion.span>
        ) : (
          <span className="text-[var(--muted)]">tap one</span>
        )}
      </div>
    </div>
  );
}

function Voice({ busy, transcript }: { busy: string; transcript: string }) {
  const t = useSince();
  const bars = [4, 9, 14, 8, 16, 11, 6, 13, 17, 9, 5, 12, 15, 7, 10, 14, 6, 9, 12, 5];
  return (
    <div className="space-y-3">
      <Banner>{busy}</Banner>
      <div className="flex justify-end">
        <motion.div {...pop} className="flex items-center gap-2.5 rounded-2xl rounded-br-md bg-[#3d7fc2] px-3 py-2.5 text-white shadow-lg">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[11px] text-[#3d7fc2]">▶</span>
          <span className="flex items-end gap-[2px]">
            {bars.map((h, i) => (
              <span key={i} className="w-[3px] rounded-full bg-white/80" style={{ height: h }} />
            ))}
          </span>
          <span className="text-[11px] text-white/70">0:07</span>
        </motion.div>
      </div>
      {t > 1400 && (
        <motion.div {...pop} className="text-center text-[12.5px] text-[var(--ink)]">
          <span className="text-[var(--muted)]">transcribed on your machine:</span> “{transcript}”
        </motion.div>
      )}
    </div>
  );
}

function Stack({ items }: { items: { title: string; body: string }[] }) {
  const t = useSince();
  return (
    <div className="space-y-2">
      {items.map((it, i) =>
        t > i * 1100 ? (
          <motion.div key={i} {...pop}>
            <Banner when={i === items.length - 1 ? "now" : `${(items.length - 1 - i) * 3}m ago`}>
              <b>{it.title}</b> · {it.body}
            </Banner>
          </motion.div>
        ) : null,
      )}
    </div>
  );
}

function Status({ c }: { c: Extract<Card, { kind: "status" }> }) {
  return (
    <div className="space-y-2">
      <div className="rounded-2xl border border-[var(--glass-line)] bg-[var(--glass)] px-3.5 py-2 backdrop-blur-xl">
        <div className="text-[10.5px] font-semibold text-[#3fa9f5]">Pinned message</div>
        <div className="text-[13px] text-[var(--glass-ink)]">{c.pinned}</div>
      </div>
      <Banner>
        <div className="mb-1 font-semibold">/status</div>
        {c.rows.map((r) => (
          <div key={r.name} className="flex justify-between gap-3 font-mono text-[12px]">
            <span>
              {r.state} <b>{r.name}</b>
            </span>
            <span className="text-[var(--glass-muted)]">
              ctx {r.ctx} · {r.cost}
            </span>
          </div>
        ))}
      </Banner>
    </div>
  );
}

function App() {
  const lines: { t: string; kind: "ctx" | "del" | "add" }[] = [
    { t: "@@ export function isExpired(token)", kind: "ctx" },
    { t: "-  return token.exp < Date.now()", kind: "del" },
    { t: "+  return token.exp * 1000 < Date.now()", kind: "add" },
    { t: "   }", kind: "ctx" },
    { t: "+ export const EXPIRY_GRACE_MS = 30_000", kind: "add" },
  ];
  return (
    <div className="overflow-hidden rounded-[22px] border border-[var(--glass-line)] bg-[var(--glass)] text-[var(--glass-ink)] shadow-[0_18px_50px_-18px_rgb(0_0_0/0.4)] backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-[var(--glass-line)] px-4 py-2.5 text-[12px]">
        <span className="text-[#3fa9f5]">Close</span>
        <span className="flex items-center gap-1.5 font-semibold">
          <Mark size={15} /> aipager
        </span>
        <span className="text-[#3fa9f5]">⋯</span>
      </div>
      <div className="flex gap-4 px-4 pt-3 text-[12px]">
        <span className="text-[var(--glass-muted)]">Sessions</span>
        <span className="border-b-2 border-[#3fa9f5] pb-1 font-semibold">Diff</span>
        <span className="text-[var(--glass-muted)]">Settings</span>
      </div>
      <div className="px-4 pb-4 pt-3">
        <div className="mb-2 flex items-center justify-between text-[12px]">
          <code className="font-mono">src/auth/expiry.ts</code>
          <span className="text-[var(--glass-muted)]">api · Edit · 14:32</span>
        </div>
        <div className="overflow-hidden rounded-xl bg-[#0c0e11] py-2 font-mono text-[11.5px]">
          {lines.map((l, i) => (
            <div
              key={i}
              className={`px-3 ${l.kind === "del" ? "bg-[#f2705d]/15 text-[#ff9c8c]" : l.kind === "add" ? "bg-[#4fd693]/12 text-[#7ef0b3]" : "text-[#7f8791]"}`}
            >
              {l.t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Night({ finished, pinned }: { finished: string; pinned: string }) {
  const t = useSince();
  return (
    <div className="space-y-3">
      <Banner when="23:38">{finished}</Banner>
      {t > 1000 && (
        <motion.div {...pop} className="rounded-2xl border border-[var(--glass-line)] bg-[var(--glass)] px-3.5 py-2 backdrop-blur-xl">
          <div className="text-[10.5px] font-semibold text-[#3fa9f5]">Pinned message</div>
          <div className="text-[13px] text-[var(--glass-ink)]">{pinned}</div>
        </motion.div>
      )}
    </div>
  );
}

export function MomentCard({ card }: { card: Card }) {
  switch (card.kind) {
    case "hero":
      return <Hero />;
    case "terminal":
      return <Terminal lines={card.lines} />;
    case "chat":
      return <Chat busy={card.busy} text={card.text} />;
    case "notify":
      return <Notify c={card} />;
    case "voice":
      return <Voice busy={card.busy} transcript={card.transcript} />;
    case "stack":
      return <Stack items={card.items} />;
    case "status":
      return <Status c={card} />;
    case "app":
      return <App />;
    case "night":
      return <Night finished={card.finished} pinned={card.pinned} />;
  }
}
