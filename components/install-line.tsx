"use client";

import { useState } from "react";

/**
 * The one command, as the page's focal point: a lit keyline, a caret that
 * blinks as if the shell were waiting, and a copy that says it worked.
 */
export function InstallLine({ cmd, label = "Copy", done = "Copied" }: { cmd: string; label?: string; done?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="group relative mx-auto w-full max-w-[32rem] xl:mx-0" dir="ltr">
      <div
        className="pointer-events-none absolute -inset-x-12 -inset-y-8 bg-[radial-gradient(55%_75%_at_50%_50%,rgb(42_171_238/0.16),transparent_70%)] opacity-70 blur-xl transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />
      <div className="relative rounded-2xl bg-[linear-gradient(110deg,rgb(63_169_245/0.5),rgb(255_255_255/0.1)_38%,rgb(255_255_255/0.05))] p-px transition-all duration-300 group-hover:bg-[linear-gradient(110deg,rgb(63_169_245/0.85),rgb(255_255_255/0.18)_38%,rgb(255_255_255/0.08))]">
        <div className="flex flex-col items-stretch gap-2 rounded-[15px] bg-[#090c10] p-2 phone:p-1.5 xl:h-[52px] xl:flex-row xl:items-center xl:gap-2 xl:p-0 xl:ps-4 xl:pe-1.5">
          <span className="flex min-w-0 flex-1 items-center gap-2.5 px-2 pt-1.5 phone:gap-2 phone:px-1.5 xl:px-0 xl:pt-0">
            <span className="font-mono text-[15px] leading-none text-accent">$</span>
            <code className="min-w-0 truncate text-start font-mono text-[13px] text-foreground phone:text-[clamp(11px,3.4vw,13px)] xl:text-[14px]">{cmd}</code>
            <span className="caret-blink hidden h-[16px] w-[8px] shrink-0 bg-accent/80 xl:block" aria-hidden />
          </span>
          <button
            type="button"
            aria-label={label}
            onClick={() => {
              void navigator.clipboard?.writeText(cmd).then(() => {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1800);
              });
            }}
            title={copied ? done : label}
            className={`flex h-[38px] shrink-0 items-center justify-center gap-1.5 rounded-xl text-[12.5px] font-medium transition-colors xl:w-[38px] ${
              copied ? "bg-live/15 text-live" : "bg-white/[0.07] text-fg-2 hover:bg-white/[0.14] hover:text-foreground"
            }`}
          >
            {copied ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="m5 13 4 4L19 7" />
                </svg>
                <span className="xl:hidden">{done}</span>
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="9" y="9" width="11" height="11" rx="2.5" />
                  <path d="M5 15V6a2 2 0 0 1 2-2h9" />
                </svg>
                <span className="xl:hidden">{label}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
