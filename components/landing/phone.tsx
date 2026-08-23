"use client";

import type { ReactNode } from "react";
import type { PhoneState, PhoneStatus } from "./scenario";
import { SESSION } from "./scenario";

function secs(v: number, since: number): number {
  return Math.max(0, Math.floor((v - since) / 1000));
}

// ---------- tiny Android / Telegram glyphs ----------

function SignalIcon() {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="currentColor" aria-hidden>
      <rect x="0" y="6" width="2" height="4" rx="0.5" />
      <rect x="3.3" y="4" width="2" height="6" rx="0.5" />
      <rect x="6.6" y="2" width="2" height="8" rx="0.5" />
      <rect x="9.9" y="0" width="2" height="10" rx="0.5" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="currentColor" aria-hidden>
      <path d="M6 9.5L1.5 4.6a6.5 6.5 0 019 0L6 9.5z" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="16" height="9" viewBox="0 0 16 9" fill="none" aria-hidden>
      <rect x="0.5" y="0.5" width="13" height="8" rx="1.5" stroke="currentColor" opacity="0.6" />
      <rect x="2" y="2" width="8.5" height="5" rx="0.5" fill="currentColor" />
      <rect x="14.5" y="2.8" width="1.5" height="3.4" rx="0.7" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M11.5 3.5L6 9l5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
      <circle cx="7" cy="2.5" r="1.4" />
      <circle cx="7" cy="7" r="1.4" />
      <circle cx="7" cy="11.5" r="1.4" />
    </svg>
  );
}

function ClipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M13 8.2l-4.5 4.5a2.8 2.8 0 11-4-4l5.6-5.6a1.9 1.9 0 012.7 2.7L7.2 11.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="6.8" y="2.5" width="4.4" height="8" rx="2.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4.5 8v.6a4.5 4.5 0 009 0V8M9 13v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden>
      <path d="M2.2 9l13-6.2-4.3 13.4-2.7-5.2L2.2 9z" />
    </svg>
  );
}

