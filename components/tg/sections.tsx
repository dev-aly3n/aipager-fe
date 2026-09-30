"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mark } from "@/components/brand";

/* ---------------- where it lives ---------------- */

const PLACES: { name: string; tag: string; color: string; initials: string; bot?: boolean; preview: string; title: string; body: string; chips: string[] }[] = [
  {
    name: "aipager",
    tag: "bot",
    color: "#3fa9f5",
    initials: "ai",
    bot: true,
    preview: "⏳ api · Testing · 3m 14s · Read ×2 · Bash ×2",
    title: "Your chat with Claude",
    body: "One chat for every session. A live card per turn that edits itself, prompts you answer with a tap, a pinned bar that says what needs you, and your next message typed straight into the session.",
    chips: ["/status", "/new", "/stop", "/app", "/<session> <prompt>"],
  },
  {
    name: "backend-team",
    tag: "group · team mode",
    color: "#faa774",
    initials: "BT",
    preview: "Sara: @aipagerbot /web run the login e2e against staging",
    title: "Your team's group",
    body: "Put the bot in a group and anyone on the allow-list can mention it. Every message runs with its sender's role; a tool the role may not use is refused before it runs, and every decision lands in the audit log.",
    chips: ["owner", "admin", "user", "read_only"],
  },
  {
    name: "aipager-observer",
    tag: "read-only bot",
    color: "#7bc862",
    initials: "ob",
    preview: "Compacted: 82% → 4%",
    title: "Anyone who should just watch",
    body: "Observer bots receive the summaries, warnings and errors, with no buttons and no way to drive a session. Fire-and-forget: a failing observer never touches the main bot.",
    chips: ["Finished", "Context at 82%", "Compacting", "API overloaded"],
  },
];

