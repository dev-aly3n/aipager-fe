/**
 * The evening, step by step. Each step waits `after` ms, then edits the
 * world. `open` moves the camera to a chat, `gate` waits for the reader to
 * tap (or taps it for them after a while), `wire` sends a charge down the
 * cable first and holds the step until it lands, and typing is spelled out
 * one character at a time into the message box.
 *
 * It is written the way an evening actually goes: you send a message and
 * leave the chat, your sessions carry on without you, and you come back
 * when something pings. Nobody sits watching a chat waiting for a reply.
 */
import { arrive, card, drop, moveCard, msg, open, pane, pinBar, type ChatId, type Mode, type Spark, type World } from "./world";
import type { Dict } from "@/lib/i18n";
import { botOf, fill, type BotStrings } from "@/lib/i18n/bot";

/**
 * Claude Code's own spinner, in Claude Code's own language. aipager
 * translates the card it writes in Telegram, not the terminal it is
 * watching, so the pane says Thinking while the card says Réflexion.
 */
const SPIN = botOf("en").spin;

export interface Step {
  after: number;
  /** what rides the cable before this step lands; the step waits for it */
  wire?: Spark;
  caption?: string;
  open?: ChatId;
  run?: (w: World) => void;
  /** wait for a tap on this message's buttons; `auto` ms of idleness taps `choice` */
  gate?: { chat: ChatId; msg: string; auto: number; choice: number; resolve: (w: World, choice: number) => void };
}

const hook = (from: string, to: string): Spark => ({ dir: "out", from, to, tone: "hook" });
const perm = (from: string, to: string): Spark => ({ dir: "out", from, to, tone: "perm" });
const back = (from: string, to: string): Spark => ({ dir: "back", from, to, tone: "verdict" });

/** The camera: you open a chat, because something brought you here. */
const look = (chat: ChatId, after: number, caption?: string): Step => ({ after, open: chat, caption });

/**
 * You, writing. A beat to collect the words, then typing at a human pace,
 * then send. The second tick lands a moment later, usually after you have
 * already moved on.
 */
function say(chat: ChatId, text: string, time: string, id: string, reacts = false, caption?: string, reply?: { name: string; text: string }): Step[] {
  const steps: Step[] = [{ after: 700, open: chat, caption }];
  for (let i = 1; i <= text.length; i++) steps.push({ after: i === 1 ? 450 : 55, run: (w) => (w.draft = text.slice(0, i)) });
  steps.push({
    after: 420,
    run: (w) => {
      w.draft = "";
      w.replyTo = null;
      arrive(w, chat, { id, kind: "text", from: "me", text, time, ticks: 1, ...(reacts ? { reaction: "" } : {}), ...(reply ? { reply } : {}) });
    },
  });
  steps.push({
    after: 650,
    run: (w) => {
      const m = msg(w, chat, id);
      if (m.kind === "text") m.ticks = 2;
    },
  });
  return steps;
}

/**
 * Someone else writing, at their own pace. Their "typing…" shows in the
 * chat list even when you are looking somewhere else, which is usually
 * where you are.
 */
function from(chat: ChatId, who: string, text: string, time: string, id: string, typingFor = 2200, notify = true, reacts = false): Step[] {
  return [
    { after: 1400, run: (w) => (w.chats[chat].typing = who) },
    {
      after: typingFor,
      run: (w) => {
        const c = w.chats[chat];
        const body = c.kind === "group" ? `${who[0].toUpperCase() + who.slice(1)}: ${text}` : text;
        arrive(w, chat, { id, kind: "text", from: who, text, time, ...(reacts ? { reaction: "" } : {}) }, notify ? { title: c.name, body } : undefined);
      },
    },
  ];
}

/* ─────────────────────────── the evening ─────────────────────────── */

/** You glance at the session. It has moved on since you last looked. */
const GLANCE = (t: Dict, bot: BotStrings): Step[] => [
  {
    after: 900,
    open: "aipager",
    wire: hook("PostToolUse", t.demo.wire.cardEdited),
    caption: t.demo.captions.glance,
    run: (w) => {
      const c = card(w, "aipager", "c1");
      c.items.push({ type: "row", text: "Bash: pnpm test e2e/login --repeat 5", done: true });
      c.items.push({ type: "prose", text: t.demo.claude.flaky });
      c.tally = "Read ×1 · Bash ×1";
      const p = pane(w, "api");
      p.lines.push({ text: "Bash(pnpm test e2e/login --repeat 5)", dot: "live", bold: true });
      p.lines.push({ text: "Tests: 1 failed, 4 passed", sub: true, tone: "amber" });
      p.lines.push({ text: t.demo.claude.flaky, dot: "fg" });
    },
  },
];

/** Mom asked twenty minutes ago. You answer her and put the phone down. */
const MOM_1 = (t: Dict, bot: BotStrings): Step[] => [
  look("mom", 1500, t.demo.captions.momFirst),
  ...say("mom", t.demo.says.youPasta, "21:04", "me1"),
  look("aipager", 1100, t.demo.captions.sent),
];

