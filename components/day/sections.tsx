import { CopyButton, Mark } from "@/components/brand";
import { getAipagerVersion } from "@/lib/version";

/* ---------------- the day, itemized ---------------- */

const LINES: { time: string; who: string; what: string; tag?: string }[] = [
  { time: "08:03", who: "api", what: "session started" },
  { time: "08:41", who: "api", what: "prompt, mid-turn", tag: "👀 👍" },
  { time: "10:15", who: "api", what: "Bash: pnpm test", tag: "ALLOWED" },
  { time: "12:30", who: "api", what: "AskUserQuestion", tag: "ANSWERED" },
  { time: "14:05", who: "api", what: "voice note → prompt" },
  { time: "16:20", who: "api", what: "compacted 82% → 4%" },
  { time: "18:45", who: "web", what: "Bash: npm run build", tag: "ALLOWED" },
  { time: "21:10", who: "—", what: "Mini App: 4 diffs read" },
  { time: "23:38", who: "docs", what: "finished · 2h 26m" },
];

const TOTALS: [string, string][] = [
  ["sessions", "3"],
  ["tool calls", "117"],
  ["your taps", "6"],
  ["time at the desk", "0h 04m"],
  ["spent (statusline)", "$2.14"],
];

function Barcode() {
  const w = [2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 2, 3, 1, 1, 2];
  return (
    <div className="mx-auto flex h-10 w-fit items-stretch gap-[2px]">
      {w.map((x, i) => (
        <span key={i} className="bg-[#1d1a18]" style={{ width: x }} />
      ))}
    </div>
  );
}

export function Receipt() {
  return (
    <section id="receipt" data-hour="24.6" className="py-32">
      <div className="wrap grid !max-w-[80rem] grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-16">
        <div>
          <div className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--muted)]">00:00</div>
          <h2 className="mt-5 font-serif text-[clamp(52px,5.4vw,84px)] leading-[0.95]">
            The day,
            <br />
            <em className="text-[var(--muted)]">itemized.</em>
          </h2>
          <p className="mt-7 max-w-[28rem] text-[17px] leading-relaxed opacity-85">
            Six taps and a voice note. Three sessions did the rest while you were somewhere else, and every answer you gave is in the audit log
            on your own disk.
          </p>
        </div>
        <div className="receipt mx-auto w-[360px] rotate-[1.5deg] bg-[#fbfaf6] px-7 pb-10 pt-8 font-mono text-[12px] leading-relaxed text-[#1d1a18] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)]">
          <div className="flex flex-col items-center text-center">
            <Mark size={30} />
            <div className="mt-2 text-[14px] font-semibold tracking-[0.2em]">AIPAGER</div>
            <div className="text-[#6f655d]">the day, itemized</div>
            <div className="mt-1 text-[#6f655d]">TUE 30 SEP · 07:30 – 23:40</div>
          </div>
          <div className="my-4 border-t border-dashed border-[#1d1a18]/40" />
          {LINES.map((l) => (
            <div key={l.time} className="grid grid-cols-[42px_38px_1fr_auto] gap-1">
              <span className="text-[#6f655d]">{l.time}</span>
              <span>{l.who}</span>
              <span className="truncate">{l.what}</span>
              <span className="font-semibold">{l.tag ?? ""}</span>
            </div>
          ))}
          <div className="my-4 border-t border-dashed border-[#1d1a18]/40" />
          {TOTALS.map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span>{k}</span>
              <span className={k.startsWith("spent") ? "font-semibold" : ""}>{v}</span>
            </div>
          ))}
          <div className="my-4 border-t border-dashed border-[#1d1a18]/40" />
          <div className="text-center text-[11px] tracking-[0.12em]">
            THANK YOU FOR NOT
            <br />
            BABYSITTING THE TERMINAL
          </div>
          <div className="mt-4">
            <Barcode />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- how it works, in one sentence ---------------- */

function Chip({ children, tone = "#3fa9f5" }: { children: React.ReactNode; tone?: string }) {
  return (
    <span className="mx-1 inline-flex -translate-y-[0.12em] items-center gap-2 rounded-full border px-3 py-0.5 align-middle font-mono text-[0.42em] tracking-normal" style={{ borderColor: `${tone}66`, color: tone }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone }} />
      {children}
    </span>
  );
}

const HOOKS = ["UserPromptSubmit", "PreToolUse", "PostToolUse", "PermissionRequest", "SubagentStart", "SubagentStop", "SessionStart", "SessionEnd", "PreCompact", "PostCompact", "MessageDisplay", "PreModelSwitch", "statusline"];

