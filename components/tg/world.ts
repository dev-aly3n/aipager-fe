/**
 * The world of the demo: your Telegram (family, friends, the team, aipager)
 * and the terminal where Claude Code runs. A story of timed steps edits it;
 * the reader can open chats and tap buttons at any point.
 *
 * What the aipager chat does mirrors the real bot: one busy card per turn
 * that edits itself, the same message turning into a permission prompt (an
 * edit, so silent), a nudge reply while it waits (that one notifies), a
 * one-line reply under the card for every tap, and the answer as its own
 * message when the turn ends.
 */

export type Tone = "fg" | "dim" | "accent" | "live" | "amber" | "deny" | "claude";

export interface TLine {
  text: string;
  tone?: Tone;
  sub?: boolean;
  dot?: Tone;
  bold?: boolean;
  /** something you typed: Claude Code gives it a block of its own */
  user?: boolean;
  /** the handle it arrived from, when aipager typed it in for someone */
  via?: string;
}

export interface TDialog {
  kind: "perm" | "question";
  title: string;
  body: string[];
  options: string[];
  selected: number;
}

export interface Pane {
  id: string;
  lines: TLine[];
  /** the spinner's verb while Claude works, and how long it has */
  spinner: string | null;
  secs: number;
  dialog: TDialog | null;
  input: string;
  status: string;
  /** launched with --dangerously-skip-permissions (Auto mode) */
  bypass?: boolean;
}

export type CardItem =
  /** Claude's own words, which the card quotes */
  | { type: "prose"; text: string }
  | { type: "row"; text: string; done: boolean }
  /** a settled run of tool calls, folded away behind one line */
  | { type: "fold"; n: number };

export type Prompt =
  | { kind: "perm"; tool: string; what: string; command: string; answered: boolean }
  | { kind: "question"; question: string; options: string[]; answered: number | null };

export type Msg =
  | { id: string; kind: "day"; text: string }
  | { id: string; kind: "text"; from: string; text: string; time: string; reaction?: string; ticks?: 1 | 2; reply?: { name: string; text: string } }
  | { id: string; kind: "card"; session: string; items: CardItem[]; mark: "⏳" | "✅" | "🔐" | "❓"; verb: string; elapsed: number; tally: string; prompt: Prompt | null; time: string }
  | { id: string; kind: "answer"; session: string; text: string; time: string; reaction?: string }
  /** a bot message with buttons (the /mode confirmation); answering edits it in place */
  | { id: string; kind: "confirm"; text: string; note: string; buttons: string[]; answered: number | null; done: string | null; time: string };

export type ChatId = "aipager" | "team" | "mom" | "friends" | "sara" | "saved";
export type Folder = "all" | "personal" | "work" | "bots";

export interface Chat {
  id: ChatId;
  name: string;
  kind: "bot" | "dm" | "group" | "saved";
  folder: Exclude<Folder, "all">;
  color: string;
  initials: string;
  subtitle: string;
  pinned: boolean;
  muted: boolean;
  unread: number;
  /** who is typing, shown in the list and the header */
  typing: string | null;
  /** newest activity first; bumped by new messages, not by edits */
  order: number;
  pinnedBar: string | null;
  msgs: Msg[];
}

export interface Note {
  id: string;
  chat: ChatId;
  title: string;
  body: string;
}

/**
 * The three permission modes of aipager 1.1+. Auto is what a new session
 * starts in; what used to be called Auto (no checks at all) is Full access.
 */
export type Mode = "ask" | "auto" | "full";

/**
 * What travels down the cable for a step: the hook name that leaves one end
 * and what lands at the other. The story announces it, the step itself is
 * held back until the charge arrives, so the chat changes on impact.
 */
export interface Spark {
  dir: "out" | "back";
  from: string;
  to: string;
  tone: "hook" | "perm" | "verdict" | "quiet";
}

export interface World {
  mode: Mode;
  /** the terminal tab in front, by pane id */
  term: string;
  chats: Record<ChatId, Chat>;
  open: ChatId;
  folder: Folder;
  draft: string;
  notes: Note[];
  panes: Pane[];
  caption: string;
  seq: number;
}

/** People and their colours (Telegram's own peer palette). */
export const PEOPLE: Record<string, { name: string; color: string }> = {
  me: { name: "You", color: "#65aadd" },
  mom: { name: "Mom", color: "#ee7aae" },
  sara: { name: "Sara", color: "#b18cff" },
  sam: { name: "Sam", color: "#faa774" },
  leo: { name: "Leo", color: "#7bc862" },
  nima: { name: "Nima", color: "#6ec9cb" },
  omid: { name: "Omid", color: "#ff7a7a" },
  bot: { name: "aipager", color: "#3fa9f5" },
};

const SHELL = "~/work/api $ ";

