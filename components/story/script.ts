/**
 * The story's script: one Claude Code session, played by scroll.
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
  | { id: string; kind: "status"; rows: { name: string; state: string; ctx: string; cost: string }[]; time: string };

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
  app: { summary: string; spent: string; tiles: AppTile[]; needs: { name: string; what: string } | null };
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
        if (p.spinner !== null) p.spinner = `${SPINNER[k % SPINNER.length]}… (${secs}s · esc to interrupt)`;
      },
    });
  }
  return out;
}

export const fmtElapsed = (s: number): string => (s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`);

/* ---------- the opening stage ---------- */

export const INITIAL: StageState = {
  panes: [
    {
      id: "api",
      lines: [],
      spinner: null,
      dialog: null,
      input: "",
      status: "",
    },
  ],
  detached: false,
  chat: [{ id: "day", kind: "day", text: "Today" }],
  pinned: "💤 all idle",
  composer: "",
  view: "chat",
  app: { summary: "", spent: "", tiles: [], needs: null },
};

const SHELL = "~/work/api $ ";

/* ---------- the scenes ---------- */

export const SCENES: Scene[] = [
  /* 0 · start a session */
  {
    id: "start",
    beats: [
      { at: 0, run: (s) => (pane(s, "api").lines = [{ text: SHELL, tone: "dim" }]) },
      ...typing(500, "aipager session api", 16, (s, v) => (pane(s, "api").lines = [{ text: SHELL + v, tone: "dim" }])),
      {
        at: 2000,
        run: (s) => {
          const p = pane(s, "api");
          p.lines = [
            { text: "✻ Welcome to Claude Code!", tone: "claude", bold: true },
            { text: "  /help for help, /status for your current setup", tone: "dim" },
            { text: "  cwd: ~/work/api", tone: "dim" },
          ];
          p.input = "";
          p.status = "Sonnet 5 · ctx 0% · $0.00";
          s.pinned = "🔄 api (starting)";
        },
        packet: { label: "SessionStart", dir: "right", tone: "accent" },
      },
      { at: 3400, run: (s) => (s.pinned = "💤 api (idle)") },
    ],
  },

  /* 1 · close the terminal */
  {
    id: "detach",
    beats: [
      { at: 300, run: (s) => (s.detached = true) },
      ...typing(1300, "fix the failing auth test", 14, (s, v) => (s.composer = v)),
    ],
  },

  /* 2 · send a prompt from the phone */
  {
    id: "send",
    beats: [
      {
        at: 200,
        run: (s) => {
          s.composer = "";
          s.chat.push({ id: "m1", kind: "me", text: "fix the failing auth test", time: "09:41", reaction: "" });
        },
      },
      { at: 900, run: (s) => (me(s, "m1").reaction = "👀"), packet: { label: "prompt → pty", dir: "left", tone: "live" } },
      ...typing(1700, "fix the failing auth test", 30, (s, v) => (pane(s, "api").input = v)),
      {
        at: 2800,
        run: (s) => {
          const p = pane(s, "api");
          p.lines.push({ text: "> fix the failing auth test", tone: "fg" });
          p.input = "";
          p.spinner = "Pondering… (0s · esc to interrupt)";
        },
        packet: { label: "UserPromptSubmit", dir: "right", tone: "accent" },
      },
      { at: 4200, run: (s) => (me(s, "m1").reaction = "👍") },
    ],
  },

  /* 3 · the busy card */
  {
    id: "watch",
    beats: [
      {
        at: 200,
        run: (s) => {
          s.pinned = "⚙️ api (working)";
          s.chat.push({
            id: "c1",
            kind: "card",
            session: "api",
            items: [{ type: "prose", text: "The auth test fails on token expiry. Let me look at how expiry is checked." }],
            mark: "⏳",
            verb: "Pondering",
            elapsed: 1,
            tally: "",
            prompt: null,
            time: "09:41",
          });
          pane(s, "api").lines.push({ text: "The auth test fails on token expiry. Let me look at how expiry is checked.", dot: "fg" });
        },
      },
      ...ticking(200, 6000, "c1", "api", 1),
      {
        at: 1100,
        run: (s) => {
          card(s, "c1").items.push({ type: "row", text: "Read: src/auth/session.ts", done: false });
          pane(s, "api").lines.push({ text: "Read(src/auth/session.ts)", dot: "live", bold: true });
        },
        packet: { label: "PreToolUse", dir: "right", tone: "accent" },
      },
      {
        at: 2000,
        run: (s) => {
          landed(s, "c1", "Read: src/auth/session.ts", "Read ×1");
          pane(s, "api").lines.push({ text: "Read 84 lines", sub: true, tone: "dim" });
          pane(s, "api").status = "Sonnet 5 · ctx 9% · $0.04";
        },
        packet: { label: "PostToolUse", dir: "right", tone: "dim" },
      },
      {
        at: 2800,
        run: (s) => {
          card(s, "c1").items.push({ type: "row", text: "Grep: expiresAt in src", done: false });
          pane(s, "api").lines.push({ text: 'Grep("expiresAt", src)', dot: "live", bold: true });
        },
        packet: { label: "PreToolUse", dir: "right", tone: "accent" },
      },
      {
        at: 3600,
        run: (s) => {
          landed(s, "c1", "Grep: expiresAt in src", "Read ×1 · Grep ×1");
          pane(s, "api").lines.push({ text: "Found 3 matches", sub: true, tone: "dim" });
        },
      },
      {
        at: 4300,
        run: (s) => {
          const c = card(s, "c1");
          c.items.push({ type: "prose", text: "token.ts compares seconds with milliseconds. Fixing it." });
          c.items.push({ type: "row", text: "Edit: src/auth/token.ts", done: false });
          const p = pane(s, "api");
          p.lines.push({ text: "token.ts compares seconds with milliseconds. Fixing it.", dot: "fg" });
          p.lines.push({ text: "Update(src/auth/token.ts)", dot: "live", bold: true });
        },
        packet: { label: "PreToolUse", dir: "right", tone: "accent" },
      },
      {
        at: 5300,
        run: (s) => {
          landed(s, "c1", "Edit: src/auth/token.ts", "Read ×1 · Grep ×1 · Edit ×1");
          const p = pane(s, "api");
          p.lines.push({ text: "Updated src/auth/token.ts with 1 addition and 1 removal", sub: true, tone: "dim" });
          p.status = "Sonnet 5 · ctx 14% · $0.09";
        },
        packet: { label: "PostToolUse", dir: "right", tone: "dim" },
      },
    ],
  },

  /* 4 · a permission prompt: the reader taps Allow */
  {
    id: "approve",
    gate: { at: 1400, auto: 6500, choice: 0 },
    beats: [
      ...ticking(0, 10000, "c1", "api", 8, 2),
      {
        at: 300,
        run: (s) => {
          card(s, "c1").items.push({ type: "row", text: "Bash: pnpm test src/auth", done: false });
          // aipager's hook holds the call and waits for a verdict from the
          // chat, so Claude Code never opens its own dialog.
          const p = pane(s, "api");
          p.lines.push({ text: "Bash(pnpm test src/auth)", dot: "live", bold: true });
          p.lines.push({ text: "Running PermissionRequest hook…", sub: true, tone: "amber" });
          p.spinner = null;
        },
        packet: { label: "PermissionRequest", dir: "right", tone: "amber" },
      },
      {
        at: 1100,
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
          s.pinned = "⚙️ api (working)";
          s.chat.push({ id: "r1", kind: "reply", text: "✅ [api] · Allowed · Bash: pnpm test src/auth", time: "09:43", quote: "🔐 api · Permission needed" });
          const p = pane(s, "api");
          p.lines = p.lines.filter((l) => l.text !== "Running PermissionRequest hook…");
          p.spinner = "Testing… (12s · esc to interrupt)";
        },
      },
      {
        at: 2600,
        afterTap: true,
        run: (s) => {
          landed(s, "c1", "Bash: pnpm test src/auth", "Read ×1 · Grep ×1 · Edit ×1 · Bash ×1");
          const p = pane(s, "api");
          p.lines.push({ text: "Tests: 42 passed, 42 total", sub: true, tone: "live" });
          p.status = "Sonnet 5 · ctx 17% · $0.12";
        },
        packet: { label: "PostToolUse", dir: "right", tone: "dim" },
      },
    ],
  },

  /* 5 · a question becomes buttons */
  {
    id: "question",
    gate: { at: 1300, auto: 6000, choice: 2 },
    beats: [
      ...ticking(0, 9500, "c1", "api", 18, 5),
      {
        at: 300,
        run: (s) => {
          const p = pane(s, "api");
          p.spinner = null;
          p.dialog = {
            kind: "question",
            title: "Expiry check",
            body: ["The expiry check is duplicated in session.ts and token.ts.", "Which one should own it?"],
            options: ["token.ts", "session.ts", "A shared helper"],
            selected: 0,
          };
        },
        packet: { label: "PreToolUse · AskUserQuestion", dir: "right", tone: "amber" },
      },
      {
        at: 1000,
        run: (s) => {
          const c = card(s, "c1");
          c.mark = "❓";
          c.verb = "Which module should own the expiry check?";
          c.prompt = { kind: "question", question: "The expiry check is duplicated in session.ts and token.ts. Which one should own it?", options: ["token.ts", "session.ts", "A shared helper"], answered: null };
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
          c.items.push({ type: "row", text: "Write: src/auth/expiry.ts", done: true });
          c.tally = "Read ×1 · Grep ×1 · Edit ×1 · Bash ×1 · Write ×1";
          s.pinned = "⚙️ api (working)";
          s.chat.push({ id: "r2", kind: "reply", text: `✅ [api] · Answered · ${choice}`, time: "09:44", quote: "❓ api · Which module should own the expiry check?" });
          const p = pane(s, "api");
          p.dialog = null;
          p.lines.push({ text: `User answered: ${choice}`, sub: true, tone: "dim" });
          p.lines.push({ text: "Write(src/auth/expiry.ts)", dot: "live", bold: true });
          p.lines.push({ text: "Wrote 18 lines to src/auth/expiry.ts", sub: true, tone: "dim" });
          p.spinner = "Refactoring… (24s · esc to interrupt)";
          p.status = "Sonnet 5 · ctx 21% · $0.16";
        },
      },
    ],
  },

  /* 6 · a fleet of sessions */
  {
    id: "fleet",
    beats: [
      {
        at: 300,
        run: (s) => {
          s.panes.push(
            {
              id: "docs",
              lines: [
                { text: "> update the README for the --resume flag", tone: "fg" },
                { text: "Read(README.md)", dot: "live", bold: true },
                { text: "Read 283 lines", sub: true, tone: "dim" },
              ],
              spinner: "Crafting… (38s · esc to interrupt)",
              dialog: null,
              input: "",
              status: "Opus 5.5 · ctx 12% · $0.08",
            },
            {
              id: "web",
              lines: [
                { text: "> bump the deps and run the build", tone: "fg" },
                { text: "Done. 14 packages updated, the build is green.", dot: "fg" },
              ],
              spinner: null,
              dialog: null,
              input: "",
              status: "Sonnet 5 · ctx 26% · $0.31",
            },
          );
          s.pinned = "⚙️ 2 working · 1 idle";
        },
        packet: { label: "SessionStart · docs", dir: "right", tone: "accent" },
      },
      ...typing(1400, "/docs mention it in the quick start too", 22, (s, v) => (s.composer = v)),
      {
        at: 3400,
        run: (s) => {
          s.composer = "";
          s.chat.push({ id: "m2", kind: "me", text: "/docs mention it in the quick start too", time: "09:46", reaction: "👀" });
        },
        packet: { label: "prompt → docs pty", dir: "left", tone: "live" },
      },
      { at: 4400, run: (s) => (me(s, "m2").reaction = "👍"), packet: { label: "UserPromptSubmit · docs", dir: "right", tone: "accent" } },
    ],
  },

  /* 7 · the Mini App */
  {
    id: "app",
    beats: [
      {
        at: 300,
        run: (s) => {
          s.view = "app";
          s.app = {
            summary: "1 needs you, 2 working",
            spent: "$0.56 spent today",
            needs: { name: "web", what: "Bash: npm publish --dry-run" },
            tiles: [
              { name: "api", state: "working", ctx: 21, model: "Sonnet 5", cost: "$0.16", folder: "~/work/api" },
              { name: "docs", state: "working", ctx: 13, model: "Opus 5.5", cost: "$0.09", folder: "~/work/docs" },
              { name: "web", state: "needs", ctx: 27, model: "Sonnet 5", cost: "$0.31", folder: "~/work/web" },
            ],
          };
          s.pinned = "⏳ web needs you - Bash: npm publish --dry-run";
          const w = pane(s, "web");
          w.lines.push({ text: "> check the package before we publish", tone: "fg" });
          w.lines.push({ text: "Bash(npm publish --dry-run)", dot: "live", bold: true });
          w.dialog = { kind: "perm", title: "Bash command", body: ["npm publish --dry-run"], options: ["Yes", "Yes, and don't ask again", "No (esc)"], selected: 0 };
        },
        packet: { label: "PermissionRequest · web", dir: "right", tone: "amber" },
      },
      { at: 2600, run: (s) => (s.app.tiles[0].ctx = 23), packet: { label: "statusline", dir: "right", tone: "dim" } },
    ],
  },

  /* 8 · finished: the card settles and the answer lands */
  {
    id: "done",
    beats: [
      { at: 200, run: (s) => (s.view = "chat") },
      {
        at: 900,
        run: (s) => {
          const c = card(s, "c1");
          c.mark = "✅";
          c.verb = "Finished";
          c.elapsed = 252;
          const p = pane(s, "api");
          p.spinner = null;
          p.lines.push({ text: "Fixed. Expiry lives in src/auth/expiry.ts now, in milliseconds everywhere. 42 tests pass.", dot: "fg" });
          p.status = "Sonnet 5 · ctx 23% · $0.18";
          s.pinned = "⏳ web needs you - Bash: npm publish --dry-run";
        },
        packet: { label: "Stop", dir: "right", tone: "live" },
      },
      {
        at: 1900,
        run: (s) => {
          s.chat.push({
            id: "a1",
            kind: "answer",
            session: "api",
            stats: "Finished (4m 12s)",
            time: "09:47",
            text: [
              "Fixed. token.ts compared the expiry in seconds with Date.now() in milliseconds, so every token looked expired.",
              "The check now lives in src/auth/expiry.ts and both callers use it. 42 tests pass.",
            ],
          });
        },
      },
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