/** Auto mode: the safe calls run themselves and you never hear about them. */
const WORK_AUTO = (t: Dict, bot: BotStrings): Step[] => [
  {
    after: 800,
    wire: hook("PostToolUse", t.demo.wire.twoCalls),
    caption: t.demo.captions.workAuto,
    run: (w) => {
      const c = card(w, "aipager", "c1");
      c.items.push({ type: "row", text: "Read: src/auth/cookie.ts", done: true });
      c.items.push({ type: "row", text: "Bash: pnpm test e2e/login --trace on", done: true });
      c.tally = "Read ×2 · Bash ×2";
      c.verb = bot.spin[9];
      const p = pane(w, "api");
      p.lines.push({ text: "Read(src/auth/cookie.ts)", dot: "live", bold: true });
      p.lines.push({ text: "Read 128 lines", sub: true, tone: "dim" });
      p.lines.push({ text: "Bash(pnpm test e2e/login --trace on)", dot: "live", bold: true });
      p.spinner = SPIN[9];
    },
  },
  {
    after: 2600,
    wire: hook("PostToolUse", t.demo.wire.trace),
    run: (w) => {
      const c = card(w, "aipager", "c1");
      c.items.push({ type: "prose", text: t.demo.claude.cookie });
      const p = pane(w, "api");
      p.lines.push({ text: "Trace: click at 5.0s, Set-Cookie at 5.3s", sub: true, tone: "dim" });
      p.lines.push({ text: t.demo.claude.cookie, dot: "fg" });
    },
  },
];

/** Ask mode: the same two calls, one tap each, and you are the bottleneck. */
const WORK_ASK = (t: Dict, bot: BotStrings): Step[] => [
  {
    after: 800,
    wire: perm("PermissionRequest", t.demo.wire.permNeeded),
    caption: t.demo.captions.askRead,
    run: (w) => {
      const c = card(w, "aipager", "c1");
      c.mark = "🔐";
      c.verb = "";
      // `ask.read` already names the tool the way the language says it
      c.prompt = { kind: "perm", tool: "", what: t.modes.ask.read, command: "src/auth/cookie.ts", answered: false };
      w.chats.aipager.pinnedBar = pinBar(w, bot, "Read: src/auth/cookie.ts");
      const p = pane(w, "api");
      p.spinner = null;
      p.lines.push({ text: "Read(src/auth/cookie.ts)", dot: "live", bold: true });
      p.lines.push({ text: "Running PermissionRequest hook…", sub: true, tone: "amber" });
    },
  },
  {
    after: 400,
    gate: {
      chat: "aipager",
      msg: "c1",
      auto: 5000,
      choice: 0,
      resolve: (w) => {
        const c = card(w, "aipager", "c1");
        if (c.prompt?.kind === "perm") c.prompt.answered = true;
      },
    },
  },
  {
    after: 500,
    wire: back(bot.allow, t.demo.wire.readRuns),
    run: (w) => {
      const c = card(w, "aipager", "c1");
      c.prompt = null;
      c.mark = "⏳";
      c.verb = bot.spin[8];
      c.items.push({ type: "row", text: "Read: src/auth/cookie.ts", done: true });
      c.tally = "Read ×2 · Bash ×1";
      w.chats.aipager.pinnedBar = pinBar(w, bot);
      arrive(w, "aipager", { id: "ok0", kind: "text", from: "bot", text: fill(bot.tpl.answerLine, { icon: "✅", session: "api", verb: bot.line.verbAllow, detail: "Read: src/auth/cookie.ts" }), time: "21:05" });
      const p = pane(w, "api");
      p.lines = p.lines.filter((l) => l.text !== "Running PermissionRequest hook…");
      p.lines.push({ text: "Read 128 lines", sub: true, tone: "dim" });
      p.spinner = SPIN[2];
    },
  },
  {
    after: 1400,
    wire: perm("PermissionRequest", t.demo.wire.permNeeded),
    caption: t.demo.captions.askTest,
    run: (w) => {
      const c = card(w, "aipager", "c1");
      c.mark = "🔐";
      c.verb = "";
      c.prompt = { kind: "perm", tool: "Bash", what: "Run the login test with tracing", command: "pnpm test e2e/login --trace on", answered: false };
      w.chats.aipager.pinnedBar = pinBar(w, bot, "Bash: pnpm test e2e/login --trace on");
      const p = pane(w, "api");
      p.spinner = null;
      p.lines.push({ text: "Bash(pnpm test e2e/login --trace on)", dot: "live", bold: true });
      p.lines.push({ text: "Running PermissionRequest hook…", sub: true, tone: "amber" });
    },
  },
  {
    after: 400,
    gate: {
      chat: "aipager",
      msg: "c1",
      auto: 4500,
      choice: 0,
      resolve: (w) => {
        const c = card(w, "aipager", "c1");
        if (c.prompt?.kind === "perm") c.prompt.answered = true;
      },
    },
  },
  {
    after: 500,
    wire: back(bot.allow, t.demo.wire.testRuns),
    run: (w) => {
      const c = card(w, "aipager", "c1");
      c.prompt = null;
      c.mark = "⏳";
      c.verb = bot.spin[5];
      c.items.push({ type: "row", text: "Bash: pnpm test e2e/login --trace on", done: true });
      c.items.push({ type: "prose", text: t.demo.claude.cookie });
      c.tally = "Read ×2 · Bash ×2";
      w.chats.aipager.pinnedBar = pinBar(w, bot);
      arrive(w, "aipager", { id: "ok1", kind: "text", from: "bot", text: fill(bot.tpl.answerLine, { icon: "✅", session: "api", verb: bot.line.verbAllow, detail: "Bash: pnpm test e2e/login --trace on" }), time: "21:06" });
      const p = pane(w, "api");
      p.lines = p.lines.filter((l) => l.text !== "Running PermissionRequest hook…");
      p.lines.push({ text: "Trace: click at 5.0s, Set-Cookie at 5.3s", sub: true, tone: "dim" });
      p.lines.push({ text: t.demo.claude.cookie, dot: "fg" });
      p.spinner = SPIN[2];
    },
  },
];

