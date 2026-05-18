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
  type TouchPoint,
} from "./telegram-shared";

// ─── Phase machine ───
type Phase =
  | "IDLE"
  | "USER_TYPING_1"
  | "USER_SEND_1"
  | "BOT_JOHN_LAUNCH"
  | "USER_TYPING_2"
  | "USER_SEND_2"
  | "BOT_TIM_LAUNCH"
  | "KB_SHOW"
  | "KB_TAP_TIM"
  | "BOT_DASHBOARD"
  | "USER_TYPING_3"
  | "USER_SEND_3"
  | "BOT_TIM_THINKING"
  | "BOT_TIM_REPLY"
  | "USER_TYPING_4"
  | "USER_SEND_4"
  | "BOT_JOHN_THINKING"
  | "BOT_JOHN_REPLY"
  | "PAUSE"
  | "RESET";

// ─── Constants ───
const PAUSE_BEFORE_RESTART = 2500;

const TYPED_MESSAGES: Record<string, string> = {
  USER_TYPING_1: "/new !john",
  USER_TYPING_2: "/new tim",
  USER_TYPING_3: "write tests for the payment webhook",
  USER_TYPING_4: "/john review PR #38",
};

const SEND_AFTER: Record<string, Phase> = {
  USER_TYPING_1: "USER_SEND_1",
  USER_TYPING_2: "USER_SEND_2",
  USER_TYPING_3: "USER_SEND_3",
  USER_TYPING_4: "USER_SEND_4",
};

const TYPING_PHASES = new Set<Phase>([
  "USER_TYPING_1",
  "USER_TYPING_2",
  "USER_TYPING_3",
  "USER_TYPING_4",
]);

// ─── Persistent keyboard layout ───

interface KBButton {
  label: string;
  id: string;
}

const KB_ROWS: KBButton[][] = [
  [
    { label: "john \u2699\uFE0F", id: "john" },
    { label: "tim \uD83D\uDCA4", id: "tim" },
  ],
  [
    { label: "\u23F9 stop", id: "stop" },
    { label: "\u2620 kill", id: "kill" },
  ],
];

