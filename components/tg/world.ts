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

import type { Dict } from "@/lib/i18n";
import { fill, type BotStrings } from "@/lib/i18n/bot";

export type Tone = "fg" | "dim" | "accent" | "live" | "amber" | "deny" | "claude";

/** One row of Claude Code's agent block: its type, what it was asked, and
 *  its running tally. */
export interface TAgent {
  type: string;
  desc: string;
  uses?: number;
  tokens?: string;
  last: string;
}

export interface TLine {
  text: string;
  /** the ⏺ Running N agents… block, with a row per agent */
  agents?: { done: boolean; rows: TAgent[] };
  tone?: Tone;
  sub?: boolean;
  dot?: Tone;
  bold?: boolean;
  /** something you typed: Claude Code gives it a block of its own */
  user?: boolean;
  /** the handle it arrived from, when aipager typed it in for someone */
  via?: string;
  /**
   * In a group the marker carries the sender's role as well: the prompt
   * runs with it, and Claude can see whose rules it is under.
   */
  role?: string;
  /**
   * Still in Claude's own queue. Claude Code renders a queued prompt in its
   * dim colour and switches it to the normal one when it takes it.
   */
  queued?: boolean;
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
  /** what the spinner's token counter reads */
  tokens?: string;
  dialog: TDialog | null;
  input: string;
  status: string;
  /** launched with --dangerously-skip-permissions (Auto mode) */
  bypass?: boolean;
  /** subagents and background shells this session has running */
  agents?: number;
  shells?: number;
  /** Claude Code's agents panel under the prompt, one row per agent */
  panel?: { name: string; what: string; clock: string; tokens: string }[];
}

export type CardItem =
  /** Claude's own words, which the card quotes */
  | { type: "prose"; text: string }
  | { type: "row"; text: string; done: boolean }
  /** a settled run of tool calls, folded away behind one line */
  | { type: "fold"; n: number }
  /**
   * A subagent's row. The card keeps a flat list in the order the agents
   * started, each one `🤖 <type> · <its latest tool call> · <clock>`, and
   * settles it in place. `fold` is that agent's own tool calls, which hide
   * behind one line once there are three.
   */
  | { type: "agent"; name: string; parent?: string; state: "run" | "done"; what: string; calls?: number; fold?: number; secs: number }
  /** a command Claude left running in the background, with its own clock */
  | { type: "shell"; what: string; state: "run" | "done"; secs: number };

/**
 * What an answer says about work that outlived its turn: the counts, a row
 * per agent, and the promise; or, once they have all stopped, one line.
 */
export interface Background {
  agents: number;
  shells: number;
  rows: { name: string; nested?: boolean; what?: string; state: "run" | "wait" | "done"; clock?: string }[];
  /** the product's own line about what is still to come, when it applies */
  promise: string | null;
  /** set once everything has stopped; replaces the block */
  done?: string;
}

export type Prompt =
  | { kind: "perm"; tool: string; what: string; command: string; answered: boolean }
  | { kind: "question"; question: string; options: string[]; answered: number | null };

export type Msg =
  | { id: string; kind: "day"; text: string }
  | { id: string; kind: "text"; from: string; text: string; time: string; reaction?: string; ticks?: 1 | 2; reply?: { name: string; text: string }; queued?: boolean }
  | { id: string; kind: "card"; session: string; items: CardItem[]; mark: "⏳" | "✅" | "🔐" | "❓" | "🔄"; verb: string; elapsed: number; tally: string; prompt: Prompt | null; time: string }
  | { id: string; kind: "answer"; session: string; text: string; time: string; reaction?: string; background?: Background }
  /** a bot message with buttons (the /mode confirmation); answering edits it in place */
  | { id: string; kind: "confirm"; text: string; note: string; buttons: string[]; answered: number | null; done: string | null; time: string }
  /**
   * The line aipager replies with under a message Claude Code has queued,
   * with the button that hands it over now. It is deleted, with the 👀, the
   * moment Claude takes the message.
   */
  | { id: string; kind: "queue"; text: string; button: string; time: string; reply: { name: string; text: string } };

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
  /** the subtitle means they are here now, whatever the language calls it */
  online?: boolean;
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
  /** the composer is answering this message, Telegram's reply mode */
  replyTo?: { id: string; name: string; text: string } | null;
  /** a message being pressed, for the tap it flashes back */
  press?: string | null;
  /** the menu Telegram opens on a message; `on` is the item under the finger */
  menu?: { msg: string; items: string[]; on: number } | null;
  /** bring this message into view, smoothly */
  focus?: string | null;
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