/** Full access: no checks at all, so the same work goes by in one breath. */
const WORK_FULL = (t: Dict, bot: BotStrings): Step[] => [
  {
    after: 900,
    wire: hook("PostToolUse", t.demo.wire.threeCalls),
    caption: t.demo.captions.workFull,
    run: (w) => {
      const c = card(w, "aipager", "c1");
      c.items.push({ type: "row", text: "Read: src/auth/cookie.ts", done: true });
      c.items.push({ type: "row", text: "Bash: pnpm test e2e/login --trace on", done: true });
      c.items.push({ type: "prose", text: t.demo.claude.cookie });
      c.tally = "Read ×2 · Bash ×2";
      c.verb = bot.spin[9];
      const p = pane(w, "api");
      p.lines.push({ text: "Read(src/auth/cookie.ts)", dot: "live", bold: true });
      p.lines.push({ text: "Bash(pnpm test e2e/login --trace on)", dot: "live", bold: true });
      p.lines.push({ text: "Trace: click at 5.0s, Set-Cookie at 5.3s", sub: true, tone: "dim" });
      p.lines.push({ text: t.demo.claude.cookie, dot: "fg" });
      p.spinner = SPIN[9];
    },
  },
];

/** Mom writes back while you are elsewhere. You go, answer, and leave again. */
const MOM_2 = (t: Dict, bot: BotStrings): Step[] => [
  ...from("mom", "mom", t.demo.says.momLunch, "21:07", "mom2", 2400),
  look("mom", 1500, t.demo.captions.momAgain),
  ...say("mom", t.demo.says.youLunch, "21:08", "me2"),
  look("aipager", 1200),
];

/** The team's group, where the bot answers to everyone by their own role. */
const TEAM = (t: Dict, bot: BotStrings): Step[] => [
  ...from("team", "sara", t.demo.says.teamRun, "21:09", "t3", 2300),
  look("team", 1600, t.demo.captions.team),
  {
    after: 1100,
    caption: t.demo.captions.teamSara,
    run: (w) => {
      arrive(w, "team", {
        id: "tc1",
        kind: "card",
        session: "web",
        items: [{ type: "row", text: "Bash: pnpm e2e login --env staging", done: false }],
        mark: "⏳",
        verb: bot.spin[5],
        elapsed: 8,
        tally: "Bash ×1",
        prompt: null,
        time: "21:09",
      });
      w.term = "web";
      const web = pane(w, "web");
      // A group prompt carries the sender and the role it runs as; in a DM
      // the marker is just the handle.
      web.lines.push({ text: t.demo.prompts.teamRun, user: true, via: "@sara", role: "admin" });
      web.lines.push({ text: "Bash(pnpm e2e login --env staging)", dot: "live", bold: true });
      web.spinner = SPIN[5];
      web.secs = 8;
      web.status = "[web] Sonnet 5.5 | 6% ctx | $0.02";
      w.chats.aipager.pinnedBar = pinBar(w, bot);
    },
  },
  ...from("team", "sam", t.demo.says.teamKubectl, "21:10", "t4", 2000),
  {
    after: 1200,
    caption: t.demo.captions.teamSam,
    run: (w) =>
      arrive(w, "team", {
        id: "t5",
        kind: "text",
        from: "bot",
        text: fill(bot.tpl.blocked, { session: "web", tool: "Bash", person: "@sam", role: "user" }),
        time: "21:10",
        reply: { name: "Sam", text: t.demo.says.teamKubectl },
      }),
  },
  {
    after: 2400,
    run: (w) => {
      const c = card(w, "team", "tc1");
      c.items[0] = { type: "row", text: "Bash: pnpm e2e login --env staging", done: true };
      c.mark = "✅";
      c.verb = bot.line.verbDone;
      c.elapsed = 72;
      arrive(w, "team", { id: "ta1", kind: "answer", session: "web", text: t.demo.claude.teamTests, time: "21:10", reaction: "" });
      const p = pane(w, "web");
      p.spinner = null;
      w.chats.aipager.pinnedBar = pinBar(w, bot);
      p.lines.push({ text: "18 passed (41s)", sub: true, tone: "live" });
      p.lines.push({ text: t.demo.claude.teamShort, dot: "fg" });
    },
  },
  {
    after: 1400,
    run: (w) => {
      const m = msg(w, "team", "ta1");
      if (m.kind === "answer") m.reaction = "🙌 2";
    },
  },
];

