"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Reply,
  Layers,
  Webhook,
  Download,
  Eye,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: MessageSquare,
    title: "Telegram mirror",
    description:
      "Busy, idle, and permission states pushed to Telegram in real time.",
  },
  {
    icon: Reply,
    title: "Reply to inject",
    description:
      "Your Telegram reply becomes the next prompt in the Claude Code session.",
  },
  {
    icon: Layers,
    title: "Multi-session",
    description:
      "Run jim, john, tim side-by-side — each session gets its own status line.",
  },
  {
    icon: Webhook,
    title: "Hooks-based",
    description:
      "Uses Claude Code's native hook API. No terminal scraping, no brittle parsing.",
  },
  {
    icon: Download,
    title: "One install",
    description:
      "pipx, uv, or brew. Ships with dtach so sessions survive disconnects.",
  },
  {
    icon: Eye,
    title: "Observer bots",
    description:
      "Add read-only mirrors to a second chat for teammates or logging.",
  },
];

export function Features() {
  return (
    <section id="features" className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25 }}
          className="text-2xl sm:text-3xl font-bold text-center mb-12"
        >
          What it does
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                  delay: i * 0.06,
                }}
                className="group rounded-lg border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/5 hover:border-accent/30"
              >
                <Icon
                  size={20}
                  className="text-accent mb-3 transition-colors"
                />
                <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-dim text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
