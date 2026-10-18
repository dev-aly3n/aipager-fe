"use client";

import { useState, type ReactNode } from "react";

/** A code block with its language and a copy button, like a real console. */
export function DocsCode({ text, lang, children }: { text: string; lang: string; children: ReactNode }) {
  const [copied, setCopied] = useState(false);
  // Code reads left to right in every language, but a fence is also how
  // the docs show a Telegram transcript, and those are in the language.
  // "auto" takes the direction from the first strong letter, so a shell
  // command stays ltr and an Arabic chat mockup reads right to left.
  return (
    <div className="code-block" dir="auto">
      <div className="code-bar">
        <span className="lang">{lang || "text"}</span>
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard?.writeText(text).then(() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1600);
            });
          }}
          className="rounded-md border border-white/10 px-2 py-[3px] font-mono text-[11px] text-fg-4 transition-colors hover:border-accent hover:text-foreground"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre>{children}</pre>
    </div>
  );
}