/** Claude has a decision to make. Not a permission: a question. */
function decide(mode: Mode, t: Dict, bot: BotStrings): Step[] {
  return [
    {
      after: 1800,
      wire: perm("PreToolUse", t.demo.wire.question),
      caption:
        mode === "auto"
          ? t.demo.captions.questionAuto
          : t.demo.captions.questionAsk,
      run: (w) => {
        w.term = "api";
        const c = card(w, "aipager", "c1");
        c.mark = "❓";
        c.verb = t.demo.question.verb;
        c.prompt = { kind: "question", question: t.demo.question.question, options: [...t.demo.question.options], answered: null };
        w.chats.aipager.pinnedBar = pinBar(w, bot, t.demo.question.question);
        const p = pane(w, "api");
        p.spinner = null;
        p.dialog = { kind: "question", title: t.demo.question.title, body: [t.demo.question.body, t.demo.question.question], options: [...t.demo.question.options], selected: 0 };
      },
    },
    look("aipager", 1600, t.demo.captions.buzzed),
    {
      after: 400,
      gate: {
        chat: "aipager",
        msg: "c1",
        auto: 6500,
        choice: 1,
        resolve: (w, choice) => {
          const c = card(w, "aipager", "c1");
          if (c.prompt?.kind === "question") c.prompt.answered = choice;
          const p = pane(w, "api");
          if (p.dialog) p.dialog.selected = choice;
        },
      },
    },
    {
      after: 700,
      wire: back(t.demo.question.options[1], t.demo.wire.answerTyped),
      caption: t.demo.captions.answerTyped,
      run: (w) => {
        const c = card(w, "aipager", "c1");
        const choice = c.prompt?.kind === "question" && c.prompt.answered !== null ? c.prompt.options[c.prompt.answered] : "Wait for the cookie";
        c.prompt = null;
        c.mark = "⏳";
        // the card's verb is always one of the product's own spinner words;
        // the Edit row right below says which file
        c.verb = bot.spin[11];
        // The run behind us settles into one line, the way a long card keeps
        // itself readable: its words stay, its tool calls fold.
        c.items = [
          { type: "prose", text: t.demo.claude.plan },
          { type: "fold", n: 4 },
          { type: "prose", text: t.demo.claude.cookie },
          { type: "row", text: "Edit: e2e/login.spec.ts", done: true },
          { type: "row", text: "Bash: pnpm test e2e/login --repeat 10", done: false },
        ];
        c.tally = "Read ×2 · Bash ×2 · Edit ×1";
        w.chats.aipager.pinnedBar = pinBar(w, bot);
        arrive(w, "aipager", { id: "ok3", kind: "text", from: "bot", text: fill(bot.tpl.answered, { session: "api", question: t.demo.question.question, option: choice }), time: "21:12", reply: { name: "aipager", text: `❓ api · ${t.demo.question.question}` } });
        const p = pane(w, "api");
        p.dialog = null;
        p.lines.push({ text: `User answered: ${choice}`, sub: true, tone: "dim" });
        p.lines.push({ text: "Update(e2e/login.spec.ts)", dot: "live", bold: true });
        p.lines.push({ text: "Updated e2e/login.spec.ts with 3 additions and 1 removal", sub: true, tone: "dim" });
        p.lines.push({ text: "Bash(pnpm test e2e/login --repeat 10)", dot: "live", bold: true });
        p.spinner = SPIN[5];
      },
    },
  ];
}

/** Friday football, while the tests run ten times over. */
const FRIENDS = (t: Dict, bot: BotStrings): Step[] => [
  ...from("friends", "leo", t.demo.says.friendsWho, "21:13", "f4", 1800, false),
  look("friends", 1700, t.demo.captions.friends),
  ...say("friends", t.demo.says.youIn, "21:13", "me3"),
  look("aipager", 1300),
];

/** The turn ends the way every other message arrives. */
const ANSWER = (t: Dict, bot: BotStrings): Step[] => [
  {
    after: 1500,
    wire: hook("Stop", t.demo.wire.claudeAnswer),
    caption: t.demo.captions.answerDone,
    run: (w) => {
      const c = card(w, "aipager", "c1");
      const r = c.items.find((x) => x.type === "row" && x.text.startsWith("Bash: pnpm test e2e/login --repeat 10"));
      if (r && r.type === "row") r.done = true;
      c.mark = "✅";
      c.verb = bot.line.verbDone;
      c.tally = "Read ×2 · Bash ×3 · Edit ×1";
      w.chats.aipager.pinnedBar = pinBar(w, bot);
      arrive(
        w,
        "aipager",
        { id: "a1", kind: "answer", session: "api", text: t.demo.claude.answer, time: "21:15" },
        { title: t.demo.chats.aipager.name, body: `💬 api · ${t.demo.claude.answer.slice(0, 54)}…` },
      );
      const p = pane(w, "api");
      p.spinner = null;
      p.lines.push({ text: "Tests: 10 passed, 10 total", sub: true, tone: "live" });
      p.lines.push({ text: t.demo.claude.answer, dot: "fg" });
    },
  },
  { after: 3400, caption: t.demo.captions.evening },
];

/* ─────────────────────── the second errand ───────────────────────
 * The work is done, and the next thing that pings is not work at all.
 * You start a second session for it from the same chat, it sends two
 * agents out to look, and while they are gone you still have the first
 * session to answer, which is where replying to a message earns its
 * keep: it is how aipager knows which session you mean.
 */

/** The one you send while it is still working, which Claude has to queue. */
const morePrompt = (t: Dict) => t.demo.prompts.more;
const tripPrompt = (t: Dict) => t.demo.prompts.trip;

