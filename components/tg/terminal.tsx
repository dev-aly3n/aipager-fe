"use client";

import { useLayoutEffect, useRef } from "react";
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
      {multi && (
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-1.5 text-[11px] text-[#7f8791]">
          <span className={`h-1.5 w-1.5 rounded-full ${p.dialog ? "bg-amber" : p.spinner ? "bg-live" : "bg-[#555c65]"}`} />
          claude-{p.id}
        </div>
      )}
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
              <span>{multi ? "" : "? for shortcuts"}</span>
              <span>{p.status}</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function Terminal({ panes, detached }: { panes: Pane[]; detached: boolean }) {
  const multi = panes.length > 1;
  return (
    <div className={`term flex h-full flex-col overflow-hidden ${detached ? "detached" : ""}`}>
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
        <span className="h-3 w-3 shrink-0 rounded-full bg-[#ff5f57]/80" />
        <span className="h-3 w-3 shrink-0 rounded-full bg-[#febc2e]/80" />
        <span className="h-3 w-3 shrink-0 rounded-full bg-[#28c840]/80" />
        <span className="ml-3 truncate text-[11.5px] text-[#7f8791]">{multi ? `${panes.length} sessions · dtach` : `claude-${panes[0]?.id ?? "api"} · dtach`}</span>
        {detached && (
          <span className="ml-auto shrink-0 whitespace-nowrap rounded-full border border-live/40 px-2 py-0.5 text-[10.5px] text-live">detached · still running</span>
        )}
      </div>
      <div className={`flex min-h-0 flex-1 flex-col transition-opacity duration-700 ${detached ? "opacity-70" : ""}`}>
        {panes.map((p) => (
          <PaneView key={p.id} p={p} multi={multi} />
        ))}
      </div>
    </div>
  );
}