export function How() {
  return (
    <section id="how" data-hour="26" className="overflow-hidden py-32">
      <div className="wrap !max-w-[80rem]">
        <div className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--muted)]">How it works</div>
        <p className="mt-8 max-w-[68rem] font-serif text-[clamp(34px,3.6vw,56px)] leading-[1.18] tracking-[-0.01em]">
          Claude Code runs inside <Chip tone="#d97757">dtach</Chip>, so it needs no open terminal. Each step it takes fires a <Chip>hook</Chip> that
          sends one datagram to the <Chip tone="#35c07f">aipager daemon</Chip> over a local socket, and the daemon edits a message in your{" "}
          <Chip tone="#6ab3f3">Telegram</Chip>. <em className="text-[var(--muted)]">Your answer travels back the same way:</em> a verdict to the hook
          that is holding the call, or keystrokes into the session.
        </p>
      </div>
      <div className="mt-20 flex w-max gap-3 marquee">
        {[...HOOKS, ...HOOKS].map((h, i) => (
          <span key={i} className="rounded-full border border-[var(--line)] px-4 py-2 font-mono text-[13px] text-[var(--muted)]">
            {h}
          </span>
        ))}
      </div>
      <div className="wrap mt-6 !max-w-[80rem] text-[14px] text-[var(--muted)]">
        Every event the daemon listens to.{" "}
        <a href="/docs/hooks" className="text-[#6ab3f3] hover:underline">
          The hook reference →
        </a>
      </div>
    </section>
  );
}

/* ---------------- trust ---------------- */

const TRUST: { n: string; title: string; body: string }[] = [
  { n: "01", title: "No aipager server.", body: "The daemon talks to the Telegram Bot API with your own bot token. There is no aipager account and no aipager service." },
  { n: "02", title: "No open port.", body: "It listens on loopback only. The Mini App goes out through a Cloudflare tunnel where every request must carry Telegram's signature, and aipager miniapp disable turns it off." },
  { n: "03", title: "Every answer on the record.", body: "Each Allow, Deny and answer goes to ~/.claude/aipager-audit.jsonl, append-only, with who tapped it in a team." },
  { n: "04", title: "Claude Code still decides.", body: "Your settings.json says what needs asking. aipager relays the question; it never decides, and it never runs as root." },
];

