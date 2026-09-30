/**
 * The story's script: one day of Claude Code sessions, played by scroll.
 *
 * Each scene is a list of timed beats that edit the stage (the terminal, the
 * wire and the phone). The stage at any moment is a pure function of the
 * scene and the time spent in it: the end of every earlier scene, plus this
 * scene's beats up to now. Scrolling back therefore shows each scene exactly
 * as it ended, and nothing ever resets or flickers.
 *
 * The phone mirrors what aipager really sends: the busy card that edits
 * itself (prose, tool rows, then its status line), the permission prompt it
 * turns into, the one-line reply under it for every tap, the pinned status
 * bar and the Mini App.
 */

export type Tone = "fg" | "dim" | "accent" | "live" | "amber" | "deny" | "claude";

export interface TLine {
  text: string;
  tone?: Tone;
  /** "⎿" result line under a tool call */
  sub?: boolean;
  /** the ⏺ bullet of a tool call or of Claude speaking */
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
  /** "Pondering… (12s · esc to interrupt)" */
  spinner: string | null;
  dialog: TDialog | null;
  input: string;
  status: string;
}

/** The busy card's timeline, in the order things happened. */
export type CardItem = { type: "prose"; text: string } | { type: "row"; text: string; done: boolean };

export interface PermPrompt {
  kind: "perm";
  tool: string;
  what: string;
  command: string;
  answered: "allow" | null;
}

export interface QuestionPrompt {
  kind: "question";
  question: string;
  options: string[];
  answered: number | null;
}

export type Msg =
  | { id: string; kind: "day"; text: string }
  | { id: string; kind: "me"; text: string; time: string; reaction: "" | "👀" | "👍" }
  | {
      id: string;
      kind: "card";
      session: string;
      items: CardItem[];
      /** "⏳ api · Pondering · 14s · Read ×2" */
      mark: "⏳" | "✅" | "🔐" | "❓";
      verb: string;
      elapsed: number;
      tally: string;
      prompt: PermPrompt | QuestionPrompt | null;
      time: string;
    }
  | { id: string; kind: "reply"; text: string; time: string; quote: string }
  | { id: string; kind: "answer"; session: string; text: string[]; stats: string; time: string }
  | { id: string; kind: "status"; rows: { name: string; state: string; ctx: string; cost: string }[]; time: string }
  | { id: string; kind: "voice"; secs: number; time: string; reaction: "" | "👀" | "👍"; transcript: string }
  | { id: string; kind: "note"; text: string; time: string };

export interface AppTile {
  name: string;
  state: "working" | "idle" | "needs";
  ctx: number;
  model: string;
  cost: string;
  folder: string;
}

export interface StageState {
  panes: Pane[];
  detached: boolean;
  chat: Msg[];
  pinned: string;
  composer: string;
  view: "chat" | "app";
  app: { summary: string; spent: string; tiles: AppTile[]; needs: { name: string; what: string } | null; diff: { file: string; meta: string; lines: { t: string; kind: "ctx" | "del" | "add" }[] } | null };
}

export interface Packet {
  id: string;
  label: string;
  dir: "right" | "left";
  tone: Tone;
}

type Draft = StageState;

/** What the reader chose at the scene's prompt (the auto-play picks `auto`). */
interface Ctx {
  choice: number;
}

interface Beat {
  at: number;
  /** timed from the moment the reader (or the auto-play) answered the scene's prompt */
  afterTap?: boolean;
  run?: (s: Draft, ctx: Ctx) => void;
  packet?: Omit<Packet, "id">;
}

export interface Scene {
  id: string;
  beats: Beat[];
  /** a prompt the reader may answer; it answers itself after `auto` ms */
  gate?: { at: number; auto: number; choice: number };
}

/* ---------- helpers ---------- */

const SPINNER = ["Pondering", "Brewing", "Tinkering", "Deciphering", "Investigating", "Percolating", "Noodling", "Synthesizing"];

