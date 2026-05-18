"use client";

import { motion } from "framer-motion";

// ─── Telegram iOS Dark theme colors (from TelegramMessenger/Telegram-iOS source) ───
export const TG = {
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

// ─── Dynamic message model ───

export interface ToolEntry {
  status: "done" | "pending";
  verb: string;
  target: string;
}

export type StatusEmoji = "gear" | "checkmark" | "lock" | "refresh" | "package";

export interface ChatMessage {
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
  dashboardLines?: string[];
}

// ─── Constants ───
export const CHAR_DELAY = 45;

// ─── SVG bubble tails ───

export function TailIn() {
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

export function TailOut() {
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

export function StatusBar() {
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

export function TelegramNav() {
  return (
    <div
      className="flex items-center gap-1 px-1 py-[5px]"
      style={{ backgroundColor: TG.headerBg, borderBottom: `0.5px solid ${TG.separator}` }}
    >
      <div className="flex items-center gap-0 pl-0.5 shrink-0">
        <svg width="7" height="12" viewBox="0 0 10 17" fill="none">
          <path d="M9 1L2 8.5L9 16" stroke={TG.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[11px] ml-[-1px]" style={{ color: TG.accent }}>Back</span>
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

export function DateSeparator() {
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

export function InlineKeyboard() {
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

export function TelegramInput({ text }: { text: string }) {
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

export function statusEmojiStr(emoji: StatusEmoji | undefined): string {
  switch (emoji) {
    case "gear": return "\u2699\uFE0F";
    case "checkmark": return "\u2705";
    case "lock": return "\uD83D\uDD10";
    case "refresh": return "\uD83D\uDD04";
    case "package": return "\uD83D\uDCE6";
    default: return "";
  }
}

// ─── Single message bubble ───

export function Bubble({ msg }: { msg: ChatMessage }) {
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
                {msg.elapsedSeconds !== undefined && msg.elapsedSeconds >= 2 ? `\u2026 ${msg.elapsedSeconds}s` : msg.statusEmoji === "gear" ? "\u2026" : ""}
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
                  {entry.status === "done" ? "\u2705" : "\u23F3"}{" "}
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

          {/* Dashboard lines (monospace key-value block) */}
          {msg.dashboardLines && msg.dashboardLines.length > 0 && (
            <div className="mt-[3px] space-y-[0px]">
              {msg.dashboardLines.map((line, i) => (
                <div
                  key={i}
                  className="text-[10px] font-mono leading-[14px] whitespace-pre"
                  style={{ color: TG.meta }}
                >
                  {line}
                </div>
              ))}
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

export interface TouchPoint {
  x: number;
  y: number;
  key: number;
}

export function TouchIndicator({ x, y }: { x: number; y: number }) {
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

// ─── iPhone frame wrapper ───

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[272px] sm:w-[290px]">
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

        {children}
      </div>
    </div>
  );
}