export function initialWorld(mode: Mode = "auto"): World {
  // Every evening starts the same way: a session resting in the other room,
  // and you about to give it the next job from the sofa.
  const w = askWorld();
  w.mode = mode;
  w.open = "aipager";
  w.caption =
    mode === "auto"
      ? "A Claude Code session resting on your laptop, in Auto mode — where every new session starts."
      : mode === "ask"
        ? "A Claude Code session resting on your laptop, in Ask mode: it asks before every action."
        : "A Claude Code session resting on your laptop. Before the next job, you take its checks off.";
  const p = w.panes[0];
  p.lines = [
    { text: SHELL + "aipager session api", tone: "dim" },
    { text: "✻ Welcome to Claude Code!", tone: "claude", bold: true },
    { text: "expire idle sessions after 30 minutes", user: true, via: "@owner" },
    { text: "Done. The session store now expires idle sessions after 30 minutes; 212 tests pass.", dot: "fg" },
  ];
  p.spinner = null;
  p.secs = 0;
  w.chats.aipager.pinnedBar = pinBar(w);
  return w;
}

function askWorld(): World {
  return {
    mode: "ask",
    term: "api",
    open: "aipager",
    folder: "all",
    draft: "",
    notes: [],
    seq: 0,
    caption: "A flaky login test, running on your machine.",
    panes: [
      {
        id: "api",
        lines: [
          { text: SHELL + "aipager session api", tone: "dim" },
          { text: "✻ Welcome to Claude Code!", tone: "claude", bold: true },
          { text: "fix the flaky login e2e test", user: true, via: "@owner" },
          { text: "I'll run the login test a few times and look at where it fails.", dot: "fg" },
          { text: "Read(e2e/login.spec.ts)", dot: "live", bold: true },
          { text: "Read 64 lines", sub: true, tone: "dim" },
        ],
        spinner: "Tinkering",
        secs: 192,
        dialog: null,
        input: "",
        status: "[api] Sonnet 5.5 | 12% ctx | $0.14",
      },
      {
        // The team's session, open and waiting for its next job.
        id: "web",
        lines: [
          { text: "~/work/web $ aipager session web", tone: "dim" },
          { text: "✻ Welcome to Claude Code!", tone: "claude", bold: true },
        ],
        spinner: null,
        secs: 0,
        dialog: null,
        input: "",
        status: "[web] Sonnet 5.5 | 2% ctx | $0.00",
      },
    ],
    chats: {
      aipager: {
        id: "aipager",
        name: "aipager",
        kind: "bot",
        folder: "bots",
        color: "#3fa9f5",
        initials: "ai",
        subtitle: "bot",
        pinned: true,
        muted: false,
        unread: 0,
        typing: null,
        order: 100,
        pinnedBar: "⚙️ api (working)",
        msgs: [
          { id: "d0", kind: "day", text: "Today" },
          // The turn the terminal still has on screen: your message, then its
          // answer. What one side shows, the other shows.
          { id: "old-u", kind: "text", from: "me", text: "expire idle sessions after 30 minutes", time: "18:36", ticks: 2 },
          { id: "old", kind: "answer", session: "api", text: "Done. The session store now expires idle sessions after 30 minutes; 212 tests pass.", time: "18:40" },
        ],
      },
      team: {
        id: "team",
        name: "backend-team",
        kind: "group",
        folder: "work",
        color: "#faa774",
        initials: "BT",
        subtitle: "5 members, 3 online",
        pinned: false,
        muted: false,
        unread: 2,
        typing: null,
        order: 90,
        pinnedBar: null,
        msgs: [
          { id: "d0", kind: "day", text: "Today" },
          { id: "t1", kind: "text", from: "sara", text: "prod login is flaky again 😬 anyone?", time: "21:02" },
          { id: "t2", kind: "text", from: "sam", text: "saw it too, twice in the last hour", time: "21:03" },
        ],
      },
      mom: {
        id: "mom",
        name: "Mom",
        kind: "dm",
        folder: "personal",
        color: "#ee7aae",
        initials: "M",
        subtitle: "online",
        pinned: false,
        muted: false,
        unread: 0,
        typing: null,
        order: 80,
        pinnedBar: null,
        msgs: [
          { id: "d0", kind: "day", text: "Today" },
          { id: "m1", kind: "text", from: "mom", text: "Did you eat? 🙂", time: "20:58" },
        ],
      },
      friends: {
        id: "friends",
        name: "Friday 5-a-side ⚽",
        kind: "group",
        folder: "personal",
        color: "#7bc862",
        initials: "F5",
        subtitle: "9 members",
        pinned: false,
        muted: true,
        unread: 3,
        typing: null,
        order: 70,
        pinnedBar: null,
        msgs: [
          { id: "d0", kind: "day", text: "Today" },
          { id: "f1", kind: "text", from: "leo", text: "pitch booked, friday 7pm", time: "19:12" },
          { id: "f2", kind: "text", from: "nima", text: "in 🙋", time: "19:20" },
          { id: "f3", kind: "text", from: "omid", text: "in, bringing the new ball", time: "19:41" },
        ],
      },
      sara: {
        id: "sara",
        name: "Sara",
        kind: "dm",
        folder: "work",
        color: "#b18cff",
        initials: "S",
        subtitle: "last seen recently",
        pinned: false,
        muted: false,
        unread: 0,
        typing: null,
        order: 60,
        pinnedBar: null,
        msgs: [
          { id: "d0", kind: "day", text: "Yesterday" },
          { id: "s1", kind: "text", from: "me", text: "merged your PR 🚀", time: "17:30", ticks: 2 },
          { id: "s2", kind: "text", from: "sara", text: "thanks!!", time: "17:31" },
        ],
      },
      saved: {
        id: "saved",
        name: "Saved Messages",
        kind: "saved",
        folder: "personal",
        color: "#3fa9f5",
        initials: "★",
        subtitle: "",
        pinned: false,
        muted: false,
        unread: 0,
        typing: null,
        order: 50,
        pinnedBar: null,
        msgs: [
          { id: "d0", kind: "day", text: "Monday" },
          { id: "v1", kind: "text", from: "me", text: "curl -fsSL aipager.run/install | sh", time: "10:02", ticks: 2 },
          { id: "v2", kind: "text", from: "me", text: "aipager config", time: "10:03", ticks: 2 },
        ],
      },
    },
  };
}

