"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type KeyboardPage = "main" | "commands" | "models";

interface KeyButton {
  label: string;
  action?: KeyboardPage;
  variant?: "default" | "stop" | "kill" | "nav";
}

const MAIN_KEYS: KeyButton[][] = [
  [
    { label: "jim ⚙️" },
    { label: "john 💤" },
    { label: "tim ✅" },
  ],
  [
    { label: "⏹ stop", variant: "stop" },
    { label: "☠ kill", variant: "kill" },
  ],
  [
    { label: "Templates" },
    { label: "Commands ›", action: "commands", variant: "nav" },
  ],
];

const COMMANDS_KEYS: KeyButton[][] = [
  [{ label: "Compact" }, { label: "Clear" }, { label: "Plan mode" }],
  [{ label: "Init" }, { label: "Security review" }],
  [
    { label: "Model ›", action: "models", variant: "nav" },
    { label: "‹ Back", action: "main", variant: "nav" },
  ],
];

const MODELS_KEYS: KeyButton[][] = [
  [{ label: "Sonnet" }, { label: "Opus" }],
  [{ label: "Haiku" }, { label: "OpusPlan" }],
  [{ label: "‹ Back", action: "commands", variant: "nav" }],
];

const PAGES: Record<KeyboardPage, { title: string; keys: KeyButton[][] }> = {
  main: { title: "Main", keys: MAIN_KEYS },
  commands: { title: "Commands", keys: COMMANDS_KEYS },
  models: { title: "Models", keys: MODELS_KEYS },
};

function KeyboardButton({
  btn,
  onNavigate,
}: {
  btn: KeyButton;
  onNavigate: (page: KeyboardPage) => void;
}) {
  const base =
    "flex-1 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer border select-none text-center";

  const variants: Record<string, string> = {
    default:
      "bg-surface border-border text-foreground hover:bg-border active:scale-[0.97]",
    stop: "bg-warning/10 border-warning/30 text-warning hover:bg-warning/20 active:scale-[0.97]",
    kill: "bg-danger/10 border-danger/30 text-danger hover:bg-danger/20 active:scale-[0.97]",
    nav: "bg-accent/10 border-accent/30 text-accent hover:bg-accent/20 active:scale-[0.97]",
  };

  return (
    <button
      className={`${base} ${variants[btn.variant ?? "default"]}`}
      onClick={() => btn.action && onNavigate(btn.action)}
    >
      {btn.label}
    </button>
  );
}

export function KeyboardPreview() {
  const [page, setPage] = useState<KeyboardPage>("main");
  const current = PAGES[page];

  return (
    <section id="keyboard" className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-xl">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25 }}
          className="text-2xl sm:text-3xl font-bold text-center mb-4"
        >
          The keyboard
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="text-dim text-center mb-10 text-sm"
        >
          A persistent Telegram reply keyboard with three tiers. Tap to
          navigate.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="rounded-xl border border-border bg-surface p-4 shadow-lg"
        >
          {/* page indicator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {(Object.keys(PAGES) as KeyboardPage[]).map((p) => (
              <span
                key={p}
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors duration-200 ${
                  p === page
                    ? "bg-accent/20 text-accent"
                    : "text-dim"
                }`}
              >
                {PAGES[p].title}
              </span>
            ))}
          </div>

          {/* keyboard */}
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="space-y-2"
            >
              {current.keys.map((row, ri) => (
                <div key={ri} className="flex gap-2">
                  {row.map((btn) => (
                    <KeyboardButton
                      key={btn.label}
                      btn={btn}
                      onNavigate={setPage}
                    />
                  ))}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
