"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  TG,
  CHAR_DELAY,
  Bubble,
  TelegramInput,
  DateSeparator,
  PhoneFrame,
  TouchIndicator,
  type ChatMessage,
  type StatusEmoji,
  type TouchPoint,
} from "./telegram-shared";

// ─── Phase machine ───
type Phase =
  | "IDLE"
  | "USER_TYPING"
  | "USER_SEND"
  | "BOT_THINKING"
  | "BOT_FINISHED"
  | "USER_TYPING_2"
  | "USER_SEND_2"
  | "BOT_THINKING_2"
  | "BOT_PERMISSION"
  | "KB_SHOW"
  | "KB_TAP_COMMANDS"
  | "KB_SHOW_COMMANDS"
  | "KB_TAP_COMPACT"
  | "KB_COMPACT_SENT"
  | "BOT_COMPACTING"
  | "BOT_COMPACTED"
  | "PAUSE"
  | "RESET";

// ─── Constants ───
const THINKING_DURATION = 7000;
const PAUSE_BEFORE_RESTART = 2500;

const THINKING_VERBS = ["Thinking", "Reasoning", "Analyzing", "Pondering"] as const;

const USER_MSG_1 = "refactor the auth middleware";
const USER_MSG_2 = "now add rate limiting";

// ─── Persistent reply keyboard (Telegram-style) ───

type KBPage = "main" | "commands";

interface KBButton {
  label: string;
  id: string;
}

const KB_MAIN: KBButton[][] = [
  [
    { label: "dev \u2699\uFE0F", id: "dev" },
    { label: "jim \uD83D\uDCA4", id: "jim" },
    { label: "tim \u2705", id: "tim" },
  ],
  [
    { label: "\u23F9 stop", id: "stop" },
    { label: "\u2620 kill", id: "kill" },
  ],
  [
    { label: "Templates", id: "templates" },
    { label: "Commands", id: "commands" },
  ],
];

const KB_COMMANDS: KBButton[][] = [
  [
    { label: "Compact", id: "compact" },
    { label: "Clear", id: "clear" },
    { label: "Plan mode", id: "plan" },
  ],
  [
    { label: "Init", id: "init" },
    { label: "Security review", id: "security" },
  ],
  [
    { label: "Model \u203A", id: "model" },
    { label: "\u00AB Back", id: "back" },
  ],
];