function PersistentKeyboard({ touch }: { touch: TouchPoint | null }) {
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
      <div className="px-[5px] py-[4px] space-y-[3px]">
        {KB_ROWS.map((row, ri) => (
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
      </div>
      {/* Touch indicator overlay */}
      <AnimatePresence>
        {touch && <TouchIndicator key={touch.key} x={touch.x} y={touch.y} />}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main export ───

export function TelegramMultiSession() {
  const [phase, setPhase] = useState<Phase>("IDLE");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [kbVisible, setKbVisible] = useState(false);
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
      setPhase("USER_TYPING_1");
    }
    if (!isInView && hasStartedRef.current) {
      reset();
      setPhase("IDLE");
    }
  }, [isInView, reset]);

  // ─── Typing sub-effect (handles all typing phases) ───

  useEffect(() => {
    if (!TYPING_PHASES.has(phase)) return;

    const targetText = TYPED_MESSAGES[phase];
    if (!targetText) return;

    if (inputText.length < targetText.length) {
      const id = setTimeout(() => {
        setInputText(targetText.slice(0, inputText.length + 1));
      }, CHAR_DELAY);
      return () => clearTimeout(id);
    }

    // Done typing — wait briefly then send
    const nextPhase = SEND_AFTER[phase];
    if (!nextPhase) return;
    const id = setTimeout(() => {
      setPhase(nextPhase);
    }, 300);
    return () => clearTimeout(id);
  }, [phase, inputText]);

  // ─── Primary phase machine ───

  useEffect(() => {
    if (!isInView) return;

    switch (phase) {
      // ── /new !john ──

      case "USER_SEND_1": {
        addMessage({
          id: "user-new-john",
          direction: "outgoing",
          hasTail: true,
          radius: "17px 17px 4px 17px",
          time: "10:30",
          content: "/new !john",
        });
        setInputText("");
        schedule(() => setPhase("BOT_JOHN_LAUNCH"), 600);
        break;
      }

      case "BOT_JOHN_LAUNCH": {
        // ⏳ launching john...
        addMessage({
          id: "bot-john-launching",
          direction: "incoming",
          hasTail: true,
          radius: "17px 17px 17px 4px",
          time: "10:30",
          content: "\u23F3 launching john\u2026",
        });

        // Update to ✅ john launched
        schedule(() => {
          updateMessage("bot-john-launching", (m) => ({
            ...m,
            content: "\u2705 john launched",
          }));
        }, 800);

        // ⌨️ staggered
        schedule(() => {
          addMessage({
            id: "bot-kb-1",
            direction: "incoming",
            hasTail: false,
            radius: "17px 17px 17px 6px",
            time: "10:30",
            content: "\u2328\uFE0F",
          });
        }, 1200);

        schedule(() => setPhase("USER_TYPING_2"), 2000);
        break;
      }

      // ── /new tim ──

      case "USER_SEND_2": {
        addMessage({
          id: "user-new-tim",
          direction: "outgoing",
          hasTail: true,
          radius: "17px 17px 4px 17px",
          time: "10:30",
          content: "/new tim",
        });
        setInputText("");
        schedule(() => setPhase("BOT_TIM_LAUNCH"), 600);
        break;
      }

      case "BOT_TIM_LAUNCH": {
        // ⏳ launching tim...
        addMessage({
          id: "bot-tim-launching",
          direction: "incoming",
          hasTail: true,
          radius: "17px 17px 17px 4px",
          time: "10:30",
          content: "\u23F3 launching tim\u2026",
        });

        // Update to ✅ tim launched
        schedule(() => {
          updateMessage("bot-tim-launching", (m) => ({
            ...m,
            content: "\u2705 tim launched",
          }));
        }, 800);

        // ⌨️ staggered
        schedule(() => {
          addMessage({
            id: "bot-kb-2",
            direction: "incoming",
            hasTail: false,
            radius: "17px 17px 17px 6px",
            time: "10:30",
            content: "\u2328\uFE0F",
          });
        }, 1200);

        schedule(() => setPhase("KB_SHOW"), 2000);
        break;
      }

      // ── Keyboard shows, tap tim ──

      case "KB_SHOW": {
        setKbVisible(true);
        schedule(() => setPhase("KB_TAP_TIM"), 1000);
        break;
      }

      case "KB_TAP_TIM": {
        // Touch indicator on "tim 💤" button (2nd button in 1st row)
        if (kbRef.current) {
          const kbWidth = kbRef.current.offsetWidth;
          const btnWidth = (kbWidth - 10 - 3) / 2; // 2 buttons, px-[5px] each side, gap-[3px]
          const x = 5 + btnWidth + 3 + btnWidth / 2;
          fireTouchAt(x, 16);
        }

        // After 300ms: send "tim" to chat, hide keyboard
        schedule(() => {
          setKbTouch(null);
          setKbVisible(false);
          addMessage({
            id: "user-switch-tim",
            direction: "outgoing",
            hasTail: true,
            radius: "17px 17px 4px 17px",
            time: "10:31",
            content: "tim",
          });
        }, 300);

        schedule(() => setPhase("BOT_DASHBOARD"), 600);
        break;
      }

      // ── Dashboard ──

      case "BOT_DASHBOARD": {
        addMessage({
          id: "bot-tim-dashboard",
          direction: "incoming",
          hasTail: true,
          radius: "17px 17px 17px 4px",
          time: "10:31",
          content: "\uD83D\uDFE2 [tim] \u00B7 idle",
          dashboardLines: [
            "  Model   Opus 4.7 (1M context)",
            "  Active  12s ago",
          ],
        });

        schedule(() => setPhase("USER_TYPING_3"), 3000);
        break;
      }

      // ── Tim: write tests ──

      case "USER_SEND_3": {
        const msgId = "user-msg-tim";
        addMessage({
          id: msgId,
          direction: "outgoing",
          hasTail: true,
          radius: "17px 17px 4px 17px",
          time: "10:31",
          content: "write tests for the payment webhook",
        });
        setInputText("");

        schedule(() => {
          updateMessage(msgId, (m) => ({ ...m, reaction: "\uD83D\uDC40" }));
        }, 500);

        schedule(() => setPhase("BOT_TIM_THINKING"), 1200);
        break;
      }

      case "BOT_TIM_THINKING": {
        const thinkId = "bot-tim-thinking";
        let elapsed = 0;

        addMessage({
          id: thinkId,
          direction: "incoming",
          hasTail: true,
          radius: "17px 17px 17px 4px",
          time: "10:31",
          statusEmoji: "gear",
          sessionName: "tim",
          statusVerb: "Thinking",
          elapsedSeconds: 0,
        });

        scheduleInterval(() => {
          elapsed++;
          updateMessage(thinkId, (m) => ({ ...m, elapsedSeconds: elapsed }));
        }, 1000);

        schedule(() => {
          intervalsRef.current.forEach(clearInterval);
          intervalsRef.current.clear();
          setPhase("BOT_TIM_REPLY");
        }, 3500);
        break;
      }

      case "BOT_TIM_REPLY": {
        removeMessage("bot-tim-thinking");

        schedule(() => {
          addMessage({
            id: "bot-tim-finished",
            direction: "incoming",
            hasTail: true,
            radius: "17px 17px 17px 4px",
            time: "10:31",
            statusEmoji: "checkmark",
            sessionName: "tim",
            statusVerb: "Finished (4s)",
            summaryText:
              "Added 6 tests covering success, invalid signature, duplicate event, and retry scenarios. Opened PR #38.",
          });
        }, 200);

        schedule(() => setPhase("USER_TYPING_4"), 3200);
        break;
      }

      // ── John: review PR ──

      case "USER_SEND_4": {
        const msgId = "user-msg-john";
        addMessage({
          id: msgId,
          direction: "outgoing",
          hasTail: true,
          radius: "17px 17px 4px 17px",
          time: "10:32",
          content: "/john review PR #38",
        });
        setInputText("");

        schedule(() => {
          updateMessage(msgId, (m) => ({ ...m, reaction: "\uD83D\uDC40" }));
        }, 500);

        schedule(() => setPhase("BOT_JOHN_THINKING"), 1200);
        break;
      }

      case "BOT_JOHN_THINKING": {
        const thinkId = "bot-john-thinking";
        let elapsed = 0;

        addMessage({
          id: thinkId,
          direction: "incoming",
          hasTail: true,
          radius: "17px 17px 17px 4px",
          time: "10:32",
          statusEmoji: "gear",
          sessionName: "john",
          statusVerb: "Thinking",
          elapsedSeconds: 0,
        });

        scheduleInterval(() => {
          elapsed++;
          updateMessage(thinkId, (m) => ({ ...m, elapsedSeconds: elapsed }));
        }, 1000);

        schedule(() => {
          intervalsRef.current.forEach(clearInterval);
          intervalsRef.current.clear();
          setPhase("BOT_JOHN_REPLY");
        }, 2500);
        break;
      }

      case "BOT_JOHN_REPLY": {
        removeMessage("bot-john-thinking");

        schedule(() => {
          addMessage({
            id: "bot-john-finished",
            direction: "incoming",
            hasTail: true,
            radius: "17px 17px 17px 4px",
            time: "10:32",
            statusEmoji: "checkmark",
            sessionName: "john",
            statusVerb: "Finished (2s)",
            summaryText:
              "PR #38 looks good. Left 2 comments: missing edge case for empty payload, and a nit on error message wording. Approved.",
          });
        }, 200);

        schedule(() => setPhase("PAUSE"), 3200);
        break;
      }

      // ── End of cycle ──

      case "PAUSE": {
        schedule(() => setPhase("RESET"), PAUSE_BEFORE_RESTART);
        break;
      }

      case "RESET": {
        setKbVisible(false);
        setKbTouch(null);
        setMessages([]);
        setInputText("");
        schedule(() => setPhase("USER_TYPING_1"), 800);
        break;
      }
    }

    return () => {
      // Cleanup handled by clearAllTimers at specific transition points
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, isInView]);

  // ─── Left-side highlight logic ───

  const launchActive =
    phase === "USER_TYPING_1" ||
    phase === "USER_SEND_1" ||
    phase === "BOT_JOHN_LAUNCH" ||
    phase === "USER_TYPING_2" ||
    phase === "USER_SEND_2" ||
    phase === "BOT_TIM_LAUNCH";

  const switchActive =
    phase === "KB_SHOW" ||
    phase === "KB_TAP_TIM" ||
    phase === "BOT_DASHBOARD";

  const directActive =
    phase === "USER_TYPING_3" ||
    phase === "USER_SEND_3" ||
    phase === "BOT_TIM_THINKING" ||
    phase === "BOT_TIM_REPLY" ||
    phase === "USER_TYPING_4" ||
    phase === "USER_SEND_4" ||
    phase === "BOT_JOHN_THINKING" ||
    phase === "BOT_JOHN_REPLY";

  return (
    <section ref={sectionRef} className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25 }}
          className="text-2xl sm:text-3xl font-bold text-center mb-4"
        >
          Run a team of agents
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="text-dim text-center mb-12 max-w-lg mx-auto"
        >
          Launch multiple Claude sessions, switch between them, and send
          direct messages — all from one chat.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left: feature descriptions */}
          <div className="space-y-6 order-2 md:order-1">
            <div
              className="transition-opacity duration-300"
              style={{ opacity: launchActive ? 1 : 0.5 }}
            >
              <h3 className="font-semibold mb-1">Multi-session orchestration</h3>
              <p className="text-dim text-sm leading-relaxed">
                Launch parallel Claude sessions with{" "}
                <code className="text-accent text-xs">/new</code>. Each runs
                independently with its own context and model.
              </p>
            </div>
            <div
              className="transition-opacity duration-300"
              style={{ opacity: switchActive ? 1 : 0.5 }}
            >
              <h3 className="font-semibold mb-1">Session switching</h3>
              <p className="text-dim text-sm leading-relaxed">
                Tap a session name to switch context. View live status, model
                info, and recent activity at a glance.
              </p>
            </div>
            <div
              className="transition-opacity duration-300"
              style={{ opacity: directActive ? 1 : 0.5 }}
            >
              <h3 className="font-semibold mb-1">Direct messaging</h3>
              <p className="text-dim text-sm leading-relaxed">
                Send prompts to any session with{" "}
                <code className="text-accent text-xs">/name message</code>. No
                need to switch — just prefix with the session name.
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
                  {kbVisible && <PersistentKeyboard touch={kbTouch} />}
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
