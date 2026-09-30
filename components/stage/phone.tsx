"use client";

import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mark } from "@/components/brand";
import { fmtElapsed, type Msg, type StageState } from "./script";

type Card = Extract<Msg, { kind: "card" }>;

export interface PhoneProps {
  state: StageState;
  /** the prompt that is waiting for the reader: pulse its main button */
  awaiting: boolean;
  onTap: (choice: number) => void;
  hint: string | null;
  /** Telegram's day or night theme */
  night: boolean;
}

/** Telegram's own light and dark palettes. */
const THEMES: Record<"day" | "night", Record<string, string>> = {
  day: {
    "--tg-bg": "#cfdde8",
    "--tg-dots": "rgb(40 70 100 / 0.07)",
    "--tg-head": "#ffffff",
    "--tg-title": "#0f1419",
    "--tg-meta": "#8a96a3",
    "--tg-link": "#3390ec",
    "--tg-in": "#ffffff",
    "--tg-in-text": "#0f1419",
    "--tg-out": "#e3fcd6",
    "--tg-out-text": "#0f1419",
    "--tg-out-meta": "#5ea55a",
    "--tg-code": "#2a6db3",
    "--tg-sub": "#5e6b78",
    "--tg-line": "rgb(0 0 0 / 0.07)",
    "--tg-btn": "rgb(55 85 115 / 0.34)",
    "--tg-btn-text": "#ffffff",
    "--tg-box": "rgb(0 0 0 / 0.045)",
    "--tg-react": "#c9e9bd",
    "--tg-pill": "rgb(40 70 100 / 0.22)",
    "--tg-app": "#f1f3f6",
    "--tg-card": "#ffffff",
  },
  night: {
    "--tg-bg": "#0e1621",
    "--tg-dots": "rgb(255 255 255 / 0.035)",
    "--tg-head": "#17212b",
    "--tg-title": "#ffffff",
    "--tg-meta": "#7f91a4",
    "--tg-link": "#6ab3f3",
    "--tg-in": "#182533",
    "--tg-in-text": "#e6edf5",
    "--tg-out": "#2b5278",
    "--tg-out-text": "#f1f6fb",
    "--tg-out-meta": "#a9c6e6",
    "--tg-code": "#b7d3ef",
    "--tg-sub": "#8fa3b8",
    "--tg-line": "rgb(255 255 255 / 0.07)",
    "--tg-btn": "rgb(38 58 80 / 0.92)",
    "--tg-btn-text": "#e6edf5",
    "--tg-box": "rgb(0 0 0 / 0.25)",
    "--tg-react": "#3d6a99",
    "--tg-pill": "rgb(0 0 0 / 0.3)",
    "--tg-app": "#101820",
    "--tg-card": "#17212b",
  },
};

function StatusIcons() {
  return (
    <span className="flex items-center gap-1.5">
      <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor" aria-hidden>
        <rect x="0" y="7" width="3" height="4" rx="0.8" />
        <rect x="4.3" y="5" width="3" height="6" rx="0.8" />
        <rect x="8.6" y="2.5" width="3" height="8.5" rx="0.8" />
        <rect x="12.9" y="0" width="3" height="11" rx="0.8" />
      </svg>
      <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
        <path d="M1 3.8a9.2 9.2 0 0 1 13 0M3.4 6.3a5.8 5.8 0 0 1 8.2 0" />
        <circle cx="7.5" cy="9" r="1" fill="currentColor" stroke="none" />
      </svg>
      <svg width="24" height="11" viewBox="0 0 24 11" fill="none" aria-hidden>
        <rect x="0.5" y="0.5" width="20" height="10" rx="3" stroke="currentColor" strokeOpacity="0.5" />
        <rect x="2" y="2" width="15" height="7" rx="1.6" fill="currentColor" />
        <rect x="21.8" y="3.5" width="1.6" height="4" rx="0.8" fill="currentColor" fillOpacity="0.5" />
      </svg>
    </span>
  );
}

