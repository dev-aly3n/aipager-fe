"use client";

import { useEffect, useState } from "react";

const PARTS: { path: string; note: string; tone: string }[] = [
  { path: "claude code · in dtach", note: "a real terminal, no window needed", tone: "text-[#d97757]" },
  { path: "aipager daemon", note: "one asyncio process, user space, never sudo", tone: "text-accent" },
  { path: "$XDG_RUNTIME_DIR/aipager.sock", note: "hook events, local only", tone: "text-fg-2" },
  { path: "~/.config/aipager/aipager.yaml", note: "your bot token, mode 600", tone: "text-fg-2" },
  { path: "~/.claude/aipager-audit.jsonl", note: "every tap, append-only", tone: "text-fg-2" },
  { path: "voice notes", note: "transcribed on this machine", tone: "text-fg-2" },
];

/** Records in the audit log's own shape (a few fields trimmed for width). */
const RECORDS: Record<string, string>[] = [
  { ts: "2026-09-30T09:43:12+00:00", label: "api", action: "Allowed", tool: "Bash", summary: "pnpm test src/auth", via: "hook_decision" },
  { ts: "2026-09-30T09:44:05+00:00", label: "api", action: "Answered", tool: "AskUserQuestion", summary: "A shared helper" },
  { ts: "2026-09-30T09:48:40+00:00", label: "web", action: "Allowed", tool: "Bash", summary: "npm publish --dry-run", via: "hook_decision" },
  { ts: "2026-09-30T10:02:17+00:00", label: "docs", action: "Denied", tool: "Bash", summary: "rm -rf dist", username: "sara" },
  { ts: "2026-09-30T10:15:03+00:00", label: "api", action: "Blocked", tool: "Write", summary: ".git/hooks/pre-push", username: "sam", reason: "protected path" },
  { ts: "2026-09-30T10:21:48+00:00", label: "api", action: "Allowed", tool: "Edit", summary: "src/auth/expiry.ts", via: "keystroke_fallback" },
];

const ACTION: Record<string, string> = { Allowed: "text-live", Answered: "text-accent", Denied: "text-danger", Blocked: "text-amber" };

function AuditLine({ r }: { r: Record<string, string> }) {
  const keys = Object.keys(r);
  return (
    <div className="[overflow-wrap:anywhere]">
      <span className="text-fg-4">{"{"}</span>
      {keys.map((k, i) => (
        <span key={k}>
          <span className="text-[#8fa3b8]">&quot;{k}&quot;</span>
          <span className="text-fg-4">:</span>
          <span className={k === "action" ? ACTION[r[k]] ?? "text-fg-2" : k === "ts" ? "text-fg-3" : "text-fg-2"}>&quot;{r[k]}&quot;</span>
          {i < keys.length - 1 && <span className="text-fg-4">, </span>}
        </span>
      ))}
      <span className="text-fg-4">{"}"}</span>
    </div>
  );
}

function AuditTail() {
  const [n, setN] = useState(3);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setN((x) => x + 1), 2200);
    return () => window.clearInterval(id);
  }, []);
  const shown = Array.from({ length: 4 }, (_, i) => RECORDS[(n - 4 + i + RECORDS.length * 10) % RECORDS.length]);
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1014]">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5 font-mono text-[11.5px] text-fg-3">
        <span className="h-1.5 w-1.5 rounded-full bg-live dot-pulse" />
        tail -f ~/.claude/aipager-audit.jsonl
      </div>
      <div className="audit-mask h-[232px] overflow-hidden px-4 py-3 font-mono text-[11.5px] leading-relaxed">
        <div key={n} className="space-y-2.5">
          {shown.map((r, i) => (
            <div key={`${n}-${i}`} className={i === shown.length - 1 ? "animate-[fadein_0.6s_ease-out]" : ""}>
              <AuditLine r={r} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Boundary() {
  return (
    <section id="boundary" className="border-t border-white/[0.06] py-32">
      <div className="wrap grid grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] items-center gap-14">
        {/* the machine */}
        <div className="relative">
          <div className="grid grid-cols-[minmax(0,1fr)_236px] items-center">
            <div className="relative rounded-3xl border border-dashed border-white/20 p-6 pt-9">
              <span className="absolute -top-3 left-6 rounded-full border border-white/15 bg-[#0a0c0f] px-3 py-0.5 font-mono text-[11.5px] text-fg-2">your machine</span>
              <ul className="space-y-2">
                {PARTS.map((p) => (
                  <li key={p.path} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
                    <code className={`block whitespace-nowrap font-mono text-[13px] ${p.tone}`}>{p.path}</code>
                    <span className="text-[12.5px] text-fg-3">{p.note}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* the only way out, and the only other party */}
            <div className="relative h-full">
              <div className="absolute left-0 right-[132px] top-[42%] h-px bg-gradient-to-r from-accent to-accent/50" />
              <span className="absolute right-[124px] top-[42%] -translate-y-1/2 text-[11px] text-accent">▶</span>
              <div className="absolute left-4 top-[42%] -translate-y-[calc(100%+6px)] font-mono text-[10.5px] leading-tight text-accent">
                HTTPS
                <br />
                outbound only
              </div>
              <div className="absolute left-0 right-[132px] top-[62%] border-t border-dashed border-danger/50" />
              <span className="absolute left-2 top-[62%] -translate-y-1/2 bg-[#0a0c0f] px-0.5 text-[11px] text-danger/70">✕</span>
              <div className="absolute left-4 top-[62%] translate-y-[6px] font-mono text-[10.5px] leading-tight text-danger/80">
                no inbound
                <br />
                port
              </div>
              <div className="absolute right-0 top-[42%] w-[124px] -translate-y-1/2 rounded-xl border border-white/12 bg-[#101820] px-2 py-2 text-center">
                <div className="font-mono text-[10.5px] text-[#6ab3f3]">api.telegram.org</div>
                <div className="text-[10.5px] text-fg-3">your own bot</div>
              </div>
            </div>
          </div>
        </div>

        {/* the words */}
        <div>
          <div className="eyebrow">Security</div>
          <h2 className="mt-4 text-[clamp(34px,3.6vw,52px)] font-semibold leading-[1.04] tracking-[-0.04em]">Nothing in the middle.</h2>
          <p className="mt-5 text-[16.5px] leading-relaxed text-fg-2">
            The daemon talks to Telegram with your own bot token: no aipager server, no account, no relay. Claude Code&apos;s own settings still decide
            which tools need asking. aipager relays the question; it never decides. Only your chat can drive it, and every answer is written
            down.
          </p>
          <div className="mt-8">
            <AuditTail />
          </div>
          <a href="/docs/security" className="mt-5 inline-flex text-[14px] text-accent hover:underline">
            Read the security model →
          </a>
        </div>
      </div>
    </section>
  );
}
