"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mark } from "@/components/brand";
import { fmtElapsed, type AppTile, type Msg, type StageState } from "./script";

type Card = Extract<Msg, { kind: "card" }>;

export interface PhoneProps {
  state: StageState;
  /** the prompt that is waiting for the reader: pulse its main button */
  awaiting: boolean;
  onTap: (choice: number) => void;
  hint: string | null;
}

function StatusIcons() {
  return (
    <span className="flex items-center gap-1.5 text-white">
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

function Ticks() {
  return (
    <svg width="16" height="10" viewBox="0 0 16 10" className="inline-block text-[#8ec8ff]" aria-hidden>
      <path d="M1 5.5 3.8 8.2 9 2" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M6.5 8.2 7 8.6 12.6 2" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Meta({ time, out = false }: { time: string; out?: boolean }) {
  return (
    <span className={`float-right ml-2 mt-1.5 translate-y-0.5 text-[10px] ${out ? "text-[#a9c6e6]" : "text-[#6d7f92]"}`}>
      {time} {out && <Ticks />}
    </span>
  );
}

function StatusLine({ c }: { c: Card }) {
  const verb = c.mark === "✅" ? `Finished (${fmtElapsed(c.elapsed)})` : c.mark === "⏳" ? c.verb : c.verb;
  const parts = [c.mark === "⏳" ? fmtElapsed(c.elapsed) : "", c.mark === "⏳" || c.mark === "✅" ? c.tally : ""].filter(Boolean);
  return (
    <div className="mt-2 border-t border-white/[0.06] pt-1.5">
      {c.mark} <b className="font-semibold">{c.session}</b> · {verb}
      {parts.length > 0 && <span className="text-[#8fa3b8]"> · {parts.join(" · ")}</span>}
    </div>
  );
}

function CardBody({ c }: { c: Card }) {
  return (
    <>
      {c.items.map((it, i) =>
        it.type === "prose" ? (
          <div key={i} className="mb-1 text-[#dfe6ee]">
            {it.text}
          </div>
        ) : (
          <div key={i} className="flex gap-1.5 text-[11.5px]">
            <span className="w-4 shrink-0">{it.done ? "✅" : "⏳"}</span>
            <code className="min-w-0 truncate text-[#b7d3ef]">{it.text}</code>
          </div>
        ),
      )}
      {c.prompt?.kind === "perm" && (
        <div className="mt-2 rounded-lg bg-black/25 px-2.5 py-2">
          <div className="text-[#e6edf5]">
            🔐 {c.prompt.tool}: {c.prompt.what}
          </div>
          <code className="mt-1 block text-[#ffd48a]">{c.prompt.command}</code>
        </div>
      )}
      {c.prompt?.kind === "question" && <div className="mt-2 rounded-lg bg-black/25 px-2.5 py-2 text-[#e6edf5]">❓ {c.prompt.question}</div>}
      <StatusLine c={c} />
    </>
  );
}

function Keyboard({ c, awaiting, onTap, hint }: { c: Card; awaiting: boolean; onTap: (choice: number) => void; hint: string | null }) {
  const p = c.prompt;
  if (!p) return null;
  if (p.kind === "perm") {
    const on = p.answered === "allow";
    const btn = (label: string, choice: number, main = false) => (
      <button
        type="button"
        disabled={p.answered !== null}
        onClick={() => onTap(choice)}
        className={`kb px-2 py-2 ${main && awaiting ? "pulse" : ""} ${on && main ? "!bg-[#2f6b4f]" : ""}`}
      >
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
        {hint && <div className="px-1 pt-0.5 text-center text-[10.5px] text-[#8fa3b8]">{hint}</div>}
      </div>
    );
  }
  return (
    <div className="mt-1 space-y-1">
      {p.options.map((o, i) => (
        <button
          key={o}
          type="button"
          disabled={p.answered !== null}
          onClick={() => onTap(i)}
          className={`kb block w-full px-2 py-2 ${awaiting && i === 0 ? "pulse" : ""} ${p.answered === i ? "!bg-[#2f6b4f]" : ""}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Bubble({ m, awaiting, onTap, hint }: { m: Msg; awaiting: boolean; onTap: (c: number) => void; hint: string | null }) {
  switch (m.kind) {
    case "day":
      return (
        <div className="flex justify-center py-1">
          <span className="rounded-full bg-black/30 px-2.5 py-0.5 text-[10.5px] text-[#c9d5e1]">{m.text}</span>
        </div>
      );
    case "me":
      return (
        <div className="flex justify-end pl-10">
          <div className="bubble out px-2.5 py-1.5 text-[#f1f6fb]">
            <span>{m.text}</span>
            <Meta time={m.time} out />
            <AnimatePresence>
              {m.reaction && (
                <motion.div
                  key={m.reaction}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  className="clear-both mt-1 inline-flex rounded-full bg-[#3d6a99] px-1.5 py-0.5 text-[11px]"
                >
                  {m.reaction}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      );
    case "card":
      return (
        <div className="pr-6">
          <div className="bubble in px-2.5 py-2 text-[#dfe6ee]">
            <CardBody c={m} />
          </div>
          <Keyboard c={m} awaiting={awaiting} onTap={onTap} hint={hint} />
        </div>
      );
    case "reply":
      return (
        <div className="pr-10">
          <div className="bubble in px-2.5 py-1.5 text-[#dfe6ee]">
            <div className="mb-1 rounded-md border-l-2 border-[#6ab3f3] bg-[#6ab3f3]/10 px-2 py-0.5">
              <div className="text-[10.5px] font-semibold text-[#6ab3f3]">aipager</div>
              <div className="truncate text-[10.5px] text-[#9fb2c6]">{m.quote}</div>
            </div>
            <span className="text-[12px]">{m.text}</span>
            <Meta time={m.time} />
          </div>
        </div>
      );
    case "answer":
      return (
        <div className="pr-6">
          <div className="bubble in px-2.5 py-2 text-[#dfe6ee]">
            <div className="mb-1">
              💬 <b className="font-semibold">{m.session}</b>
              {m.stats && <span className="text-[#8fa3b8]"> · {m.stats}</span>}
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
          <div className="bubble in px-2.5 py-2 text-[#dfe6ee]">
            <div className="mb-1 font-semibold">Sessions</div>
            {m.rows.map((r) => (
              <div key={r.name} className="flex justify-between gap-2 font-mono text-[11px]">
                <span>
                  {r.state.split(" ")[0]} <b>{r.name}</b>
                </span>
                <span className="text-[#8fa3b8]">
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

function Ring({ value, tone }: { value: number; tone: string }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90">
      <circle cx="20" cy="20" r={r} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="4" />
      <circle cx="20" cy="20" r={r} fill="none" stroke={tone} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(value / 100) * c} ${c}`} className="transition-[stroke-dasharray] duration-700" />
    </svg>
  );
}

const TILE_TONE: Record<AppTile["state"], string> = { working: "#3fa9f5", idle: "#7f8791", needs: "#f2b84b" };

function MiniApp({ app }: { app: StageState["app"] }) {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 260, damping: 32 }}
      className="absolute inset-x-0 bottom-0 top-[64px] z-20 flex flex-col rounded-t-2xl bg-[#101820] shadow-[0_-20px_40px_rgb(0_0_0/0.5)]"
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5 text-[12px]">
        <span className="text-[#6ab3f3]">Close</span>
        <span className="flex items-center gap-1.5 font-semibold text-white">
          <Mark size={16} /> aipager
        </span>
        <span className="text-[#6ab3f3]">⋯</span>
      </div>
      <div className="flex-1 space-y-3 overflow-hidden px-3.5 py-3">
        <div>
          <div className="text-[17px] font-semibold leading-tight text-white">{app.summary}</div>
          <div className="text-[11px] text-[#8fa3b8]">{app.spent}</div>
        </div>
        {app.needs && (
          <div className="rounded-xl border border-amber/40 bg-amber/10 p-2.5">
            <div className="text-[10.5px] font-semibold uppercase tracking-wider text-amber">Needs you</div>
            <div className="mt-0.5 text-[12px] text-white">
              <b>{app.needs.name}</b> · <code className="text-[11px]">{app.needs.what}</code>
            </div>
            <div className="mt-2 inline-block rounded-lg bg-amber px-2.5 py-1 text-[11px] font-semibold text-[#1a1406]">Answer in chat</div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          {app.tiles.map((t) => (
            <div
              key={t.name}
              className={`rounded-xl border p-2.5 ${t.state === "working" ? "border-accent/40 bg-accent/[0.07] shadow-[0_0_24px_-8px_rgb(63_169_245/0.6)]" : t.state === "needs" ? "border-amber/40 bg-amber/[0.06]" : "border-white/[0.08] bg-white/[0.03]"}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[12.5px] font-semibold text-white">{t.name}</div>
                  <div className="text-[10px]" style={{ color: TILE_TONE[t.state] }}>
                    {t.state === "needs" ? "needs you" : t.state}
                  </div>
                </div>
                <div className="relative">
                  <Ring value={t.ctx} tone={TILE_TONE[t.state]} />
                  <span className="absolute inset-0 grid place-items-center text-[9.5px] text-[#c9d5e1]">{t.ctx}%</span>
                </div>
              </div>
              <div className="mt-1.5 truncate font-mono text-[9.5px] text-[#8fa3b8]">{t.folder}</div>
              <div className="flex justify-between text-[10px] text-[#8fa3b8]">
                <span>{t.model}</span>
                <span>{t.cost}</span>
              </div>
            </div>
          ))}
          <div className="grid place-items-center rounded-xl border border-dashed border-white/[0.12] text-[20px] text-[#6ab3f3]">+</div>
        </div>
      </div>
    </motion.div>
  );
}

export function Phone({ state, awaiting, onTap, hint }: PhoneProps) {
  return (
    <div className="phone h-full w-full">
      <div className="screen relative flex h-full flex-col">
        {/* status bar */}
        <div className="flex items-center justify-between px-6 pb-1 pt-2.5 text-[11px] font-semibold text-white">
          <span className="w-14">9:41</span>
          <span className="h-[18px] w-[70px] rounded-full bg-black" />
          <span className="flex w-14 justify-end">
            <StatusIcons />
          </span>
        </div>
        {/* chat header */}
        <div className="flex items-center gap-2.5 bg-[var(--tg-head)] px-3 py-2">
          <span className="text-[18px] leading-none text-[#6ab3f3]">‹</span>
          <Mark size={30} />
          <div className="leading-tight">
            <div className="text-[13px] font-semibold text-white">aipager</div>
            <div className="text-[10.5px] text-[#7f91a4]">bot</div>
          </div>
          <span className="ml-auto text-[#7f91a4]">⋮</span>
        </div>
        {/* pinned status bar */}
        <div className="flex items-center gap-2 border-b border-black/30 bg-[var(--tg-head)] px-3 py-1.5">
          <span className="h-7 w-0.5 rounded-full bg-[#6ab3f3]" />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="text-[10.5px] font-semibold text-[#6ab3f3]">Pinned message</div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={state.pinned}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="truncate text-[11.5px] text-[#dfe6ee]"
              >
                {state.pinned}
              </motion.div>
            </AnimatePresence>
          </div>
          <span className="text-[#7f91a4]">
            <Icon d="M9 4h6l-1 6 3 3H7l3-3-1-6ZM12 13v7" size={14} />
          </span>
        </div>
        {/* chat */}
        <div className="tg-wall relative flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-2.5 pb-2">
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
        {/* composer */}
        <div className="flex items-end gap-2 bg-[var(--tg-head)] px-3 py-2">
          <span className="pb-px text-[#7f91a4]">
            <Icon d={CLIP} />
          </span>
          <div className={`min-h-[20px] flex-1 break-words text-[12.5px] leading-snug ${state.composer ? "text-white" : "text-[#6d7f92]"}`}>
            {state.composer ? <span className="caret">{state.composer}</span> : "Message"}
          </div>
          {state.composer ? (
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#6ab3f3] text-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M3.4 20.4 21 12 3.4 3.6l.1 6.5L15 12 3.5 13.9z" />
              </svg>
            </span>
          ) : (
            <span className="pb-px text-[#7f91a4]">
              <Icon d={MIC} />
            </span>
          )}
        </div>
        <div className="flex justify-center bg-[var(--tg-head)] pb-1.5">
          <span className="h-1 w-24 rounded-full bg-white/60" />
        </div>
        <AnimatePresence>{state.view === "app" && <MiniApp key="app" app={state.app} />}</AnimatePresence>
      </div>
    </div>
  );
}
