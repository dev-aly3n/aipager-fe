// A slim Telegram chat window — the light-weight cousin of the full S25
// shell for sections where a whole phone would be too much, so chat-styled
// content never floats frameless on the page.

import type { ReactNode } from "react";

export function ChatCard({ children }: { children: ReactNode }) {
  return (
    <div className="tg overflow-hidden rounded-xl border border-border shadow-xl">
      <div className="flex items-center gap-2.5 bg-[var(--tg-panel)] px-3 py-2">
        <span className="logo-mark !rounded-full" style={{ width: 24, height: 24 }} />
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="text-[12.5px] font-semibold text-[var(--tg-fg)]">aipager</span>
          <span className="text-[10px] text-[var(--tg-dim)]">bot</span>
        </span>
      </div>
      <div className="bg-[var(--tg-bg)] p-3">{children}</div>
    </div>
  );
}
