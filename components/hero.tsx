"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { CopyButton } from "./copy-button";

const COMMAND = "curl -fsSL aipager.run/install | sh";
const PROMPT = "$ ";

interface OutputLine {
  text: string;
  color: string;
}

const OUTPUT_LINES: OutputLine[] = [
  { text: "[1/3] Detecting platform… macOS (arm64)", color: "text-accent" },
  { text: "[2/3] Installing aipager v0.3.11…", color: "text-accent" },
  { text: "[3/3] Installing dtach…", color: "text-accent" },
  {
    text: "  ✓  aipager installed — run `aipager config` to start",
    color: "text-success",
  },
];

const CHAR_DELAY = 45;
const LINE_DELAY = 500;
const PAUSE_BEFORE_RESTART = 3000;

type Phase = "typing" | "output" | "pause";

export function Hero() {
  const [phase, setPhase] = useState<Phase>("typing");
  const [charIndex, setCharIndex] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    setPhase("typing");
    setCharIndex(0);
    setVisibleLines(0);
  }, []);

  useEffect(() => {
    if (phase === "typing") {
      if (charIndex < COMMAND.length) {
        timerRef.current = setTimeout(
          () => setCharIndex((i) => i + 1),
          CHAR_DELAY,
        );
      } else {
        timerRef.current = setTimeout(() => setPhase("output"), 400);
      }
    }

    if (phase === "output") {
      if (visibleLines < OUTPUT_LINES.length) {
        timerRef.current = setTimeout(
          () => setVisibleLines((n) => n + 1),
          LINE_DELAY,
        );
      } else {
        timerRef.current = setTimeout(() => setPhase("pause"), 200);
      }
    }

    if (phase === "pause") {
      timerRef.current = setTimeout(reset, PAUSE_BEFORE_RESTART);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, charIndex, visibleLines, reset]);

  return (
    <section className="relative flex flex-col items-center justify-center px-4 pt-24 pb-20 sm:pt-32 sm:pb-28 overflow-hidden">
      {/* background grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 30%, var(--accent) 0%, transparent 60%)",
          opacity: 0.04,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          opacity: 0.3,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-6 text-center"
      >
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          aipager
        </h1>
        <p className="text-dim text-lg sm:text-xl max-w-md">
          Telegram remote-control for Claude Code
        </p>
      </motion.div>

      {/* terminal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
        className="relative z-10 mt-10 w-full max-w-xl"
      >
        <div className="rounded-lg border border-border bg-terminal-bg overflow-hidden shadow-2xl">
          {/* title bar */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-xs text-dim font-mono">terminal</span>
          </div>
          {/* body */}
          <div className="p-4 font-mono text-sm leading-relaxed min-h-[140px]">
            <div className="text-terminal-fg">
              <span className="text-success">{PROMPT}</span>
              <span>{COMMAND.slice(0, charIndex)}</span>
              {phase === "typing" && (
                <span className="inline-block w-2 h-4 bg-terminal-fg ml-0.5 animate-pulse align-middle" />
              )}
            </div>
            {OUTPUT_LINES.slice(0, visibleLines).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className={`${line.color} mt-1`}
              >
                {line.text}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* install command */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="relative z-10 mt-8 flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 font-mono text-sm"
      >
        <code className="text-accent select-all">{COMMAND}</code>
        <CopyButton text={COMMAND} />
      </motion.div>
    </section>
  );
}
