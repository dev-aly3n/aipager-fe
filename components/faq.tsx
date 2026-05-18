"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How is this different from Claude Code's web/mobile?",
    answer:
      "Claude Code's web interface requires a browser session and runs in Anthropic's cloud. aipager mirrors your local CLI session — your code never leaves your machine. You get the same terminal power with Telegram as the remote.",
  },
  {
    question: "Does my code leave my machine?",
    answer:
      "No. aipager is a local daemon that bridges Telegram and your Claude Code CLI. Only status messages, permission prompts, and your replies travel through the Telegram Bot API. Your source code stays on your machine.",
  },
  {
    question: "What's dtach?",
    answer:
      "dtach is a lightweight pseudo-terminal multiplexer (think minimal tmux). aipager uses it to keep Claude Code sessions alive after you disconnect. It ships with the installer — you don't need to set it up.",
  },
  {
    question: "Why Telegram and not Slack or Discord?",
    answer:
      "Telegram has the right primitives: inline keyboards for permission prompts, reply threading for prompt injection, bots that don't require workspace approval, and a solid mobile app. It's the shortest path from idea to working integration.",
  },
];

function FaqEntry({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left text-sm font-medium hover:text-accent transition-colors duration-200 cursor-pointer"
      >
        <span>{item.question}</span>
        <ChevronDown
          size={16}
          className={`text-dim flex-shrink-0 ml-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-dim leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  return (
    <section id="faq" className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25 }}
          className="text-2xl sm:text-3xl font-bold text-center mb-10"
        >
          Why?
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="border-t border-border"
        >
          {FAQ_ITEMS.map((item) => (
            <FaqEntry key={item.question} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
