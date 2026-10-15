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
import { arrive, card, msg, open, pane, pinBar, type ChatId, type Mode, type Spark, type World } from "./world";

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
 * chat list even when you are looking somewhere else — which is usually
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
const GLANCE: Step[] = [
  {
    after: 900,
    open: "aipager",
    wire: hook("PostToolUse", "card edited · Bash ×1"),
    caption: "It runs the test a few times. Every step it takes edits the same card.",
    run: (w) => {
      const c = card(w, "aipager", "c1");
      c.items.push({ type: "row", text: "Bash: pnpm test e2e/login --repeat 5", done: true });
      c.items.push({ type: "prose", text: "It fails about one run in five. Timing, not logic." });
      c.tally = "Read ×1 · Bash ×1";
      const p = pane(w, "api");
      p.lines.push({ text: "Bash(pnpm test e2e/login --repeat 5)", dot: "live", bold: true });
      p.lines.push({ text: "Tests: 1 failed, 4 passed", sub: true, tone: "amber" });
      p.lines.push({ text: "It fails about one run in five. Timing, not logic.", dot: "fg" });
    },
  },
];

/** Mom asked twenty minutes ago. You answer her and put the phone down. */
const MOM_1: Step[] = [
  look("mom", 1500, "Mom asked twenty minutes ago. Nothing here needs you, so you answer her."),
  ...say("mom", "yes! made pasta 🍝 you?", "21:04", "me1"),
  look("aipager", 1100, "Sent. You leave the chat, the way anyone does."),
];

/** Auto mode: the safe calls run themselves and you never hear about them. */
const WORK_AUTO: Step[] = [
  {
    after: 800,
    wire: hook("PostToolUse", "two calls, nothing to tap"),
    caption: "Auto mode, where every new session starts: Claude Code's own safety check ran the read and the test run itself. Neither came to you.",
    run: (w) => {
      const c = card(w, "aipager", "c1");
      c.items.push({ type: "row", text: "Read: src/auth/cookie.ts", done: true });
      c.items.push({ type: "row", text: "Bash: pnpm test e2e/login --trace on", done: true });
      c.tally = "Read ×2 · Bash ×2";
      c.verb = "Investigating";
      const p = pane(w, "api");
      p.lines.push({ text: "Read(src/auth/cookie.ts)", dot: "live", bold: true });
      p.lines.push({ text: "Read 128 lines", sub: true, tone: "dim" });
      p.lines.push({ text: "Bash(pnpm test e2e/login --trace on)", dot: "live", bold: true });
      p.spinner = "Investigating";
    },
  },
  {
    after: 2600,
    wire: hook("PostToolUse", "the trace, and what it found"),
    run: (w) => {
      const c = card(w, "aipager", "c1");
      c.items.push({ type: "prose", text: "The test clicks before the session cookie is set. It sleeps 5s and hopes." });
      const p = pane(w, "api");
      p.lines.push({ text: "Trace: click at 5.0s, Set-Cookie at 5.3s", sub: true, tone: "dim" });
      p.lines.push({ text: "The test clicks before the session cookie is set. It sleeps 5s and hopes.", dot: "fg" });
    },
  },
];