function Icon({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

const CLIP = "M21 11.5 12.6 19.9a5.5 5.5 0 0 1-7.8-7.8l8.5-8.5a3.7 3.7 0 0 1 5.2 5.2l-8.5 8.5a1.8 1.8 0 0 1-2.6-2.6l7.8-7.8";
const MIC = "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3ZM5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21";

function Meta({ time, out = false }: { time: string; out?: boolean }) {
  return (
    <span className={`float-right ml-2 mt-1.5 translate-y-0.5 text-[10px] ${out ? "text-[var(--tg-out-meta)]" : "text-[var(--tg-meta)]"}`}>
      {time} {out && "✓✓"}
    </span>
  );
}

function Reaction({ r }: { r: string }) {
  return (
    <AnimatePresence>
      {r && (
        <motion.div
          key={r}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          className="clear-both mt-1 inline-flex rounded-full bg-[var(--tg-react)] px-1.5 py-0.5 text-[11px]"
        >
          {r}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatusLine({ c }: { c: Card }) {
  const verb = c.mark === "✅" ? `Finished (${fmtElapsed(c.elapsed)})` : c.verb;
  const parts = [c.mark === "⏳" ? fmtElapsed(c.elapsed) : "", c.mark === "⏳" || c.mark === "✅" ? c.tally : ""].filter(Boolean);
  return (
    <div className="mt-2 border-t border-[var(--tg-line)] pt-1.5">
      {c.mark} <b className="font-semibold">{c.session}</b> · {verb}
      {parts.length > 0 && <span className="text-[var(--tg-sub)]"> · {parts.join(" · ")}</span>}
    </div>
  );
}

function CardBody({ c }: { c: Card }) {
  return (
    <>
      {c.items.map((it, i) =>
        it.type === "prose" ? (
          <div key={i} className="mb-1">
            {it.text}
          </div>
        ) : (
          <div key={i} className="flex gap-1.5 text-[11.5px]">
            <span className="w-4 shrink-0">{it.done ? "✅" : "⏳"}</span>
            <code className="min-w-0 truncate text-[var(--tg-code)]">{it.text}</code>
          </div>
        ),
      )}
      {c.prompt?.kind === "perm" && (
        <div className="mt-2 rounded-lg bg-[var(--tg-box)] px-2.5 py-2">
          <div>
            🔐 {c.prompt.tool}: {c.prompt.what}
          </div>
          <code className="mt-1 block text-[#d98a1e]">{c.prompt.command}</code>
        </div>
      )}
      {c.prompt?.kind === "question" && <div className="mt-2 rounded-lg bg-[var(--tg-box)] px-2.5 py-2">❓ {c.prompt.question}</div>}
      <StatusLine c={c} />
    </>
  );
}

function Keyboard({ c, awaiting, onTap, hint }: { c: Card; awaiting: boolean; onTap: (choice: number) => void; hint: string | null }) {
  const p = c.prompt;
  if (!p) return null;
  const cls = "kb-tg rounded-[9px] bg-[var(--tg-btn)] px-2 py-2 text-[12px] font-medium text-[var(--tg-btn-text)] backdrop-blur transition active:scale-[0.97]";
  if (p.kind === "perm") {
    const btn = (label: string, choice: number, main = false) => (
      <button type="button" disabled={p.answered !== null} onClick={() => onTap(choice)} className={`${cls} ${main && awaiting ? "tap-me" : ""} ${p.answered === "allow" && main ? "!bg-[#3a9a64]" : ""}`}>
        {label}
      </button>
    );
    return (
      <div className="mt-1 space-y-1">
        <div className="grid grid-cols-2 gap-1">
          {btn("✅ Allow", 0, true)}
          {btn("❌ Deny", 1)}
        </div>
        <div className="grid grid-cols-2 gap-1">
          {btn("🟢 Allow always", 2)}
          {btn("⏹ Stop", 3)}
        </div>
        {hint && <div className="rounded-lg bg-[var(--tg-pill)] px-2 py-1 text-center text-[10.5px] text-white">{hint}</div>}
      </div>
    );
  }
  return (
    <div className="mt-1 space-y-1">
      {p.options.map((o, i) => (
        <button key={o} type="button" disabled={p.answered !== null} onClick={() => onTap(i)} className={`${cls} block w-full ${awaiting && i === 0 ? "tap-me" : ""} ${p.answered === i ? "!bg-[#3a9a64]" : ""}`}>
          {o}
        </button>
      ))}
    </div>
  );
}

function Bubble({ m, awaiting, onTap, hint }: { m: Msg; awaiting: boolean; onTap: (c: number) => void; hint: string | null }) {
  const inBubble = "bubble in !bg-[var(--tg-in)] px-2.5 py-2 text-[var(--tg-in-text)]";
  const outBubble = "bubble out !bg-[var(--tg-out)] px-2.5 py-1.5 text-[var(--tg-out-text)]";
  switch (m.kind) {
    case "day":
      return (
        <div className="flex justify-center py-1">
          <span className="rounded-full bg-[var(--tg-pill)] px-2.5 py-0.5 text-[10.5px] text-white">{m.text}</span>
        </div>
      );
    case "me":
      return (
        <div className="flex justify-end pl-10">
          <div className={outBubble}>
            <span>{m.text}</span>
            <Meta time={m.time} out />
            <Reaction r={m.reaction} />
          </div>
        </div>
      );
    case "voice":
      return (
        <div className="flex justify-end pl-10">
          <div className={outBubble}>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--tg-out-meta)] text-[10px] text-white">▶</span>
              <span className="flex items-end gap-[2px]">
                {[4, 8, 12, 7, 14, 10, 5, 12, 15, 8, 5, 11, 13, 6, 9, 12, 5].map((h, i) => (
                  <span key={i} className="w-[2.5px] rounded-full bg-[var(--tg-out-meta)]" style={{ height: h }} />
                ))}
              </span>
              <span className="text-[10.5px] text-[var(--tg-out-meta)]">0:0{m.secs}</span>
            </div>
            <Meta time={m.time} out />
            <Reaction r={m.reaction} />
          </div>
        </div>
      );
    case "card":
      return (
        <div className="pr-6">
          <div className={inBubble}>
            <CardBody c={m} />
          </div>
          <Keyboard c={m} awaiting={awaiting} onTap={onTap} hint={hint} />
        </div>
      );
    case "reply":
      return (
        <div className="pr-10">
          <div className={`${inBubble} !py-1.5`}>
            <div className="mb-1 rounded-md border-l-2 border-[var(--tg-link)] bg-[var(--tg-box)] px-2 py-0.5">
              <div className="text-[10.5px] font-semibold text-[var(--tg-link)]">aipager</div>
              <div className="truncate text-[10.5px] text-[var(--tg-sub)]">{m.quote}</div>
            </div>
            <span className="text-[12px]">{m.text}</span>
            <Meta time={m.time} />
          </div>
        </div>
      );
    case "note":
      return (
        <div className="pr-10">
          <div className={`${inBubble} !py-1.5`}>
            <span className="text-[12px]">{m.text}</span>
            <Meta time={m.time} />
          </div>
        </div>
      );
    case "answer":
      return (
        <div className="pr-6">
          <div className={inBubble}>
            <div className="mb-1">
              💬 <b className="font-semibold">{m.session}</b>
              {m.stats && <span className="text-[var(--tg-sub)]"> · {m.stats}</span>}
            </div>
            {m.text.map((t, i) => (
              <p key={i} className="mb-1 last:mb-0">
                {t}
              </p>
            ))}
            <Meta time={m.time} />
          </div>
        </div>
      );
    case "status":
      return (
        <div className="pr-6">
          <div className={inBubble}>
            <div className="mb-1 font-semibold">Sessions</div>
            {m.rows.map((r) => (
              <div key={r.name} className="flex justify-between gap-2 font-mono text-[11px]">
                <span>
                  {r.state.split(" ")[0]} <b>{r.name}</b>
                </span>
                <span className="text-[var(--tg-sub)]">
                  ctx {r.ctx} · {r.cost}
                </span>
              </div>
            ))}
            <Meta time={m.time} />
          </div>
        </div>
      );
  }
}

function MiniApp({ app }: { app: StageState["app"] }) {
  const d = app.diff;
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 260, damping: 32 }}
      className="absolute inset-x-0 bottom-0 top-[64px] z-20 flex flex-col rounded-t-2xl bg-[var(--tg-app)] text-[var(--tg-in-text)] shadow-[0_-20px_40px_rgb(0_0_0/0.3)]"
    >
      <div className="flex items-center justify-between border-b border-[var(--tg-line)] px-4 py-2.5 text-[12px]">
        <span className="text-[var(--tg-link)]">Close</span>
        <span className="flex items-center gap-1.5 font-semibold">
          <Mark size={16} /> aipager
        </span>
        <span className="text-[var(--tg-link)]">⋯</span>
      </div>
      <div className="px-3.5 pt-3">
        <div className="text-[16px] font-semibold leading-tight">{app.summary}</div>
        <div className="text-[11px] text-[var(--tg-sub)]">{app.spent}</div>
      </div>
      <div className="flex gap-4 px-3.5 pt-3 text-[12px]">
        <span className="text-[var(--tg-sub)]">Sessions</span>
        <span className="border-b-2 border-[var(--tg-link)] pb-1 font-semibold">Diff</span>
        <span className="text-[var(--tg-sub)]">Settings</span>
      </div>
      {d && (
        <div className="px-3.5 pt-3">
          <div className="mb-2 flex items-center justify-between text-[11.5px]">
            <code className="font-mono">{d.file}</code>
            <span className="text-[var(--tg-sub)]">{d.meta}</span>
          </div>
          <div className="overflow-hidden rounded-xl bg-[#0c0e11] py-2 font-mono text-[9.5px] leading-relaxed">
            {d.lines.map((l, i) => (
              <div key={i} className={`whitespace-pre-wrap break-all px-2.5 ${l.kind === "del" ? "bg-[#f2705d]/15 text-[#ff9c8c]" : l.kind === "add" ? "bg-[#4fd693]/12 text-[#7ef0b3]" : "text-[#7f8791]"}`}>
                {l.t}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function Phone({ state, awaiting, onTap, hint, night }: PhoneProps) {
  return (
    <div className="phone h-full w-full" style={THEMES[night ? "night" : "day"] as CSSProperties}>
      <div className="screen relative flex h-full flex-col !bg-[var(--tg-bg)] transition-colors duration-700">
        <div className="flex items-center justify-between bg-[var(--tg-head)] px-6 pb-1 pt-2.5 text-[11px] font-semibold text-[var(--tg-title)]">
          <span className="w-14">9:41</span>
          <span className="h-[18px] w-[70px] rounded-full bg-black" />
          <span className="flex w-14 justify-end">
            <StatusIcons />
          </span>
        </div>
        <div className="flex items-center gap-2.5 bg-[var(--tg-head)] px-3 py-2">
          <span className="text-[18px] leading-none text-[var(--tg-link)]">‹</span>
          <Mark size={30} />
          <div className="leading-tight">
            <div className="text-[13px] font-semibold text-[var(--tg-title)]">aipager</div>
            <div className="text-[10.5px] text-[var(--tg-meta)]">bot</div>
          </div>
          <span className="ml-auto text-[var(--tg-meta)]">⋮</span>
        </div>
        <div className="flex items-center gap-2 border-b border-[var(--tg-line)] bg-[var(--tg-head)] px-3 py-1.5">
          <span className="h-7 w-0.5 rounded-full bg-[var(--tg-link)]" />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="text-[10.5px] font-semibold text-[var(--tg-link)]">Pinned message</div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={state.pinned}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="truncate text-[11.5px] text-[var(--tg-title)]"
              >
                {state.pinned}
              </motion.div>
            </AnimatePresence>
          </div>
          <span className="text-[var(--tg-meta)]">
            <Icon d="M9 4h6l-1 6 3 3H7l3-3-1-6ZM12 13v7" size={14} />
          </span>
        </div>
        <div
          className="relative flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-2.5 pb-2"
          style={{ backgroundImage: "radial-gradient(var(--tg-dots) 1px, transparent 1px)", backgroundSize: "14px 14px" }}
        >
          <div className="space-y-1.5">
            <AnimatePresence initial={false}>
              {state.chat.map((m) => (
                <motion.div
                  key={m.id}
                  layout="position"
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                >
                  <Bubble m={m} awaiting={awaiting} onTap={onTap} hint={hint} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex items-end gap-2 bg-[var(--tg-head)] px-3 py-2">
          <span className="pb-px text-[var(--tg-meta)]">
            <Icon d={CLIP} />
          </span>
          <div className={`min-h-[20px] flex-1 break-words text-[12.5px] leading-snug ${state.composer ? "text-[var(--tg-title)]" : "text-[var(--tg-meta)]"}`}>
            {state.composer ? <span className="caret">{state.composer}</span> : "Message"}
          </div>
          {state.composer ? (
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--tg-link)] text-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M3.4 20.4 21 12 3.4 3.6l.1 6.5L15 12 3.5 13.9z" />
              </svg>
            </span>
          ) : (
            <span className="pb-px text-[var(--tg-meta)]">
              <Icon d={MIC} />
            </span>
          )}
        </div>
        <div className="flex justify-center bg-[var(--tg-head)] pb-1.5">
          <span className="h-1 w-24 rounded-full bg-[var(--tg-title)] opacity-50" />
        </div>
        <AnimatePresence>{state.view === "app" && <MiniApp key="app" app={state.app} />}</AnimatePresence>
      </div>
    </div>
  );
}