function pane(s: Draft, id: string): Pane {
  const p = s.panes.find((x) => x.id === id);
  if (!p) throw new Error(`no pane ${id}`);
  return p;
}

function card(s: Draft, id: string): Extract<Msg, { kind: "card" }> {
  const m = s.chat.find((x) => x.id === id);
  if (!m || m.kind !== "card") throw new Error(`no card ${id}`);
  return m;
}

/** Mark a card's tool row done, and set the card's tally. */
function landed(s: Draft, cardId: string, text: string, tally: string): void {
  const c = card(s, cardId);
  const r = c.items.find((x) => x.type === "row" && x.text === text);
  if (r && r.type === "row") r.done = true;
  c.tally = tally;
}

function me(s: Draft, id: string): Extract<Msg, { kind: "me" }> {
  const m = s.chat.find((x) => x.id === id);
  if (!m || m.kind !== "me") throw new Error(`no message ${id}`);
  return m;
}

function voice(s: Draft, id: string): Extract<Msg, { kind: "voice" }> {
  const m = s.chat.find((x) => x.id === id);
  if (!m || m.kind !== "voice") throw new Error(`no voice note ${id}`);
  return m;
}

/** Beats that type `text` into a field, one character at a time. */
function typing(from: number, text: string, cps: number, set: (s: Draft, v: string) => void): Beat[] {
  const out: Beat[] = [];
  for (let i = 1; i <= text.length; i++) out.push({ at: from + (i * 1000) / cps, run: (s) => set(s, text.slice(0, i)) });
  return out;
}

/** A busy card and a terminal spinner that tick: the verb every 2.4 s, the clock every second. */
function ticking(from: number, until: number, cardId: string, paneId: string, startElapsed: number, verbOffset = 0): Beat[] {
  const out: Beat[] = [];
  for (let t = from; t <= until; t += 1000) {
    const k = Math.floor((t - from) / 2400) + verbOffset;
    const secs = startElapsed + Math.round((t - from) / 1000);
    out.push({
      at: t,
      run: (s) => {
        const c = card(s, cardId);
        if (c.mark !== "⏳") return;
        c.verb = SPINNER[k % SPINNER.length];
        c.elapsed = secs;
        const p = pane(s, paneId);
        if (p.spinner !== null) p.spinner = `${SPINNER[k % SPINNER.length]}… (${fmtElapsed(secs)} · esc to interrupt)`;
      },
    });
  }
  return out;
}

export const fmtElapsed = (s: number): string =>
  s < 60 ? `${s}s` : s < 3600 ? `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s` : `${Math.floor(s / 3600)}h ${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}m`;

/* ---------- the opening stage ---------- */

const SHELL = "~/work/api $ ";

export const INITIAL: StageState = {
  panes: [{ id: "api", lines: [{ text: SHELL, tone: "dim" }], spinner: null, dialog: null, input: "", status: "" }],
  detached: false,
  chat: [{ id: "day", kind: "day", text: "Today" }],
  pinned: "💤 all idle",
  composer: "",
  view: "chat",
  app: { summary: "", spent: "", tiles: [], needs: null, diff: null },
};

/* ---------- the day, one scene per moment ---------- */

