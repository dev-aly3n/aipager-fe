"use client";

import { useState, type ReactNode } from "react";

/** The aipager mark: a terminal prompt with the blue notification dot. */
export function Mark({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <rect x="2" y="2" width="60" height="60" rx="14" fill="#181C20" stroke="#3a4048" strokeWidth="1" />
      <path d="M16 24 L26 32 L16 40" stroke="#F6F7F8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="30" y="29" width="8" height="6" rx="1" fill="#F6F7F8" />
      <circle cx="48" cy="20" r="6" fill="#3FA9F5" fillOpacity="0.22" />
      <circle cx="48" cy="20" r="3" fill="#3FA9F5" />
    </svg>
  );
}

/** "aipager.run" in Geist 500, the dot in the accent colour. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-medium tracking-[-0.025em] ${className}`}>
      <Mark size={26} />
      <span>
        aipager<span className="text-accent">.</span>run
      </span>
    </span>
  );
}

export function GitHubIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.33c-2.23.48-2.69-1.07-2.69-1.07-.36-.92-.89-1.17-.89-1.17-.72-.49.06-.48.06-.48.8.06 1.22.83 1.22.83.72 1.22 1.87.87 2.33.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.96 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.08-1.87 3.76-3.65 3.96.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38C13.71 14.53 16 11.54 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export function CopyButton({
  text,
  className = "",
  children,
  label = "Copy",
  done = "Copied",
}: {
  text: string;
  className?: string;
  children?: ReactNode;
  /** what the button says, in the page's language */
  label?: string;
  done?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      className={className}
      onClick={() => {
        void navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        });
      }}
    >
      {children ?? (copied ? done : label)}
      {children && copied ? <span className="sr-only">{done}</span> : null}
    </button>
  );
}