function Ticks() {
  return (
    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden>
      <path d="M1 4.2L3.4 6.6 8 1.5M6 4.6l2 2L12.6 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------- the reusable S25 Ultra + Telegram shell ----------

export function TgReplyBar({ typed }: { typed?: string }) {
  return (
    <div className="flex items-center gap-2 bg-[var(--tg-panel)] px-3 py-2">
      <span className="text-[var(--tg-dim)]">
        <ClipIcon />
      </span>
      <span className="min-w-0 flex-1 truncate text-[12px]">
        {typed ? (
          <span className="text-[var(--tg-fg)]">
            {typed}
            <span className="type-caret" />
          </span>
        ) : (
          <span className="text-[var(--tg-dim)]">Message</span>
        )}
      </span>
      <span className={typed ? "text-[var(--tg-accent)]" : "text-[var(--tg-dim)]"}>
        {typed ? <SendIcon /> : <MicIcon />}
      </span>
    </div>
  );
}

export function PhoneShell({
  width,
  label,
  children,
}: {
  width?: number;
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      className="s25 shrink-0"
      style={width ? ({ "--s25-w": `${width}px` } as React.CSSProperties) : undefined}
      aria-label={label}
    >
      <div className="s25-screen tg flex flex-col">
        <div className="s25-punch" aria-hidden />

        {/* Android status bar */}
        <div className="flex items-center justify-between px-4 pb-1 pt-1.5 text-[10px] text-white/85">
          <span className="font-medium tracking-wide">21:07</span>
          <span className="flex items-center gap-1.5">
            <SignalIcon />
            <WifiIcon />
            <BatteryIcon />
          </span>
        </div>

        {/* Telegram app bar */}
        <div className="flex items-center gap-2.5 bg-[var(--tg-panel)] px-3 py-2">
          <span className="text-white/70">
            <BackIcon />
          </span>
          <span className="logo-mark !rounded-full" style={{ width: 30, height: 30 }} />
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="text-[13px] font-semibold text-[var(--tg-fg)]">aipager</span>
            <span className="text-[10.5px] text-[var(--tg-dim)]">bot</span>
          </span>
          <span className="ml-auto text-white/70">
            <DotsIcon />
          </span>
        </div>

        {children}

        {/* Android gesture pill */}
        <div className="flex justify-center bg-[var(--tg-panel)] pb-1.5">
          <span className="h-[3px] w-24 rounded-full bg-white/25" />
        </div>
      </div>
    </div>
  );
}

// ---------- hero-mirror message pieces ----------

function StatusBubble({
  status,
  v,
  holding,
  onAllow,
}: {
  status: PhoneStatus;
  v: number;
  holding: boolean;
  onAllow: () => void;
}) {
  const isPerm = status.kind === "perm";
  return (
    <div className="msg-in max-w-[92%] self-start">
      <div className="rounded-2xl rounded-bl-md bg-[var(--tg-in)] px-3 py-2">
        <div className="text-[12px] font-semibold text-[var(--tg-fg)]">
          {isPerm ? "🔐" : "⚙️"} {SESSION}
        </div>
        {isPerm ? (
          <div className="msg-in">
            <div className="mt-0.5 text-[11px] text-[var(--tg-dim)]">
              {status.permDesc}
            </div>
            <div className="mt-1 rounded-md bg-black/30 px-2 py-1 font-mono text-[10.5px] text-[var(--tg-accent)]">
              {status.permCmd}
            </div>
          </div>
        ) : (
          <div className="mt-0.5 text-[11px] italic text-[var(--tg-dim)]">
            {status.verb}… · {secs(v, status.sinceMs)}s
          </div>
        )}
        {status.tools.length > 0 && (
          <div className="mt-1.5 space-y-0.5">
            {status.tools.map((t) => (
              <div key={t.label} className="msg-in text-[11px] text-[var(--tg-dim)]">
                {t.icon === "done" ? (
                  <span className="text-[var(--tg-ok)]">✓ </span>
                ) : (
                  <span className="text-[var(--tg-accent)]">● </span>
                )}
                {t.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {isPerm && (
        <div className="msg-in mt-[3px] grid grid-cols-2 gap-[3px]">
          <button
            type="button"
            onClick={onAllow}
            className={`tg-btn ${holding ? "tg-btn-hint" : ""} ${
              status.resolved === "allow" ? "tg-btn-pressed" : ""
            }`}
          >
            ✅ Allow
          </button>
          <button type="button" className="tg-btn" tabIndex={-1}>
            ❌ Deny
          </button>
          <button type="button" className="tg-btn" tabIndex={-1}>
            🟢 Allow always
          </button>
          <button type="button" className="tg-btn" tabIndex={-1}>
            ⏹ Stop
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- the hero-mirror phone ----------

export function Phone({
  phone,
  v,
  holding,
  onAllow,
}: {
  phone: PhoneState;
  v: number;
  holding: boolean;
  onAllow: () => void;
}) {
  return (
    <PhoneShell width={256} label="Telegram on an Android phone, mirroring the Claude Code session">
      {/* chat — bottom-anchored, older messages clip at the top */}
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-1.5 overflow-hidden px-2.5 pb-2 pt-1 text-[12px]">
        <div className="self-center rounded-full bg-black/25 px-2.5 py-0.5 text-[10px] font-medium text-[var(--tg-dim)]">
          Today
        </div>

        {phone.user && (
          <div className="msg-in max-w-[85%] self-end rounded-2xl rounded-br-md bg-[var(--tg-out)] px-2.5 py-1.5 text-[var(--tg-fg)]">
            {phone.user.text}
            <span className="ml-2 inline-flex items-center gap-1 align-bottom text-[9.5px] text-white/60">
              21:07 <Ticks />
            </span>
            {phone.user.reaction && (
              <div
                key={phone.user.reaction}
                className="react-pop mt-1 inline-flex w-fit items-center rounded-full bg-white/12 px-1.5 py-0.5 text-[11px]"
              >
                {phone.user.reaction === "sent" ? "👀" : "👍"}
              </div>
            )}
          </div>
        )}

        {phone.status && (
          <StatusBubble status={phone.status} v={v} holding={holding} onAllow={onAllow} />
        )}

        {phone.audit && (
          <div className="msg-in max-w-[92%] self-start rounded-xl bg-[var(--tg-in)] px-2.5 py-1 text-[10.5px] text-[var(--tg-dim)]">
            ✅ {SESSION} · {phone.audit}
          </div>
        )}

        {phone.result && (
          <div className="msg-in max-w-[92%] self-start rounded-2xl rounded-bl-md bg-[var(--tg-in)] px-3 py-2">
            <div className="text-[12px] font-semibold text-[var(--tg-fg)]">
              ✅ {SESSION} — {phone.result.headline}
            </div>
            <div className="mt-0.5 text-[11.5px] text-[var(--tg-fg)]/90">
              {phone.result.text}
            </div>
            <div className="mt-0.5 text-right text-[9.5px] text-[var(--tg-dim)]">21:08</div>
          </div>
        )}
      </div>

      <TgReplyBar typed={phone.typed} />
    </PhoneShell>
  );
}
