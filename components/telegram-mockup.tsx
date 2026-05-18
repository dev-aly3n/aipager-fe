"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ─── Telegram iOS Dark theme colors (from TelegramMessenger/Telegram-iOS source) ───
const TG = {
  chatBg: "#000000",
  headerBg: "#1c1c1d",
  incomingBg: "#1e1e1e",
  outgoingBg: "#3390ec",
  text: "#ffffff",
  meta: "#8d8e93",
  outMeta: "rgba(255,255,255,0.55)",
  inputBg: "#272728",
  inputPlaceholder: "#8f8f8f",
  separator: "rgba(84,84,88,0.25)",
  accent: "#3390ec",
  constructive: "#31b545",
  destructive: "#e53935",
} as const;

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

// ─── Dynamic message model ───
interface ToolEntry {
  status: "done" | "pending";
  verb: string;
  target: string;
}

type StatusEmoji = "gear" | "checkmark" | "lock" | "refresh" | "package";

interface ChatMessage {
  id: string;
  direction: "incoming" | "outgoing";
  hasTail: boolean;
  radius: string;
  time: string;
  statusEmoji?: StatusEmoji;
  sessionName?: string;
  statusVerb?: string;
  elapsedSeconds?: number;
  toolEntries?: ToolEntry[];
  summaryText?: string;
  permissionCommand?: string;
  hasKeyboard?: boolean;
  content?: string;
  reaction?: string;
}

// ─── Constants ───
const CHAR_DELAY = 45;
const THINKING_DURATION = 7000;
const PAUSE_BEFORE_RESTART = 2500;

const THINKING_VERBS = ["Thinking", "Reasoning", "Analyzing", "Pondering"] as const;

const USER_MSG_1 = "refactor the auth middleware";
const USER_MSG_2 = "now add rate limiting";

// ─── SVG bubble tails ───

function TailIn() {
  return (
    <svg
      className="absolute bottom-0 -left-[6px]"
      width="7"
      height="16"
      viewBox="0 0 7 16"
      fill="none"
    >
      <path d="M7 0V16H0C3.5 14 6 9 7 0Z" fill={TG.incomingBg} />
    </svg>
  );
}

function TailOut() {
  return (
    <svg
      className="absolute bottom-0 -right-[6px]"
      width="7"
      height="16"
      viewBox="0 0 7 16"
      fill="none"
    >
      <path d="M0 0V16H7C3.5 14 1 9 0 0Z" fill={TG.outgoingBg} />
    </svg>
  );
}

// ─── Status bar (iOS-style) ───

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-1 pb-0.5">
      <span
        className="text-[14px] font-semibold leading-none"
        style={{ color: TG.text, fontFamily: "-apple-system,system-ui,sans-serif" }}
      >
        9:41
      </span>
      <div className="flex items-center gap-[5px]">
        <svg width="17" height="11" viewBox="0 0 17 11" fill={TG.text}>
          <rect x="0" y="8" width="3" height="3" rx="0.5" fillOpacity="0.3" />
          <rect x="4.3" y="5.5" width="3" height="5.5" rx="0.5" />
          <rect x="8.6" y="3" width="3" height="8" rx="0.5" />
          <rect x="12.9" y="0" width="3" height="11" rx="0.5" />
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke={TG.text} strokeWidth="1.4" strokeLinecap="round">
          <circle cx="7.5" cy="9.5" r="1" fill={TG.text} stroke="none" />
          <path d="M5 7.5C5.7 6.8 6.5 6.4 7.5 6.4S9.3 6.8 10 7.5" />
          <path d="M2.5 5C3.8 3.7 5.5 3 7.5 3S11.2 3.7 12.5 5" />
          <path d="M.5 2.8C2.2 1.1 4.6.2 7.5.2S12.8 1.1 14.5 2.8" />
        </svg>
        <svg width="25" height="11" viewBox="0 0 25 11" fill={TG.text}>
          <rect x="0.5" y="0.5" width="21" height="10" rx="2" stroke={TG.text} strokeWidth="1" fill="none" strokeOpacity="0.35" />
          <rect x="2" y="2" width="15" height="7" rx="1.5" />
          <path d="M23 3.5C23.5 3.5 24 4 24 4.7V6.3C24 7 23.5 7.5 23 7.5V3.5Z" fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

// ─── Telegram nav header ───