const ACT2 = (t: Dict, bot: BotStrings): Step[] => [
  ...from("sara", "sara", t.demo.says.saraVacation, "21:20", "sv1", 2000),
  look("sara", 1700, t.demo.captions.saraPing),
  ...say("sara", t.demo.says.youTwoMinutes, "21:20", "me4"),

  look("aipager", 1600, t.demo.captions.second),
  ...say("aipager", "/new trip", "21:21", "u3"),
  {
    after: 900,
    wire: back("/new trip", t.demo.wire.sessionIn),
    caption: t.demo.captions.newReady,
    run: (w) => {
      arrive(w, "aipager", { id: "nw", kind: "text", from: "bot", text: `${fill(bot.tpl.ready, { session: "trip" })} · ${fill(bot.tpl.readySettings, { mode: bot.modes.auto, model: "Sonnet 5.5", folder: "~/travel" })}`, time: "21:21" });
      w.term = "trip";
      w.panes.push({
        id: "trip",
        lines: [
          { text: "~/travel $ aipager session trip", tone: "dim" },
          { text: "✻ Welcome to Claude Code!", tone: "claude", bold: true },
        ],
        spinner: null,
        secs: 0,
        dialog: null,
        input: "",
        status: "[trip] Sonnet 5.5 | 1% ctx | $0.00",
      });
      w.chats.aipager.pinnedBar = pinBar(w, bot);
    },
  },
  ...say("aipager", tripPrompt(t), "21:22", "u4", true),
  {
    after: 700,
    wire: back(t.demo.wire.yourMessage, t.demo.wire.typedTrip),
    run: (w) => {
      const m = msg(w, "aipager", "u4");
      if (m.kind === "text") m.reaction = "👀";
      const p = pane(w, "trip");
      p.lines.push({ text: tripPrompt(t), user: true, via: "@owner" });
      p.spinner = SPIN[2];
      p.secs = 2;
      w.chats.aipager.pinnedBar = pinBar(w, bot);
    },
  },
  {
    after: 1100,
    wire: hook("UserPromptSubmit", t.demo.wire.newCardTrip),
    run: (w) => {
      const m = msg(w, "aipager", "u4");
      if (m.kind === "text") m.reaction = "👍";
      arrive(w, "aipager", {
        id: "c3",
        kind: "card",
        session: "trip",
        items: [{ type: "prose", text: t.demo.claude.weather }],
        mark: "⏳",
        verb: bot.spin[8],
        elapsed: 3,
        tally: "",
        prompt: null,
        time: "21:22",
      });
      const p = pane(w, "trip");
      p.lines.push({ text: t.demo.claude.weather, dot: "fg" });
    },
  },
  {
    after: 2400,
    wire: hook("PostToolUse", t.demo.wire.lisbon),
    caption: t.demo.captions.weather,
    run: (w) => {
      const c = card(w, "aipager", "c3");
      c.items.push({ type: "row", text: "WebFetch: climate, Lisbon, March", done: true });
      c.items.push({ type: "prose", text: t.demo.claude.lisbon });
      c.tally = "WebFetch ×1";
      const p = pane(w, "trip");
      p.lines.push({ text: "WebFetch(climate, Lisbon, March)", dot: "live", bold: true });
      p.lines.push({ text: "18°C by day · rain 2 of 7 days", sub: true, tone: "dim" });
      p.lines.push({ text: t.demo.claude.lisbon, dot: "fg" });
    },
  },
  ...say("aipager", morePrompt(t), "21:23", "u6", true),
  {
    after: 650,
    wire: hook(t.demo.wire.yourMessage, t.demo.wire.queued),
    caption: t.demo.captions.queued,
    run: (w) => {
      const m = msg(w, "aipager", "u6");
      if (m.kind === "text") {
        m.reaction = "👀";
        m.queued = true;
      }
      const p = pane(w, "trip");
      p.lines.push({ text: morePrompt(t), user: true, via: "@owner", queued: true });
    },
  },
  {
    after: 800,
    caption: t.demo.captions.queueLine,
    run: (w) => {
      arrive(w, "aipager", {
        id: "q1",
        kind: "queue",
        text: bot.line.queued,
        button: bot.btn.sendNow,
        time: "21:23",
        reply: { name: "You", text: morePrompt(t) },
      });
    },
  },
  {
    after: 1500,
    wire: back("claude-trip", t.demo.wire.tookIt),
    caption: t.demo.captions.tookIt,
    run: (w) => {
      const m = msg(w, "aipager", "u6");
      if (m.kind === "text") {
        m.reaction = "👍";
        m.queued = false;
      }
      drop(w, "aipager", "q1");
      const p = pane(w, "trip");
      for (const l of p.lines) if (l.queued) l.queued = false;
      p.spinner = SPIN[10];
      p.tokens = "2.1k";
    },
  },
  {
    // Telegram cannot move a message, so aipager sends the card again under
    // the message Claude is now answering and deletes the old copy. Same
    // card, same clock, one message lower.
    after: 320,
    run: (w) => moveCard(w, "aipager", "c3"),
  },
  {
    after: 1600,
    wire: hook("SubagentStart", t.demo.wire.twoAgents),
    caption: t.demo.captions.agents,
    run: (w) => {
      const c = card(w, "aipager", "c3");
      c.verb = bot.spin[10];
      c.items.push({ type: "prose", text: t.demo.claude.twoAgents });
      // the parent's own Agent calls, then the agents themselves
      c.items.push({ type: "row", text: "Agent", done: true });
      c.items.push({ type: "row", text: "Agent", done: true });
      c.items.push({ type: "agent", name: "general-purpose", state: "run", what: "starting", secs: 2 });
      c.items.push({ type: "agent", name: "general-purpose", state: "run", what: "starting", secs: 1 });
      c.tally = "WebFetch ×1 · Agent ×2";
      const p = pane(w, "trip");
      p.agents = 2;
      p.lines.push({ text: t.demo.claude.twoAgents, dot: "fg" });
      p.lines.push({
        text: "",
        agents: {
          done: false,
          rows: [
            { type: "general-purpose", desc: "hotels in Lisbon under €180", last: "Initializing…" },
            { type: "general-purpose", desc: "flights BER→LIS, 12 and 19 March", last: "Initializing…" },
          ],
        },
      });
      p.panel = [
        { name: "general-purpose", what: "Starting", clock: "0:02", tokens: "1.1k tokens" },
        { name: "general-purpose", what: "Starting", clock: "0:01", tokens: "0.9k tokens" },
      ];
      w.chats.aipager.pinnedBar = pinBar(w, bot);
    },
  },
  {
    after: 5000,
    caption: t.demo.captions.agentsWork,
    run: (w) => {
      const c = card(w, "aipager", "c3");
      const [a1, a2] = c.items.filter((x) => x.type === "agent");
      if (a1?.type === "agent") {
        a1.what = "WebFetch: booking.com";
        a1.secs = 24;
        a1.fold = 3;
      }
      if (a2?.type === "agent") {
        a2.what = "WebSearch: TAP direct BER LIS March";
        a2.secs = 23;
      }
      const p = pane(w, "trip");
      const block = p.lines.find((l) => l.agents);
      if (block?.agents) {
        block.agents.rows[0] = { ...block.agents.rows[0], uses: 4, tokens: "9.2k", last: "WebFetch(booking.com)" };
        block.agents.rows[1] = { ...block.agents.rows[1], uses: 3, tokens: "7.4k", last: "WebSearch(TAP direct BER LIS)" };
      }
      p.tokens = "11.8k";
      p.panel = [
        { name: "general-purpose", what: "booking.com", clock: "0:24", tokens: "9.2k tokens" },
        { name: "general-purpose", what: "TAP direct", clock: "0:23", tokens: "7.4k tokens" },
      ];
    },
  },
  // While they are out, the first session still needs an answer, and with
  // two live in one chat, the reply is how you say which one you mean.
  {
    after: 1600,
    caption: t.demo.captions.twoSessions,
    run: (w) => {
      w.focus = "a1";
    },
  },
  {
    after: 1500,
    run: (w) => {
      w.press = "a1";
    },
  },
  {
    after: 650,
    caption: t.demo.captions.hold,
    run: (w) => {
      w.press = null;
      w.menu = { msg: "a1", items: [...t.demo.menu], on: -1 };
    },
  },
  {
    after: 900,
    run: (w) => {
      if (w.menu) w.menu = { ...w.menu, on: 0 };
    },
  },
  {
    after: 700,
    caption: t.demo.captions.reply,
    run: (w) => {
      w.menu = null;
      w.focus = null;
      w.replyTo = { id: "a1", name: t.demo.chats.aipager.name, text: `💬 api · ${t.demo.claude.answer.slice(0, 54)}…` };
    },
  },
  ...say("aipager", t.demo.prompts.push, "21:24", "u5", true, undefined, {
    name: "aipager",
    text: `💬 api · ${t.demo.claude.answer.slice(0, 54)}…`,
  }),
  {
    after: 800,
    wire: back(t.demo.wire.aReply, t.demo.wire.aimed),
    caption: t.demo.captions.aimed,
    run: (w) => {
      const m = msg(w, "aipager", "u5");
      if (m.kind === "text") m.reaction = "👀";
      const p = pane(w, "api");
      p.lines.push({ text: t.demo.prompts.push, user: true, via: "@owner" });
      p.spinner = SPIN[5];
      p.tokens = "1.4k";
      w.chats.aipager.pinnedBar = pinBar(w, bot);
    },
  },
  {
    after: 1400,
    wire: hook("UserPromptSubmit", t.demo.wire.cardApi),
    run: (w) => {
      const m = msg(w, "aipager", "u5");
      if (m.kind === "text") m.reaction = "👍";
      arrive(w, "aipager", {
        id: "c4",
        kind: "card",
        session: "api",
        items: [{ type: "row", text: "Bash: git push -u origin fix/login-cookie", done: false }],
        mark: "⏳",
        verb: bot.spin[5],
        elapsed: 2,
        tally: "Bash ×1",
        prompt: null,
        time: "21:24",
      });
      const p = pane(w, "api");
      p.lines.push({ text: "Bash(git push -u origin fix/login-cookie)", dot: "live", bold: true });
    },
  },
  {
    after: 5500,
    wire: hook("Stop", t.demo.wire.interim),
    caption: t.demo.captions.interim,
    run: (w) => {
      const c = card(w, "aipager", "c3");
      c.mark = "🔄";
      c.verb = bot.count.agents2;
      arrive(w, "aipager", {
        id: "a5",
        kind: "answer",
        session: "trip",
        text: t.demo.claude.interim,
        time: "21:24",
        background: {
          agents: 2,
          shells: 0,
          rows: [
            { name: "general-purpose", state: "run", what: "Fetching booking.com" },
            { name: "general-purpose", state: "run", what: "Searching the web for TAP direct BER LIS" },
          ],
          promise: bot.line.promise,
        },
      });
      const p = pane(w, "trip");
      p.spinner = null;
      w.chats.aipager.pinnedBar = pinBar(w, bot);
    },
  },
  {
    after: 2600,
    wire: hook("Stop", t.demo.wire.thePr),
    caption: t.demo.captions.apiFirst,
    run: (w) => {
      const c = card(w, "aipager", "c4");
      const r = c.items[0];
      if (r.type === "row") r.done = true;
      c.mark = "✅";
      c.verb = bot.line.verbDone;
      arrive(w, "aipager", { id: "a3", kind: "answer", session: "api", text: t.demo.claude.pr, time: "21:25" });
      const p = pane(w, "api");
      p.spinner = null;
      p.lines.push({ text: t.demo.claude.pr, dot: "fg" });
      w.chats.aipager.pinnedBar = pinBar(w, bot);
    },
  },
  {
    after: 5000,
    caption: t.demo.captions.liveLine,
    run: (w) => {
      // the agents report on the message above the PR's answer; the chat
      // goes up to it, so the wait reads as work, not as a stuck screen
      w.focus = "a5";
      const m = msg(w, "aipager", "a5");
      if (m.kind === "answer" && m.background) {
        m.background.rows = [
          { name: "general-purpose", state: "run", what: "Reading reviews for 6 places" },
          { name: "general-purpose", state: "run", what: "Fetching tap.pt" },
        ];
      }
      const c = card(w, "aipager", "c3");
      const [a1, a2] = c.items.filter((x) => x.type === "agent");
      if (a1?.type === "agent") {
        a1.what = "Read: 6 reviews";
        a1.fold = 6;
      }
      if (a2?.type === "agent") {
        a2.what = "WebFetch: tap.pt";
        a2.fold = 3;
      }
      const p = pane(w, "trip");
      const block = p.lines.find((l) => l.agents);
      if (block?.agents) {
        block.agents.rows[0] = { ...block.agents.rows[0], uses: 7, tokens: "18.4k", last: "Read(reviews.json)" };
        block.agents.rows[1] = { ...block.agents.rows[1], uses: 5, tokens: "12.1k", last: "WebFetch(tap.pt)" };
      }
      p.panel = [
        { name: "general-purpose", what: "6 reviews", clock: "1:42", tokens: "18.4k tokens" },
        { name: "general-purpose", what: "tap.pt", clock: "1:41", tokens: "12.1k tokens" },
      ];
    },
  },
  {
    after: 6000,
    wire: hook("SubagentStop", t.demo.wire.flightsDone),
    run: (w) => {
      const c = card(w, "aipager", "c3");
      const a2 = c.items.filter((x) => x.type === "agent")[1];
      if (a2?.type === "agent") {
        a2.state = "done";
        a2.calls = 7;
        a2.secs = 161;
      }
      const m = msg(w, "aipager", "a5");
      if (m.kind === "answer" && m.background) {
        m.background.rows = [
          { name: "general-purpose", state: "run", what: "Reading reviews for 6 places" },
          { name: "general-purpose", state: "done", clock: "2:41" },
        ];
        m.background.agents = 1;
      }
      const p = pane(w, "trip");
      p.agents = 1;
      p.panel = [{ name: "general-purpose", what: "6 reviews", clock: "2:38", tokens: "27.9k tokens" }];
      w.chats.aipager.pinnedBar = pinBar(w, bot);
    },
  },
  {
    after: 5500,
    wire: hook("SubagentStop", t.demo.wire.hotelsDone),
    caption: t.demo.captions.bothBack,
    run: (w) => {
      const c = card(w, "aipager", "c3");
      const a1 = c.items.filter((x) => x.type === "agent")[0];
      if (a1?.type === "agent") {
        a1.state = "done";
        a1.calls = 11;
        a1.secs = 192;
      }
      c.mark = "✅";
      c.verb = bot.line.verbDone;
      const m = msg(w, "aipager", "a5");
      if (m.kind === "answer" && m.background) {
        m.background.agents = 0;
        m.background.rows = [];
        m.background.promise = null;
        m.background.done = fill(bot.count.agentsDone2, { clock: "3:12" });
      }
      const p = pane(w, "trip");
      p.agents = 0;
      const block = p.lines.find((l) => l.agents);
      if (block?.agents) {
        block.agents.done = true;
        block.agents.rows[0] = { ...block.agents.rows[0], uses: 11, tokens: "31.6k", last: "Done (11 tool uses · 31.6k tokens · 3m 12s)" };
        block.agents.rows[1] = { ...block.agents.rows[1], uses: 7, tokens: "19.8k", last: "Done (7 tool uses · 19.8k tokens · 2m 41s)" };
      }
      p.spinner = SPIN[1];
      p.tokens = "34.2k";
      p.panel = undefined;
      w.chats.aipager.pinnedBar = pinBar(w, bot);
    },
  },
  {
    after: 3200,
    wire: hook("Stop", t.demo.wire.shortlist),
    caption: t.demo.captions.shortlist,
    run: (w) => {
      // back to the bottom, where the shortlist lands
      w.focus = null;
      arrive(
        w,
        "aipager",
        {
          id: "a4",
          kind: "answer",
          session: "trip",
          text: t.demo.claude.shortlist,
          time: "21:27",
        },
        { title: t.demo.chats.aipager.name, body: `💬 trip · ${t.demo.claude.shortlist.slice(0, 40)}…` },
      );
      const p = pane(w, "trip");
      p.spinner = null;
      p.lines.push({ text: t.demo.claude.shortlist, dot: "fg" });
      w.chats.aipager.pinnedBar = pinBar(w, bot);
    },
  },
  look("sara", 2200, t.demo.captions.human),
  ...say("sara", t.demo.says.youBook, "21:26", "me5"),
  ...from("sara", "sara", t.demo.says.saraBook, "21:26", "sv2", 1600),
  { after: 2600, caption: t.demo.captions.end },
];

