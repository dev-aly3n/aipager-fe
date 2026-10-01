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

export type CardItem = { type: "prose"; text: string } | { type: "row"; text: string; done: boolean };

export type Prompt =
  | { kind: "perm"; tool: string; what: string; command: string; answered: boolean }
  | { kind: "question"; question: string; options: string[]; answered: number | null };

export type Msg =
  | { id: string; kind: "day"; text: string }
  | { id: string; kind: "text"; from: string; text: string; time: string; reaction?: string; ticks?: 1 | 2; reply?: { name: string; text: string } }
  | { id: string; kind: "card"; session: string; items: CardItem[]; mark: "⏳" | "✅" | "🔐" | "❓"; verb: string; elapsed: number; tally: string; prompt: Prompt | null; time: string }
  | { id: string; kind: "answer"; session: string; text: string; time: string; reaction?: string }
  /** a bot message with buttons (the /perms confirmation); answering edits it in place */
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

export type Mode = "ask" | "auto";

export interface World {
  mode: Mode;
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

export function initialWorld(mode: Mode = "ask"): World {
  const w = askWorld();
  if (mode === "ask") return w;
  // Auto: the session is idle when the evening starts, and you are in its chat.
  w.mode = "auto";
  w.open = "aipager";
  w.caption = "Auto mode: /perms switches the session so Claude runs tools without asking. Going to Auto asks you to confirm.";
  const p = w.panes[0];
  p.lines = [
    { text: SHELL + "aipager session api", tone: "dim" },
    { text: "✻ Welcome to Claude Code!", tone: "claude", bold: true },
    { text: "> expire idle sessions after 30 minutes", tone: "fg" },
    { text: "Done. The session store now expires idle sessions after 30 minutes; 212 tests pass.", dot: "fg" },
  ];
  p.spinner = null;
  p.secs = 0;
  const a = w.chats.aipager;
  a.msgs = a.msgs.filter((m) => m.id === "d0" || m.id === "old");
  a.pinnedBar = "💤 api (idle)";
  return w;
}

function askWorld(): World {
  return {
    mode: "ask",
    open: "mom",
    folder: "all",
    draft: "",
    notes: [],
    seq: 0,
    caption: "Claude is fixing a flaky test in your terminal. You're catching up with Mom.",
    panes: [
      {
        id: "api",
        lines: [
          { text: SHELL + "aipager session api", tone: "dim" },
          { text: "✻ Welcome to Claude Code!", tone: "claude", bold: true },
          { text: "> fix the flaky login e2e test", tone: "fg" },
          { text: "I'll run the login test a few times and look at where it fails.", dot: "fg" },
          { text: "Read(e2e/login.spec.ts)", dot: "live", bold: true },
          { text: "Read 64 lines", sub: true, tone: "dim" },
        ],
        spinner: "Tinkering",
        secs: 192,
        dialog: null,
        input: "",
        status: "Sonnet 5 · ctx 12% · $0.14",
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
          { id: "old", kind: "answer", session: "api", text: "Done. The session store now expires idle sessions after 30 minutes; 212 tests pass.", time: "18:40" },
          { id: "u1", kind: "text", from: "me", text: "fix the flaky login e2e test", time: "21:01", ticks: 2, reaction: "👍" },
          {
            id: "c1",
            kind: "card",
            session: "api",
            items: [
              { type: "prose", text: "I'll run the login test a few times and look at where it fails." },
              { type: "row", text: "Read: e2e/login.spec.ts", done: true },
            ],
            mark: "⏳",
            verb: "Tinkering",
            elapsed: 192,
            tally: "Read ×1",
            prompt: null,
            time: "21:01",
          },
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
      const first = m.items[0];
      return head + (first ? (first.type === "prose" ? first.text : `${m.mark} ${first.text}`) : `${m.mark} ${m.session} · ${m.verb}`);
    }
    case "answer":
      return `${c.kind === "group" ? "aipager: " : ""}💬 ${m.session} · ${m.text}`;
    case "confirm":
      return m.done ?? m.text;
    default:
      return "";
  }
}

export const fmtElapsed = (s: number): string =>
  s < 60 ? `${s}s` : s < 3600 ? `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s` : `${Math.floor(s / 3600)}h ${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}m`;
