"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mark } from "@/components/brand";
import { fmtClock, PEOPLE, preview, type CardItem, type Chat, type ChatId, type Folder, type Msg, type World } from "./world";

type Card = Extract<Msg, { kind: "card" }>;

/* ---------------- small pieces ---------------- */

function Avatar({ chat, size = 42 }: { chat: Pick<Chat, "kind" | "color" | "initials">; size?: number }) {
  if (chat.kind === "bot") return <Mark size={size} className="shrink-0 rounded-full" />;
  if (chat.kind === "saved")
    return (
      <span className="grid shrink-0 place-items-center rounded-full bg-[#3f8ae0] text-white" style={{ width: size, height: size }}>
        <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
        </svg>
      </span>
    );
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.36, background: `linear-gradient(160deg, ${chat.color}, color-mix(in oklab, ${chat.color} 70%, #000))` }}
    >
      {chat.initials}
    </span>
  );
}

function PersonDot({ id, size = 30 }: { id: string; size?: number }) {
  const p = PEOPLE[id];
  if (id === "bot") return <Mark size={size} className="shrink-0 rounded-full" />;
  return (
    <span className="grid shrink-0 place-items-center rounded-full font-semibold text-white" style={{ width: size, height: size, fontSize: size * 0.4, background: p?.color ?? "#65aadd" }}>
      {(p?.name ?? id)[0]}
    </span>
  );
}

/** Animates in when its value changes, and only then (a row moving in the list must not replay it). */
function Pop({ value, className, children }: { value: string | number; className?: string; children: ReactNode }) {
  const el = useRef<HTMLSpanElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    el.current?.animate(
      [
        { opacity: 0, transform: "translateY(4px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 300, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
    );
  }, [value]);
  return (
    <span ref={el} className={className}>
      {children}
    </span>
  );
}

const Typing = () => (
  <span className="inline-flex items-center gap-[3px] align-middle">
    {[0, 1, 2].map((i) => (
      <span key={i} className="typing-dot h-[4px] w-[4px] rounded-full bg-[#6ab3f3]" style={{ animationDelay: `${i * 0.15}s` }} />
    ))}
  </span>
);

/* ---------------- folders and the chat list ---------------- */