export const SCENES: Scene[] = [
  /* 0 · 07:30, before anything */
  { id: "dawn", beats: [] },

  /* 1 · 08:03, kitchen: start it at the desk, then leave */
  {
    id: "kitchen",
    beats: [
      ...typing(300, "aipager session api", 16, (s, v) => (pane(s, "api").lines = [{ text: SHELL + v, tone: "dim" }])),
      {
        at: 1700,
        run: (s) => {
          const p = pane(s, "api");
          p.lines = [
            { text: "✻ Welcome to Claude Code!", tone: "claude", bold: true },
            { text: "  cwd: ~/work/api", tone: "dim" },
          ];
          p.status = "Sonnet 5 · ctx 0% · $0.00";
          s.pinned = "🔄 api (starting)";
        },
        packet: { label: "SessionStart", dir: "right", tone: "accent" },
      },
      { at: 2400, run: (s) => (s.pinned = "💤 api (idle)") },
      ...typing(2600, "migrate the auth tokens to the new expiry format", 34, (s, v) => (pane(s, "api").input = v)),
      {
        at: 4300,
        run: (s) => {
          const p = pane(s, "api");
          p.lines.push({ text: "> migrate the auth tokens to the new expiry format", tone: "fg" });
          p.input = "";
          p.spinner = "Pondering… (1s · esc to interrupt)";
          s.pinned = "⚙️ api (working)";
          s.chat.push({
            id: "c1",
            kind: "card",
            session: "api",
            items: [{ type: "prose", text: "Let me see how tokens are issued and checked today." }],
            mark: "⏳",
            verb: "Pondering",
            elapsed: 1,
            tally: "",
            prompt: null,
            time: "08:03",
          });
        },
        packet: { label: "UserPromptSubmit", dir: "right", tone: "accent" },
      },
      {
        at: 5200,
        run: (s) => {
          card(s, "c1").items.push({ type: "row", text: "Read: src/auth/session.ts", done: false });
          pane(s, "api").lines.push({ text: "Read(src/auth/session.ts)", dot: "live", bold: true });
        },
        packet: { label: "PreToolUse", dir: "right", tone: "accent" },
      },
      { at: 6200, run: (s) => (s.detached = true) },
      ...ticking(4300, 9000, "c1", "api", 1),
    ],
  },

  /* 2 · 08:41, train: a thought, sent mid-turn */
  {
    id: "train",
    beats: [
      {
        at: 0,
        run: (s) => {
          landed(s, "c1", "Read: src/auth/session.ts", "Read ×6 · Edit ×2");
          const c = card(s, "c1");
          c.items.push({ type: "prose", text: "Issuing is done. Moving the checks over." });
          c.items.push({ type: "row", text: "Edit: src/auth/token.ts", done: false });
          const p = pane(s, "api");
          p.lines.push({ text: "Read 84 lines", sub: true, tone: "dim" });
          p.lines.push({ text: "Issuing is done. Moving the checks over.", dot: "fg" });
          p.lines.push({ text: "Update(src/auth/token.ts)", dot: "live", bold: true });
          p.status = "Sonnet 5 · ctx 18% · $0.21";
        },
      },
      ...ticking(0, 9000, "c1", "api", 2280, 3),
      ...typing(400, "also update the CHANGELOG when you're done", 26, (s, v) => (s.composer = v)),
      {
        at: 2200,
        run: (s) => {
          s.composer = "";
          s.chat.push({ id: "m1", kind: "me", text: "also update the CHANGELOG when you're done", time: "08:41", reaction: "" });
        },
      },
      { at: 2800, run: (s) => (me(s, "m1").reaction = "👀"), packet: { label: "prompt → pty", dir: "left", tone: "live" } },
      ...typing(3200, "also update the CHANGELOG when you're done", 40, (s, v) => (pane(s, "api").input = v)),
      {
        at: 4400,
        run: (s) => {
          const p = pane(s, "api");
          p.lines.push({ text: "> also update the CHANGELOG when you're done", tone: "fg" });
          p.input = "";
        },
        packet: { label: "UserPromptSubmit", dir: "right", tone: "accent" },
      },
      { at: 5400, run: (s) => (me(s, "m1").reaction = "👍") },
    ],
  },

  /* 3 · 10:15, meeting: the permission prompt */
  {
    id: "meeting",
    gate: { at: 1400, auto: 7000, choice: 0 },
    beats: [
      {
        at: 0,
        run: (s) => {
          landed(s, "c1", "Edit: src/auth/token.ts", "Read ×9 · Edit ×5");
          card(s, "c1").items.push({ type: "row", text: "Bash: pnpm test src/auth", done: false });
          const p = pane(s, "api");
          p.lines.push({ text: "Updated src/auth/token.ts with 12 additions and 9 removals", sub: true, tone: "dim" });
          p.lines.push({ text: "Bash(pnpm test src/auth)", dot: "live", bold: true });
          p.lines.push({ text: "Running PermissionRequest hook…", sub: true, tone: "amber" });
          p.spinner = null;
          p.status = "Sonnet 5 · ctx 31% · $0.48";
        },
        packet: { label: "PermissionRequest", dir: "right", tone: "amber" },
      },
      {
        at: 800,
        run: (s) => {
          const c = card(s, "c1");
          c.mark = "🔐";
          c.verb = "Permission needed";
          c.prompt = { kind: "perm", tool: "Bash", what: "Run the auth tests", command: "pnpm test src/auth", answered: null };
          s.pinned = "⏳ api needs you - Bash: pnpm test src/auth";
        },
      },
      {
        at: 0,
        afterTap: true,
        run: (s) => {
          const c = card(s, "c1");
          if (c.prompt?.kind === "perm") c.prompt.answered = "allow";
        },
        packet: { label: "verdict: allow", dir: "left", tone: "live" },
      },
      {
        at: 900,
        afterTap: true,
        run: (s) => {
          const c = card(s, "c1");
          c.prompt = null;
          c.mark = "⏳";
          c.verb = "Testing";
          c.elapsed = 7920;
          s.pinned = "⚙️ api (working)";
          s.chat.push({ id: "r1", kind: "reply", text: "✅ [api] · Allowed · Bash: pnpm test src/auth", time: "10:15", quote: "🔐 api · Permission needed" });
          const p = pane(s, "api");
          p.lines = p.lines.filter((l) => l.text !== "Running PermissionRequest hook…");
          p.spinner = "Testing… (2h 12m · esc to interrupt)";
        },
      },
      {
        at: 2600,
        afterTap: true,
        run: (s) => {
          landed(s, "c1", "Bash: pnpm test src/auth", "Read ×9 · Edit ×5 · Bash ×1");
          pane(s, "api").lines.push({ text: "Tests: 42 passed, 42 total", sub: true, tone: "live" });
        },
        packet: { label: "PostToolUse", dir: "right", tone: "dim" },
      },
    ],
  },

  /* 4 · 12:30, lunch: a question */
  {
    id: "lunch",
    gate: { at: 1300, auto: 6500, choice: 2 },
    beats: [
      {
        at: 200,
        run: (s) => {
          const p = pane(s, "api");
          p.spinner = null;
          p.dialog = {
            kind: "question",
            title: "Expiry check",
            body: ["The expiry check lives in session.ts and token.ts.", "Which one should own it?"],
            options: ["token.ts", "session.ts", "A shared helper"],
            selected: 0,
          };
        },
        packet: { label: "AskUserQuestion", dir: "right", tone: "amber" },
      },
      {
        at: 900,
        run: (s) => {
          const c = card(s, "c1");
          c.mark = "❓";
          c.verb = "Which module should own the expiry check?";
          c.prompt = { kind: "question", question: "The expiry check lives in session.ts and token.ts. Which one should own it?", options: ["token.ts", "session.ts", "A shared helper"], answered: null };
          s.pinned = "⏳ api needs you - Which module should own the expiry check?";
        },
      },
      {
        at: 0,
        afterTap: true,
        run: (s, ctx) => {
          const c = card(s, "c1");
          if (c.prompt?.kind === "question") c.prompt.answered = ctx.choice;
          const p = pane(s, "api");
          if (p.dialog) p.dialog.selected = ctx.choice;
        },
        packet: { label: "arrow keys + ↵", dir: "left", tone: "live" },
      },
      {
        at: 1000,
        afterTap: true,
        run: (s) => {
          const c = card(s, "c1");
          const choice = c.prompt?.kind === "question" && c.prompt.answered !== null ? c.prompt.options[c.prompt.answered] : "A shared helper";
          c.prompt = null;
          c.mark = "⏳";
          c.verb = "Refactoring";
          c.elapsed = 16200;
          c.items.push({ type: "row", text: "Write: src/auth/expiry.ts", done: true });
          c.tally = "Read ×9 · Edit ×6 · Bash ×1 · Write ×1";
          s.pinned = "⚙️ api (working)";
          s.chat.push({ id: "r2", kind: "reply", text: `✅ [api] · Answered · ${choice}`, time: "12:30", quote: "❓ api · Which module should own the expiry check?" });
          const p = pane(s, "api");
          p.dialog = null;
          p.lines.push({ text: `User answered: ${choice}`, sub: true, tone: "dim" });
          p.lines.push({ text: "Write(src/auth/expiry.ts)", dot: "live", bold: true });
          p.lines.push({ text: "Wrote 18 lines to src/auth/expiry.ts", sub: true, tone: "dim" });
          p.spinner = "Refactoring… (4h 30m · esc to interrupt)";
          p.status = "Sonnet 5 · ctx 44% · $0.83";
        },
      },
    ],
  },

  /* 5 · 14:05, walking back: the turn is done; a voice note starts the next */
  {
    id: "walk",
    beats: [
      {
        at: 0,
        run: (s) => {
          const c = card(s, "c1");
          c.mark = "✅";
          c.verb = "Finished";
          c.elapsed = 19860;
          c.items.push({ type: "row", text: "Edit: CHANGELOG.md", done: true });
          c.tally = "Read ×9 · Edit ×7 · Bash ×1 · Write ×1";
          s.pinned = "💤 api (idle)";
          s.chat.push({
            id: "a1",
            kind: "answer",
            session: "api",
            stats: "",
            time: "13:34",
            text: ["Done. Tokens carry their expiry in milliseconds, the check lives in src/auth/expiry.ts, and the CHANGELOG has an entry. 42 tests pass."],
          });
          const p = pane(s, "api");
          p.spinner = null;
          p.lines.push({ text: "Done. Tokens carry their expiry in milliseconds; CHANGELOG updated.", dot: "fg" });
          p.status = "Sonnet 5 · ctx 47% · $0.91";
        },
      },
      {
        at: 1000,
        run: (s) => s.chat.push({ id: "v1", kind: "voice", secs: 7, time: "14:05", reaction: "", transcript: "when the tests are green, start on the rate limiter" }),
      },
      { at: 1800, run: (s) => (voice(s, "v1").reaction = "👀"), packet: { label: "voice → local Whisper", dir: "left", tone: "live" } },
      ...typing(2600, "when the tests are green, start on the rate limiter", 40, (s, v) => (pane(s, "api").input = v)),
      {
        at: 4000,
        run: (s) => {
          const p = pane(s, "api");
          p.lines.push({ text: "> when the tests are green, start on the rate limiter", tone: "fg" });
          p.input = "";
          p.spinner = "Pondering… (1s · esc to interrupt)";
          s.pinned = "⚙️ api (working)";
        },
        packet: { label: "UserPromptSubmit", dir: "right", tone: "accent" },
      },
      {
        at: 4800,
        run: (s) => {
          voice(s, "v1").reaction = "👍";
          s.chat.push({
            id: "c2",
            kind: "card",
            session: "api",
            items: [{ type: "prose", text: "Tests are green. Starting on the rate limiter." }, { type: "row", text: "Read: src/http/middleware.ts", done: false }],
            mark: "⏳",
            verb: "Pondering",
            elapsed: 1,
            tally: "",
            prompt: null,
            time: "14:05",
          });
        },
      },
      ...ticking(4800, 9000, "c2", "api", 1),
    ],
  },

  /* 6 · 16:20, coffee: context warnings */
  {
    id: "coffee",
    beats: [
      {
        at: 0,
        run: (s) => {
          landed(s, "c2", "Read: src/http/middleware.ts", "Read ×12 · Edit ×4");
          const c = card(s, "c2");
          c.elapsed = 8100;
          c.verb = "Tinkering";
          const p = pane(s, "api");
          p.lines.push({ text: "Read 212 lines", sub: true, tone: "dim" });
          p.spinner = "Tinkering… (2h 15m · esc to interrupt)";
          p.status = "Sonnet 5 · ctx 82% · $1.64";
        },
      },
      {
        at: 700,
        run: (s) => s.chat.push({ id: "n1", kind: "note", text: "⚠️ api · Context at 82% · auto-compact soon", time: "16:20" }),
        packet: { label: "statusline · ctx 82%", dir: "right", tone: "amber" },
      },
      {
        at: 2600,
        run: (s) => {
          s.chat.push({ id: "n2", kind: "note", text: "api · Compacting…", time: "16:24" });
          const p = pane(s, "api");
          p.spinner = null;
          p.lines.push({ text: "Compacting conversation…", dot: "claude" });
        },
        packet: { label: "PreCompact", dir: "right", tone: "accent" },
      },
      {
        at: 4400,
        run: (s) => {
          s.chat.push({ id: "n3", kind: "note", text: "✅ api · Compacted: 82% → 4%", time: "16:25" });
          const p = pane(s, "api");
          p.lines.push({ text: "Compacted (ctrl+r to see the summary)", sub: true, tone: "dim" });
          p.spinner = "Tinkering… (2h 20m · esc to interrupt)";
          p.status = "Sonnet 5 · ctx 4% · $1.71";
        },
        packet: { label: "PostCompact", dir: "right", tone: "live" },
      },
    ],
  },

  /* 7 · 18:45, between sets: three sessions */
  {
    id: "gym",
    beats: [
      {
        at: 0,
        run: (s) => {
          const c = card(s, "c2");
          c.mark = "✅";
          c.verb = "Finished";
          c.elapsed = 10560;
          c.tally = "Read ×14 · Edit ×9 · Bash ×3";
          pane(s, "api").spinner = null;
          pane(s, "api").lines.push({ text: "Rate limiter in place: 100 requests a minute per token. Tests pass.", dot: "fg" });
          s.panes.push(
            {
              id: "docs",
              lines: [
                { text: "> document the new expiry format", tone: "fg" },
                { text: "Update(docs/auth.md)", dot: "live", bold: true },
              ],
              spinner: "Crafting… (1h 12m · esc to interrupt)",
              dialog: null,
              input: "",
              status: "Opus 5.5 · ctx 41% · $0.64",
            },
            {
              id: "web",
              lines: [
                { text: "> ship the new login page", tone: "fg" },
                { text: "Bash(npm run build)", dot: "live", bold: true },
                { text: "Running PermissionRequest hook…", sub: true, tone: "amber" },
              ],
              spinner: null,
              dialog: null,
              input: "",
              status: "Sonnet 5 · ctx 17% · $0.38",
            },
          );
          s.pinned = "⏳ web needs you - Bash: npm run build";
        },
        packet: { label: "PermissionRequest · web", dir: "right", tone: "amber" },
      },
      ...typing(600, "/status", 12, (s, v) => (s.composer = v)),
      {
        at: 1500,
        run: (s) => {
          s.composer = "";
          s.chat.push({ id: "m2", kind: "me", text: "/status", time: "18:45", reaction: "" });
        },
      },
      {
        at: 2300,
        run: (s) =>
          s.chat.push({
            id: "st",
            kind: "status",
            time: "18:45",
            rows: [
              { name: "api", state: "💤 idle", ctx: "9%", cost: "$1.96" },
              { name: "docs", state: "⚙️ working", ctx: "41%", cost: "$0.64" },
              { name: "web", state: "⏳ needs you", ctx: "17%", cost: "$0.38" },
            ],
          }),
      },
    ],
  },

  /* 8 · 21:10, sofa: the Mini App's diff viewer */
  {
    id: "sofa",
    beats: [
      {
        at: 300,
        run: (s) => {
          s.view = "app";
          s.app = {
            summary: "1 working, 2 resting",
            spent: "$3.12 spent today",
            needs: null,
            tiles: [],
            diff: {
              file: "src/auth/expiry.ts",
              meta: "api · Write · 12:31",
              lines: [
                { t: "@@ export function isExpired(token)", kind: "ctx" },
                { t: "-  return token.exp < Date.now()", kind: "del" },
                { t: "+  return token.exp * 1000 < Date.now()", kind: "add" },
                { t: "   }", kind: "ctx" },
                { t: "+ export const EXPIRY_GRACE_MS = 30_000", kind: "add" },
              ],
            },
          };
          s.pinned = "⚙️ docs (working)";
          const w = pane(s, "web");
          w.lines = w.lines.filter((l) => l.text !== "Running PermissionRequest hook…");
          w.lines.push({ text: "Build finished in 41s.", sub: true, tone: "live" });
          w.lines.push({ text: "The new login page is live on staging.", dot: "fg" });
        },
      },
    ],
  },

  /* 9 · 23:40, lights out */
  {
    id: "night",
    beats: [
      { at: 200, run: (s) => (s.view = "chat") },
      {
        at: 900,
        run: (s) => {
          s.chat.push({
            id: "c3",
            kind: "card",
            session: "docs",
            items: [{ type: "row", text: "Edit: docs/auth.md", done: true }, { type: "row", text: "Edit: README.md", done: true }],
            mark: "✅",
            verb: "Finished",
            elapsed: 8760,
            tally: "Read ×14 · Edit ×9",
            prompt: null,
            time: "23:38",
          });
          const d = pane(s, "docs");
          d.spinner = null;
          d.lines.push({ text: "The expiry format is documented in docs/auth.md and the README.", dot: "fg" });
        },
        packet: { label: "Stop · docs", dir: "right", tone: "live" },
      },
      { at: 2000, run: (s) => (s.pinned = "💤 all idle") },
    ],
  },
];

