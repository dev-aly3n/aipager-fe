/**
 * The evening, step by step. Each step waits `after` ms, then edits the
 * world. `open` switches the open chat, `gate` waits for the reader to tap a
 * button (or taps it for them after a while), and typing is spelled out one
 * character at a time into the message box.
 */
import { arrive, card, msg, open, pane, type ChatId, type World } from "./world";

export interface Step {
  after: number;
  caption?: string;
  open?: ChatId;
  run?: (w: World) => void;
  /** wait for a tap on this message's buttons; `auto` ms of idleness taps `choice` */
  gate?: { chat: ChatId; msg: string; auto: number; choice: number; resolve: (w: World, choice: number) => void };
}

/** Typing into the open chat's box, then sending. */
function say(chat: ChatId, text: string, time: string, id: string): Step[] {
  const steps: Step[] = [{ after: 500, open: chat }];
  for (let i = 1; i <= text.length; i++) steps.push({ after: i === 1 ? 400 : 42, run: (w) => (w.draft = text.slice(0, i)) });
  steps.push({
    after: 350,
    run: (w) => {
      w.draft = "";
      arrive(w, chat, { id, kind: "text", from: "me", text, time, ticks: 1 });
    },
  });
  steps.push({
    after: 700,
    run: (w) => {
      const m = msg(w, chat, id);
      if (m.kind === "text") m.ticks = 2;
    },
  });
  return steps;
}

/** Someone types for a while, then their message lands. */
function from(chat: ChatId, who: string, text: string, time: string, id: string, typingFor = 1600, notify = true): Step[] {
  return [
    { after: 600, run: (w) => (w.chats[chat].typing = who) },
    {
      after: typingFor,
      run: (w) => {
        const c = w.chats[chat];
        const title = c.kind === "group" ? c.name : c.name;
        const body = c.kind === "group" ? `${who[0].toUpperCase() + who.slice(1)}: ${text}` : text;
        arrive(w, chat, { id, kind: "text", from: who, text, time }, notify ? { title, body } : undefined);
      },
    },
  ];
}