/* ───────────────────── full access: the way in ───────────────────── */

const FULL_SWITCH = (t: Dict, bot: BotStrings): Step[] => [
  look("aipager", 600, t.demo.captions.resting),
  ...say("aipager", "/mode full", "21:00", "pm"),
  {
    after: 900,
    wire: perm("/mode full", t.demo.wire.switchFull),
    run: (w) =>
      arrive(w, "aipager", {
        id: "cf",
        kind: "confirm",
        text: fill(bot.tpl.confirmFull, { session: "api", mode: bot.modes.full }).split("\n")[0],
        note: fill(bot.tpl.confirmFull, { session: "api", mode: bot.modes.full }).split("\n").slice(1).join(" "),
        buttons: [bot.btn.toFull, bot.btn.cancel],
        answered: null,
        done: null,
        time: "21:00",
      }),
  },
  { after: 700, caption: t.demo.captions.fullWho },
  {
    after: 300,
    gate: {
      chat: "aipager",
      msg: "cf",
      auto: 6000,
      choice: 0,
      resolve: (w, choice) => {
        const m = msg(w, "aipager", "cf");
        if (m.kind === "confirm") m.answered = choice;
      },
    },
  },
  {
    after: 800,
    wire: back(bot.btn.toFull, t.demo.wire.restarting),
    caption: t.demo.captions.fullRestart,
    run: (w) => {
      const m = msg(w, "aipager", "cf");
      if (m.kind === "confirm") m.done = fill(bot.tpl.switched, { session: "api", mode: bot.modes.full });
      const p = pane(w, "api");
      p.lines = [
        { text: "~/work/api $ claude --resume 4f2a91c --dangerously-skip-permissions", tone: "dim" },
        { text: "✻ Welcome back!", tone: "claude", bold: true },
        { text: "  Resumed: expire idle sessions after 30 minutes", tone: "dim" },
      ];
      p.bypass = true;
    },
  },
];

