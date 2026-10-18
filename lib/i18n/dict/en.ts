import type { Dict } from "./types";

/**
 * The English the site is written in, and the source every translation works
 * from. Product text (cards, buttons, the pinned bar) is not here: it comes
 * from aipager's own catalogs through lib/bot-strings.json.
 */
export const en: Dict = {
  meta: {
    title: "aipager: Claude Code, paging you",
    description:
      "aipager runs your Claude Code sessions in a detached terminal and mirrors them to Telegram: watch them work, approve what they ask, send the next prompt. It runs on your computer.",
  },

  nav: {
    modes: "Modes",
    app: "Mini App",
    how: "How it works",
    install: "Install",
    security: "Security",
    faq: "FAQ",
    docs: "Docs",
    language: "Change language",
  },

  hero: {
    title: "Claude is one more chat.",
    lead: "aipager puts your Claude Code sessions in Telegram, between your family, your friends and your team. It runs on your computer.",
    agentInstall: "Let your agent install it",
    docs: "Docs",
    security: "Security",
    meta: "Linux & macOS · MIT · about a minute",
  },

  modes: {
    eyebrow: "Permission modes",
    title: "Three modes. Auto is where you start.",
    lead: "Every session is in one of three, set per session and changed any time with /mode. Ask stops before each action. Auto, where every new session starts, lets Claude Code's own safety check run the safe calls and stop the risky ones for you. Full access runs everything with no checks at all. A mode moves Claude Code's own prompts and nothing else: in a group, a tool a member's role may not use is still refused, whatever the mode says.",
    legend: [
      { k: "Allow", v: "this one call" },
      { k: "Deny", v: "Claude blocks the call" },
      { k: "Allow always", v: "adds the rule Claude offers, when it offers one" },
      { k: "Stop", v: "interrupt the turn instead of answering" },
    ],
    ask: {
      tag: "/mode ask",
      note: "Every call waits for you, even a read.",
      quote: "I'll look at the cookie helper first.",
      read: "Read: the cookie helper",
      needs: "Permission needed",
    },
    auto: {
      tag: "default",
      note: "The read and the test run went through on their own. A command against staging is the risky kind, so it stopped.",
      quote: "The test clicks before the session cookie is set.",
      risky: "Bash: Look at the newest sessions on staging",
    },
    full: {
      tag: "/mode full",
      note: "No checks, no buttons. Just the answer when it is done.",
      ask: "fix the flaky login e2e test",
      quote: "The test clicks before the session cookie is set. It sleeps 5s and hopes.",
    },
    facts: [
      {
        t: "/mode",
        b: "Shows a button for each other mode; /mode ask, /mode auto and /mode full switch straight away. New sessions start in Auto unless the chat chose otherwise under /settings → New sessions.",
      },
      {
        t: "Ask ⇄ Auto, in place",
        b: "No restart, even while Claude works: aipager presses Shift+Tab in the session, and the card says it is switching until Claude Code confirms the new mode.",
      },
      {
        t: "Full access restarts",
        b: "Going to or from Full access restarts the session and keeps the conversation. Only an admin can start or switch one into it (or you, in your own private chat with the bot).",
      },
      {
        t: "Questions still come",
        b: "A mode governs permission prompts, not decisions: when Claude asks you something, the buttons land in your chat whatever the mode.",
      },
    ],
  },

  places: {
    eyebrow: "Where it lives",
    title: "Three chats. Everything else is just your life.",
    chats: [
      {
        name: "aipager",
        tag: "bot",
        preview: "api · Working · 3:14 · Read ×2 · Bash ×2",
        title: "Your chat with Claude",
        body: "One chat for every session. A live card per turn that edits itself, prompts you answer with a tap, and a pinned bar that says what needs you. A plain message goes to the session the bar names; /web sends the next one to another session, and the conversation carries on there.",
      },
      {
        name: "backend-team",
        tag: "group · team mode",
        preview: "Sara: @aipagerbot /web run the login e2e against staging",
        title: "Your team's group",
        body: "Put the bot in a group and anyone on the allow-list can mention it. Every message runs with its sender's role; a tool the role may not use is refused before it runs, and every decision lands in the audit log with the name of whoever tapped.",
      },
      {
        name: "Jim",
        tag: "their own chat with the bot",
        preview: "web · Permission needed",
        title: "Someone else, in their own chat",
        body: "Add a teammate's private chat with the bot and they drive their own sessions, with their own role and their own root folder: their Claude turns start inside it and read nothing in your home folder outside it. Someone who should only watch gets read_only in your group.",
      },
    ],
    chips: [
      ["/status", "/new", "/mode", "/stop", "/app", "/<session> <prompt>"],
      ["owner", "admin", "user", "read_only"],
      ["members' root folder", "~/aipager-users/<label>", "read_only", "/new"],
    ],
    roles: {
      title: "Four roles, and a tool rule per role.",
      lead: "The role that counts is the one you hold in the chat you are acting in, and a tool a role may not use is refused before it runs, not asked about. Nothing in Telegram or the Mini App can change who is in the list: only aipager config, on the computer.",
      can: "Can",
      rows: [
        "Send prompts to a session",
        "Allow, Deny, answer Claude's questions",
        "Bash, and anything else that runs code",
        "Full access, a group's /settings, /update",
        "Where their sessions may work",
        "Read credential files (~/.ssh, …)",
      ],
      anywhere: "anywhere",
      rootFolder: "root folder",
      ownChat: "own chat",
      link: "Team mode, in full",
    },
  },

  day: {
    eyebrow: "Day to day",
    title: "Use it like a chat.",
    lead: "Not a console with a chat skin: everything you already do in Telegram works here. Talk into it on the way home, throw it the screenshot, send the next thought before the last one is done.",
    items: [
      {
        t: "Say it instead",
        b: "Send a voice note and it is transcribed on your own computer (never anyone's cloud), echoed back so you can see what it heard, and typed into the session as if you had written it.",
      },
      {
        t: "A screenshot of the bug",
        b: "Photos and files land in a folder on your computer and Claude is pointed at the path, with your caption as the prompt, or check this: … when there is none. Send several at once and they go as one prompt.",
      },
      {
        t: "It sends files back",
        b: "Ask in your own words, “send me the screenshot”, and the file comes to that session's chat right after the answer: images as photos, videos and audio as themselves, anything else as a file, several at once as one album. Never aipager's settings, Claude's credentials or your keys: those are refused before anything is sent.",
      },
      {
        t: "Send the next one now",
        b: "Your message goes to Claude the moment you send it, even mid-turn: 👀 while Claude's own queue holds it, 👍 when Claude takes it. ⚡ Send now hands it over without waiting for the step to end.",
      },
      {
        t: "Never read as the answer",
        b: "A message you send while a permission prompt is open is held back, not folded into the prompt, and goes to the session the moment you have answered.",
      },
      {
        t: "Agents and shells, counted",
        b: "Every background agent Claude starts gets its own row on the card with what it is doing, and a command left running in the background keeps its own clock until it ends.",
      },
      {
        t: "It tells you first",
        b: "A context warning, a compaction, a session that ended or went quiet, a turn that outlived itself: the chat says so without you going to look.",
      },
      {
        t: "The buttons are already there",
        b: "A keyboard sits under the message box: one button per live session, then status, stop and new, then Templates for the prompts you keep retyping and Commands for the ones Claude Code handles itself.",
      },
      {
        t: "/status, the whole chat at once",
        b: "Every session as a list you can act on: what each is doing, its model, the context left, what it has cost, what is queued behind it, with Stop, Answer and the rest of the menu on each one.",
      },
    ],
    heard: "Heard:",
    said: "fix the flaky login e2e test",
    /** what you ask for under the third one (Claude's caption is modes.auto.quote) */
    ask: "send me the screenshot",
  },

  app: {
    eyebrow: "The Mini App",
    title: "A dashboard, still inside Telegram.",
    lead: "/app opens every session at once: one tile each, with its context ring, folder, model and what it has spent. The chat is still where you answer, and the app is for the look across all of them, and for the things a chat is clumsy at, like reading a diff or changing a setting.",
    tabs: { sessions: "Sessions", settings: "Settings" },
    summary: { needs: "needs you", working: "working", resting: "resting", spent: "spent", finished: "finished" },
    needsYou: "Needs you",
    answerInChat: "Answer in chat",
    states: { working: "working", needs: "needs you", resting: "resting" },
    settings: {
      updates: "Updates",
      upToDate: "Everything is up to date.",
      check: "Check for updates",
      language: "App language",
      languageNote: "Only aipager's own text. Claude's answers don't change.",
      chatPrefs: "Chat preferences",
      chatPrefsNote: "These apply to every session in this chat.",
      rows: [
        { k: "Message layout", v: "Busy card + result" },
        { k: "Diff previews", v: "Off" },
        { k: "Long-turn card updates", v: "On" },
        { k: "New sessions" },
      ],
    },
    close: "Close",
    facts: [
      {
        t: "Every session on one screen",
        b: "A tile each, with its context ring, whose it is, the model and what it has spent, with a line over them that says how the chat stands: what is working, what is resting, what the day cost, how many have finished. The + starts another: a name, a folder from the ones you already use, a model.",
      },
      {
        t: "Whatever needs you, first",
        b: "A session waiting on a permission prompt or a question sits at the top with what it is asking. Answer in chat sends that prompt back to the bottom of the chat, buttons and all, and you answer it there.",
      },
      {
        t: "A page per session",
        b: "The state line, “Working for 3:12” or “Resting, last active 5m ago”, and one tap to Stop or Resume. Under it the last tool calls, the latest reply, the model control, the files the turn changed as a diff, and that session's own settings.",
      },
      {
        t: "Served by aipager itself",
        b: "On by default, every request checked against Telegram's own signature, and the page loads nothing from anywhere else: no fonts, no scripts. aipager miniapp disable turns it off.",
      },
    ],
    link: "What the app can do",
  },

  langs: {
    eyebrow: "Fifteen languages",
    title: "In your language, down to the digits.",
    lead: "Only aipager's own words change: cards, prompts, buttons, the pinned bar, /status, the Mini App, the docs. Your sessions do not: Claude answers in the language you write to it, and what aipager sends Claude stays as it was. Pick one with /language, or let it follow your Telegram app.",
    facts: [
      {
        t: "Right to left, properly",
        b: "Persian and Arabic read right to left, with Persian (۰-۹) or Arabic-Indic (٠-٩) digits and their own separators, in Telegram and in the Mini App. Session names, paths, commands and code keep their own direction.",
      },
      {
        t: "Written, not translated",
        b: "Each language was written the way people who use apps in it actually speak, loanwords included, with each language's own plural forms (Arabic has six).",
      },
      {
        t: "Your chat, your language",
        b: "A private chat can follow your Telegram app. A group has one language, set by an admin, and a pop-up after a tap is in the tapper's own language.",
      },
      {
        t: "The docs too",
        b: "The README and every page under docs/ are translated. When a translation and the English page disagree, the English page is right.",
      },
    ],
    pinned: "Pinned message",
  },

  under: {
    eyebrow: "Under the chat",
    title: "The terminal stays the source of truth.",
    lead: "Claude Code runs in a real terminal, inside dtach, so nobody has to keep a window open. Each step fires a hook that sends one datagram to aipager over a local socket, and aipager edits a message in your chat. Your answers travel back the same way: a verdict to the hook holding the call, or keystrokes into the session.",
    nodes: [
      { t: "Claude Code", b: "inside dtach, no window needed" },
      { t: "hook", b: "fires at every step" },
      { t: "aipager", b: "one process, your user" },
      { t: "Telegram", b: "your own bot token" },
      { t: "your chats", b: "your private chat, your team's group" },
    ],
    facts: [
      {
        t: "Sit down at it whenever you like",
        b: "aipager session api attaches to the running session from any shell. Type there, type in the chat: same session. Close the window and it carries on, and the attach even follows the session through a restart.",
      },
      {
        t: "It never reads your screen",
        b: "aipager types into the session and listens to Claude Code's own events. What your chat shows comes from the hooks and the transcript, not from scraping a terminal.",
      },
      {
        t: "Nothing waits on the chat",
        b: "A hook sends one datagram and returns, about 20 ms of Claude Code's time. With aipager not listening the event is simply dropped and Claude carries on; aipager catches up from the session's own files.",
      },
    ],
    hooks: "Sixteen hooks, and the status line it reads for the model, the context and the cost. aipager is wired to every one of them.",
  },

  trust: {
    eyebrow: "Security",
    title: "Nothing in the middle.",
    lead: "aipager never talks to Anthropic. The only thing that does is Claude Code itself, with your own login, on your own computer. aipager starts it in a terminal and listens to the hooks Claude Code publishes. No endpoint anyone reverse-engineered, no proxy, no account but yours: the session you drive from your phone is the one you would drive from the keyboard.",
    cards: [
      {
        t: "No aipager server.",
        b: "aipager talks to the Telegram Bot API with your own bot token. There is no aipager account and no aipager service, and no one else's computer between your phone and yours.",
      },
      {
        t: "Only your chats answered.",
        b: "aipager answers only in the chats listed in your config. A stranger who finds the bot gets one line saying it is not configured to talk to them; nothing they send reaches a session.",
      },
      {
        t: "No open port.",
        b: "It listens on loopback only. The Mini App goes out through a Cloudflare tunnel where every request must carry Telegram's signature, and aipager miniapp disable turns it off.",
      },
      {
        t: "Your token, your file.",
        b: "The bot token and the chat ids live in ~/.config/aipager/aipager.yaml at mode 600. They are kept out of aipager's log, and redacted wherever they could slip into one.",
      },
      {
        t: "It never elevates.",
        b: "No sudo, no setuid. Everything it writes is under your home folder, /tmp or its own socket folder, and every process it starts (claude, dtach, the installers) runs as you.",
      },
      {
        t: "Claude Code still decides.",
        b: "Your settings.json says what needs asking. aipager relays the question; it never decides what may run, and a button left from a finished turn refuses instead of acting on the work running now.",
      },
      {
        t: "Access is granted on the computer.",
        b: "Members and roles change only with aipager config, on the computer. Nothing in Telegram and nothing in the Mini App can add a person or widen a role.",
      },
      {
        t: "Every answer on the record.",
        b: "Each Allow, Deny and answer goes to ~/.claude/aipager-audit.jsonl, append-only, with who tapped it in a group.",
      },
    ],
    link: "The security model",
  },

  install: {
    eyebrow: "Install",
    title: "Four lines. Keep them in Saved Messages.",
    lead: "Tap a line to copy it. Two things first: a bot of your own from @BotFather (press Start in it), and Claude Code logged in on this computer. The wizard in line two asks for the rest.",
    agent: {
      title: "Or hand it to the agent you already have.",
      lead: "Put the bot token in a file it never has to read, then give Claude Code this:",
      link: "The guide it follows",
    },
    saved: { name: "Saved Messages", count: "4 messages" },
    lines: [
      { note: "uv, pipx or Homebrew, whichever you have. Linux or macOS." },
      { note: "your bot token from @BotFather, your chat, Claude Code's hooks" },
      { note: "keeps aipager running after you log out" },
      { note: "Claude Code in dtach. Your chat takes it from here." },
    ],
    copied: "Copied",
    pm: "Prefer your package manager? uv, pipx, Homebrew, Docker, Nix, the AUR and Snap.",
    pmLink: "every way to install",
  },

  faq: {
    eyebrow: "FAQ",
    title: "Ask it.",
    readBack: "drag to read back",
    items: [
      {
        q: "How is this different from Claude's mobile apps?",
        a: "Claude's apps talk to Anthropic's hosted assistant. aipager mirrors a Claude Code session running on your own computer: your repo, your tools, your environment.",
      },
      {
        q: "Does my code leave my computer?",
        a: "Only as far as your own Telegram chats. aipager talks to Telegram with your own bot token; there is no aipager server in between.",
      },
      {
        q: "Can this get my Claude account banned?",
        a: "aipager never calls Anthropic. It starts the official claude CLI on your computer and reads the hooks Claude Code publishes, and your messages are typed into that session exactly as if you were at the keyboard: no reverse-engineered endpoint, no proxy, no shared account, nothing through anyone else's server. What Anthropic sees is your own Claude Code login doing what it already does. Their usage policies still cover what you ask it for, and a team on one bot is still sharing your subscription: for that, run aipager on its own account or a spend-limited key.",
      },
      {
        q: "Do I need a VPN or an open port?",
        a: "No. aipager polls Telegram outward over HTTPS and listens on no port outside loopback, so there is nothing to forward and nothing to reach from the network. Your phone talks to Telegram; Telegram talks to your computer's own outbound connection.",
      },
      {
        q: "What if Claude goes off the rails?",
        a: "Prompts wait for your tap, /stop interrupts the turn and drops anything queued, /kill ends the session, and buttons from a finished turn refuse.",
      },
      {
        q: "Can my team use it?",
        a: "Yes. Put the bot in a group with roles: owner, admin, user, read_only. Each message runs with its sender's permissions, a member without can_manage works inside their own root folder, and every decision is audited.",
      },
      {
        q: "Can I send it a voice note or a screenshot?",
        a: "Both. A voice note is transcribed on your computer and typed into the session as if you had written it; a photo or file is saved locally and Claude is handed the path, with your caption as the prompt.",
      },
      {
        q: "Does it speak my language?",
        a: "Fifteen, picked with /language or followed from your Telegram app. Persian and Arabic read right to left, with their own digits. Only aipager's own text changes; Claude answers in the language you write to it.",
      },
      {
        q: "Is there a dashboard?",
        a: "/app opens a Mini App inside Telegram: a tile per session, a diff viewer for every Write and Edit, the settings, one-tap stop. It is on by default, every request is checked against Telegram's signature, and aipager miniapp disable turns it off.",
      },
      {
        q: "What is dtach?",
        a: "A tiny terminal detacher. It keeps Claude Code alive after the terminal closes or SSH drops, so an answer you send an hour later still reaches a live session. It comes with aipager.",
      },
      {
        q: "Does it keep running when I log out?",
        a: "aipager service install keeps aipager running under systemd or launchd, and the sessions themselves live in dtach, so they outlive the terminal that started them. There are Docker, Nix, AUR and Snap builds too.",
      },
      {
        q: "How do I update it?",
        a: "/update checks aipager and Claude Code and installs the new version, then 🔄 Restart now brings it up in place, whether it runs in a terminal, tmux, Docker or under a service. Your sessions keep running through it.",
      },
      {
        q: "What does it cost?",
        a: "Nothing. It's MIT licensed, the bot is yours, and Claude Code keeps using whatever plan or key it already uses.",
      },
    ],
  },

  cta: {
    title: "Add Claude to your chats.",
    lead: "Then close the terminal and go live your evening.",
    copy: "Copy",
  },

  footer: { changelog: "Changelog", issues: "Issues" },

  docs: {
    title: "Docs",
    description: "Reference documentation for aipager: architecture, hooks, commands, troubleshooting, security.",
    onThisPage: "On this page",
    translated: "This page is a translation of the English page; if they differ, the English page is right.",
    english: "English",
    source: "Source on GitHub",
    onGitHub: "These pages on GitHub",
    sourceNote: "The markdown in the repo is the same text you are reading.",
    prev: "Previous",
    next: "Next",
    groups: ["Start here", "Reference", "Running it"],
  },

  demo: {
    people: { you: "You" },
    typing: "typing",
    isTyping: "is typing",
    days: { today: "Today", yesterday: "Yesterday", monday: "Monday" },
    chats: {
      aipager: { name: "aipager", subtitle: "bot" },
      team: { name: "backend-team", subtitle: "5 members, 3 online" },
      mom: { name: "Mom", subtitle: "online" },
      friends: { name: "Friday 5-a-side ⚽", subtitle: "9 members" },
      sara: { name: "Sara", subtitle: "last seen recently" },
      saved: { name: "Saved Messages", subtitle: "" },
    },
    folders: { all: "All chats", personal: "Personal", work: "Work", bots: "Bots" },
    seed: {
      oldPrompt: "expire idle sessions after 30 minutes",
      oldAnswer: "Done. The session store now expires idle sessions after 30 minutes; 212 tests pass.",
      teamFlaky: "prod login is flaky again 😬 anyone?",
      teamSaw: "saw it too, twice in the last hour",
      momEat: "Did you eat? 🙂",
      friendsPitch: "pitch booked, friday 7pm",
      friendsIn: "in 🙋",
      friendsBall: "in, bringing the new ball",
      saraMerged: "merged your PR 🚀",
      saraThanks: "thanks!!",
      savedConfig: "aipager config",
    },
    says: {
      youPasta: "yes! made pasta 🍝 you?",
      momLunch: "sunday lunch at 1? 😊",
      youLunch: "1pm ❤️",
      teamRun: "@aipagerbot /web run the login e2e against staging",
      teamKubectl: "@aipagerbot /web kubectl rollout restart deploy/api",
      friendsWho: "who's in friday? need 2 more ⚽",
      youIn: "in 🙋‍♂️",
      saraVacation: "did you decide for the vacation? 🏖",
      youTwoMinutes: "two minutes 😄",
      youBook: "Lisbon, 12–19 March ☀️ flights €193, hotel €142",
      saraBook: "yes!! book it 🎉",
    },
    prompts: {
      fix: "fix the flaky login e2e test",
      trip: "a week in Lisbon in March: check the weather first, then 3 hotels under €180 and flights from Berlin. If the weather looks bad, try Seville.",
      more: "spawn a couple of agents for it: one on hotels under €180, one on flights from Berlin",
      push: "also push the fix branch and open the PR",
      teamRun: "run the login e2e against staging",
    },
    claude: {
      plan: "I'll run the login test a few times and look at where it fails.",
      flaky: "It fails about one run in five. Timing, not logic.",
      cookie: "The test clicks before the session cookie is set. It sleeps 5s and hopes.",
      answer: "Fixed. The test now waits for the session cookie instead of sleeping 5s. 10 runs in a row, all green.",
      teamTests: "18 of 18 login tests pass on staging. The flake doesn't show there.",
      weather: "Weather first: no point pricing a week of rain.",
      lisbon: "Lisbon in March: 18°C by day, rain on 2 of the 7. Good enough, no need for Seville.",
      pr: "Pushed fix/login-cookie and opened PR #214. CI is running on it.",
      teamShort: "18 of 18 login tests pass on staging.",
      twoAgents: "Two agents then: one on beds, one on seats.",
      interim: "Lisbon is on: 18°C, two wet days. Both agents are out looking; I'll come back with the shortlist.",
      shortlist:
        "Hotels: Casa Baleal €142 a night, Lx Boutique €165, Santa Justa €178, all walkable to Baixa. Flights: TAP direct, €89 out on the 12th and €104 back on the 19th. Say the word and I'll hold both.",
    },
    question: {
      verb: "Raise the timeout or wait for the cookie?",
      question: "Raise the timeout, or wait for the cookie?",
      options: ["Raise the timeout", "Wait for the cookie", "Both"],
      title: "Fix",
      body: "The test sleeps 5s before clicking.",
    },
    captions: {
      restAuto: "A Claude Code session resting on your laptop, in Auto mode, where every new session starts.",
      restAsk: "A Claude Code session resting on your laptop, in Ask mode: it asks before every action.",
      restFull: "A Claude Code session resting on your laptop. Before the next job, you take its checks off.",
      held: "Paused while you look around. Leave it for a moment and the evening carries on.",
      arrived: "👀 means it arrived. aipager types it into the session, exactly as if you were at the keyboard.",
      took: "👍 means Claude took it. From here it is one card, editing itself as the turn runs.",
      glance: "It runs the test a few times. Every step it takes edits the same card.",
      momFirst: "Mom asked twenty minutes ago. Nothing here needs you, so you answer her.",
      sent: "Sent. You leave the chat, the way anyone does.",
      workAuto:
        "Auto mode, where every new session starts: Claude Code's own safety check ran the read and the test run itself. Neither came to you.",
      askRead: "Ask mode: every call waits for you. This one only wants to read a file.",
      askTest: "And again for the test run. In Auto mode neither of these would have asked at all.",
      workFull: "Full access: Claude Code asks nothing and aipager has nothing to relay. You only see what it did.",
      momAgain: "Mom again. The session carries on behind you; it does not need a window open.",
      team: "The team's group. Anyone on the allow-list can mention the bot; each message runs with its sender's role.",
      teamSara:
        "Sara is an admin in this group, so her test run goes through. The prompt reaches Claude tagged with who sent it and the role it runs as.",
      teamSam: "Sam is a user in this group. Bash is off for his role, so the call is refused before it runs.",
      questionAuto:
        "Now something only you can answer. A mode decides what runs without asking; a question like this comes to you in every mode.",
      questionAsk: "A question, not a permission: Claude's own decision, with a button per option.",
      buzzed: "Your phone buzzed on the arm of the sofa. Three buttons, one tap.",
      answerTyped: "Your answer is typed into the session as if you were at the keyboard.",
      friends: "Family, friends, work and Claude: one app, the one you check anyway.",
      answerDone: "Done. The answer lands like any other message, and the pinned bar goes quiet.",
      evening: "A flaky test fixed from the sofa, between a question from Mom and a game on Friday.",
      saraPing: "Not everything that pings is work.",
      second: "A second session, started from the chat: no terminal, no ssh.",
      newReady: "aipager starts it on your computer and hands it back, ready, in the mode new sessions start in.",
      weather: "It checks the thing that decides the rest, and says what it found.",
      queued: "Sent while it is still working: aipager hands it over at once, Claude queues it, and the 👀 says it is in.",
      queueLine: "The line under it says what it is waiting for, and tapping it hands the message to Claude mid-step.",
      tookIt:
        "Claude takes it at the end of the step: 👍, the grey lifts, the line goes, and the card moves under the message it is answering.",
      agents: "It sends two out at once. Each gets a row of its own, and the card follows what each is doing.",
      agentsWork: "They are off on their own now: a few tool calls each, and nothing for you to do.",
      twoSessions:
        "Two sessions live in this chat now. A plain message goes to the one your messages are set to; to reach the other, you answer one of its own.",
      hold: "Hold it, and Telegram offers what you can do with it.",
      reply: "Reply. The composer is answering that message, and aipager reads the aim from it.",
      aimed: "Typed into api, not into trip.",
      interim: "The turn ends before they do, so the answer goes out with a live line under it for the work still running.",
      apiFirst: "api answers first; it only had the one thing to do.",
      liveLine: "aipager keeps that line up to date on its own while they work.",
      bothBack: "Both back. aipager folds their two lines into one, and what they found wakes Claude.",
      shortlist: "What they found comes back as its own answer, written once Claude has read both reports.",
      human: "Which only leaves the part a machine should not do for you.",
      end: "Two sessions, three agents and a week in Lisbon, from a sofa. Nothing left running, nothing left to tap.",
      resting: "This session is resting. Before you give it the next job, you take its checks off.",
      fullWho: "Full access is for admins, and for you, in your own private chat with the bot.",
      fullRestart:
        "Going to or from Full access restarts the session and keeps the conversation. Between Ask and Auto nothing restarts at all.",
    },
    switch: {
      default: "default",
      lines: [
        "Every call stops and waits for your tap.",
        "Safe calls run themselves; risky ones need your approval first.",
        "Nothing stops. Nothing asks.",
      ],
    },
    cable: { idle: "waiting for a turn", quiet: "nothing new", flick: "the cable is real · flick it", daemon: "aipager" },
    wire: {
      cardEdited: "card edited · Bash ×1",
      twoCalls: "two calls, nothing to tap",
      trace: "the trace, and what it found",
      permNeeded: "🔐 Permission needed",
      readRuns: "verdict · the read runs",
      testRuns: "verdict · the test runs",
      threeCalls: "three calls, no checks",
      question: "❓ a question, with buttons",
      answerTyped: "answer typed in",
      claudeAnswer: "💬 Claude's answer",
      sessionIn: "a session in ~/travel",
      typedTrip: "typed into claude-trip",
      newCardTrip: "a new card · trip",
      lisbon: "Lisbon in March · 18°C",
      queued: "claude-trip · queued",
      tookIt: "took it · 👍",
      twoAgents: "🤖 two agents",
      aimed: "aimed at claude-api",
      cardApi: "a card · api",
      interim: "💬 trip · an interim answer",
      thePr: "💬 api · the PR",
      flightsDone: "✅ flights · 7 tool calls",
      hotelsDone: "✅ hotels · 11 tool calls",
      shortlist: "💬 trip · the shortlist",
      switchFull: "switch to Full access?",
      restarting: "restarting, conversation kept",
      typedApi: "typed into claude-api",
      newCardApi: "a new card · api",
      yourMessage: "your message",
      aReply: "a reply · api",
    },
    hints: {
      cancel: "Cancel would leave api where it is. This evening goes on to Full access: try the other button.",
      deny: "Deny would block the call for real. This evening needs the test run: try Allow.",
      stop: "Stop would interrupt the turn. Try Allow.",
    },
    menu: ["Reply", "Copy Text", "Pin", "Forward", "Select", "Delete"],
    composer: "Write a message…",
    search: "Search",
  },
};