export const STORY: Step[] = [
  /* ---- Mom ---- */
  ...say("mom", "yes! made pasta 🍝 you?", "21:04", "me1"),
  {
    after: 800,
    run: (w) => {
      const c = card(w, "aipager", "c1");
      c.items.push({ type: "prose", text: "It fails about one run in five. Timing, not logic." });
      c.items.push({ type: "row", text: "Bash: pnpm test e2e/login --repeat 5", done: true });
      c.tally = "Read ×1 · Bash ×1";
      const p = pane(w, "api");
      p.lines.push({ text: "Bash(pnpm test e2e/login --repeat 5)", dot: "live", bold: true });
      p.lines.push({ text: "Tests: 1 failed, 4 passed", sub: true, tone: "amber" });
      p.lines.push({ text: "It fails about one run in five. Timing, not logic.", dot: "fg" });
    },
  },
  ...from("mom", "mom", "good 😊 sunday lunch at 1?", "21:05", "mom2", 1800),
  ...say("mom", "I'll be there, bringing dessert 🍰", "21:05", "me2"),
  {
    after: 1200,
    run: (w) => {
      const m = msg(w, "mom", "me2");
      if (m.kind === "text") m.reaction = "❤️";
    },
  },

  /* ---- Claude asks: the card quietly becomes a prompt ---- */
  {
    after: 1400,
    caption: "Claude wants to run a command. In the aipager chat, its card quietly turns into a permission prompt.",
    run: (w) => {
      const c = card(w, "aipager", "c1");
      c.items.push({ type: "row", text: "Read: src/auth/cookie.ts", done: true });
      c.mark = "🔐";
      c.verb = "Permission needed";
      c.prompt = { kind: "perm", tool: "Bash", what: "Run the login test with tracing", command: "pnpm test e2e/login --trace on", answered: false };
      w.chats.aipager.pinnedBar = "⏳ api needs you - Bash: pnpm test e2e/login --trace on";
      const p = pane(w, "api");
      p.spinner = null;
      p.lines.push({ text: "Read(src/auth/cookie.ts)", dot: "live", bold: true });
      p.lines.push({ text: "Bash(pnpm test e2e/login --trace on)", dot: "live", bold: true });
      p.lines.push({ text: "Running PermissionRequest hook…", sub: true, tone: "amber" });
    },
  },
  {
    after: 2600,
    caption: "An edit makes no sound, so aipager nudges you once while it waits.",
    run: (w) =>
      arrive(
        w,
        "aipager",
        { id: "nudge", kind: "text", from: "bot", text: "⬆️ api · still waiting for your answer above", time: "21:06", reply: { name: "aipager", text: "🔐 api · Permission needed" } },
        { title: "aipager", body: "⬆️ api · still waiting for your answer above" },
      ),
  },
  { after: 1800, open: "aipager", caption: "Tap Allow. The verdict goes straight back to the hook that is holding the call." },
  {
    after: 300,
    gate: {
      chat: "aipager",
      msg: "c1",
      auto: 6500,
      choice: 0,
      resolve: (w) => {
        const c = card(w, "aipager", "c1");
        if (c.prompt?.kind === "perm") c.prompt.answered = true;
      },
    },
  },
  {
    after: 800,
    caption: "Allowed. Nothing was typed into the terminal; the tool call just carries on.",
    run: (w) => {
      const c = card(w, "aipager", "c1");
      c.prompt = null;
      c.mark = "⏳";
      c.verb = "Testing";
      c.items.push({ type: "row", text: "Bash: pnpm test e2e/login --trace on", done: false });
      w.chats.aipager.pinnedBar = "⚙️ api (working)";
      arrive(w, "aipager", { id: "ok1", kind: "text", from: "bot", text: "✅ [api] · Allowed · Bash: pnpm test e2e/login --trace on", time: "21:06", reply: { name: "aipager", text: "🔐 api · Permission needed" } });
      const p = pane(w, "api");
      p.lines = p.lines.filter((l) => l.text !== "Running PermissionRequest hook…");
      p.spinner = "Testing";
    },
  },
  {
    after: 2200,
    run: (w) => {
      const c = card(w, "aipager", "c1");
      const r = c.items.find((x) => x.type === "row" && x.text.startsWith("Bash: pnpm test e2e/login --trace"));
      if (r && r.type === "row") r.done = true;
      c.items.push({ type: "prose", text: "The test clicks before the session cookie is set. It sleeps 5s and hopes." });
      c.tally = "Read ×2 · Bash ×2";
      const p = pane(w, "api");
      p.lines.push({ text: "Trace: click at 5.0s, Set-Cookie at 5.3s", sub: true, tone: "dim" });
      p.lines.push({ text: "The test clicks before the session cookie is set. It sleeps 5s and hopes.", dot: "fg" });
    },
  },

  /* ---- the team group ---- */
  ...from("team", "sara", "@aipagerbot /web run the login e2e against staging", "21:07", "t3", 1700),
  { after: 400, caption: "In the team group, anyone on the allow-list can mention the bot. Each message runs with its sender's role." },
  { after: 1400, open: "team" },
  {
    after: 900,
    run: (w) => {
      arrive(w, "team", {
        id: "tc1",
        kind: "card",
        session: "web",
        items: [{ type: "row", text: "Bash: pnpm e2e login --env staging", done: false }],
        mark: "⏳",
        verb: "Running",
        elapsed: 4,
        tally: "",
        prompt: null,
        time: "21:07",
      });
      w.panes.push({
        id: "web",
        lines: [
          { text: "> run the login e2e against staging", tone: "fg" },
          { text: "Bash(pnpm e2e login --env staging)", dot: "live", bold: true },
        ],
        spinner: "Running",
        secs: 4,
        dialog: null,
        input: "",
        status: "Sonnet 5 · ctx 6% · $0.02",
      });
    },
  },
  ...from("team", "sam", "@aipagerbot /web kubectl rollout restart deploy/api", "21:08", "t4", 1500),
  {
    after: 1000,
    caption: "Sam is a user in this group. Bash is off for his role, so the call is refused before it runs.",
    run: (w) => arrive(w, "team", { id: "t5", kind: "text", from: "bot", text: "⛔ [web] · Blocked · Bash is not allowed for @sam (user)", time: "21:08", reply: { name: "Sam", text: "@aipagerbot /web kubectl rollout restart deploy/api" } }),
  },
  {
    after: 2000,
    run: (w) => {
      const c = card(w, "team", "tc1");
      c.items[0] = { type: "row", text: "Bash: pnpm e2e login --env staging", done: true };
      c.mark = "✅";
      c.verb = "Finished";
      c.elapsed = 72;
      c.tally = "Bash ×1";
      arrive(w, "team", { id: "ta1", kind: "answer", session: "web", text: "18 of 18 login tests pass on staging. The flake doesn't show there.", time: "21:09" });
      const p = pane(w, "web");
      p.spinner = null;
      p.lines.push({ text: "18 passed (41s)", sub: true, tone: "live" });
      p.lines.push({ text: "18 of 18 login tests pass on staging.", dot: "fg" });
    },
  },
  {
    after: 1100,
    run: (w) => {
      const m = msg(w, "team", "ta1");
      if (m.kind === "answer") m.reaction = "🙌 2";
    },
  },

  /* ---- friends ---- */
  ...from("friends", "leo", "who's in friday? need 2 more ⚽", "21:09", "f4", 1400, false),
  { after: 300, caption: "Family, friends, work, and Claude: one app, the one you check anyway." },
  ...say("friends", "in 🙋‍♂️", "21:10", "me3"),

  /* ---- Claude asks a question ---- */
  {
    after: 1300,
    caption: "Claude needs a decision. The same card becomes a question with a button per option.",
    run: (w) => {
      const c = card(w, "aipager", "c1");
      c.mark = "❓";
      c.verb = "Raise the timeout or wait for the cookie?";
      c.prompt = { kind: "question", question: "Raise the timeout, or wait for the cookie?", options: ["Raise the timeout", "Wait for the cookie", "Both"], answered: null };
      w.chats.aipager.pinnedBar = "⏳ api needs you - Raise the timeout, or wait for the cookie?";
      const p = pane(w, "api");
      p.spinner = null;
      p.dialog = { kind: "question", title: "Fix", body: ["The test sleeps 5s before clicking.", "Raise the timeout, or wait for the cookie?"], options: ["Raise the timeout", "Wait for the cookie", "Both"], selected: 0 };
    },
  },
  { after: 1600, open: "aipager" },
  {
    after: 300,
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
    after: 900,
    run: (w) => {
      const c = card(w, "aipager", "c1");
      const choice = c.prompt?.kind === "question" && c.prompt.answered !== null ? c.prompt.options[c.prompt.answered] : "Wait for the cookie";
      c.prompt = null;
      c.mark = "⏳";
      c.verb = "Editing";
      c.items.push({ type: "row", text: "Edit: e2e/login.spec.ts", done: true });
      c.items.push({ type: "row", text: "Bash: pnpm test e2e/login --repeat 10", done: false });
      c.tally = "Read ×2 · Bash ×2 · Edit ×1";
      w.chats.aipager.pinnedBar = "⚙️ api (working)";
      arrive(w, "aipager", { id: "ok2", kind: "text", from: "bot", text: `✅ [api] · Answered · ${choice}`, time: "21:10", reply: { name: "aipager", text: "❓ api · Raise the timeout, or wait for the cookie?" } });
      const p = pane(w, "api");
      p.dialog = null;
      p.lines.push({ text: `User answered: ${choice}`, sub: true, tone: "dim" });
      p.lines.push({ text: "Update(e2e/login.spec.ts)", dot: "live", bold: true });
      p.lines.push({ text: "Updated e2e/login.spec.ts with 3 additions and 1 removal", sub: true, tone: "dim" });
      p.lines.push({ text: "Bash(pnpm test e2e/login --repeat 10)", dot: "live", bold: true });
      p.spinner = "Testing";
    },
  },

  /* ---- done ---- */
  {
    after: 3200,
    caption: "Done. The answer arrives like any other message, and the pinned bar goes quiet.",
    run: (w) => {
      const c = card(w, "aipager", "c1");
      const r = c.items.find((x) => x.type === "row" && x.text.startsWith("Bash: pnpm test e2e/login --repeat 10"));
      if (r && r.type === "row") r.done = true;
      c.mark = "✅";
      c.verb = "Finished";
      c.tally = "Read ×2 · Bash ×3 · Edit ×1";
      w.chats.aipager.pinnedBar = "💤 all idle";
      arrive(
        w,
        "aipager",
        { id: "a1", kind: "answer", session: "api", text: "Fixed. The test now waits for the session cookie instead of sleeping 5s. 10 runs in a row, all green.", time: "21:11" },
        { title: "aipager", body: "💬 api · Fixed. The test now waits for the session cookie…" },
      );
      const p = pane(w, "api");
      p.spinner = null;
      p.lines.push({ text: "Tests: 10 passed, 10 total", sub: true, tone: "live" });
      p.lines.push({ text: "Fixed. The test waits for the session cookie now; 10 runs in a row, all green.", dot: "fg" });
    },
  },
  { after: 2600 },
  ...from("team", "sara", "login is green on prod 🎉 thanks @aipagerbot", "21:12", "t6", 1500),
  { after: 1200, open: "team" },
  {
    after: 900,
    run: (w) => {
      const m = msg(w, "team", "t6");
      if (m.kind === "text") m.reaction = "🎉 3";
    },
  },
  { after: 5000 },
];

export { open };
