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
  type ChatMessage,
} from "./telegram-shared";

// ─── Phase machine ───
type Phase =
  | "IDLE"
  | "USER_TYPING_1"
  | "USER_SEND_1"
  | "USER_TYPING_2"
  | "USER_SEND_2"
  | "BOT_LAUNCHES"
  | "USER_TYPING_3"
  | "USER_SEND_3"
  | "BOT_DASHBOARD"
  | "USER_TYPING_4"
  | "USER_SEND_4"
  | "BOT_TIM_REPLY"
  | "USER_TYPING_5"
  | "USER_SEND_5"
  | "BOT_JOHN_REPLY"
  | "PAUSE"
  | "RESET";

// ─── Constants ───
const PAUSE_BEFORE_RESTART = 2500;

const TYPED_MESSAGES: Record<string, string> = {
  USER_TYPING_1: "/new !john",
  USER_TYPING_2: "/new tim",
  USER_TYPING_3: "tim",
  USER_TYPING_4: "hey tim how are you?",
  USER_TYPING_5: "/john are you ready for a task?",
};

const SEND_AFTER: Record<string, Phase> = {
  USER_TYPING_1: "USER_SEND_1",
  USER_TYPING_2: "USER_SEND_2",
  USER_TYPING_3: "USER_SEND_3",
  USER_TYPING_4: "USER_SEND_4",
  USER_TYPING_5: "USER_SEND_5",
};

const TYPING_PHASES = new Set<Phase>([
  "USER_TYPING_1",
  "USER_TYPING_2",
  "USER_TYPING_3",
  "USER_TYPING_4",
  "USER_TYPING_5",
]);

// ─── Main export ───

export function TelegramMultiSession() {
  const [phase, setPhase] = useState<Phase>("IDLE");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });
  const hasStartedRef = useRef(false);
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  // ─── Timer helpers ───

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timersRef.current.delete(id);
      fn();
    }, ms);
    timersRef.current.add(id);
    return id;
  }, []);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current.clear();
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

  const reset = useCallback(() => {
    clearAllTimers();
    setMessages([]);
    setInputText("");
    hasStartedRef.current = false;
  }, [clearAllTimers]);

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

  // ─── Typing sub-effect (handles all 5 typing phases) ───

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
      // ── Launch flow ──

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
        schedule(() => setPhase("USER_TYPING_2"), 400);
        break;
      }

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
        schedule(() => setPhase("BOT_LAUNCHES"), 600);
        break;
      }

      case "BOT_LAUNCHES": {
        // Stagger: ✅ john launched → ⌨️ → ✅ tim launched → ⌨️
        schedule(() => {
          addMessage({
            id: "bot-john-launched",
            direction: "incoming",
            hasTail: true,
            radius: "17px 17px 17px 4px",
            time: "10:30",
            content: "\u2705 john launched",
          });
        }, 300);

        schedule(() => {
          addMessage({
            id: "bot-kb-1",
            direction: "incoming",
            hasTail: false,
            radius: "17px 17px 17px 6px",
            time: "10:30",
            content: "\u2328\uFE0F",
          });
        }, 700);

        schedule(() => {
          addMessage({
            id: "bot-tim-launched",
            direction: "incoming",
            hasTail: false,
            radius: "17px 17px 17px 6px",
            time: "10:30",
            content: "\u2705 tim launched",
          });
        }, 1100);

        schedule(() => {
          addMessage({
            id: "bot-kb-2",
            direction: "incoming",
            hasTail: false,
            radius: "17px 17px 17px 6px",
            time: "10:30",
            content: "\u2328\uFE0F",
          });
        }, 1500);

        schedule(() => setPhase("USER_TYPING_3"), 2200);
        break;
      }

      // ── Session switching ──

      case "USER_SEND_3": {
        addMessage({
          id: "user-switch-tim",
          direction: "outgoing",
          hasTail: true,
          radius: "17px 17px 4px 17px",
          time: "10:31",
          content: "tim",
        });
        setInputText("");
        schedule(() => setPhase("BOT_DASHBOARD"), 600);
        break;
      }

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

        schedule(() => setPhase("USER_TYPING_4"), 3000);
        break;
      }

      // ── Direct messaging ──

      case "USER_SEND_4": {
        const msgId = "user-msg-tim";
        addMessage({
          id: msgId,
          direction: "outgoing",
          hasTail: true,
          radius: "17px 17px 4px 17px",
          time: "10:31",
          content: "hey tim how are you?",
        });
        setInputText("");

        schedule(() => {
          updateMessage(msgId, (m) => ({ ...m, reaction: "\uD83D\uDC40" }));
        }, 500);

        schedule(() => setPhase("BOT_TIM_REPLY"), 1200);
        break;
      }

      case "BOT_TIM_REPLY": {
        addMessage({
          id: "bot-tim-finished",
          direction: "incoming",
          hasTail: true,
          radius: "17px 17px 17px 4px",
          time: "10:31",
          statusEmoji: "checkmark",
          sessionName: "tim",
          statusVerb: "Finished (3s)",
          summaryText:
            "Hey! I\u2019m doing well, thanks for asking.\nReady when you are \u2014 what are\nwe working on today?",
        });

        schedule(() => setPhase("USER_TYPING_5"), 3000);
        break;
      }

      case "USER_SEND_5": {
        const msgId = "user-msg-john";
        addMessage({
          id: msgId,
          direction: "outgoing",
          hasTail: true,
          radius: "17px 17px 4px 17px",
          time: "10:32",
          content: "/john are you ready for a task?",
        });
        setInputText("");

        schedule(() => {
          updateMessage(msgId, (m) => ({ ...m, reaction: "\uD83D\uDC40" }));
        }, 500);

        schedule(() => setPhase("BOT_JOHN_REPLY"), 1200);
        break;
      }

      case "BOT_JOHN_REPLY": {
        addMessage({
          id: "bot-john-finished",
          direction: "incoming",
          hasTail: true,
          radius: "17px 17px 17px 4px",
          time: "10:32",
          statusEmoji: "checkmark",
          sessionName: "john",
          statusVerb: "Finished (1s)",
          summaryText: "Ready. What\u2019s the task?",
        });

        schedule(() => setPhase("PAUSE"), 3000);
        break;
      }

      // ── End of cycle ──

      case "PAUSE": {
        schedule(() => setPhase("RESET"), PAUSE_BEFORE_RESTART);
        break;
      }

      case "RESET": {
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
    phase === "USER_TYPING_2" ||
    phase === "USER_SEND_2" ||
    phase === "BOT_LAUNCHES";

  const switchActive =
    phase === "USER_TYPING_3" ||
    phase === "USER_SEND_3" ||
    phase === "BOT_DASHBOARD";

  const directActive =
    phase === "USER_TYPING_4" ||
    phase === "USER_SEND_4" ||
    phase === "BOT_TIM_REPLY" ||
    phase === "USER_TYPING_5" ||
    phase === "USER_SEND_5" ||
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