/** Where every evening starts: you give the session its next job. */
const TASK = (t: Dict, bot: BotStrings): Step[] => [
  ...say("aipager", t.demo.prompts.fix, "21:01", "u1", true, t.demo.captions.restAuto),
  {
    after: 700,
    wire: back(t.demo.wire.yourMessage, t.demo.wire.typedApi),
    caption: t.demo.captions.arrived,
    run: (w) => {
      const m = msg(w, "aipager", "u1");
      if (m.kind === "text") m.reaction = "👀";
      const p = pane(w, "api");
      p.lines.push({ text: t.demo.prompts.fix, user: true, via: "@owner" });
      p.spinner = SPIN[2];
      p.secs = 1;
      w.chats.aipager.pinnedBar = pinBar(w, bot);
    },
  },
  {
    after: 1100,
    wire: hook("UserPromptSubmit", t.demo.wire.newCardApi),
    caption: t.demo.captions.took,
    run: (w) => {
      const m = msg(w, "aipager", "u1");
      if (m.kind === "text") m.reaction = "👍";
      arrive(w, "aipager", {
        id: "c1",
        kind: "card",
        session: "api",
        items: [
          { type: "prose", text: t.demo.claude.plan },
          { type: "row", text: "Read: e2e/login.spec.ts", done: true },
        ],
        mark: "⏳",
        verb: bot.spin[2],
        elapsed: 6,
        tally: "Read ×1",
        prompt: null,
        time: "21:02",
      });
      const p = pane(w, "api");
      p.lines.push({ text: t.demo.claude.plan, dot: "fg" });
      p.lines.push({ text: "Read(e2e/login.spec.ts)", dot: "live", bold: true });
      p.lines.push({ text: "Read 64 lines", sub: true, tone: "dim" });
    },
  },
];

export function storyFor(mode: Mode, t: Dict, bot: BotStrings): Step[] {
  const work = mode === "ask" ? WORK_ASK(t, bot) : mode === "full" ? WORK_FULL(t, bot) : WORK_AUTO(t, bot);
  const start = mode === "full" ? FULL_SWITCH(t, bot) : [];
  return [
    ...start,
    ...TASK(t, bot),
    ...GLANCE(t, bot),
    ...MOM_1(t, bot),
    ...work,
    ...MOM_2(t, bot),
    ...TEAM(t, bot),
    ...decide(mode, t, bot),
    ...FRIENDS(t, bot),
    ...ANSWER(t, bot),
    ...ACT2(t, bot),
  ];
}

export { open };