function TelegramNav() {
  return (
    <div
      className="flex items-center gap-1 px-1 py-[5px]"
      style={{ backgroundColor: TG.headerBg, borderBottom: `0.5px solid ${TG.separator}` }}
    >
      <div className="flex items-center gap-0 pl-0.5 shrink-0">
        <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
          <path d="M9 1L2 8.5L9 16" stroke={TG.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[13px] ml-[-1px]" style={{ color: TG.accent }}>Back</span>
      </div>
      <div
        className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-[13px] font-medium shrink-0 ml-1"
        style={{ background: "linear-gradient(180deg, #72d5fd, #2ca5e0)" }}
      >
        a
      </div>
      <div className="flex-1 min-w-0 ml-[3px]">
        <div className="text-[15px] font-semibold leading-[18px] truncate" style={{ color: TG.text }}>
          aipager
        </div>
        <div className="text-[12px] leading-[14px]" style={{ color: TG.meta }}>bot</div>
      </div>
    </div>
  );
}

// ─── Date separator ───

function DateSeparator() {
  return (
    <div className="flex justify-center py-[3px]">
      <span
        className="text-[11px] font-medium px-[7px] py-[2px] rounded-full"
        style={{ backgroundColor: "rgba(255,255,255,0.08)", color: TG.text }}
      >
        Today
      </span>
    </div>
  );
}

// ─── Inline keyboard (Allow / Deny / Stop) ───

function InlineKeyboard() {
  return (
    <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)" }}>
      <div className="flex">
        <button className="flex-1 py-[6px] text-[12px] font-medium cursor-default" style={{ color: TG.constructive }}>
          ✅ Allow
        </button>
        <div style={{ width: "0.5px", backgroundColor: "rgba(255,255,255,0.08)" }} />
        <button className="flex-1 py-[6px] text-[12px] font-medium cursor-default" style={{ color: TG.destructive }}>
          ❌ Deny
        </button>
      </div>
      <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)" }}>
        <button className="w-full py-[6px] text-[12px] font-medium cursor-default" style={{ color: TG.text }}>
          ⏹ Stop
        </button>
      </div>
    </div>
  );
}

// ─── Input bar ───