export function initialWorld(t: Dict, bot: BotStrings, mode: Mode = "auto"): World {
  // Every evening starts the same way: a session resting in the other room,
  // and you about to give it the next job from the sofa.
  const w = askWorld(t, bot);
  w.mode = mode;
  w.open = "aipager";
  w.caption = mode === "auto" ? t.demo.captions.restAuto : mode === "ask" ? t.demo.captions.restAsk : t.demo.captions.restFull;
  const p = w.panes[0];
  p.lines = [
    { text: SHELL + "aipager session api", tone: "dim" },
    { text: "✻ Welcome to Claude Code!", tone: "claude", bold: true },
    { text: t.demo.seed.oldPrompt, user: true, via: "@owner" },
    { text: t.demo.seed.oldAnswer, dot: "fg" },
  ];
  p.spinner = null;
  p.secs = 0;
  w.chats.aipager.pinnedBar = pinBar(w, bot);
  return w;
}

function askWorld(t: Dict, bot: BotStrings): World {
  return {
    mode: "ask",
    term: "api",
    open: "aipager",
    folder: "all",
    draft: "",
    notes: [],
    seq: 0,
    caption: t.demo.captions.restAsk,
    panes: [
      {
        id: "api",
        lines: [
          { text: SHELL + "aipager session api", tone: "dim" },
          { text: "✻ Welcome to Claude Code!", tone: "claude", bold: true },
          { text: t.demo.prompts.fix, user: true, via: "@owner" },
          { text: t.demo.claude.plan, dot: "fg" },
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
        name: t.demo.chats.aipager.name,
        kind: "bot",
        folder: "bots",
        color: "#3fa9f5",
        initials: "ai",
        subtitle: t.demo.chats.aipager.subtitle,
        pinned: true,
        muted: false,
        unread: 0,
        typing: null,
        order: 100,
        pinnedBar: fill(bot.tpl.pinWorking, { session: "api" }),
        msgs: [
          { id: "d0", kind: "day", text: t.demo.days.today },
          // The turn the terminal still has on screen: your message, then its
          // answer. What one side shows, the other shows.
          { id: "old-u", kind: "text", from: "me", text: t.demo.seed.oldPrompt, time: "18:36", ticks: 2 },
          { id: "old", kind: "answer", session: "api", text: t.demo.seed.oldAnswer, time: "18:40" },
        ],
      },
      team: {
        id: "team",
        name: t.demo.chats.team.name,
        kind: "group",
        folder: "work",
        color: "#faa774",
        initials: "BT",
        subtitle: t.demo.chats.team.subtitle,
        pinned: false,
        muted: false,
        unread: 2,
        typing: null,
        order: 90,
        pinnedBar: null,
        msgs: [
          { id: "d0", kind: "day", text: t.demo.days.today },
          { id: "t1", kind: "text", from: "sara", text: t.demo.seed.teamFlaky, time: "21:02" },
          { id: "t2", kind: "text", from: "sam", text: t.demo.seed.teamSaw, time: "21:03" },
        ],
      },
      mom: {
        id: "mom",
        name: t.demo.chats.mom.name,
        kind: "dm",
        folder: "personal",
        color: "#ee7aae",
        initials: "M",
        subtitle: t.demo.chats.mom.subtitle,
        online: true,
        pinned: false,
        muted: false,
        unread: 0,
        typing: null,
        order: 80,
        pinnedBar: null,
        msgs: [
          { id: "d0", kind: "day", text: t.demo.days.today },
          { id: "m1", kind: "text", from: "mom", text: t.demo.seed.momEat, time: "20:58" },
        ],
      },
      friends: {
        id: "friends",
        name: t.demo.chats.friends.name,
        kind: "group",
        folder: "personal",
        color: "#7bc862",
        initials: "F5",
        subtitle: t.demo.chats.friends.subtitle,
        pinned: false,
        muted: true,
        unread: 3,
        typing: null,
        order: 70,
        pinnedBar: null,
        msgs: [
          { id: "d0", kind: "day", text: t.demo.days.today },
          { id: "f1", kind: "text", from: "leo", text: t.demo.seed.friendsPitch, time: "19:12" },
          { id: "f2", kind: "text", from: "nima", text: t.demo.seed.friendsIn, time: "19:20" },
          { id: "f3", kind: "text", from: "omid", text: t.demo.seed.friendsBall, time: "19:41" },
        ],
      },
      sara: {
        id: "sara",
        name: t.demo.chats.sara.name,
        kind: "dm",
        folder: "work",
        color: "#b18cff",
        initials: "S",
        subtitle: t.demo.chats.sara.subtitle,
        pinned: false,
        muted: false,
        unread: 0,
        typing: null,
        order: 60,
        pinnedBar: null,
        msgs: [
          { id: "d0", kind: "day", text: t.demo.days.yesterday },
          { id: "s1", kind: "text", from: "me", text: t.demo.seed.saraMerged, time: "17:30", ticks: 2 },
          { id: "s2", kind: "text", from: "sara", text: t.demo.seed.saraThanks, time: "17:31" },
        ],
      },
      saved: {
        id: "saved",
        name: t.demo.chats.saved.name,
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
          { id: "d0", kind: "day", text: t.demo.days.monday },
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
 * counted: the shape aipager uses in a chat with more than one.
 */
export function pinBar(w: World, bot: BotStrings, needs?: string): string {
  const live = w.panes.length;
  const working = w.panes.filter((p) => p.spinner).length;
  const agents = w.panes.reduce((n, p) => n + (p.agents ?? 0), 0);
  const running = agents ? fill(bot.tpl.pinRunning, { running: agents === 1 ? bot.count.agents1 : bot.count.agents2 }) : "";
  const tail = running ? ` ${running}` : "";
  if (needs) return fill(bot.tpl.pinWaiting, { session: "api", summary: needs });
  if (live === 1) {
    const one = working ? bot.tpl.pinWorking : bot.tpl.pinOneIdle;
    return fill(one, { session: w.panes[0].id }) + tail;
  }
  if (working === 0) return bot.tpl.pinIdle + tail;
  const counts = [
    working === 1 ? bot.count.working1 : bot.count.working2,
    live - working > 0 ? (live - working === 1 ? bot.count.idle1 : bot.count.idle2) : "",
  ]
    .filter(Boolean)
    .join(" · ");
  return fill(bot.tpl.pinCounts, { glyph: "⚙️", counts }) + tail;
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

/** aipager deleting one of its own messages. */
export function drop(w: World, chat: ChatId, id: string): void {
  const c = w.chats[chat];
  c.msgs = c.msgs.filter((x) => x.id !== id);
}

/**
 * Claude took a message mid-turn, so the turn's card belongs under *that*
 * message. Telegram cannot move a message, so aipager sends the same card
 * again at the bottom and deletes the old copy, which is what this is: the
 * card keeps its own object, so its clock and timeline carry straight on,
 * and the demo animates the move instead of blinking it.
 */
export function moveCard(w: World, chat: ChatId, id: string): void {
  const c = w.chats[chat];
  const i = c.msgs.findIndex((x) => x.id === id);
  if (i < 0) throw new Error(`no card ${id} in ${chat}`);
  c.msgs.push(...c.msgs.splice(i, 1));
}

export function open(w: World, chat: ChatId): void {
  w.open = chat;
  w.chats[chat].unread = 0;
  w.draft = "";
}

/** The text a chat row shows under its name. */
/** Telegram's own list shows a line's words, not its markup. */
const plain = (text: string) => text.replace(/<\/?(?:b|i|code)>/g, "");

export function preview(c: Chat, you: string, needs: string): string {
  return plain(newest(c, you, needs));
}

function newest(c: Chat, you: string, needs: string): string {
  const m = [...c.msgs].reverse().find((x) => x.kind !== "day");
  if (!m) return "";
  const who = (from: string) => (c.kind === "group" && from !== "me" ? `${PEOPLE[from]?.name ?? from}: ` : from === "me" && c.kind !== "saved" ? `${you}: ` : "");
  switch (m.kind) {
    case "text":
      return who(m.from) + m.text;
    case "card": {
      const head = c.kind === "group" ? "aipager: " : "";
      if (m.prompt?.kind === "perm") return `${head}🔐 ${m.session} · ${needs}`;
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
    case "queue":
      return m.text;
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
