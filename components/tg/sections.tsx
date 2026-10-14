"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mark } from "@/components/brand";
import { Ticks } from "./telegram";
import STRINGS from "@/lib/bot-strings.json";

/* ---------------- where it lives ---------------- */

const PLACES: { name: string; tag: string; color: string; initials: string; bot?: boolean; preview: string; title: string; body: string; chips: string[] }[] = [
  {
    name: "aipager",
    tag: "bot",
    color: "#3fa9f5",
    initials: "ai",
    bot: true,
    preview: "⏳ api · Testing · 3:14 · Read ×2 · Bash ×2",
    title: "Your chat with Claude",
    body: "One chat for every session. A live card per turn that edits itself, prompts you answer with a tap, a pinned bar that says what needs you, and your next message typed straight into the session — even mid-turn.",
    chips: ["/status", "/new", "/mode", "/stop", "/app", "/<session> <prompt>"],
  },
  {
    name: "backend-team",
    tag: "group · team mode",
    color: "#faa774",
    initials: "BT",
    preview: "Sara: @aipagerbot /web run the login e2e against staging",
    title: "Your team's group",
    body: "Put the bot in a group and anyone on the allow-list can mention it. Every message runs with its sender's role; a tool the role may not use is refused before it runs, and every decision lands in the audit log with the name of whoever tapped.",
    chips: ["owner", "admin", "user", "read_only"],
  },
  {
    name: "Jim",
    tag: "their own chat with the bot",
    color: "#b18cff",
    initials: "J",
    preview: "🔐 web · Permission needed",
    title: "Someone else, in their own chat",
    body: "Add a teammate's private chat with the bot and they drive their own sessions, with their own role and their own root folder: their Claude turns start inside it and read nothing in your home folder outside it. Someone who should only watch gets read_only in your group.",
    chips: ["members' root folder", "~/aipager-users/<label>", "read_only", "/new"],
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
  { title: "your chats", sub: "your DM, your team's group", color: "#b18cff" },
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
            {[
              "UserPromptSubmit",
              "PreToolUse",
              "PermissionRequest",
              "PostToolUse",
              "PostToolUseFailure",
              "Notification",
              "Stop",
              "StopFailure",
              "SubagentStart",
              "SubagentStop",
              "PreCompact",
              "PostCompact",
              "MessageDisplay",
              "PreModelSwitch",
              "SessionStart",
              "SessionEnd",
              "statusline",
            ].map((h) => (
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
                    <span className="float-right ml-3 inline-flex items-center gap-1 text-[11px] text-[#7da8d3]">
                      {s.time}
                      <span className="inline-block h-[11px] w-4 text-[#6ab3f3]">
                        <Ticks n={2} />
                      </span>
                    </span>
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
  { q: "Can my team use it?", a: "Yes. Put the bot in a group with roles: owner, admin, user, read_only. Each message runs with its sender's permissions, a member without can_manage works inside their own root folder, and every decision is audited." },
  { q: "Does it speak my language?", a: "Fifteen, picked with /language or followed from your Telegram app — Persian and Arabic right to left, with their own digits. Only aipager's own text changes; Claude answers in the language you write to it." },
  { q: "Is there a dashboard?", a: "/app opens a Mini App inside Telegram: a tile per session, a diff viewer for every Write and Edit, the settings, one-tap stop. It is on by default, every request is checked against Telegram's signature, and aipager miniapp disable turns it off." },
  { q: "How do I update it?", a: "/update checks aipager and Claude Code and installs the new version, then 🔄 Restart now brings it up in place — in a terminal, tmux, Docker or under a service. Your sessions keep running through it." },
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

/* ---------------- ask, or let it run ---------------- */

function MiniChat({ title, tag, children }: { title: string; tag: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0e1621]">
      <div className="flex items-center gap-3 border-b border-black/40 bg-[#17212b] px-4 py-3">
        <Mark size={34} className="rounded-full" />
        <div className="leading-tight">
          <div className="text-[14.5px] font-semibold text-white">aipager</div>
          <div className="text-[12px] text-[#6ab3f3]">bot</div>
        </div>
        <span className="ml-auto rounded-full bg-white/[0.06] px-3 py-1 text-[12.5px] font-medium text-white">{title}</span>
        <span className="text-[12px] text-fg-4">{tag}</span>
      </div>
      <div className="tg-pattern space-y-2 px-4 py-5 text-[13.5px] leading-[1.4] text-[#f1f5f9]">{children}</div>
    </div>
  );
}

const In = ({ children }: { children: React.ReactNode }) => <div className="max-w-[88%] rounded-[14px] rounded-bl-[5px] bg-[#182533] px-3 py-2">{children}</div>;
const Out = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-end">
    <div className="max-w-[80%] rounded-[14px] rounded-br-[5px] bg-[#2b5278] px-3 py-2">{children}</div>
  </div>
);
const Key = ({ children, on = false }: { children: React.ReactNode; on?: boolean }) => (
  <span className={`rounded-lg px-2 py-[7px] text-center text-[13px] font-medium text-white ${on ? "bg-[#2e7d57]" : "bg-[#1f3246]/90"}`}>{children}</span>
);
/** Claude's own words, as the card quotes them. */
const Quote = ({ children }: { children: React.ReactNode }) => (
  <div className="relative my-1 rounded-[6px] border-l-[3px] border-[#e8737d] bg-[#2a2029]/80 py-1 pl-2.5 pr-5 leading-[1.38]">
    {children}
    <span className="absolute right-1.5 top-0.5 font-serif text-[13px] leading-none text-[#e8737d]">&rdquo;</span>
  </div>
);

const Fold = ({ n }: { n: number }) => (
  <div className="flex items-center gap-2 py-[3px] text-[12.5px] text-[#c9d6e3]">
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7d8b99" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
    ▸ {n} tool calls
  </div>
);

const Row = ({ done, children }: { done: boolean; children: React.ReactNode }) => (
  <div className="flex gap-1.5 text-[12.5px]">
    <span className="w-4 shrink-0">{done ? "✅" : "⏳"}</span>
    <code className="min-w-0 truncate font-mono text-[12px] text-[#9fc6ee]">{children}</code>
  </div>
);

const MODE_FACTS: { title: string; body: string }[] = [
  {
    title: "/mode",
    body: "Shows a button for each other mode; /mode ask, /mode auto and /mode full switch straight away. New sessions start in Auto unless the chat chose otherwise under /settings → New sessions.",
  },
  {
    title: "Ask ⇄ Auto, in place",
    body: "No restart, even while Claude works: aipager presses Shift+Tab in the session, and the card says it is switching until Claude Code confirms the new mode.",
  },
  {
    title: "Full access restarts",
    body: "Going to or from Full access restarts the session and keeps the conversation. Only an admin can start or switch one into it — or you, in your own private chat with the bot.",
  },
  {
    title: "Questions still come",
    body: "A mode governs permission prompts, not decisions: when Claude asks you something, the buttons land in your chat whatever the mode.",
  },
];

export function Modes() {
  return (
    <section id="modes" className="border-t border-white/[0.06] py-32">
      <div className="wrap !max-w-[76rem]">
        <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-end gap-16">
          <div>
            <div className="eyebrow">Permission modes</div>
            <h2 className="mt-4 text-[clamp(36px,4vw,56px)] font-semibold leading-[1.02] tracking-[-0.04em]">Three modes. Auto is where you start.</h2>
          </div>
          <p className="text-[16.5px] leading-relaxed text-fg-2">
            Every session is in one of three, set per session and changed any time with <code className="font-mono text-fg-3">/mode</code>. Ask stops
            before each action. Auto — where every new session starts — lets Claude Code&apos;s own safety check run the safe calls and stop the risky
            ones for you. Full access runs everything with no checks at all.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-3 gap-5">
          <MiniChat title="💬 Ask" tag="/mode ask">
            <In>
              <Quote>I&apos;ll look at the cookie helper first.</Quote>
              <div className="mt-1 rounded-lg bg-black/25 px-2.5 py-2">
                <div>🔐 Read: the cookie helper</div>
                <code className="mt-1 block font-mono text-[12px] text-[#ffc774]">src/auth/cookie.ts</code>
              </div>
              <div className="mt-2 border-t border-white/[0.07] pt-1.5">
                🔐 <b>api</b> · Permission needed
              </div>
            </In>
            <div className="grid max-w-[88%] grid-cols-2 gap-1">
              <Key on>✅ Allow</Key>
              <Key>❌ Deny</Key>
              <Key>🟢 Allow always</Key>
              <Key>⏹ Stop</Key>
            </div>
            <In>✅ api · Allowed · Read: src/auth/cookie.ts</In>
            <div className="max-w-[88%] px-1 text-[12.5px] text-fg-3">Every call waits for you — even a read.</div>
          </MiniChat>
          <MiniChat title="🤖 Auto" tag="default">
            <In>
              <Quote>The test clicks before the session cookie is set.</Quote>
              <Row done>Read: src/auth/cookie.ts</Row>
              <Row done>Bash: pnpm test e2e/login --trace on</Row>
              <div className="mt-2 rounded-lg bg-black/25 px-2.5 py-2">
                <div>🔐 Bash: Look at the newest sessions on staging</div>
                <code className="mt-1 block font-mono text-[12px] text-[#ffc774]">psql $STAGING_URL -c &apos;select id, …&apos;</code>
              </div>
              <div className="mt-2 border-t border-white/[0.07] pt-1.5">
                🔐 <b>api</b> · Permission needed
              </div>
            </In>
            <div className="grid max-w-[88%] grid-cols-2 gap-1">
              <Key on>✅ Allow</Key>
              <Key>❌ Deny</Key>
              <Key>🟢 Allow always</Key>
              <Key>⏹ Stop</Key>
            </div>
            <div className="max-w-[88%] px-1 text-[12.5px] text-fg-3">The read and the test run went through on their own. A command against staging is the risky kind, so it stopped.</div>
          </MiniChat>
          <MiniChat title="🔓 Full access" tag="/mode full">
            <Out>/mode full</Out>
            <In>🔓 api is now in Full access mode.</In>
            <Out>fix the flaky login e2e test</Out>
            <In>
              <Fold n={4} />
              <Quote>The test clicks before the session cookie is set. It sleeps 5s and hopes.</Quote>
              <Row done>Edit: e2e/login.spec.ts</Row>
              <Row done={false}>Bash: pnpm test e2e/login --repeat 10</Row>
              <div className="mt-2 border-t border-white/[0.07] pt-1.5">
                ⏳ <b>api</b> · Testing <span className="text-[#8fa3b8]">· 4:02 · Read ×2 · Bash ×3 · Edit ×1</span>
              </div>
            </In>
            <div className="max-w-[88%] px-1 text-[12.5px] text-fg-3">No checks, no buttons. Just the answer when it is done.</div>
          </MiniChat>
        </div>
        <div className="mt-12 grid grid-cols-4 gap-8">
          {MODE_FACTS.map((f) => (
            <div key={f.title} className="border-t border-white/10 pt-5">
              <div className="font-mono text-[14px] text-white">{f.title}</div>
              <p className="mt-2 text-[14px] leading-relaxed text-fg-2">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- fifteen languages ---------------- */

interface Lang {
  code: string;
  name: string;
  rtl: boolean;
  permHead: string;
  allow: string;
  deny: string;
  always: string;
  stop: string;
  switched: string;
  cardStatus: string;
  clock: string;
  language: string;
  modes: { ask: string; auto: string; full: string };
}

const LANGS = STRINGS as Lang[];

/** The catalogs' only markup is <b> around the session's name. */
function Bold({ html }: { html: string }) {
  return (
    <>
      {html.split(/<\/?b>/).map((part, i) =>
        i % 2 === 1 ? (
          <b key={i} className="font-semibold text-white">
            {part}
          </b>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export function Languages() {
  const [code, setCode] = useState("fa");
  const L = LANGS.find((l) => l.code === code) ?? LANGS[0];
  return (
    <section id="languages" className="border-t border-white/[0.06] py-32">
      <div className="wrap !max-w-[76rem]">
        <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-end gap-16">
          <div>
            <div className="eyebrow">Fifteen languages</div>
            <h2 className="mt-4 text-[clamp(36px,4vw,56px)] font-semibold leading-[1.02] tracking-[-0.04em]">In your language, down to the digits.</h2>
          </div>
          <p className="text-[16.5px] leading-relaxed text-fg-2">
            Only aipager&apos;s own words change: cards, prompts, buttons, the pinned bar, <code className="font-mono text-fg-3">/status</code>, the
            Mini App, the docs. Your sessions do not — Claude answers in the language you write to it, and what aipager sends Claude stays as it was.
            Pick one with <code className="font-mono text-fg-3">/language</code>, or let it follow your Telegram app.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start gap-14">
          <div>
            <div className="flex flex-wrap gap-2">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setCode(l.code)}
                  aria-pressed={l.code === code}
                  className={`rounded-full px-3.5 py-1.5 text-[14px] transition-colors ${
                    l.code === code ? "bg-[#2aabee] text-white" : "border border-white/10 bg-white/[0.03] text-fg-2 hover:border-white/25 hover:text-foreground"
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-6">
              {[
                { t: "Right to left, properly", b: "Persian and Arabic read right to left, with Persian (۰-۹) or Arabic-Indic (٠-٩) digits and their own separators — in Telegram and in the Mini App. Session names, paths, commands and code keep their own direction." },
                { t: "Written, not translated", b: "Each language was written the way people who use apps in it actually speak, loanwords included, with each language's own plural forms (Arabic has six)." },
                { t: "Your chat, your language", b: "A private chat can follow your Telegram app. A group has one language, set by an admin — and a pop-up after a tap is in the tapper's own language." },
                { t: "The docs too", b: "The README and every page under docs/ are translated. When a translation and the English page disagree, the English page is right." },
              ].map((f) => (
                <div key={f.t} className="border-t border-white/10 pt-4">
                  <div className="text-[15px] font-semibold text-white">{f.t}</div>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-fg-3">{f.b}</p>
                </div>
              ))}
            </div>
          </div>
          <div dir={L.rtl ? "rtl" : "ltr"} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0e1621] shadow-[0_40px_100px_-40px_rgb(0_0_0/0.9)]">
            <div className="flex items-center gap-3 border-b border-black/40 bg-[#17212b] px-4 py-3" dir="ltr">
              <Mark size={34} className="rounded-full" />
              <div className="leading-tight">
                <div className="text-[14.5px] font-semibold text-white">aipager</div>
                <div className="text-[12px] text-[#6ab3f3]">bot</div>
              </div>
              <span className="ml-auto font-mono text-[12px] text-fg-4">{L.name}</span>
            </div>
            <div className="tg-pattern space-y-2 px-4 py-5 text-[13.5px] leading-[1.45] text-[#f1f5f9]">
              <div className="max-w-[92%] rounded-[14px] rounded-bl-[5px] bg-[#182533] px-3 py-2">
                <div>
                  <Bold html={L.permHead} />
                </div>
                <code className="mt-1.5 block rounded-lg bg-black/25 px-2.5 py-1.5 text-start font-mono text-[12px] text-[#ffc774]" dir="ltr">
                  pnpm test e2e/login --trace on
                </code>
              </div>
              <div className="grid max-w-[92%] grid-cols-2 gap-1">
                {[L.allow, L.deny, L.always, L.stop].map((b) => (
                  <Key key={b}>{b}</Key>
                ))}
              </div>
              <div className="max-w-[92%] rounded-[14px] rounded-bl-[5px] bg-[#182533] px-3 py-2">
                <Bold html={L.switched} />
              </div>
              <div className="max-w-[92%] rounded-[14px] rounded-bl-[5px] bg-[#182533] px-3 py-2 text-[#c9d6e3]">
                <Bold html={L.cardStatus} /> · {L.clock} · Read ×2 · Bash ×1
              </div>
              <div className="max-w-[92%] px-1 text-[12.5px] text-fg-4">{L.language}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
