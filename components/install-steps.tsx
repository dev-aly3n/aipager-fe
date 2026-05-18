"use client";

import { motion } from "framer-motion";
import { CopyButton } from "./copy-button";

interface Step {
  number: number;
  title: string;
  command: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: 1,
    title: "Install",
    command: "curl -fsSL aipager.run/install | sh",
    description: "One command. Installs aipager + dtach.",
  },
  {
    number: 2,
    title: "Configure",
    command: "aipager config",
    description: "Interactive wizard — bot token, chat ID, done.",
  },
  {
    number: 3,
    title: "Start",
    command: "aipager start",
    description: "Daemon launches. Open Telegram.",
  },
];

function ConfigPreview() {
  return (
    <div className="mt-3 rounded border border-border bg-terminal-bg p-3 font-mono text-[11px] leading-relaxed">
      <div className="text-dim">┌─ aipager config ─┐</div>
      <div>
        <span className="text-success">✓</span>
        <span className="text-terminal-fg"> Verified — </span>
        <span className="text-accent">@yourbot</span>
      </div>
      <div>
        <span className="text-success">✓</span>
        <span className="text-terminal-fg"> Chat ID — </span>
        <span className="text-accent">12345678</span>
      </div>
      <div>
        <span className="text-success">✓</span>
        <span className="text-terminal-fg"> Hooks patched into </span>
        <span className="text-dim">~/.claude/settings.json</span>
      </div>
      <div className="text-dim">└──────────────────┘</div>
    </div>
  );
}

export function InstallSteps() {
  return (
    <section id="install" className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25 }}
          className="text-2xl sm:text-3xl font-bold text-center mb-4"
        >
          Install in 3 commands
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="text-dim text-center mb-12"
        >
          From zero to Telegram notifications in under a minute.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
                delay: i * 0.08,
              }}
              className="rounded-lg border border-border bg-surface p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold">
                  {step.number}
                </span>
                <h3 className="font-semibold text-sm">{step.title}</h3>
              </div>
              <div className="flex items-center gap-2 rounded bg-terminal-bg px-3 py-2 font-mono text-xs text-terminal-fg">
                <code className="flex-1 break-all">{step.command}</code>
                <CopyButton text={step.command} />
              </div>
              <p className="text-dim text-xs mt-3 leading-relaxed">
                {step.description}
              </p>
              {step.number === 2 && <ConfigPreview />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
