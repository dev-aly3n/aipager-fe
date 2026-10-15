"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fmtElapsed, type Pane, type TDialog, type TLine, type Tone } from "./world";

const TONE: Record<Tone, string> = {
  fg: "text-[#e8ebee]",
  dim: "text-[#7f8791]",
  accent: "text-accent",
  live: "text-live",
  amber: "text-amber",
  deny: "text-danger",
  claude: "text-[#d97757]",
};

const DOT: Record<Tone, string> = {
  fg: "text-[#e8ebee]",
  dim: "text-[#7f8791]",
  accent: "text-accent",
  live: "text-live",
  amber: "text-amber",
  deny: "text-danger",
  claude: "text-[#d97757]",
};

function Line({ line }: { line: TLine }) {
  // What you typed sits in a block of its own, dimmer than Claude's own
  // words — the way Claude Code separates the two in the terminal.
  if (line.user) {
    return (
      <div className="-mx-4 my-[3px] flex gap-2 bg-white/[0.2] px-4 py-[3px]">
        <span className="text-[#aeb6bf]">›</span>
        <span className="min-w-0 text-[#f1f3f5]">{line.text}</span>
      </div>
    );
  }
  if (line.sub) {
    return (
      <div className={`flex gap-2 pl-4 ${TONE[line.tone ?? "dim"]}`}>
        <span className="text-[#555c65]">⎿</span>
        <span className="min-w-0">{line.text}</span>
      </div>
    );
  }
  if (line.dot) {
    return (
      <div className="flex gap-2">
        <span className={DOT[line.dot]}>⏺</span>
        <span className={`min-w-0 ${line.bold ? "font-semibold text-[#e8ebee]" : TONE[line.tone ?? "fg"]}`}>{line.text}</span>
      </div>
    );
  }
  return <div className={`${TONE[line.tone ?? "fg"]} ${line.bold ? "font-semibold" : ""}`}>{line.text}</div>;
}

function Dialog({ d }: { d: TDialog }) {
  return (
    <div className={`box mt-2 px-3 py-2 ${d.kind === "perm" ? "claude" : "ask"}`}>
      <div className="font-semibold text-[#e8ebee]">{d.title}</div>
      <div className="mt-1 pl-2">
        {d.body.map((b, i) => (
          <div key={i} className={i === 0 && d.kind === "perm" ? "text-[#e8ebee]" : "text-[#9aa1aa]"}>
            {b}
          </div>
        ))}
      </div>
      <div className="mt-1.5 text-[#e8ebee]">{d.kind === "perm" ? "Do you want to proceed?" : ""}</div>
      {d.options.map((o, i) => (
        <div key={o} className={i === d.selected ? "text-accent" : "text-[#9aa1aa]"}>
          {i === d.selected ? "❯ " : "  "}
          {i + 1}. {o}
        </div>
      ))}
    </div>
  );
}

function PaneView({ p, multi }: { p: Pane; multi: boolean }) {
  // Claude Code draws inline: the conversation from the top, the input box
  // right under it, and the view follows the newest line once it fills.
  const body = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = body.current;
    if (el) el.scrollTop = el.scrollHeight;
  });
  return (
    <div className="pane flex min-h-0 flex-1 flex-col">
      <div ref={body} className="min-h-0 flex-1 overflow-hidden px-4 pb-2 pt-3">
        <div className="space-y-1">
          {p.lines.map((l, i) => (
            <Line key={i} line={l} />
          ))}
        </div>
        {p.dialog && <Dialog d={p.dialog} />}
        {p.spinner && (
          <div className="mt-1.5 text-[#d97757]">
            ✻ <span className="text-[#c9ccd1]">
              {p.spinner}… ({fmtElapsed(p.secs)} · esc to interrupt)
            </span>
          </div>
        )}
        {p.status || p.input ? (
          <div className="pt-2">
            <div className="box px-3 py-1.5 text-[#e8ebee]">
              <span className="text-[#7f8791]">&gt; </span>
              <span className="caret">{p.input}</span>
            </div>
            <div className="mt-1 flex justify-between text-[11px] text-[#555c65]">
              {p.bypass ? <span className="text-[#ff6b80]">⏵⏵ bypass permissions on</span> : <span>{multi ? "" : "? for shortcuts"}</span>}
              <span>{p.status}</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * A session's tab. The one in front wears a lit pill with a line under it,
 * and both slide across when another tab takes over — the way a terminal
 * moves its indicator rather than blinking it from place to place.
 */
function Tab({ p, n, on, onPick }: { p: Pane; n: number; on: boolean; onPick: () => void }) {
  const state = p.dialog ? "bg-amber" : p.spinner ? "bg-live" : "bg-[#555c65]";
  const glide = { type: "spring" as const, stiffness: 420, damping: 36, mass: 0.7 };
  return (
    <button
      type="button"
      onClick={onPick}
      className={`relative flex shrink-0 items-center gap-2 rounded-full px-3 py-[3px] text-[11.5px] transition-colors ${
        on ? "text-[#e8ebee]" : "text-[#7f8791] hover:text-[#b9bfc7]"
      }`}
    >
      {on && (
        <>
          <motion.span
            layoutId="term-tab"
            transition={glide}
            className="absolute inset-0 rounded-full border border-live/70 bg-white/[0.07] shadow-[0_0_14px_-3px_rgb(79_214_147/0.9)]"
          />
          <motion.span
            layoutId="term-line"
            transition={glide}
            className="absolute inset-x-1 -bottom-[8px] h-[2px] rounded-full bg-live shadow-[0_0_10px_rgb(79_214_147/0.9)]"
          />
        </>
      )}
      <span className={`relative h-1.5 w-1.5 shrink-0 rounded-full ${state}`} />
      <span className="relative">claude-{p.id}</span>
      <span className={`relative ${on ? "text-[#7f8791]" : "text-[#555c65]"}`}>⌘{n}</span>
    </button>
  );
}

export function Terminal({
  panes,
  detached,
  active = "",
  onTab,
}: {
  panes: Pane[];
  detached: boolean;
  /** the pane in front */
  active?: string;
  onTab?: (id: string) => void;
}) {
  const multi = panes.length > 1;
  const shown = panes.find((p) => p.id === active) ?? panes[0];
  return (
    <div className={`term flex h-full flex-col overflow-hidden ${detached ? "detached" : ""}`}>
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
        <span className="h-3 w-3 shrink-0 rounded-full bg-[#ff5f57]/80" />
        <span className="h-3 w-3 shrink-0 rounded-full bg-[#febc2e]/80" />
        <span className="h-3 w-3 shrink-0 rounded-full bg-[#28c840]/80" />
        <span className="ml-3 truncate text-[11.5px] text-[#7f8791]">claude-{shown?.id ?? "api"} · dtach</span>
        {detached && (
          <span className="ml-auto shrink-0 whitespace-nowrap rounded-full border border-live/40 px-2 py-0.5 text-[10.5px] text-live">detached · still running</span>
        )}
      </div>
      {multi && (
        <div className="relative flex shrink-0 items-center gap-1.5 border-b-2 border-live/25 bg-black/25 px-2.5 py-1.5">
          {panes.map((p, i) => (
            <Tab key={p.id} p={p} n={i + 1} on={p.id === shown?.id} onPick={() => onTab?.(p.id)} />
          ))}
        </div>
      )}
      <div className={`flex min-h-0 flex-1 flex-col transition-opacity duration-700 ${detached ? "opacity-70" : ""}`}>
        {shown && <PaneView key={shown.id} p={shown} multi={multi} />}
      </div>
    </div>
  );
}
