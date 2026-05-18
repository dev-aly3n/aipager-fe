"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Bubble {
  id: string;
  type: "status" | "finished" | "user" | "permission";
  icon: string;
  label: string;
  content: string;
  explanation: string;
}

const BUBBLES: Bubble[] = [
  {
    id: "thinking",
    type: "status",
    icon: "⚙️",
    label: "jim · Thinking…",
    content: "",
    explanation:
      "The daemon detected a tool call via Claude Code's hook API and pushed a status update to Telegram. No scraping involved.",
  },
  {
    id: "finished",
    type: "finished",
    icon: "✅",
    label: "jim · Finished (10s)",
    content: "Refactored auth middleware to\nuse JWT verification.",
    explanation:
      "When Claude Code completes a turn, aipager captures the summary and duration, then sends it as a formatted message.",
  },
  {
    id: "reply",
    type: "user",
    icon: "",
    label: "",
    content: "Now add rate limiting to the /api/login endpoint",
    explanation:
      "Your Telegram reply is injected as the next prompt into the Claude Code session. Just reply to any message from the bot.",
  },
  {
    id: "permission",
    type: "permission",
    icon: "🔐",
    label: "jim · Permission needed",
    content: "Bash: npm install express-rate-limit",
    explanation:
      "Permission prompts surface as inline keyboards. Tap Allow or Deny right from Telegram — no need to switch to your terminal.",
  },
];

function BubbleComponent({
  bubble,
  index,
}: {
  bubble: Bubble;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const isUser = bubble.type === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.25, ease: "easeOut", delay: index * 0.12 }}
      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className={`text-left max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 cursor-pointer ${
          isUser
            ? "bg-[#3390ec] text-white rounded-br-sm"
            : "bg-[#212121] text-[#e4e4e4] rounded-bl-sm"
        }`}
      >
        {bubble.label && (
          <div className="flex items-center gap-1.5 mb-1">
            {bubble.icon && <span>{bubble.icon}</span>}
            <span className="font-medium text-xs opacity-80">
              {bubble.label}
            </span>
            {bubble.type === "status" && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            )}
          </div>
        )}
        {bubble.content && (
          <div
            className={
              bubble.type === "finished"
                ? "font-mono text-xs bg-black/30 rounded px-2 py-1.5 mt-1 whitespace-pre"
                : ""
            }
          >
            {bubble.content}
          </div>
        )}
        {bubble.type === "permission" && (
          <div className="flex gap-2 mt-2">
            <span className="px-3 py-1 rounded bg-success/20 text-success text-xs font-medium">
              Allow
            </span>
            <span className="px-3 py-1 rounded bg-danger/20 text-danger text-xs font-medium">
              Deny
            </span>
          </div>
        )}
      </button>
      {expanded && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
          className="text-xs text-dim mt-2 max-w-[85%] px-1 leading-relaxed"
        >
          {bubble.explanation}
        </motion.p>
      )}
    </motion.div>
  );
}

export function TelegramMockup() {
  return (
    <section id="demo" className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25 }}
          className="text-2xl sm:text-3xl font-bold text-center mb-4"
        >
          See it in your pocket
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="text-dim text-center mb-12 max-w-lg mx-auto"
        >
          Every state change, every permission prompt, every completion —
          delivered to Telegram in real time.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* explanatory text */}
          <div className="space-y-6 order-2 md:order-1">
            <div>
              <h3 className="font-semibold mb-1">Live status mirror</h3>
              <p className="text-dim text-sm leading-relaxed">
                See when Claude is thinking, reading files, or writing code.
                Each tool call triggers a Telegram notification via hooks.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Reply to inject prompts</h3>
              <p className="text-dim text-sm leading-relaxed">
                Reply to any bot message and your text becomes the next prompt.
                Steer your session from anywhere.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">
                Approve permissions remotely
              </h3>
              <p className="text-dim text-sm leading-relaxed">
                Dangerous commands surface as inline keyboards with Allow/Deny
                buttons. No terminal required.
              </p>
            </div>
            <p className="text-xs text-dim italic">
              Tap any bubble to see what happens under the hood.
            </p>
          </div>

          {/* phone frame */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className="w-[280px] sm:w-[300px]">
              {/* phone shell */}
              <div className="rounded-[2rem] border-2 border-border bg-[#0e0e0e] p-2 shadow-2xl">
                {/* notch */}
                <div className="flex justify-center mb-1">
                  <div className="w-20 h-5 bg-black rounded-full" />
                </div>
                {/* screen */}
                <div className="rounded-[1.5rem] bg-[#181818] overflow-hidden">
                  {/* telegram header */}
                  <div className="px-4 py-3 border-b border-[#2a2a2a] flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#3390ec] flex items-center justify-center text-white text-xs font-bold">
                      A
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">
                        aipager
                      </div>
                      <div className="text-[#888] text-[10px]">bot</div>
                    </div>
                  </div>
                  {/* messages */}
                  <div className="px-3 py-4 space-y-3 min-h-[320px]">
                    {BUBBLES.map((bubble, i) => (
                      <BubbleComponent
                        key={bubble.id}
                        bubble={bubble}
                        index={i}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
