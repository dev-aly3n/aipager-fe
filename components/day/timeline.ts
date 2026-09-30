/**
 * One day with aipager: the moments it pages you, and what each session was
 * doing in between. Every message mirrors something the real bot sends.
 */

export type Card =
  | { kind: "hero" }
  | { kind: "terminal"; lines: { text: string; tone?: "dim" | "claude" | "live" | "accent" }[] }
  | { kind: "chat"; busy: string; text: string }
  | { kind: "notify"; title: string; body?: string; code?: string; buttons: string[]; cols: 1 | 2; done: string; main: number }
  | { kind: "voice"; transcript: string; busy: string }
  | { kind: "stack"; items: { title: string; body: string }[] }
  | { kind: "status"; pinned: string; rows: { name: string; state: string; ctx: string; cost: string }[] }
  | { kind: "app" }
  | { kind: "night"; finished: string; pinned: string };

export interface Moment {
  id: string;
  h: number;
  time: string;
  place: string;
  title: string;
  body: string;
  under: string;
  card: Card;
}

export const MOMENTS: Moment[] = [
  { id: "dawn", h: 7.5, time: "07:30", place: "", title: "", body: "", under: "", card: { kind: "hero" } },
  {
    id: "kitchen",
    h: 8.05,
    time: "08:03",
    place: "Kitchen, first coffee",
    title: "Start it, then leave it.",
    body: "One command hands Claude a task inside dtach, a tiny detacher that keeps the session alive with no terminal open. Close the window, drop SSH, take the coffee to go.",
    under: "aipager session api  →  claude-api, running under dtach",
    card: {
      kind: "terminal",
      lines: [
        { text: "~/work/api $ aipager session api", tone: "dim" },
        { text: "✻ Welcome to Claude Code!", tone: "claude" },
        { text: "> migrate the auth tokens to the new expiry format" },
        { text: "⏺ Read(src/auth/session.ts)", tone: "live" },
        { text: "✻ Pondering… (6s · esc to interrupt)", tone: "claude" },
        { text: "[detached from claude-api]", tone: "accent" },
      ],
    },
  },
  {
    id: "train",
    h: 8.68,
    time: "08:41",
    place: "On the train",
    title: "Thought of something? Send it.",
    body: "Your message is typed straight into the session, even mid-turn: send three and Claude queues them itself, like typing at the desk. 👀 means it reached the session, 👍 means Claude picked it up.",
    under: "Telegram  →  keystrokes into the session  →  UserPromptSubmit",
    card: { kind: "chat", busy: "⏳ api · Pondering · 38m · Read ×6 · Edit ×2", text: "also update the CHANGELOG when you're done" },
  },
  {
    id: "meeting",
    h: 10.25,
    time: "10:15",
    place: "In a meeting",
    title: "One tap under the table.",
    body: "Claude reaches a command it has to ask about. aipager's hook holds the call while your phone shows the real command; Allow answers the hook directly, without touching the terminal, and lands in the audit log.",
    under: "PermissionRequest  →  verdict: allow",
    card: {
      kind: "notify",
      title: "🔐 api · Permission needed",
      body: "Bash: Run the auth tests",
      code: "pnpm test src/auth",
      buttons: ["✅ Allow", "❌ Deny", "🟢 Allow always", "⏹ Stop"],
      cols: 2,
      main: 0,
      done: "✅ [api] · Allowed · Bash: pnpm test src/auth",
    },
  },
  {
    id: "lunch",
    h: 12.5,
    time: "12:30",
    place: "Lunch",
    title: "It asks. You pick.",
    body: "When Claude needs a decision it asks with AskUserQuestion, and aipager turns each option into a button, checkboxes where several are allowed. A button from a turn that already ended refuses instead of answering the wrong question.",
    under: "AskUserQuestion  →  arrow keys and Enter into Claude's dialog",
    card: {
      kind: "notify",
      title: "❓ api · Which module should own the expiry check?",
      buttons: ["token.ts", "session.ts", "A shared helper"],
      cols: 1,
      main: 2,
      done: "✅ [api] · Answered · {choice}",
    },
  },
  {
    id: "walk",
    h: 14.08,
    time: "14:05",
    place: "Walking back",
    title: "Hands full? Talk.",
    body: "Send a voice note. It is transcribed on your own machine and typed in as the next prompt; the audio never leaves it. Voice is an optional extra you can install from the chat.",
    under: "voice note  →  local Whisper  →  prompt",
    card: { kind: "voice", busy: "⏳ api · Editing · 1h 52m · Edit ×7 · Bash ×3", transcript: "when the tests are green, start on the rate limiter" },
  },
  {
    id: "coffee",
    h: 16.33,
    time: "16:20",
    place: "Coffee, round two",
    title: "It warns you before it forgets.",
    body: "Long sessions fill their context. aipager tells you when compaction is near and again when it's done, and it flags a stalled turn or a session that ended, so nothing dies quietly.",
    under: "PreCompact  →  PostCompact",
    card: {
      kind: "stack",
      items: [
        { title: "api", body: "Context at 82% · auto-compact soon" },
        { title: "api", body: "Compacting" },
        { title: "api", body: "Compacted: 82% → 4%" },
      ],
    },
  },
  {
    id: "gym",
    h: 18.75,
    time: "18:45",
    place: "Between sets",
    title: "Three sessions, one glance.",
    body: "/new starts another from chat: name, mode, model, folder. /status lists them all, the pinned bar says who needs you, and /web run the build prompts one without switching.",
    under: "one daemon, one socket per session",
    card: {
      kind: "status",
      pinned: "⏳ web needs you - Bash: npm run build",
      rows: [
        { name: "api", state: "💤 idle", ctx: "23%", cost: "$1.12" },
        { name: "docs", state: "⚙️ working", ctx: "41%", cost: "$0.64" },
        { name: "web", state: "⏳ needs you", ctx: "17%", cost: "$0.38" },
      ],
    },
  },
  {
    id: "sofa",
    h: 21.17,
    time: "21:10",
    place: "On the sofa",
    title: "Read the day's diffs.",
    body: "/app opens the Mini App inside Telegram: a tile per session with its context ring and cost, a tray for whatever needs you, and a diff for every Write and Edit. The daemon serves it itself, and checks every request against Telegram's signature.",
    under: "the Mini App, served by the daemon",
    card: { kind: "app" },
  },
  {
    id: "night",
    h: 23.67,
    time: "23:40",
    place: "Lights out",
    title: "All idle. Sleep well.",
    body: "The last session settles into its summary and the pinned bar reads all idle. Tomorrow, aipager session api --resume picks the conversation back up.",
    under: "SessionEnd  →  💤 all idle",
    card: { kind: "night", finished: "✅ docs · Finished (2h 26m) · Read ×14 · Edit ×9", pinned: "💤 all idle" },
  },
];

