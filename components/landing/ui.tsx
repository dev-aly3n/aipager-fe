"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

export function Logo({ size = 22 }: { size?: number }) {
  return (
    <span
      className="logo-mark"
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

export function CopyButton({
  text,
  className = "",
  children,
}: {
  text: string;
  className?: string;
  children?: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={`${className} ${copied ? "copied" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        navigator.clipboard?.writeText(text).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6.5l2.5 2.5L10 3.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Copied
        </>
      ) : (
        children || (
          <>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect
                x="3.5"
                y="3.5"
                width="6.5"
                height="6.5"
                rx="1.2"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M2 8V2.5a.5.5 0 01.5-.5H8"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
            Copy
          </>
        )
      )}
    </button>
  );
}

export type IconName =
  | "github"
  | "arrow"
  | "send"
  | "paperclip"
  | "mic"
  | "telegram"
  | "menu"
  | "chevron";

export function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const s = size;
  switch (name) {
    case "github":
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.33c-2.23.48-2.69-1.07-2.69-1.07-.36-.92-.89-1.17-.89-1.17-.72-.49.06-.48.06-.48.8.06 1.22.83 1.22.83.72 1.22 1.87.87 2.33.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.96 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.08-1.87 3.76-3.65 3.96.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38C13.71 14.53 16 11.54 16 8c0-4.42-3.58-8-8-8z" />
        </svg>
      );
    case "arrow":
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "send":
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 8l12-6-4 14-2.5-5.5L2 8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="currentColor" />
        </svg>
      );
    case "paperclip":
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M11.5 7.5l-4 4a2.5 2.5 0 11-3.5-3.5l5-5a1.5 1.5 0 012 2L6 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "mic":
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="6" y="2.5" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M4 7v.5a4 4 0 008 0V7M8 11.5v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "telegram":
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M14.5 1.5L1.5 6.7c-.6.2-.6.6-.1.8L4.6 8.6l8-5.1c.4-.2.7-.1.4.2L6.4 9.9 6.1 13c.3 0 .4-.1.6-.3l1.6-1.5 3.3 2.4c.6.3 1 .1 1.2-.6l2.2-10.3c.2-.9-.3-1.3-1.5-.2z" />
        </svg>
      );
    case "menu":
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 5h10M3 8h10M3 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "chevron":
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export function PhoneFrame({
  children,
  sessionName = "aipager",
  status = "online",
}: {
  children: ReactNode;
  sessionName?: string;
  status?: string;
}) {
  return (
    <div className="phone">
      <div className="phone-bar">
        <span>9:41</span>
        <div className="phone-bar-right">
          <span>5G</span>
          <div className="phone-bar-icons">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
      <div className="chat-header">
        <button
          type="button"
          style={{ color: "var(--accent)", fontSize: 14, paddingRight: 4 }}
          aria-label="back"
        >
          <Icon name="chevron" size={18} />
        </button>
        <div className="avatar">a</div>
        <div className="meta">
          <span className="name">{sessionName}</span>
          <span className="sub">{status}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

export function PersistentKeyboard({ activeName = "jim" }: { activeName?: string }) {
  const sessions: { name: string; status: "busy" | "idle" | "live" }[] = [
    { name: "jim", status: "busy" },
    { name: "john", status: "idle" },
    { name: "tim", status: "live" },
  ];
  const activeStyle: CSSProperties = {
    borderColor: "var(--accent)",
    color: "var(--fg)",
  };
  return (
    <div className="persistent-kb">
      {sessions.map((s) => (
        <div
          key={s.name}
          className="k"
          style={s.name === activeName ? activeStyle : undefined}
        >
          <span className={`pip ${s.status}`} />
          {s.name}
        </div>
      ))}
      <div className="k">⏹ stop</div>
      <div className="k">☠ kill</div>
      <div className="k">Templates</div>
      <div className="k col-3" style={{ justifyContent: "space-between" }}>
        <span style={{ color: "var(--fg-3)" }}>Commands</span>
        <span style={{ color: "var(--fg-4)" }}>›</span>
      </div>
    </div>
  );
}