/* ---------------- editing the world ---------------- */

export function card(w: World, chat: ChatId, id: string): Extract<Msg, { kind: "card" }> {
  const m = w.chats[chat].msgs.find((x) => x.id === id);
  if (!m || m.kind !== "card") throw new Error(`no card ${id} in ${chat}`);
  return m;
}

export function msg(w: World, chat: ChatId, id: string): Msg {
  const m = w.chats[chat].msgs.find((x) => x.id === id);
  if (!m) throw new Error(`no message ${id} in ${chat}`);
  return m;
}

/**
 * The pinned bar's first line. One live session is named; several are
 * counted — the shape aipager uses in a chat with more than one.
 */
export function pinBar(w: World, needs?: string): string {
  if (needs) return `⏳ api needs you - ${needs}`;
  const live = w.panes.length;
  const working = w.panes.filter((p) => p.spinner).length;
  if (live === 1) return working ? `⚙️ ${w.panes[0].id} (working)` : `💤 ${w.panes[0].id} (idle)`;
  if (working === 0) return "💤 all idle";
  if (working === live) return `⚙️ ${working} working`;
  return `⚙️ ${working} working · ${live - working} idle`;
}

export function pane(w: World, id: string): Pane {
  const p = w.panes.find((x) => x.id === id);
  if (!p) throw new Error(`no pane ${id}`);
  return p;
}

const top = (w: World): number => Math.max(...Object.values(w.chats).map((c) => c.order)) + 1;

/** A new message: to the top of the list, unread (and a notification) unless the chat is open. */
export function arrive(w: World, chat: ChatId, m: Msg, notify?: { title: string; body: string }): void {
  const c = w.chats[chat];
  c.msgs.push(m);
  c.typing = null;
  if (!c.pinned) c.order = top(w);
  const mine = m.kind === "text" && m.from === "me";
  if (w.open !== chat && !mine) {
    c.unread += 1;
    if (!c.muted && notify) {
      w.seq += 1;
      w.notes = [...w.notes.slice(-1), { id: `n${w.seq}`, chat, ...notify }];
    }
  }
}

export function open(w: World, chat: ChatId): void {
  w.open = chat;
  w.chats[chat].unread = 0;
  w.draft = "";
}

/** The text a chat row shows under its name. */
export function preview(c: Chat): string {
  const m = [...c.msgs].reverse().find((x) => x.kind !== "day");
  if (!m) return "";
  const who = (from: string) => (c.kind === "group" && from !== "me" ? `${PEOPLE[from]?.name ?? from}: ` : from === "me" && c.kind !== "saved" ? "You: " : "");
  switch (m.kind) {
    case "text":
      return who(m.from) + m.text;
    case "card": {
      const head = c.kind === "group" ? "aipager: " : "";
      if (m.prompt?.kind === "perm") return `${head}🔐 ${m.session} · Permission needed`;
      if (m.prompt?.kind === "question") return `${head}❓ ${m.session} · ${m.prompt.question}`;
      // The list shows the card's own newest line, as Telegram does.
      const last = [...m.items].reverse().find((x) => x.type === "prose" || x.type === "row");
      if (!last) return `${head}${m.mark} ${m.session} · ${m.verb}`;
      return head + (last.type === "prose" ? last.text : `${m.mark} ${last.text}`);
    }
    case "answer":
      return `${c.kind === "group" ? "aipager: " : ""}💬 ${m.session} · ${m.text}`;
    case "confirm":
      return m.done ?? m.text;
    default:
      return "";
  }
}

/**
 * The clock aipager puts on a card since 1.1: `0:45`, `4:10`, `1:23:00`.
 * (The terminal pane keeps Claude Code's own `3m 16s`, which is its UI.)
 */
export const fmtClock = (s: number): string => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
};

export const fmtElapsed = (s: number): string =>
  s < 60 ? `${s}s` : s < 3600 ? `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s` : `${Math.floor(s / 3600)}h ${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}m`;