export function Trust() {
  return (
    <section id="trust" data-hour="27.6" className="py-32">
      <div className="wrap !max-w-[80rem]">
        <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-16">
          <div>
            <div className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--muted)]">Security</div>
            <h2 className="mt-5 font-serif text-[clamp(48px,4.8vw,76px)] leading-[0.98]">
              Nothing
              <br />
              <em className="text-[var(--muted)]">in the middle.</em>
            </h2>
            <a href="/docs/security" className="mt-8 inline-block text-[14px] text-[#6ab3f3] hover:underline">
              The security model →
            </a>
          </div>
          <div className="grid grid-cols-2 gap-x-12">
            {TRUST.map((t) => (
              <div key={t.n} className="border-t border-[var(--line)] py-8">
                <div className="font-serif text-[44px] leading-none text-[var(--muted)]">{t.n}</div>
                <div className="mt-5 text-[19px] font-semibold tracking-[-0.02em]">{t.title}</div>
                <p className="mt-2 text-[15px] leading-relaxed opacity-80">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- install, at dawn ---------------- */

const STEPS: { cmd: string; note: string }[] = [
  { cmd: "curl -fsSL aipager.run/install | sh", note: "uv, pipx or Homebrew, whichever you have" },
  { cmd: "aipager config", note: "your bot token, your chat, Claude Code's hooks" },
  { cmd: "aipager service install", note: "keeps the daemon up after you log out" },
  { cmd: "aipager session api", note: "and walk away" },
];

const OTHER: { label: string; cmd: string }[] = [
  { label: "uv", cmd: "uv tool install aipager" },
  { label: "pipx", cmd: "pipx install aipager" },
  { label: "Homebrew", cmd: "brew install dev-aly3n/tap/aipager" },
  { label: "Docker", cmd: "ghcr.io/dev-aly3n/aipager" },
  { label: "Nix", cmd: "nix profile install github:dev-aly3n/aipager" },
  { label: "AUR", cmd: "yay -S aipager" },
  { label: "Snap", cmd: "snap install aipager" },
];

export function Install() {
  return (
    <section id="install" data-hour="31.4" className="py-32">
      <div className="wrap !max-w-[64rem] text-center">
        <div className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--muted)]">07:24 · the next morning</div>
        <h2 className="mt-5 font-serif text-[clamp(52px,5.6vw,88px)] leading-[0.95]">
          Set it up
          <em className="text-[var(--muted)]"> before breakfast.</em>
        </h2>
        <div className="mx-auto mt-14 overflow-hidden rounded-3xl border border-black/10 bg-[#0c0e11] text-left font-mono text-[14px] shadow-[0_40px_90px_-40px_rgb(0_0_0/0.55)]">
          <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-5 py-3">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]/80" />
            <span className="ml-3 text-[12px] text-[#7f8791]">~ · zsh</span>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {STEPS.map((s) => (
              <div key={s.cmd} className="group flex items-center gap-4 px-6 py-4">
                <span className="text-[#3fa9f5]">$</span>
                <span className="text-[#eef0f3]">{s.cmd}</span>
                <span className="min-w-0 flex-1 truncate text-[#5d646e]"># {s.note}</span>
                <CopyButton
                  text={s.cmd}
                  className="rounded-lg border border-white/10 px-2.5 py-1 text-[11.5px] text-[#9aa1aa] opacity-0 transition group-hover:opacity-100 hover:text-white focus:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-[13px]">
          <span className="text-[var(--muted)]">or:</span>
          {OTHER.map((o) => (
            <span key={o.label} title={o.cmd} className="rounded-full border border-[var(--line)] bg-[var(--glass)] px-3 py-1 font-mono text-[12px] backdrop-blur-xl">
              {o.label}
            </span>
          ))}
          <a href="https://github.com/dev-aly3n/aipager#install" className="ml-1 text-[#2f7fc4] hover:underline">
            every way to install →
          </a>
        </div>
        <p className="mt-6 text-[14px] text-[var(--muted)]">Linux or macOS, any architecture. dtach comes with it. MIT licensed.</p>
      </div>
    </section>
  );
}

/* ---------------- questions ---------------- */

const FAQS: { q: string; a: string }[] = [
  { q: "How is this different from Claude's mobile apps?", a: "Claude's apps talk to Anthropic's hosted assistant. aipager mirrors a Claude Code session running on your own machine: your repo, your tools, your environment." },
  { q: "Does my code leave my machine?", a: "No. Prompts, files and output only go to the Telegram chats you configured, through your own bot. There is no aipager server." },
  { q: "What is dtach?", a: "A tiny terminal detacher. It keeps Claude Code alive after the terminal closes or SSH drops, so an answer you send an hour later still reaches a live session." },
  { q: "What if Claude goes off the rails?", a: "Prompts wait for your tap, /stop interrupts the turn and drops anything queued, /kill ends the session. Buttons from a finished task refuse." },
  { q: "Can my team use it?", a: "Yes: put the bot in a group with per-user roles (owner, admin, user, read_only). Each message runs with its sender's permissions, and every decision is audited." },
  { q: "What does it cost?", a: "Nothing. It is MIT licensed, the bot is yours, and Claude Code keeps using whatever plan or key it already uses." },
];

export function Faq() {
  return (
    <section id="faq" data-hour="33.5" className="py-32">
      <div className="wrap !max-w-[80rem]">
        <h2 className="font-serif text-[clamp(44px,4.4vw,68px)] leading-none">
          Questions, <em className="text-[var(--muted)]">answered.</em>
        </h2>
        <div className="mt-14 grid grid-cols-3 gap-x-12 gap-y-12">
          {FAQS.map((f) => (
            <div key={f.q} className="border-t border-[var(--line)] pt-6">
              <div className="text-[18px] font-semibold leading-snug tracking-[-0.015em]">{f.q}</div>
              <p className="mt-3 text-[15px] leading-relaxed opacity-80">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function DayFooter() {
  const version = await getAipagerVersion();
  return (
    <footer data-hour="34" className="border-t border-[var(--line)] py-10">
      <div className="wrap flex !max-w-[80rem] flex-wrap items-center justify-between gap-6 text-sm text-[var(--muted)]">
        <div className="flex items-center gap-3">
          <Mark size={20} />
          <span className="text-[var(--ink)]">
            aipager<span className="text-[#3fa9f5]">.</span>run
          </span>
          <span className="font-mono text-xs">v{version}</span>
          <span aria-hidden>·</span>
          <a href="https://github.com/dev-aly3n/aipager/blob/main/LICENSE" className="hover:text-[var(--ink)]">
            MIT
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <a href="https://github.com/dev-aly3n/aipager" className="hover:text-[var(--ink)]">GitHub</a>
          <a href="/docs" className="hover:text-[var(--ink)]">Docs</a>
          <a href="https://pypi.org/project/aipager/" className="hover:text-[var(--ink)]">PyPI</a>
          <a href="https://github.com/dev-aly3n/aipager/blob/main/CHANGELOG.md" className="hover:text-[var(--ink)]">Changelog</a>
          <a href="https://github.com/dev-aly3n/aipager/issues" className="hover:text-[var(--ink)]">Issues</a>
        </div>
      </div>
    </footer>
  );
}
