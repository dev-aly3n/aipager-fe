"use client";

import type { TermLine } from "./scenario";

function secs(v: number, since: number): number {
  return Math.max(0, Math.floor((v - since) / 1000));
}

function Line({ line, v }: { line: TermLine; v: number }) {
  switch (line.kind) {
    case "banner":
      return (
        <div className="mb-2">
          <div>
            <span className="text-accent">✻</span> Welcome to{" "}
            <span className="font-semibold text-foreground">Claude Code</span>!
          </div>
          <div className="pl-4 text-dim">/help for help · cwd: ~/work/api</div>
        </div>
      );
    case "prompt":
      return (
        <div className="mt-2">
          <span className="text-dim">&gt; </span>
          <span className="text-foreground">{line.text}</span>
        </div>
      );
    case "text":
      return (
        <div className="mt-2 flex gap-2">
          <span className="text-foreground">●</span>
          <span className="text-terminal-fg">{line.text}</span>
        </div>
      );
    case "tool":
      return (
        <div className="mt-2">
          <div className="flex gap-2">
            <span className="text-success">●</span>
            <span>
              <span className="font-semibold text-foreground">{line.name}</span>
              <span className="text-dim">({line.arg})</span>
            </span>
          </div>
          {line.result && (
            <div className="flex gap-2 pl-4 text-dim">
              <span>└</span>
              <span>{line.result}</span>
            </div>
          )}
        </div>
      );
    case "spinner":
      return (
        <div className="mt-2 text-dim">
          <span className="term-spin text-accent">✻</span>{" "}
          <span className="text-terminal-fg">{line.verb}…</span>{" "}
          ({secs(v, line.sinceMs)}s · esc to interrupt)
        </div>
      );
    case "perm":
      return (
        <div className="mt-2 rounded-md border border-border px-3 py-2">
          <div className="font-semibold text-foreground">{line.tool}</div>
          <div className="mt-1 text-accent">{line.cmd}</div>
          <div className="text-dim">{line.desc}</div>
          <div className="mt-2 text-foreground">Do you want to proceed?</div>
          <div className={line.resolved ? "text-success" : "text-accent"}>
            ❯ 1. Yes{line.resolved ? "  ✓" : ""}
          </div>
          <div className="text-dim">&nbsp;&nbsp;2. Yes, and don&apos;t ask again</div>
          <div className="text-dim">&nbsp;&nbsp;3. No, and tell Claude what to do differently</div>
        </div>
      );
  }
}

export function Terminal({ lines, v }: { lines: TermLine[]; v: number }) {
  return (
    <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-terminal-bg shadow-2xl">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate font-mono text-xs text-dim">
          ~/work/api — claude
        </span>
      </div>
      {/* Bottom-anchored like a real terminal: older lines clip at the top,
          so no scroll bookkeeping is needed as the story grows. */}
      <div className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden p-4 font-mono text-[12.5px] leading-relaxed text-terminal-fg">
        {lines.map((line) => (
          <Line key={line.id} line={line} v={v} />
        ))}
      </div>
    </div>
  );
}