/* ---------- playback ---------- */

export interface Tap {
  at: number;
  choice: number;
}

function applyScene(state: Draft, scene: Scene, t: number, tap: Tap | null): { packets: Packet[] } {
  const auto = scene.gate ? scene.gate.at + scene.gate.auto : 0;
  const resolve = scene.gate ? Math.min(tap?.at ?? Infinity, auto) : 0;
  const ctx: Ctx = { choice: tap && tap.at <= auto ? tap.choice : (scene.gate?.choice ?? 0) };
  const timed = scene.beats
    .map((b, i) => ({ b, i, when: b.afterTap ? resolve + b.at : b.at }))
    .filter((x) => x.when <= t)
    .sort((a, b) => a.when - b.when || a.i - b.i);
  const packets: Packet[] = [];
  for (const { b, i, when } of timed) {
    b.run?.(state, ctx);
    if (b.packet && t - when < 1500) packets.push({ ...b.packet, id: `${scene.id}-${i}-${when}` });
  }
  return { packets };
}

/** When a scene's last beat plays, with its prompt answered by the auto-play. */
export function sceneEnd(scene: Scene): number {
  const resolve = scene.gate ? scene.gate.at + scene.gate.auto : 0;
  return Math.max(0, ...scene.beats.map((b) => (b.afterTap ? resolve + b.at : b.at)));
}

/** The stage at the end of each scene: ENDS[k] is where scene k starts. */
const ENDS: StageState[] = (() => {
  const out: StageState[] = [structuredClone(INITIAL)];
  let s = structuredClone(INITIAL);
  for (const scene of SCENES) {
    applyScene(s, scene, sceneEnd(scene), null);
    out.push(structuredClone(s));
    s = structuredClone(s);
  }
  return out;
})();

/** The stage `t` ms into scene `k`, with the reader's tap (ms into the scene) if any. */
export function stageAt(k: number, t: number, tap: Tap | null): { state: StageState; packets: Packet[] } {
  const scene = SCENES[k];
  const state = structuredClone(ENDS[k]);
  const { packets } = applyScene(state, scene, t, tap);
  return { state, packets };
}

/** Whether scene k is waiting for the reader's tap at time t. */
export function awaitingTap(k: number, t: number, tap: Tap | null): boolean {
  const g = SCENES[k].gate;
  if (!g || tap !== null) return false;
  return t >= g.at && t < g.at + g.auto;
}