function PersistentKeyboard({
  page,
  touch,
}: {
  page: KBPage;
  touch: TouchPoint | null;
}) {
  const rows = page === "main" ? KB_MAIN : KB_COMMANDS;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative overflow-hidden"
      style={{
        backgroundColor: TG.headerBg,
        borderTop: `0.5px solid ${TG.separator}`,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: page === "commands" ? 12 : -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: page === "commands" ? -12 : 12 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="px-[5px] py-[4px] space-y-[3px]"
        >
          {rows.map((row, ri) => (
            <div key={ri} className="flex gap-[3px]">
              {row.map((btn) => (
                <div
                  key={btn.id}
                  className="flex-1 py-[5px] rounded-[5px] text-[11px] font-medium text-center"
                  style={{
                    backgroundColor: TG.inputBg,
                    color: TG.text,
                  }}
                >
                  {btn.label}
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
      {/* Touch indicator overlay */}
      <AnimatePresence>
        {touch && <TouchIndicator key={touch.key} x={touch.x} y={touch.y} />}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main export ───

export function TelegramMockup() {
  const [phase, setPhase] = useState<Phase>("IDLE");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [kbVisible, setKbVisible] = useState(false);
  const [kbPage, setKbPage] = useState<KBPage>("main");
  const [kbTouch, setKbTouch] = useState<TouchPoint | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });
  const hasStartedRef = useRef(false);
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const intervalsRef = useRef<Set<ReturnType<typeof setInterval>>>(new Set());
  const kbRef = useRef<HTMLDivElement>(null);
  const touchKeyRef = useRef(0);

  // ─── Timer helpers ───

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timersRef.current.delete(id);
      fn();
    }, ms);
    timersRef.current.add(id);
    return id;
  }, []);

  const scheduleInterval = useCallback((fn: () => void, ms: number) => {
    const id = setInterval(fn, ms);
    intervalsRef.current.add(id);
    return id;
  }, []);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current.clear();
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current.clear();
  }, []);

  // ─── Message helpers ───

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const updateMessage = useCallback(
    (id: string, updater: (msg: ChatMessage) => ChatMessage) => {
      setMessages((prev) => prev.map((m) => (m.id === id ? updater(m) : m)));
    },
    [],
  );

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const reset = useCallback(() => {
    clearAllTimers();
    setMessages([]);
    setInputText("");
    setKbVisible(false);
    setKbPage("main");
    setKbTouch(null);
    hasStartedRef.current = false;
  }, [clearAllTimers]);

  // ─── Touch helper ───

  const fireTouchAt = useCallback((x: number, y: number) => {
    touchKeyRef.current++;
    setKbTouch({ x, y, key: touchKeyRef.current });
  }, []);

  // ─── Start when in view ───

  useEffect(() => {
    if (isInView && !hasStartedRef.current) {
      hasStartedRef.current = true;
      setPhase("USER_TYPING");
    }
    if (!isInView && hasStartedRef.current) {
      reset();
      setPhase("IDLE");
    }
  }, [isInView, reset]);

  // ─── Typing sub-effect ───

  useEffect(() => {
    if (phase !== "USER_TYPING" && phase !== "USER_TYPING_2") return;

    const targetText = phase === "USER_TYPING" ? USER_MSG_1 : USER_MSG_2;

    if (inputText.length < targetText.length) {
      const id = setTimeout(() => {
        setInputText(targetText.slice(0, inputText.length + 1));
      }, CHAR_DELAY);
      return () => clearTimeout(id);
    }

    // Done typing — wait briefly then send
    const id = setTimeout(() => {
      setPhase(phase === "USER_TYPING" ? "USER_SEND" : "USER_SEND_2");
    }, 300);
    return () => clearTimeout(id);
  }, [phase, inputText]);

  // ─── Primary phase machine ───

  useEffect(() => {
    if (!isInView) return;

    switch (phase) {
      // ── Chat flow ──

      case "USER_SEND": {
        const msgId = "user-1";
        addMessage({
          id: msgId,
          direction: "outgoing",
          hasTail: true,
          radius: "17px 17px 4px 17px",
          time: "10:24",
          content: USER_MSG_1,
        });
        setInputText("");

        schedule(() => {
          updateMessage(msgId, (m) => ({ ...m, reaction: "\uD83D\uDC40" }));
        }, 500);

        schedule(() => setPhase("BOT_THINKING"), 1200);
        break;
      }

      case "BOT_THINKING": {
        const thinkId = "bot-thinking-1";
        let verbIdx = 0;
        let elapsed = 0;

        addMessage({
          id: thinkId,
          direction: "incoming",
          hasTail: false,
          radius: "17px 17px 17px 6px",
          time: "10:24",
          statusEmoji: "gear" as StatusEmoji,
          sessionName: "dev",
          statusVerb: THINKING_VERBS[0],
          elapsedSeconds: 0,
          toolEntries: [],
        });

        // Elapsed time counter
        scheduleInterval(() => {
          elapsed++;
          updateMessage(thinkId, (m) => ({ ...m, elapsedSeconds: elapsed }));
        }, 1000);

        // Verb rotation
        scheduleInterval(() => {
          verbIdx = (verbIdx + 1) % THINKING_VERBS.length;
          updateMessage(thinkId, (m) => ({ ...m, statusVerb: THINKING_VERBS[verbIdx] }));
        }, 1500);

        // Tool entries — staggered
        schedule(() => {
          updateMessage(thinkId, (m) => ({
            ...m,
            toolEntries: [...(m.toolEntries ?? []), { status: "done", verb: "Read", target: "src/auth.ts" }],
          }));
        }, 1200);

        schedule(() => {
          updateMessage(thinkId, (m) => ({
            ...m,
            toolEntries: [...(m.toolEntries ?? []), { status: "done", verb: "Read", target: "src/middleware.ts" }],
          }));
        }, 2800);

        schedule(() => {
          updateMessage(thinkId, (m) => ({
            ...m,
            toolEntries: [...(m.toolEntries ?? []), { status: "pending", verb: "Edit", target: "src/auth.ts" }],
          }));
        }, 4500);

        // Transition to finished — elapsed will show ~7s
        schedule(() => {
          clearAllTimers();
          setPhase("BOT_FINISHED");
        }, THINKING_DURATION);
        break;
      }

      case "BOT_FINISHED": {
        removeMessage("bot-thinking-1");

        schedule(() => {
          addMessage({
            id: "bot-finished-1",
            direction: "incoming",
            hasTail: true,
            radius: "6px 17px 17px 4px",
            time: "10:24",
            statusEmoji: "checkmark" as StatusEmoji,
            sessionName: "dev",
            statusVerb: `Finished (${Math.round(THINKING_DURATION / 1000)}s, +42 -7)`,
            summaryText: "Refactored auth middleware\nto use JWT verification.",
          });
        }, 300);

        schedule(() => setPhase("USER_TYPING_2"), 3500);
        break;
      }

      case "USER_SEND_2": {
        const msgId = "user-2";
        addMessage({
          id: msgId,
          direction: "outgoing",
          hasTail: true,
          radius: "17px 17px 4px 17px",
          time: "10:25",
          content: USER_MSG_2,
        });
        setInputText("");

        schedule(() => {
          updateMessage(msgId, (m) => ({ ...m, reaction: "\uD83D\uDC40" }));
        }, 500);

        schedule(() => setPhase("BOT_THINKING_2"), 1200);
        break;
      }

      case "BOT_THINKING_2": {
        const thinkId = "bot-thinking-2";
        addMessage({
          id: thinkId,
          direction: "incoming",
          hasTail: false,
          radius: "17px 17px 17px 6px",
          time: "10:25",
          statusEmoji: "gear" as StatusEmoji,
          sessionName: "dev",
          statusVerb: "Analyzing",
          toolEntries: [],
        });

        schedule(() => {
          updateMessage(thinkId, (m) => ({
            ...m,
            toolEntries: [{ status: "pending", verb: "Bash", target: "npm install express-rate-limit" }],
          }));
        }, 900);

        schedule(() => setPhase("BOT_PERMISSION"), 2000);
        break;
      }

      case "BOT_PERMISSION": {
        updateMessage("bot-thinking-2", (m) => ({
          ...m,
          statusEmoji: "lock" as StatusEmoji,
          statusVerb: "Permission needed",
          toolEntries: undefined,
          permissionCommand: "Bash: npm install express-rate-limit",
          hasKeyboard: true,
          hasTail: true,
          radius: "17px 17px 17px 4px",
        }));

        schedule(() => setPhase("KB_SHOW"), 3000);
        break;
      }

      // ── Keyboard flow ──

      case "KB_SHOW": {
        setKbVisible(true);
        setKbPage("main");
        schedule(() => setPhase("KB_TAP_COMMANDS"), 1500);
        break;
      }

      case "KB_TAP_COMMANDS": {
        // Touch "Commands" — 2nd button in 3rd row of main layout
        if (kbRef.current) {
          const kbWidth = kbRef.current.offsetWidth;
          const btnWidth = (kbWidth - 10 - 3) / 2; // 2 buttons in row 2
          const x = 5 + btnWidth + 3 + btnWidth / 2;
          fireTouchAt(x, 70);
        }
        // Send "Commands" as user message (Telegram sends keyboard text to chat)
        schedule(() => {
          setKbTouch(null);
          addMessage({
            id: "user-commands",
            direction: "outgoing",
            hasTail: true,
            radius: "17px 17px 4px 17px",
            time: "10:26",
            content: "Commands",
          });
        }, 300);
        schedule(() => setPhase("KB_SHOW_COMMANDS"), 800);
        break;
      }

      case "KB_SHOW_COMMANDS": {
        // Bot responds with 🎛 Commands confirmation
        addMessage({
          id: "bot-commands-ack",
          direction: "incoming",
          hasTail: true,
          radius: "17px 17px 17px 4px",
          time: "10:26",
          content: "\uD83C\uDF9B Commands",
        });
        setKbPage("commands");
        schedule(() => setPhase("KB_TAP_COMPACT"), 1500);
        break;
      }

      case "KB_TAP_COMPACT": {
        // Touch "Compact" — 1st button in 1st row of commands layout
        if (kbRef.current) {
          const kbWidth = kbRef.current.offsetWidth;
          const btnWidth = (kbWidth - 10 - 6) / 3; // 3 buttons in row 0
          const x = 5 + btnWidth / 2;
          fireTouchAt(x, 16);
        }
        // Send "Compact" as user message
        schedule(() => {
          setKbTouch(null);
          setPhase("KB_COMPACT_SENT");
        }, 300);
        break;
      }

      case "KB_COMPACT_SENT": {
        const msgId = "user-compact";
        addMessage({
          id: msgId,
          direction: "outgoing",
          hasTail: true,
          radius: "17px 17px 4px 17px",
          time: "10:26",
          content: "Compact",
        });

        // Bot reacts with ✅ to the compact command
        schedule(() => {
          updateMessage(msgId, (m) => ({ ...m, reaction: "\u2705" }));
        }, 500);

        schedule(() => setPhase("BOT_COMPACTING"), 1200);
        break;
      }

      case "BOT_COMPACTING": {
        const compactId = "bot-compacting";
        let dots = 0;
        addMessage({
          id: compactId,
          direction: "incoming",
          hasTail: true,
          radius: "17px 17px 17px 4px",
          time: "10:26",
          statusEmoji: "refresh" as StatusEmoji,
          sessionName: "dev",
          statusVerb: "Compacting",
        });

        // Animate dots: Compacting. → Compacting.. → Compacting...
        scheduleInterval(() => {
          dots = (dots + 1) % 4;
          const dotStr = ".".repeat(dots || 1);
          updateMessage(compactId, (m) => ({
            ...m,
            statusVerb: `Compacting${dotStr}`,
          }));
        }, 500);

        schedule(() => {
          clearAllTimers();
          setPhase("BOT_COMPACTED");
        }, 2500);
        break;
      }

      case "BOT_COMPACTED": {
        updateMessage("bot-compacting", (m) => ({
          ...m,
          statusEmoji: "package" as StatusEmoji,
          statusVerb: "Compacted: 73% \u2192 42%",
        }));

        schedule(() => setPhase("PAUSE"), 3000);
        break;
      }

      // ── End of cycle ──

      case "PAUSE": {
        schedule(() => setPhase("RESET"), PAUSE_BEFORE_RESTART);
        break;
      }

      case "RESET": {
        setKbVisible(false);
        setMessages([]);
        setInputText("");
        setKbPage("main");
        setKbTouch(null);
        schedule(() => setPhase("USER_TYPING"), 800);
        break;
      }
    }

    return () => {
      // Cleanup handled by clearAllTimers at specific transition points
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, isInView]);

  return (
    <section ref={sectionRef} id="demo" className="px-4 py-20 sm:py-28">
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
          {/* Left: feature descriptions */}
          <div className="space-y-6 order-2 md:order-1">
            <div
              className="transition-opacity duration-300"
              style={{
                opacity:
                  phase === "BOT_THINKING" || phase === "BOT_FINISHED"
                    ? 1
                    : 0.5,
              }}
            >
              <h3 className="font-semibold mb-1">Live status mirror</h3>
              <p className="text-dim text-sm leading-relaxed">
                See when Claude is thinking, reading files, or writing code.
                Each tool call triggers a Telegram notification via hooks.
              </p>
            </div>
            <div
              className="transition-opacity duration-300"
              style={{
                opacity:
                  phase === "USER_TYPING" ||
                  phase === "USER_SEND" ||
                  phase === "USER_TYPING_2" ||
                  phase === "USER_SEND_2"
                    ? 1
                    : 0.5,
              }}
            >
              <h3 className="font-semibold mb-1">Reply to inject prompts</h3>
              <p className="text-dim text-sm leading-relaxed">
                Reply to any bot message and your text becomes the next prompt.
                Steer your session from the couch.
              </p>
            </div>
            <div
              className="transition-opacity duration-300"
              style={{
                opacity:
                  phase === "BOT_PERMISSION" || phase === "BOT_THINKING_2" ||
                  phase === "KB_SHOW" || phase === "KB_TAP_COMMANDS" ||
                  phase === "KB_SHOW_COMMANDS" || phase === "KB_TAP_COMPACT" ||
                  phase === "KB_COMPACT_SENT" || phase === "BOT_COMPACTING" ||
                  phase === "BOT_COMPACTED"
                    ? 1
                    : 0.5,
              }}
            >
              <h3 className="font-semibold mb-1">Approve permissions remotely</h3>
              <p className="text-dim text-sm leading-relaxed">
                Dangerous commands surface as inline keyboards with Allow/Deny
                buttons. No terminal required.
              </p>
            </div>
          </div>

          {/* Right: phone */}
          <div className="order-1 md:order-2 flex flex-col items-center">
            <PhoneFrame>
              {/* Chat area */}
              <div
                className="flex-1 flex flex-col justify-end px-[10px] pb-[6px] space-y-[4px] overflow-hidden"
                style={{ backgroundColor: TG.chatBg }}
              >
                <DateSeparator />
                <div className="space-y-[4px]">
                  <AnimatePresence mode="popLayout">
                    {messages.map((msg) => (
                      <Bubble key={msg.id} msg={msg} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Persistent reply keyboard */}
              <div ref={kbRef} className="shrink-0">
                <AnimatePresence>
                  {kbVisible && (
                    <PersistentKeyboard page={kbPage} touch={kbTouch} />
                  )}
                </AnimatePresence>
              </div>

              {/* Input bar */}
              <div className="shrink-0">
                <TelegramInput text={inputText} />
              </div>
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