const FOLDERS: { id: Folder; label: string; icon: string }[] = [
  { id: "all", label: "All chats", icon: "M4 5h16v11H8l-4 4V5Z" },
  { id: "personal", label: "Personal", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" },
  { id: "work", label: "Work", icon: "M4 8h16v11H4zM9 8V5h6v3" },
  { id: "bots", label: "Bots", icon: "M6 9h12v9H6zM12 5v4M9 13h.01M15 13h.01" },
];

function inFolder(c: Chat, f: Folder): boolean {
  return f === "all" || c.folder === f;
}

function Folders({ world, onFolder }: { world: World; onFolder: (f: Folder) => void }) {
  return (
    <div className="flex w-[62px] shrink-0 flex-col items-center gap-1 bg-[#0e1621] pt-3">
      {FOLDERS.map((f) => {
        const unread = Object.values(world.chats)
          .filter((c) => inFolder(c, f.id) && !c.muted)
          .reduce((a, c) => a + (c.unread > 0 ? 1 : 0), 0);
        const on = world.folder === f.id;
        return (
          <button key={f.id} type="button" onClick={() => onFolder(f.id)} className={`relative flex w-full flex-col items-center gap-1 py-2 text-[10.5px] ${on ? "text-white" : "text-[#6d7f8f] hover:text-[#a9b8c6]"}`}>
            {on && <span className="absolute left-0 top-2 h-8 w-[3px] rounded-r bg-[#6ab3f3]" />}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" aria-hidden>
              <path d={f.icon} />
            </svg>
            {f.label}
            {unread > 0 && <span className="absolute right-2.5 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#5288c1] px-1 text-[9.5px] font-semibold text-white">{unread}</span>}
          </button>
        );
      })}
    </div>
  );
}

function ChatList({ world, onOpen }: { world: World; onOpen: (id: ChatId) => void }) {
  const chats = Object.values(world.chats)
    .filter((c) => inFolder(c, world.folder))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.order - a.order);

  // Rows glide to their new place when a chat moves up (FLIP).
  const items = useRef(new Map<string, HTMLLIElement>());
  const tops = useRef(new Map<string, number>());
  useLayoutEffect(() => {
    items.current.forEach((el, id) => {
      const topNow = el.offsetTop;
      const was = tops.current.get(id);
      tops.current.set(id, topNow);
      if (was === undefined || was === topNow) return;
      el.style.transition = "none";
      el.style.transform = `translateY(${was - topNow}px)`;
      requestAnimationFrame(() => {
        el.style.transition = "transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)";
        el.style.transform = "";
      });
    });
  });

  return (
    <div className="flex w-[262px] shrink-0 flex-col border-r border-black/40 bg-[#17212b]">
      <div className="flex items-center gap-3 px-3 py-2.5">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6d7f8f" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <div className="flex-1 rounded-full bg-[#242f3d] px-3.5 py-1.5 text-[13px] text-[#6d7f8f]">Search</div>
      </div>
      <ul className="relative min-h-0 flex-1 overflow-hidden">
        {chats.map((c) => {
          const on = c.id === world.open;
          const pv = preview(c);
          let time = "";
          for (const m of c.msgs) if (m.kind !== "day") time = m.time;
          return (
            <li
              key={c.id}
              ref={(el) => {
                if (el) items.current.set(c.id, el);
                else items.current.delete(c.id);
              }}
            >
              <button type="button" onClick={() => onOpen(c.id)} className={`flex w-full items-center gap-2.5 px-2.5 py-[7px] text-left transition-colors duration-150 ${on ? "bg-[#2b5278]" : "hover:bg-[#202b36]"}`}>
                <Avatar chat={c} size={42} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1">
                    {c.kind === "group" && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={on ? "#fff" : "#8a98a6"} aria-hidden>
                        <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 8a6 6 0 0 1 12 0H3Zm13-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm1 8h4a5 5 0 0 0-6.4-4.8A7.5 7.5 0 0 1 17 19Z" />
                      </svg>
                    )}
                    <span className="truncate text-[14px] font-semibold text-white">{c.name}</span>
                    {c.kind === "bot" && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={on ? "#fff" : "#6ab3f3"} aria-hidden>
                        <path d="M12 2 14.4 4.4 17.8 4.2 18 7.6 20.4 10 18 12.4 17.8 15.8 14.4 15.6 12 18 9.6 15.6 6.2 15.8 6 12.4 3.6 10 6 7.6 6.2 4.2 9.6 4.4Z" opacity=".9" />
                      </svg>
                    )}
                    {c.muted && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={on ? "#fff" : "#6d7f8f"} strokeWidth="2" strokeLinecap="round" aria-hidden>
                        <path d="M11 5 6 9H3v6h3l5 4V5ZM22 9l-6 6M16 9l6 6" />
                      </svg>
                    )}
                    <span className={`ml-auto shrink-0 text-[12px] ${on ? "text-[#c8dcf0]" : "text-[#6d7f8f]"}`}>{time}</span>
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5">
                    {c.typing ? (
                      <span className={`min-w-0 flex-1 truncate text-[13px] ${on ? "text-white" : "text-[#6ab3f3]"}`}>
                        {c.kind === "group" ? `${PEOPLE[c.typing]?.name} is typing` : "typing"} <Typing />
                      </span>
                    ) : (
                      <Pop value={pv} className={`min-w-0 flex-1 truncate text-[13px] ${on ? "text-[#c8dcf0]" : "text-[#7d8b99]"}`}>
                        {pv}
                      </Pop>
                    )}
                    {c.unread > 0 ? (
                      <Pop value={c.unread} className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11.5px] font-semibold text-white ${on ? "bg-white !text-[#2b5278]" : c.muted ? "bg-[#3e546a]" : "bg-[#5288c1]"}`}>
                        {c.unread}
                      </Pop>
                    ) : c.pinned ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={on ? "#c8dcf0" : "#6d7f8f"} aria-hidden>
                        <path d="M15 3l6 6-3 1-4 4 1 5-2 1-4-4-5 5-1-1 5-5-4-4 1-2 5 1 4-4 1-3Z" />
                      </svg>
                    ) : null}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------------- messages ---------------- */

/**
 * Telegram's sent (one check) and read (two checks) marks, drawn as icons in
 * a slot of one fixed size, so a message turning read never moves its bubble.
 */
export function Ticks({ n }: { n: 1 | 2 }) {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="block" aria-label={n === 2 ? "read" : "sent"}>
      {n === 2 ? (
        <>
          <path d="M1.2 5.9 3.9 8.6 9.6 2.3" />
          <path d="M8 8.4 8.2 8.6 13.9 2.3" />
        </>
      ) : (
        <path d="M4.2 5.9 6.9 8.6 12.6 2.3" />
      )}
    </svg>
  );
}

function Meta({ time, ticks, out }: { time: string; ticks?: 1 | 2; out: boolean }) {
  return (
    <span className={`float-right ml-2 mt-[5px] translate-y-[3px] select-none whitespace-nowrap text-[11px] ${out ? "text-[#7da8d3]" : "text-[#6d7f8f]"}`}>
      {time}
      {out && ticks && (
        <span className="ml-1 inline-block h-[11px] w-4 align-[-1px] text-[#6ab3f3]">
          <Ticks n={ticks} />
        </span>
      )}
    </span>
  );
}

/**
 * A reaction sits on the bubble's bottom edge instead of inside it, so it can
 * land without resizing the bubble. Messages that will get one keep the room
 * under them from the start (see `reacts` in Bubble).
 */
function Reaction({ r, out }: { r?: string; out: boolean }) {
  return (
    <AnimatePresence>
      {r && (
        <motion.span
          key={r}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 520, damping: 20 }}
          className={`absolute -bottom-[13px] z-10 inline-flex items-center gap-1 whitespace-nowrap rounded-full border-2 border-[#0e1621] bg-[#2f4a66] px-2 py-[1px] text-[12px] text-white ${out ? "right-2" : "left-2"}`}
        >
          {r}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/**
 * One line of a card: Claude's own words come as a Telegram blockquote, a
 * settled run of tool calls folds away behind one line, and everything else
 * is a tool row.
 */
function CardRow({ it }: { it: CardItem }) {
  if (it.type === "prose")
    return (
      <div className="relative my-1.5 rounded-[6px] border-l-[3px] border-[#e8737d] bg-[#2a2029]/80 py-1 pl-2.5 pr-5 leading-[1.38]">
        {it.text}
        <span className="absolute right-1.5 top-0.5 font-serif text-[13px] leading-none text-[#e8737d]">&rdquo;</span>
      </div>
    );
  if (it.type === "fold")
    return (
      <div className="flex items-center gap-2 py-[3px] text-[12.5px] text-[#c9d6e3]">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7d8b99" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m6 9 6 6 6-6" />
        </svg>
        ▸ {it.n} tool calls
      </div>
    );
  return (
    <div className="flex gap-1.5 text-[12.5px]">
      <span className="w-4 shrink-0">{it.done ? "✅" : "⏳"}</span>
      <code className="min-w-0 truncate font-mono text-[12px] text-[#9fc6ee]">{it.text}</code>
    </div>
  );
}

function CardBody({ c }: { c: Card }) {
  const verb = c.mark === "✅" ? `Finished (${fmtClock(c.elapsed)})` : c.verb;
  const parts = [c.mark === "⏳" ? fmtClock(c.elapsed) : "", c.mark === "⏳" || c.mark === "✅" ? c.tally : ""].filter(Boolean);
  return (
    <>
      {c.items.map((it, i) => (
        <CardRow key={i} it={it} />
      ))}
      {c.prompt?.kind === "perm" && (
        <div className="mt-2 rounded-lg bg-black/25 px-2.5 py-2">
          <div>
            🔐 {c.prompt.tool}: {c.prompt.what}
          </div>
          <code className="mt-1 block font-mono text-[12px] text-[#ffc774]">{c.prompt.command}</code>
        </div>
      )}
      {c.prompt?.kind === "question" && <div className="mt-2 rounded-lg bg-black/25 px-2.5 py-2">❓ {c.prompt.question}</div>}
      <div className="mt-2 border-t border-white/[0.07] pt-1.5">
        {c.mark} <b className="font-semibold">{c.session}</b> · {verb}
        {parts.length > 0 && <span className="text-[#8fa3b8]"> · {parts.join(" · ")}</span>}
      </div>
    </>
  );
}

function Keyboard({ c, waiting, onTap }: { c: Card; waiting: boolean; onTap: (choice: number) => void }) {
  const p = c.prompt;
  if (!p) return null;
  const base = "rounded-lg bg-[#1f3246]/90 px-2 py-[7px] text-[13px] font-medium text-white backdrop-blur transition hover:bg-[#28415b] active:scale-[0.98] disabled:cursor-default";
  if (p.kind === "perm") {
    const b = (label: string, choice: number, main = false) => (
      <button type="button" disabled={p.answered} onClick={() => onTap(choice)} className={`${base} ${main && waiting ? "tap-me" : ""} ${main && p.answered ? "!bg-[#2e7d57]" : ""}`}>
        {label}
      </button>
    );
    return (
      <div className="mt-1 grid grid-cols-2 gap-1">
        {b("✅ Allow", 0, true)}
        {b("❌ Deny", 1)}
        {b("🟢 Allow always", 2)}
        {b("⏹ Stop", 3)}
      </div>
    );
  }
  return (
    <div className="mt-1 grid gap-1">
      {p.options.map((o, i) => (
        <button key={o} type="button" disabled={p.answered !== null} onClick={() => onTap(i)} className={`${base} ${waiting && i === 1 ? "tap-me" : ""} ${p.answered === i ? "!bg-[#2e7d57]" : ""}`}>
          {o}
        </button>
      ))}
    </div>
  );
}

function Bubble({ m, chat, prev, waiting, onTap }: { m: Msg; chat: Chat; prev: Msg | undefined; waiting: boolean; onTap: (msg: string, choice: number) => void }) {
  if (m.kind === "day")
    return (
      <div className="flex justify-center py-1.5">
        <span className="rounded-full bg-[#1c2c3c]/90 px-3 py-0.5 text-[12.5px] font-medium text-white">{m.text}</span>
      </div>
    );
  const sender = m.kind === "text" ? m.from : "bot";
  const out = sender === "me";
  const group = chat.kind === "group";
  const prevSender = prev && prev.kind !== "day" ? (prev.kind === "text" ? prev.from : "bot") : null;
  const firstOfRun = prevSender !== sender;
  const reacts = (m.kind === "text" || m.kind === "answer") && m.reaction !== undefined;
  const bubble = `relative flow-root max-w-[78%] rounded-[14px] px-3 py-[7px] text-[13.5px] leading-[1.38] text-[#f1f5f9] shadow-[0_1px_1px_rgb(0_0_0/0.3)] ${
    out ? "bg-[#2b5278] rounded-br-[5px]" : "bg-[#182533] rounded-bl-[5px]"
  }`;
  const name = group && !out && firstOfRun ? (
    <div className="mb-0.5 text-[13px] font-semibold" style={{ color: PEOPLE[sender]?.color }}>
      {PEOPLE[sender]?.name}
    </div>
  ) : null;

  let body: ReactNode = null;
  if (m.kind === "text") {
    body = (
      <>
        {name}
        {m.reply && (
          <div className="mb-1 rounded-md border-l-[3px] border-[#6ab3f3] bg-[#6ab3f3]/10 px-2 py-0.5">
            <div className="text-[12.5px] font-semibold text-[#6ab3f3]">{m.reply.name}</div>
            <div className="truncate text-[12.5px] text-[#a9b8c6]">{m.reply.text}</div>
          </div>
        )}
        <span className="whitespace-pre-wrap">{m.text}</span>
        <Meta time={m.time} ticks={m.ticks} out={out} />
        <Reaction r={m.reaction} out={out} />
      </>
    );
  } else if (m.kind === "card") {
    body = (
      <>
        {name}
        <CardBody c={m} />
        <Meta time={m.time} out={false} />
      </>
    );
  } else if (m.kind === "confirm") {
    body = (
      <>
        {m.done ?? (
          <>
            <div>{m.text}</div>
            <div className="mt-0.5 text-[12.5px] italic text-[#a9b8c6]">{m.note}</div>
          </>
        )}
        <Meta time={m.time} out={false} />
      </>
    );
  } else if (m.kind === "answer") {
    body = (
      <>
        {name}
        <div className="mb-0.5">
          💬 <b className="font-semibold">{m.session}</b>
        </div>
        <span>{m.text}</span>
        <Meta time={m.time} out={false} />
        <Reaction r={m.reaction} out={false} />
      </>
    );
  }

  return (
    <div className={`flex items-end gap-2 ${out ? "justify-end pl-16" : "pr-10"} ${firstOfRun ? "mt-2" : "mt-0.5"} ${reacts ? "mb-3.5" : ""}`}>
      {group && !out && <span className="w-[30px] shrink-0">{firstOfRun && <PersonDot id={sender} />}</span>}
      <div className={`min-w-0 ${out ? "flex justify-end" : ""} ${m.kind === "card" ? "w-[78%] max-w-[420px]" : m.kind === "confirm" && m.done === null ? "w-[70%] max-w-[380px]" : ""}`}>
        <div className={m.kind === "card" || (m.kind === "confirm" && m.done === null) ? `${bubble} !max-w-full` : bubble}>{body}</div>
        {m.kind === "card" && <Keyboard c={m} waiting={waiting} onTap={(choice) => onTap(m.id, choice)} />}
        {m.kind === "confirm" && m.done === null && (
          <div className="mt-1 grid grid-cols-2 gap-1">
            {m.buttons.map((b, i) => (
              <button
                key={b}
                type="button"
                disabled={m.answered !== null}
                onClick={() => onTap(m.id, i)}
                className={`rounded-lg bg-[#1f3246]/90 px-2 py-[7px] text-[13px] font-medium text-white backdrop-blur transition hover:bg-[#28415b] active:scale-[0.98] ${waiting && i === 0 ? "tap-me" : ""} ${m.answered === i ? "!bg-[#2e7d57]" : ""}`}
              >
                {b}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- the open chat ---------------- */

function ChatView({ world, waiting, onTap }: { world: World; waiting: { chat: ChatId; msg: string } | null; onTap: (msg: string, choice: number) => void }) {
  const c = world.chats[world.open];
  const subtitle = c.typing ? (c.kind === "group" ? `${PEOPLE[c.typing]?.name} is typing` : "typing") : c.subtitle;
  return (
    <div className="relative flex min-w-0 flex-1 flex-col bg-[#0e1621]">
      <div className="flex h-[54px] shrink-0 items-center gap-3 border-b border-black/40 bg-[#17212b] px-4">
        <Avatar chat={c} size={38} />
        <div className="min-w-0 leading-tight">
          <div className="truncate text-[14.5px] font-semibold text-white">{c.name}</div>
          <div className={`text-[12.5px] ${c.typing || c.subtitle === "online" ? "text-[#6ab3f3]" : "text-[#6d7f8f]"}`}>
            {subtitle}
            {c.typing && <Typing />}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4 text-[#6d7f8f]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <circle cx="12" cy="5" r="1.8" />
            <circle cx="12" cy="12" r="1.8" />
            <circle cx="12" cy="19" r="1.8" />
          </svg>
        </div>
      </div>
      {c.pinnedBar && (
        <div className="flex shrink-0 items-center gap-2.5 border-b border-black/40 bg-[#17212b] px-4 py-1.5">
          <span className="h-8 w-[3px] rounded-full bg-[#6ab3f3]" />
          <div className="min-w-0 leading-tight">
            <div className="text-[12.5px] font-semibold text-[#6ab3f3]">Pinned message</div>
            <Pop value={c.pinnedBar} className={`block truncate text-[13px] ${c.pinnedBar.startsWith("⏳") ? "text-[#ffc774]" : "text-[#d6e0ea]"}`}>
              {c.pinnedBar}
            </Pop>
          </div>
        </div>
      )}
      <div className="tg-pattern relative flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-4 pb-3">
        <div key={c.id}>
          <AnimatePresence initial={false}>
            {c.msgs.map((m, i) => (
              <motion.div
                key={m.id}
                layout="position"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              >
                <Bubble m={m} chat={c} prev={c.msgs[i - 1]} waiting={!!waiting && waiting.chat === c.id && waiting.msg === m.id} onTap={onTap} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex h-[52px] shrink-0 items-center gap-3 border-t border-black/40 bg-[#17212b] px-4">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6d7f8f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 11.5 12.6 19.9a5.5 5.5 0 0 1-7.8-7.8l8.5-8.5a3.7 3.7 0 0 1 5.2 5.2l-8.5 8.5a1.8 1.8 0 0 1-2.6-2.6l7.8-7.8" />
        </svg>
        <div className={`min-w-0 flex-1 truncate text-[14px] ${world.draft ? "text-white" : "text-[#6d7f8f]"}`}>{world.draft ? <span className="caret">{world.draft}</span> : "Write a message…"}</div>
        {world.draft ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#6ab3f3" aria-hidden>
            <path d="M3.4 20.4 21 12 3.4 3.6l.1 6.5L15 12 3.5 13.9z" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6d7f8f" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3ZM5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
          </svg>
        )}
      </div>
    </div>
  );
}

/* ---------------- the window ---------------- */

export function TelegramWindow({
  world,
  waiting,
  onOpen,
  onFolder,
  onTap,
}: {
  world: World;
  waiting: { chat: ChatId; msg: string } | null;
  onOpen: (id: ChatId) => void;
  onFolder: (f: Folder) => void;
  onTap: (msg: string, choice: number) => void;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#17212b] shadow-[0_40px_100px_-30px_rgb(0_0_0/0.9)]">
      <div className="relative flex h-[30px] shrink-0 items-center gap-2 bg-[#0f171f] px-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="absolute left-1/2 -translate-x-1/2 text-[12.5px] font-medium text-[#8a98a6]">Telegram</span>
      </div>
      <div className="flex min-h-0 flex-1">
        <Folders world={world} onFolder={onFolder} />
        <ChatList world={world} onOpen={onOpen} />
        <ChatView world={world} waiting={waiting} onTap={onTap} />
      </div>
    </div>
  );
}