function TelegramInput({ text }: { text: string }) {
  const showPlaceholder = text.length === 0;

  return (
    <div
      className="flex items-center gap-1.5 px-[6px] py-[5px]"
      style={{ backgroundColor: TG.headerBg, borderTop: `0.5px solid ${TG.separator}` }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0 ml-0.5">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke={TG.meta} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div
        className="flex-1 rounded-[16px] px-3 py-[5px] text-[14px]"
        style={{ backgroundColor: TG.inputBg, color: showPlaceholder ? TG.inputPlaceholder : TG.text }}
      >
        {showPlaceholder ? (
          "Message"
        ) : (
          <>
            {text}
            <span
              className="inline-block w-[1.5px] h-[14px] ml-[1px] animate-pulse align-middle"
              style={{ backgroundColor: TG.accent }}
            />
          </>
        )}
      </div>
      {showPlaceholder ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0 mr-0.5">
          <path d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" stroke={TG.accent} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M19 10v1a7 7 0 01-14 0v-1" stroke={TG.accent} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 19v3" stroke={TG.accent} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ) : (
        <div
          className="w-[24px] h-[24px] rounded-full flex items-center justify-center shrink-0 mr-0.5"
          style={{ backgroundColor: TG.accent }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ─── Emoji helpers ───

function statusEmojiStr(emoji: StatusEmoji | undefined): string {
  switch (emoji) {
    case "gear": return "⚙️";
    case "checkmark": return "✅";
    case "lock": return "🔐";
    case "refresh": return "🔄";
    case "package": return "📦";
    default: return "";
  }
}

// ─── Single message bubble ───

function Bubble({ msg }: { msg: ChatMessage }) {
  const isOut = msg.direction === "outgoing";

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex ${isOut ? "justify-end" : "justify-start"} relative`}
    >
      <div
        className="relative max-w-[85%]"
        style={{
          backgroundColor: isOut ? TG.outgoingBg : TG.incomingBg,
          borderRadius: msg.radius,
        }}
      >
        {msg.hasTail && (isOut ? <TailOut /> : <TailIn />)}

        <div className="px-[7px] pt-[4px] pb-[2px]">
          {/* Status line: emoji + session · verb + elapsed */}
          {msg.statusVerb && (
            <div className="flex items-center gap-1 mb-[1px]">
              <span className="text-[12.5px] font-medium leading-tight" style={{ color: TG.text }}>
                {statusEmojiStr(msg.statusEmoji)} {msg.sessionName} · {msg.statusVerb}
                {msg.elapsedSeconds !== undefined && msg.elapsedSeconds >= 2 ? `… ${msg.elapsedSeconds}s` : msg.statusEmoji === "gear" ? "…" : ""}
              </span>
              {msg.statusEmoji === "gear" && (
                <span
                  className="inline-block w-[4px] h-[4px] rounded-full animate-pulse"
                  style={{ backgroundColor: TG.accent }}
                />
              )}
            </div>
          )}

          {/* Tool entries */}
          {msg.toolEntries && msg.toolEntries.length > 0 && (
            <div className="mt-[2px] space-y-[1px]">
              {msg.toolEntries.map((entry, i) => (
                <motion.div
                  key={`${entry.verb}-${entry.target}-${i}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-[11px] font-mono"
                  style={{ color: TG.text, opacity: 0.85 }}
                >
                  {entry.status === "done" ? "✅" : "⏳"}{" "}
                  <span style={{ color: TG.meta }}>{entry.verb}:</span> {entry.target}
                </motion.div>
              ))}
            </div>
          )}

          {/* Summary blockquote (for finished messages) */}
          {msg.summaryText && (
            <div
              className="text-[11px] leading-[14px] rounded px-[5px] py-[3px] mt-[2px] border-l-2"
              style={{
                color: TG.text,
                backgroundColor: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.15)",
              }}
            >
              {msg.summaryText}
            </div>
          )}

          {/* Permission command */}
          {msg.permissionCommand && (
            <div
              className="text-[11px] font-mono mt-[2px] rounded px-[5px] py-[3px]"
              style={{ color: TG.text, backgroundColor: "rgba(0,0,0,0.3)" }}
            >
              {msg.permissionCommand}
            </div>
          )}

          {/* Plain text content */}
          {msg.content && (
            <div className="text-[13px] leading-[17px]" style={{ color: TG.text }}>
              {msg.content}
            </div>
          )}

          {/* Timestamp row */}
          <div className="flex items-center gap-[2px] justify-end mt-[0px]">
            <span className="text-[10px] leading-none" style={{ color: isOut ? TG.outMeta : TG.meta }}>
              {msg.time}
            </span>
            {isOut && (
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                <path d="M1 4L3.5 6.5L8.5 1.5" stroke={TG.outMeta} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.5 4L7 6.5L12 1.5" stroke={TG.outMeta} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>

        {msg.hasKeyboard && <InlineKeyboard />}
      </div>

      {/* Reaction badge */}
      {msg.reaction && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className={`absolute -bottom-[8px] ${isOut ? "right-[8px]" : "left-[8px]"} text-[11px] rounded-full px-[5px] py-[1px]`}
          style={{ backgroundColor: "rgba(30,30,30,0.9)" }}
        >
          {msg.reaction}
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Touch indicator (iOS developer mode style) ───

function TouchIndicator({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      initial={{ opacity: 0.5, scale: 0.3 }}
      animate={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute pointer-events-none z-50"
      style={{
        left: x,
        top: y,
        width: 28,
        height: 28,
        marginLeft: -14,
        marginTop: -14,
        borderRadius: "50%",
        backgroundColor: "rgba(255,255,255,0.35)",
        boxShadow: "0 0 8px rgba(255,255,255,0.2)",
      }}
    />
  );
}

// ─── Persistent reply keyboard (Telegram-style) ───

type KBPage = "main" | "commands";

interface KBButton {
  label: string;
  id: string;
}

const KB_MAIN: KBButton[][] = [
  [
    { label: "dev ⚙️", id: "dev" },
    { label: "jim 💤", id: "jim" },
    { label: "tim ✅", id: "tim" },
  ],
  [
    { label: "⏹ stop", id: "stop" },
    { label: "☠ kill", id: "kill" },
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
    { label: "Model ›", id: "model" },
    { label: "« Back", id: "back" },
  ],
];

interface TouchPoint {
  x: number;
  y: number;
  key: number;
}

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
          updateMessage(msgId, (m) => ({ ...m, reaction: "👀" }));
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
          statusEmoji: "gear",
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
            statusEmoji: "checkmark",
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
          updateMessage(msgId, (m) => ({ ...m, reaction: "👀" }));
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
          statusEmoji: "gear",
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
          statusEmoji: "lock",
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
        // Row centers: row0=16, row1=43, row2=70 (see geometry notes in plan)
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
          content: "🎛 Commands",
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
          updateMessage(msgId, (m) => ({ ...m, reaction: "✅" }));
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
          statusEmoji: "refresh",
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
          statusEmoji: "package",
          statusVerb: "Compacted: 73% → 42%",
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
            <div className="w-[272px] sm:w-[290px]">
              {/* iPhone frame — 9:19.5 aspect ratio matches iPhone 15 Pro */}
              <div
                className="rounded-[2.5rem] border-[3px] overflow-hidden shadow-2xl flex flex-col"
                style={{
                  borderColor: "#2a2a2a",
                  backgroundColor: TG.chatBg,
                  aspectRatio: "9 / 19.5",
                }}
              >
                {/* Dynamic Island */}
                <div className="flex justify-center pt-[5px] pb-[2px] shrink-0" style={{ backgroundColor: TG.chatBg }}>
                  <div className="w-[72px] h-[20px] bg-black rounded-full border border-[#1a1a1a]" />
                </div>

                {/* Status bar */}
                <div className="shrink-0">
                  <StatusBar />
                </div>

                {/* Telegram header */}
                <div className="shrink-0">
                  <TelegramNav />
                </div>

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