/** Ask mode: the same two calls, one tap each, and you are the bottleneck. */
const WORK_ASK: Step[] = [
  {
    after: 800,
    wire: perm("PermissionRequest", "🔐 Permission needed"),
    caption: "Ask mode: every call waits for you — this one only wants to read a file.",
    run: (w) => {
      const c = card(w, "aipager", "c1");
      c.mark = "🔐";
      c.verb = "Permission needed";
      c.prompt = { kind: "perm", tool: "Read", what: "Read the cookie helper", command: "src/auth/cookie.ts", answered: false };
      w.chats.aipager.pinnedBar = pinBar(w, "Read: src/auth/cookie.ts");
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
    wire: back("✅ Allow", "verdict · the read runs"),
    run: (w) => {
      const c = card(w, "aipager", "c1");
      c.prompt = null;
      c.mark = "⏳";
      c.verb = "Reading";
      c.items.push({ type: "row", text: "Read: src/auth/cookie.ts", done: true });
      c.tally = "Read ×2 · Bash ×1";
      w.chats.aipager.pinnedBar = pinBar(w);
      arrive(w, "aipager", { id: "ok0", kind: "text", from: "bot", text: "✅ api · Allowed · Read: src/auth/cookie.ts", time: "21:05" });
      const p = pane(w, "api");
      p.lines = p.lines.filter((l) => l.text !== "Running PermissionRequest hook…");
      p.lines.push({ text: "Read 128 lines", sub: true, tone: "dim" });
      p.spinner = "Pondering";
    },
  },
  {
    after: 1400,
    wire: perm("PermissionRequest", "🔐 Permission needed"),
    caption: "And again for the test run. In Auto mode neither of these would have asked at all.",
    run: (w) => {
      const c = card(w, "aipager", "c1");
      c.mark = "🔐";
      c.verb = "Permission needed";
      c.prompt = { kind: "perm", tool: "Bash", what: "Run the login test with tracing", command: "pnpm test e2e/login --trace on", answered: false };
      w.chats.aipager.pinnedBar = pinBar(w, "Bash: pnpm test e2e/login --trace on");
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
    wire: back("✅ Allow", "verdict · the test runs"),
    run: (w) => {
      const c = card(w, "aipager", "c1");
      c.prompt = null;
      c.mark = "⏳";
      c.verb = "Testing";
      c.items.push({ type: "row", text: "Bash: pnpm test e2e/login --trace on", done: true });
      c.items.push({ type: "prose", text: "The test clicks before the session cookie is set. It sleeps 5s and hopes." });
      c.tally = "Read ×2 · Bash ×2";
      w.chats.aipager.pinnedBar = pinBar(w);
      arrive(w, "aipager", { id: "ok1", kind: "text", from: "bot", text: "✅ api · Allowed · Bash: pnpm test e2e/login --trace on", time: "21:06" });
      const p = pane(w, "api");
      p.lines = p.lines.filter((l) => l.text !== "Running PermissionRequest hook…");
      p.lines.push({ text: "Trace: click at 5.0s, Set-Cookie at 5.3s", sub: true, tone: "dim" });
      p.lines.push({ text: "The test clicks before the session cookie is set. It sleeps 5s and hopes.", dot: "fg" });
      p.spinner = "Pondering";
    },
  },
];

/** Full access: no checks at all, so the same work goes by in one breath. */
const WORK_FULL: Step[] = [
  {
    after: 900,
    wire: hook("PostToolUse", "three calls, no checks"),
    caption: "Full access: Claude Code asks nothing and aipager has nothing to relay. You only see what it did.",
    run: (w) => {
      const c = card(w, "aipager", "c1");
      c.items.push({ type: "row", text: "Read: src/auth/cookie.ts", done: true });
      c.items.push({ type: "row", text: "Bash: pnpm test e2e/login --trace on", done: true });
      c.items.push({ type: "prose", text: "The test clicks before the session cookie is set. It sleeps 5s and hopes." });
      c.tally = "Read ×2 · Bash ×2";
      c.verb = "Investigating";
      const p = pane(w, "api");
      p.lines.push({ text: "Read(src/auth/cookie.ts)", dot: "live", bold: true });
      p.lines.push({ text: "Bash(pnpm test e2e/login --trace on)", dot: "live", bold: true });
      p.lines.push({ text: "Trace: click at 5.0s, Set-Cookie at 5.3s", sub: true, tone: "dim" });
      p.lines.push({ text: "The test clicks before the session cookie is set. It sleeps 5s and hopes.", dot: "fg" });
      p.spinner = "Investigating";
    },
  },
];

/** Mom writes back while you are elsewhere. You go, answer, and leave again. */
const MOM_2: Step[] = [
  ...from("mom", "mom", "sunday lunch at 1? 😊", "21:07", "mom2", 2400),
  look("mom", 1500, "Mom again. The session carries on behind you — it does not need a window open."),
  ...say("mom", "1pm ❤️", "21:08", "me2"),
  look("aipager", 1200),
];

/** The team's group, where the bot answers to everyone by their own role. */
const TEAM: Step[] = [
  ...from("team", "sara", "@aipagerbot /web run the login e2e against staging", "21:09", "t3", 2300),
  look("team", 1600, "The team's group. Anyone on the allow-list can mention the bot; each message runs with its sender's role."),
  {
    after: 1100,
    run: (w) => {
      arrive(w, "team", {
        id: "tc1",
        kind: "card",
        session: "web",
        items: [{ type: "row", text: "Bash: pnpm e2e login --env staging", done: false }],
        mark: "⏳",
        verb: "Testing",
        elapsed: 8,
        tally: "Bash ×1",
        prompt: null,
        time: "21:09",
      });
      w.term = "web";
      const web = pane(w, "web");
      web.lines.push({ text: "run the login e2e against staging", user: true, via: "@sara" });
      web.lines.push({ text: "Bash(pnpm e2e login --env staging)", dot: "live", bold: true });
      web.spinner = "Testing";
      web.secs = 8;
      web.status = "[web] Sonnet 5.5 | 6% ctx | $0.02";
      w.chats.aipager.pinnedBar = pinBar(w);
    },
  },
  ...from("team", "sam", "@aipagerbot /web kubectl rollout restart deploy/api", "21:10", "t4", 2000),
  {
    after: 1200,
    caption: "Sam is a user in this group. Bash is off for his role, so the call is refused before it runs.",
    run: (w) =>
      arrive(w, "team", {
        id: "t5",
        kind: "text",
        from: "bot",
        text: "⛔ web · Bash blocked for @sam (role user)",
        time: "21:10",
        reply: { name: "Sam", text: "@aipagerbot /web kubectl rollout restart deploy/api" },
      }),
  },
  {
    after: 2400,
    run: (w) => {
      const c = card(w, "team", "tc1");
      c.items[0] = { type: "row", text: "Bash: pnpm e2e login --env staging", done: true };
      c.mark = "✅";
      c.verb = "Finished";
      c.elapsed = 72;
      arrive(w, "team", { id: "ta1", kind: "answer", session: "web", text: "18 of 18 login tests pass on staging. The flake doesn't show there.", time: "21:10", reaction: "" });
      const p = pane(w, "web");
      p.spinner = null;
      w.chats.aipager.pinnedBar = pinBar(w);
      p.lines.push({ text: "18 passed (41s)", sub: true, tone: "live" });
      p.lines.push({ text: "18 of 18 login tests pass on staging.", dot: "fg" });
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

/** Claude has a decision to make. Not a permission — a question. */
function decide(mode: Mode): Step[] {
  return [
    {
      after: 1800,
      wire: perm("PreToolUse", "❓ a question, with buttons"),
      caption:
        mode === "auto"
          ? "Now something only you can answer. A mode decides what runs without asking; a question like this comes to you in every mode."
          : "A question, not a permission: Claude's own decision, with a button per option.",
      run: (w) => {
        w.term = "api";
        const c = card(w, "aipager", "c1");
        c.mark = "❓";
        c.verb = "Raise the timeout or wait for the cookie?";
        c.prompt = { kind: "question", question: "Raise the timeout, or wait for the cookie?", options: ["Raise the timeout", "Wait for the cookie", "Both"], answered: null };
        w.chats.aipager.pinnedBar = pinBar(w, "Raise the timeout, or wait for the cookie?");
        const p = pane(w, "api");
        p.spinner = null;
        p.dialog = { kind: "question", title: "Fix", body: ["The test sleeps 5s before clicking.", "Raise the timeout, or wait for the cookie?"], options: ["Raise the timeout", "Wait for the cookie", "Both"], selected: 0 };
      },
    },
    look("aipager", 1600, "Your phone buzzed on the arm of the sofa. Three buttons, one tap."),
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
      wire: back("Wait for the cookie", "answer typed in"),
      caption: "Your answer is typed into the session as if you were at the keyboard.",
      run: (w) => {
        const c = card(w, "aipager", "c1");
        const choice = c.prompt?.kind === "question" && c.prompt.answered !== null ? c.prompt.options[c.prompt.answered] : "Wait for the cookie";
        c.prompt = null;
        c.mark = "⏳";
        c.verb = "Editing";
        // The run behind us settles into one line, the way a long card keeps
        // itself readable: its words stay, its tool calls fold.
        c.items = [
          { type: "prose", text: "I'll run the login test a few times and look at where it fails." },
          { type: "fold", n: 4 },
          { type: "prose", text: "The test clicks before the session cookie is set. It sleeps 5s and hopes." },
          { type: "row", text: "Edit: e2e/login.spec.ts", done: true },
          { type: "row", text: "Bash: pnpm test e2e/login --repeat 10", done: false },
        ];
        c.tally = "Read ×2 · Bash ×2 · Edit ×1";
        w.chats.aipager.pinnedBar = pinBar(w);
        arrive(w, "aipager", { id: "ok3", kind: "text", from: "bot", text: `✓ api · Answered · ${choice}`, time: "21:12", reply: { name: "aipager", text: "❓ api · Raise the timeout, or wait for the cookie?" } });
        const p = pane(w, "api");
        p.dialog = null;
        p.lines.push({ text: `User answered: ${choice}`, sub: true, tone: "dim" });
        p.lines.push({ text: "Update(e2e/login.spec.ts)", dot: "live", bold: true });
        p.lines.push({ text: "Updated e2e/login.spec.ts with 3 additions and 1 removal", sub: true, tone: "dim" });
        p.lines.push({ text: "Bash(pnpm test e2e/login --repeat 10)", dot: "live", bold: true });
        p.spinner = "Testing";
      },
    },
  ];
}

/** Friday football, while the tests run ten times over. */
const FRIENDS: Step[] = [
  ...from("friends", "leo", "who's in friday? need 2 more ⚽", "21:13", "f4", 1800, false),
  look("friends", 1700, "Family, friends, work and Claude: one app, the one you check anyway."),
  ...say("friends", "in 🙋‍♂️", "21:13", "me3"),
  look("aipager", 1300),
];

/** The turn ends the way every other message arrives. */
const ANSWER: Step[] = [
  {
    after: 1500,
    wire: hook("Stop", "💬 Claude's answer"),
    caption: "Done. The answer lands like any other message, and the pinned bar goes quiet.",
    run: (w) => {
      const c = card(w, "aipager", "c1");
      const r = c.items.find((x) => x.type === "row" && x.text.startsWith("Bash: pnpm test e2e/login --repeat 10"));
      if (r && r.type === "row") r.done = true;
      c.mark = "✅";
      c.verb = "Finished";
      c.tally = "Read ×2 · Bash ×3 · Edit ×1";
      w.chats.aipager.pinnedBar = pinBar(w);
      arrive(
        w,
        "aipager",
        { id: "a1", kind: "answer", session: "api", text: "Fixed. The test now waits for the session cookie instead of sleeping 5s. 10 runs in a row, all green.", time: "21:15" },
        { title: "aipager", body: "💬 api · Fixed. The test now waits for the session cookie…" },
      );
      const p = pane(w, "api");
      p.spinner = null;
      p.lines.push({ text: "Tests: 10 passed, 10 total", sub: true, tone: "live" });
      p.lines.push({ text: "Fixed. The test waits for the session cookie now; 10 runs in a row, all green.", dot: "fg" });
    },
  },
  { after: 3400, caption: "A flaky test fixed from the sofa, between a question from Mom and a game on Friday." },
];

/* ─────────────────────── the second errand ───────────────────────
 * The work is done, and the next thing that pings is not work at all.
 * You start a second session for it from the same chat, it sends two
 * agents out to look, and while they are gone you still have the first
 * session to answer — which is where replying to a message earns its
 * keep: it is how aipager knows which session you mean.
 */

const TRIP = "a week in Lisbon in March: check the weather first, then 3 hotels under €180 and flights from Berlin. If the weather looks bad, try Seville.";

const ACT2: Step[] = [
  ...from("sara", "sara", "did you decide for the vacation? 🏖", "21:20", "sv1", 2000),
  look("sara", 1700, "Not everything that pings is work."),
  ...say("sara", "two minutes 😄", "21:20", "me4"),

  look("aipager", 1600, "A second session, started from the chat — no terminal, no ssh."),
  ...say("aipager", "/new trip", "21:21", "u3"),
  {
    after: 900,
    wire: back("/new trip", "a session in ~/travel"),
    caption: "aipager starts it on your machine and hands it back, ready, in the mode new sessions start in.",
    run: (w) => {
      arrive(w, "aipager", { id: "nw", kind: "text", from: "bot", text: "🆕 trip · 🤖 Auto mode · ~/travel · ready", time: "21:21" });
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
      w.chats.aipager.pinnedBar = pinBar(w);
    },
  },
  ...say("aipager", TRIP, "21:22", "u4", true),
  {
    after: 700,
    wire: back("your message", "typed into claude-trip"),
    run: (w) => {
      const m = msg(w, "aipager", "u4");
      if (m.kind === "text") m.reaction = "👀";
      const p = pane(w, "trip");
      p.lines.push({ text: TRIP, user: true, via: "@owner" });
      p.spinner = "Pondering";
      p.secs = 2;
      w.chats.aipager.pinnedBar = pinBar(w);
    },
  },
  {
    after: 1100,
    wire: hook("UserPromptSubmit", "a new card · trip"),
    run: (w) => {
      const m = msg(w, "aipager", "u4");
      if (m.kind === "text") m.reaction = "👍";
      arrive(w, "aipager", {
        id: "c3",
        kind: "card",
        session: "trip",
        items: [{ type: "prose", text: "Weather first — no point pricing a week of rain." }],
        mark: "⏳",
        verb: "Checking",
        elapsed: 3,
        tally: "",
        prompt: null,
        time: "21:22",
      });
      const p = pane(w, "trip");
      p.lines.push({ text: "Weather first — no point pricing a week of rain.", dot: "fg" });
    },
  },
  {
    after: 2400,
    wire: hook("PostToolUse", "Lisbon in March · 18°C"),
    caption: "It checks the thing that decides the rest, and says what it found.",
    run: (w) => {
      const c = card(w, "aipager", "c3");
      c.items.push({ type: "row", text: "WebFetch: climate, Lisbon, March", done: true });
      c.items.push({ type: "prose", text: "Lisbon in March: 18°C by day, rain on 2 of the 7. Good enough — no need for Seville." });
      c.tally = "WebFetch ×1";
      const p = pane(w, "trip");
      p.lines.push({ text: "WebFetch(climate, Lisbon, March)", dot: "live", bold: true });
      p.lines.push({ text: "18°C by day · rain 2 of 7 days", sub: true, tone: "dim" });
      p.lines.push({ text: "Good enough — no need for Seville.", dot: "fg" });
    },
  },
  {
    after: 2200,
    wire: hook("SubagentStart", "🤖 hotels · 🤖 flights"),
    caption: "Then it sends two agents out at once: one for beds, one for seats.",
    run: (w) => {
      const c = card(w, "aipager", "c3");
      c.verb = "Delegating";
      c.items.push({ type: "agent", name: "hotels", state: "run", what: "Searching 12–19 March, under €180", secs: 6 });
      c.items.push({ type: "agent", name: "flights", state: "run", what: "BER → LIS, 12 and 19 March", secs: 4 });
      c.tally = "WebFetch ×1 · Task ×2";
      const p = pane(w, "trip");
      p.agents = 2;
      p.spinner = "Delegating";
      p.lines.push({ text: "Task(hotels: 12–19 March, under €180)", dot: "live", bold: true });
      p.lines.push({ text: "Task(flights: BER → LIS, 12 and 19 March)", dot: "live", bold: true });
      w.chats.aipager.pinnedBar = pinBar(w);
    },
  },
  {
    after: 3200,
    caption: "Two sessions now live in this one chat. A plain message goes to the one your messages are set to — to reach the other, you reply to something it said.",
    run: (w) => {
      const c = card(w, "aipager", "c3");
      const h = c.items.find((x) => x.type === "agent" && x.name === "hotels");
      if (h && h.type === "agent") h.what = "Reading reviews for 6 places";
    },
  },
  // the gesture itself: find api's answer, hold it, and pick Reply
  {
    after: 1200,
    caption: "To aim a message at api you answer one of its own. Scroll back to it…",
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
    caption: "…hold it, and Telegram offers what you can do with it.",
    run: (w) => {
      w.press = null;
      w.menu = { msg: "a1", items: ["Reply", "Copy Text", "Pin", "Forward", "Select", "Delete"], on: -1 };
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
    caption: "Reply. Now the composer is answering that message — and aipager reads the aim from it.",
    run: (w) => {
      w.menu = null;
      w.focus = null;
      w.replyTo = { id: "a1", name: "aipager", text: "💬 api · Fixed. The test now waits for the session cookie…" };
    },
  },
  ...say("aipager", "also push the fix branch and open the PR", "21:23", "u5", true, undefined, {
    name: "aipager",
    text: "💬 api · Fixed. The test now waits for the session cookie…",
  }),
  {
    after: 800,
    wire: back("a reply · api", "aimed at claude-api"),
    caption: "The reply is the aim: aipager types it into api, not into trip.",
    run: (w) => {
      const m = msg(w, "aipager", "u5");
      if (m.kind === "text") m.reaction = "👀";
      const p = pane(w, "api");
      p.lines.push({ text: "also push the fix branch and open the PR", user: true, via: "@owner" });
      p.spinner = "Pushing";
      p.secs = 1;
      w.chats.aipager.pinnedBar = pinBar(w);
    },
  },
  {
    after: 1400,
    wire: hook("UserPromptSubmit", "a card · api"),
    run: (w) => {
      const m = msg(w, "aipager", "u5");
      if (m.kind === "text") m.reaction = "👍";
      arrive(w, "aipager", {
        id: "c4",
        kind: "card",
        session: "api",
        items: [{ type: "row", text: "Bash: git push -u origin fix/login-cookie", done: false }],
        mark: "⏳",
        verb: "Pushing",
        elapsed: 2,
        tally: "Bash ×1",
        prompt: null,
        time: "21:23",
      });
      const p = pane(w, "api");
      p.lines.push({ text: "Bash(git push -u origin fix/login-cookie)", dot: "live", bold: true });
    },
  },
  {
    after: 2600,
    wire: hook("SubagentStop", "✅ flights · 7 tool calls"),
    run: (w) => {
      const c = card(w, "aipager", "c3");
      const f = c.items.find((x) => x.type === "agent" && x.name === "flights");
      if (f && f.type === "agent") {
        f.state = "done";
        f.calls = 7;
        f.secs = 41;
      }
      const p = pane(w, "trip");
      p.agents = 1;
      p.lines.push({ text: "flights · 7 tool calls · 0:41", sub: true, tone: "live" });
      w.chats.aipager.pinnedBar = pinBar(w);
    },
  },
  {
    after: 2000,
    wire: hook("Stop", "💬 api · the PR"),
    caption: "api answers first — it only had one thing to do.",
    run: (w) => {
      const c = card(w, "aipager", "c4");
      const r = c.items[0];
      if (r.type === "row") r.done = true;
      c.mark = "✅";
      c.verb = "Finished";
      arrive(w, "aipager", { id: "a3", kind: "answer", session: "api", text: "Pushed fix/login-cookie and opened PR #214. CI is running on it.", time: "21:24" });
      const p = pane(w, "api");
      p.spinner = null;
      p.lines.push({ text: "Opened PR #214.", dot: "fg" });
      w.chats.aipager.pinnedBar = pinBar(w);
    },
  },
  {
    after: 2800,
    wire: hook("SubagentStop", "✅ hotels · 9 tool calls"),
    caption: "And the pair come back with something you can actually choose from.",
    run: (w) => {
      const c = card(w, "aipager", "c3");
      const h = c.items.find((x) => x.type === "agent" && x.name === "hotels");
      if (h && h.type === "agent") {
        h.state = "done";
        h.calls = 9;
        h.secs = 48;
      }
      c.items.push({ type: "prose", text: "Hotels: Casa Baleal €142 · Lx Boutique €165 · Santa Justa €178, all walkable to Baixa." });
      c.items.push({ type: "prose", text: "Flights: TAP direct, BER→LIS 12 March €89, back on the 19th €104." });
      c.tally = "WebFetch ×1 · Task ×2";
      const p = pane(w, "trip");
      p.agents = 0;
      p.lines.push({ text: "hotels · 9 tool calls · 0:48", sub: true, tone: "live" });
      p.lines.push({ text: "3 hotels under €180, TAP direct both ways.", dot: "fg" });
      w.chats.aipager.pinnedBar = pinBar(w);
    },
  },
  {
    after: 1800,
    wire: hook("Stop", "💬 trip · the week"),
    run: (w) => {
      const c = card(w, "aipager", "c3");
      c.mark = "✅";
      c.verb = "Finished";
      arrive(
        w,
        "aipager",
        {
          id: "a4",
          kind: "answer",
          session: "trip",
          text: "Lisbon works: 18°C, two wet days. Casa Baleal is the pick at €142 a night, and TAP direct is €193 return. Say the word and I'll hold both.",
          time: "21:25",
        },
        { title: "aipager", body: "💬 trip · Lisbon works: 18°C, two wet days…" },
      );
      const p = pane(w, "trip");
      p.spinner = null;
      w.chats.aipager.pinnedBar = pinBar(w);
    },
  },
  look("sara", 2200, "Which only leaves the part a machine should not do for you."),
  ...say("sara", "Lisbon, 12–19 March ☀️ flights €193, hotel €142", "21:26", "me5"),
  ...from("sara", "sara", "yes!! book it 🎉", "21:26", "sv2", 1600),
  { after: 2600, caption: "Two sessions, three agents and a week in Lisbon, from a sofa. Nothing left running, nothing left to tap." },
];

/* ───────────────────── full access: the way in ───────────────────── */

const FULL_SWITCH: Step[] = [
  look("aipager", 600, "This session is resting. Before you give it the next job, you take its checks off."),
  ...say("aipager", "/mode full", "21:00", "pm"),
  {
    after: 900,
    wire: perm("/mode full", "switch to Full access?"),
    run: (w) =>
      arrive(w, "aipager", {
        id: "cf",
        kind: "confirm",
        text: "⚙️ Switch api to 🔓 Full access mode?",
        note: "Every tool runs with no checks at all (--dangerously-skip-permissions). Ask and Auto switch in place; this one restarts the session.",
        buttons: ["✅ Yes, switch", "↩️ Cancel"],
        answered: null,
        done: null,
        time: "21:00",
      }),
  },
  { after: 700, caption: "Full access is for admins — and for you, in your own private chat with the bot." },
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
    wire: back("✅ Yes, switch", "restarting, conversation kept"),
    caption: "Going to or from Full access restarts the session and keeps the conversation. Between Ask and Auto nothing restarts at all.",
    run: (w) => {
      const m = msg(w, "aipager", "cf");
      if (m.kind === "confirm") m.done = "🔓 api is now in Full access mode.";
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
const TASK: Step[] = [
  ...say("aipager", "fix the flaky login e2e test", "21:01", "u1", true, "The session is resting. You send it the next job from the sofa."),
  {
    after: 700,
    wire: back("your message", "typed into claude-api"),
    caption: "👀 means it arrived. aipager types it into the session, exactly as if you were at the keyboard.",
    run: (w) => {
      const m = msg(w, "aipager", "u1");
      if (m.kind === "text") m.reaction = "👀";
      const p = pane(w, "api");
      p.lines.push({ text: "fix the flaky login e2e test", user: true, via: "@owner" });
      p.spinner = "Pondering";
      p.secs = 1;
      w.chats.aipager.pinnedBar = pinBar(w);
    },
  },
  {
    after: 1100,
    wire: hook("UserPromptSubmit", "a new card · api"),
    caption: "👍 means Claude took it. From here it is one card, editing itself as the turn runs.",
    run: (w) => {
      const m = msg(w, "aipager", "u1");
      if (m.kind === "text") m.reaction = "👍";
      arrive(w, "aipager", {
        id: "c1",
        kind: "card",
        session: "api",
        items: [
          { type: "prose", text: "I'll run the login test a few times and look at where it fails." },
          { type: "row", text: "Read: e2e/login.spec.ts", done: true },
        ],
        mark: "⏳",
        verb: "Pondering",
        elapsed: 6,
        tally: "Read ×1",
        prompt: null,
        time: "21:02",
      });
      const p = pane(w, "api");
      p.lines.push({ text: "I'll run the login test a few times and look at where it fails.", dot: "fg" });
      p.lines.push({ text: "Read(e2e/login.spec.ts)", dot: "live", bold: true });
      p.lines.push({ text: "Read 64 lines", sub: true, tone: "dim" });
    },
  },
];

export function storyFor(mode: Mode): Step[] {
  const work = mode === "ask" ? WORK_ASK : mode === "full" ? WORK_FULL : WORK_AUTO;
  const start = mode === "full" ? FULL_SWITCH : [];
  return [...start, ...TASK, ...GLANCE, ...MOM_1, ...work, ...MOM_2, ...TEAM, ...decide(mode), ...FRIENDS, ...ANSWER, ...ACT2];
}

export { open };