export interface Span {
  from: number;
  to: number;
  waiting?: boolean;
}

export const SESSIONS: { name: string; color: string; spans: Span[] }[] = [
  {
    name: "api",
    color: "#3fa9f5",
    spans: [
      { from: 8.05, to: 10.25 },
      { from: 10.25, to: 10.34, waiting: true },
      { from: 10.34, to: 12.5 },
      { from: 12.5, to: 12.58, waiting: true },
      { from: 12.58, to: 13.7 },
      { from: 14.1, to: 17.0 },
    ],
  },
  {
    name: "docs",
    color: "#35c07f",
    spans: [
      { from: 13.0, to: 17.6 },
      { from: 21.2, to: 23.62 },
    ],
  },
  {
    name: "web",
    color: "#a07bf0",
    spans: [
      { from: 17.2, to: 18.72 },
      { from: 18.72, to: 18.86, waiting: true },
      { from: 18.86, to: 20.2 },
    ],
  },
];

export const DAY_END = 24;
const HOURS = [...MOMENTS.map((m) => m.h), DAY_END];

const smooth = (u: number): number => u * u * (3 - 2 * u);

/** The hour at scroll progress p (0..1) through the day: slow at each moment, quick between. */
export function hourAt(p: number): number {
  const n = HOURS.length - 1;
  const x = Math.min(n, Math.max(0, p * n));
  const i = Math.min(n - 1, Math.floor(x));
  return HOURS[i] + (HOURS[i + 1] - HOURS[i]) * smooth(x - i);
}

/** The moment being told at progress p. */
export function momentAt(p: number): number {
  const n = HOURS.length - 1;
  return Math.min(MOMENTS.length - 1, Math.max(0, Math.round(p * n)));
}

export const clock = (h: number): string => {
  const m = Math.floor((h % 24) * 60);
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};