export function Places() {
  return (
    <section id="where" className="border-t border-white/[0.06] py-32">
      <div className="wrap !max-w-[76rem]">
        <div className="eyebrow">Where it lives</div>
        <h2 className="mt-4 max-w-3xl text-[clamp(36px,4vw,56px)] font-semibold leading-[1.02] tracking-[-0.04em]">Three chats. Everything else is just your life.</h2>
        <ul className="mt-16 divide-y divide-white/[0.06] overflow-hidden rounded-3xl border border-white/10 bg-[#17212b]">
          {PLACES.map((p) => (
            <li key={p.name} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-10 px-8 py-8 transition-colors hover:bg-[#1c2835]">
              <div className="flex items-center gap-5">
                {p.bot ? (
                  <Mark size={68} className="shrink-0 rounded-full" />
                ) : (
                  <span className="grid h-[68px] w-[68px] shrink-0 place-items-center rounded-full text-[22px] font-semibold text-white" style={{ background: `linear-gradient(160deg, ${p.color}, color-mix(in oklab, ${p.color} 65%, #000))` }}>
                    {p.initials}
                  </span>
                )}
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[22px] font-semibold text-white">{p.name}</span>
                    <span className="text-[13px] text-[#6ab3f3]">{p.tag}</span>
                  </div>
                  <div className="mt-1 truncate text-[15px] text-[#7d8b99]">{p.preview}</div>
                </div>
              </div>
              <div>
                <div className="text-[18px] font-semibold tracking-[-0.02em] text-white">{p.title}</div>
                <p className="mt-2 text-[15px] leading-relaxed text-fg-2">{p.body}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.chips.map((c) => (
                    <span key={c} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 font-mono text-[12px] text-fg-3">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- under the chat ---------------- */

const NODES: { title: string; sub: string; color: string }[] = [
  { title: "Claude Code", sub: "inside dtach, no window needed", color: "#d97757" },
  { title: "hook", sub: "fires at every step", color: "#3fa9f5" },
  { title: "aipager daemon", sub: "one process, your user", color: "#4fd693" },
  { title: "Telegram", sub: "your own bot token", color: "#2aabee" },
  { title: "your chats", sub: "DM, groups, observers", color: "#b18cff" },
];

export function Under() {
  return (
    <section id="how" className="border-t border-white/[0.06] py-32">
      <div className="wrap !max-w-[76rem]">
        <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-end gap-16">
          <div>
            <div className="eyebrow">Under the chat</div>
            <h2 className="mt-4 text-[clamp(36px,4vw,56px)] font-semibold leading-[1.02] tracking-[-0.04em]">The terminal stays the source of truth.</h2>
          </div>
          <p className="text-[16.5px] leading-relaxed text-fg-2">
            Claude Code runs in a real terminal, inside dtach, so nobody has to keep a window open. Each step fires a hook that sends one datagram
            to the aipager daemon over a local socket, and the daemon edits a message in your chat. Your answers travel back the same way: a
            verdict to the hook holding the call, or keystrokes into the session.
          </p>
        </div>
        <div className="relative mt-20">
          <div className="absolute left-[10%] right-[10%] top-[27px] h-px bg-gradient-to-r from-[#d97757]/60 via-[#4fd693]/60 to-[#b18cff]/60" />
          <span className="flow-dot absolute top-[23px] h-[9px] w-[9px] rounded-full bg-white shadow-[0_0_12px_white]" />
          <span className="flow-dot flow-back absolute top-[23px] h-[9px] w-[9px] rounded-full bg-live shadow-[0_0_12px_rgb(79_214_147)]" />
          <ol className="relative grid grid-cols-5">
            {NODES.map((n) => (
              <li key={n.title} className="text-center">
                <span className="mx-auto grid h-[56px] w-[56px] place-items-center rounded-2xl border bg-[#0d1117]" style={{ borderColor: `${n.color}66` }}>
                  <span className="h-3 w-3 rounded-full" style={{ background: n.color, boxShadow: `0 0 16px ${n.color}` }} />
                </span>
                <div className="mt-4 text-[16px] font-semibold text-white">{n.title}</div>
                <div className="mt-1 text-[13px] text-fg-3">{n.sub}</div>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-wrap justify-center gap-2 font-mono text-[12px] text-fg-3">
            {["UserPromptSubmit", "PreToolUse", "PostToolUse", "PermissionRequest", "SubagentStart", "SessionStart", "SessionEnd", "PreCompact", "PostCompact", "MessageDisplay", "PreModelSwitch", "statusline"].map((h) => (
              <span key={h} className="rounded-full border border-white/10 px-3 py-1">
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- nothing in the middle ---------------- */

const TRUST: { title: string; body: string }[] = [
  { title: "No aipager server.", body: "The daemon talks to the Telegram Bot API with your own bot token. There is no aipager account and no aipager service." },
  { title: "No open port.", body: "It listens on loopback only. The Mini App goes out through a Cloudflare tunnel where every request must carry Telegram's signature, and aipager miniapp disable turns it off." },
  { title: "Every answer on the record.", body: "Each Allow, Deny and answer goes to ~/.claude/aipager-audit.jsonl, append-only, with who tapped it in a group." },
  { title: "Claude Code still decides.", body: "Your settings.json says what needs asking. aipager relays the question; it never decides, and it never runs as root." },
];

export function Trust() {
  return (
    <section id="trust" className="border-t border-white/[0.06] py-32">
      <div className="wrap !max-w-[76rem]">
        <div className="eyebrow">Security</div>
        <h2 className="mt-4 text-[clamp(36px,4vw,56px)] font-semibold leading-[1.02] tracking-[-0.04em]">Nothing in the middle.</h2>
        <div className="mt-14 grid grid-cols-4 gap-8">
          {TRUST.map((t, i) => (
            <div key={t.title} className="border-t border-white/10 pt-6">
              <div className="font-mono text-[12px] text-fg-4">0{i + 1}</div>
              <div className="mt-3 text-[18px] font-semibold tracking-[-0.02em] text-white">{t.title}</div>
              <p className="mt-2 text-[14.5px] leading-relaxed text-fg-2">{t.body}</p>
            </div>
          ))}
        </div>
        <a href="/docs/security" className="mt-10 inline-block text-[14px] text-accent hover:underline">
          The security model →
        </a>
      </div>
    </section>
  );
}

/* ---------------- install: your Saved Messages ---------------- */

const SAVED: { cmd: string; note: string; time: string }[] = [
  { cmd: "curl -fsSL aipager.run/install | sh", note: "uv, pipx or Homebrew, whichever you have. Linux or macOS.", time: "10:02" },
  { cmd: "aipager config", note: "your bot token from @BotFather, your chat, Claude Code's hooks", time: "10:03" },
  { cmd: "aipager service install", note: "keeps the daemon up after you log out", time: "10:04" },
  { cmd: "aipager session api", note: "Claude Code in dtach. Your chat takes it from here.", time: "10:05" },
];

export function Saved() {
  const [copied, setCopied] = useState<string | null>(null);
  return (
    <section id="install" className="border-t border-white/[0.06] py-32">
      <div className="wrap grid !max-w-[76rem] grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-center gap-16">
        <div>
          <div className="eyebrow">Install</div>
          <h2 className="mt-4 text-[clamp(36px,4vw,56px)] font-semibold leading-[1.02] tracking-[-0.04em]">Four lines. Keep them in Saved Messages.</h2>
          <p className="mt-5 text-[16.5px] leading-relaxed text-fg-2">Tap a line to copy it. Prefer your package manager? It is on uv, pipx, Homebrew, Docker, Nix, the AUR and Snap.</p>
          <a href="https://github.com/dev-aly3n/aipager#install" className="mt-6 inline-block text-[14px] text-accent hover:underline">
            Every way to install →
          </a>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0e1621] shadow-[0_40px_100px_-40px_rgb(0_0_0/0.9)]">
          <div className="flex items-center gap-3 border-b border-black/40 bg-[#17212b] px-4 py-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#3f8ae0] text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
              </svg>
            </span>
            <div className="leading-tight">
              <div className="text-[15px] font-semibold text-white">Saved Messages</div>
              <div className="text-[12.5px] text-[#6d7f8f]">4 messages</div>
            </div>
          </div>
          <div className="tg-pattern space-y-2 px-5 py-6">
            {SAVED.map((s) => (
              <div key={s.cmd} className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard?.writeText(s.cmd).then(() => {
                      setCopied(s.cmd);
                      window.setTimeout(() => setCopied(null), 1400);
                    });
                  }}
                  className="max-w-[88%] rounded-[14px] rounded-br-[5px] bg-[#2b5278] px-3.5 py-2 text-left transition hover:brightness-110"
                >
                  <code className="block font-mono text-[14px] text-white">{s.cmd}</code>
                  <span className="mt-0.5 block text-[12.5px] text-[#a9c6e6]">
                    {copied === s.cmd ? "Copied ✓" : s.note}
                    <span className="float-right ml-3 text-[11px] text-[#7da8d3]">{s.time} ✓✓</span>
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- questions, asked in the chat ---------------- */

const FAQS: { q: string; a: string }[] = [
  { q: "How is this different from Claude's mobile apps?", a: "Claude's apps talk to Anthropic's hosted assistant. aipager mirrors a Claude Code session running on your own machine: your repo, your tools, your environment." },
  { q: "Does my code leave my machine?", a: "Only as far as your own Telegram chats. The daemon talks to Telegram with your own bot token; there is no aipager server in between." },
  { q: "What is dtach?", a: "A tiny terminal detacher. It keeps Claude Code alive after the terminal closes or SSH drops, so an answer you send an hour later still reaches a live session. It comes with aipager." },
  { q: "What if Claude goes off the rails?", a: "Prompts wait for your tap, /stop interrupts the turn and drops anything queued, /kill ends the session, and buttons from a finished turn refuse." },
  { q: "Can my team use it?", a: "Yes. Put the bot in a group with roles: owner, admin, user, read_only. Each message runs with its sender's permissions, and every decision is audited." },
  { q: "What does it cost?", a: "Nothing. It's MIT licensed, the bot is yours, and Claude Code keeps using whatever plan or key it already uses." },
];

export function Ask() {
  const [asked, setAsked] = useState<number[]>([0]);
  const [typing, setTyping] = useState(false);
  const ask = (i: number) => {
    if (typing || asked.includes(i)) return;
    setAsked((a) => [...a, i]);
    setTyping(true);
    window.setTimeout(() => setTyping(false), 1100);
  };
  const shown = asked.slice(-3);
  return (
    <section id="faq" className="border-t border-white/[0.06] py-32">
      <div className="wrap grid !max-w-[76rem] grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-16">
        <div>
          <div className="eyebrow">FAQ</div>
          <h2 className="mt-4 text-[clamp(36px,4vw,56px)] font-semibold leading-[1.02] tracking-[-0.04em]">Ask it.</h2>
          <div className="mt-8 flex flex-col items-start gap-2">
            {FAQS.map((f, i) => (
              <button
                key={f.q}
                type="button"
                onClick={() => ask(i)}
                className={`rounded-full border px-4 py-2 text-left text-[14.5px] transition-colors ${asked.includes(i) ? "border-white/5 text-fg-4" : "border-white/12 text-fg-2 hover:border-accent hover:text-foreground"}`}
              >
                {f.q}
              </button>
            ))}
          </div>
        </div>
        <div className="flex h-[520px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e1621]">
          <div className="flex items-center gap-3 border-b border-black/40 bg-[#17212b] px-4 py-3">
            <Mark size={40} className="rounded-full" />
            <div className="leading-tight">
              <div className="text-[15px] font-semibold text-white">aipager</div>
              <div className="text-[12.5px] text-[#6ab3f3]">{typing ? "typing…" : "bot"}</div>
            </div>
          </div>
          <div className="tg-pattern flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden px-5 py-5">
            <AnimatePresence initial={false}>
              {shown.map((i, k) => {
                const answering = typing && k === shown.length - 1;
                return (
                  <motion.div key={i} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-[14px] rounded-br-[5px] bg-[#2b5278] px-3.5 py-2 text-[14px] text-white">{FAQS[i].q}</div>
                    </div>
                    <div className="flex">
                      <div className="max-w-[85%] rounded-[14px] rounded-bl-[5px] bg-[#182533] px-3.5 py-2 text-[14px] leading-relaxed text-[#e6edf5]">
                        {answering ? (
                          <span className="inline-flex gap-1 py-1">
                            {[0, 1, 2].map((d) => (
                              <span key={d} className="typing-dot h-[6px] w-[6px] rounded-full bg-[#6ab3f3]" style={{ animationDelay: `${d * 0.15}s` }} />
                            ))}
                          </span>
                        ) : (
                          FAQS[i].a
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
