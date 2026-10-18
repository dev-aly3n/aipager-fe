/**
 * Every word the site says, in one shape.
 *
 * The interface is written by hand rather than inferred from the English, so
 * TypeScript proves that each language has every key, and tuples prove it has
 * the same number of cards, facts and questions. Nothing here is a fragment
 * of a sentence: a translator always sees a whole line, the rule aipager's own
 * catalogs follow (tools/i18n/TRANSLATING.md).
 *
 * What is NOT here: anything the product itself says. Cards, buttons, the
 * pinned bar and the rest come from aipager's own catalogs through
 * lib/bot-strings.json, so the demo shows the product's own wording in each
 * language, never a translation of it. Claude Code's terminal text stays
 * English, because Claude Code speaks English.
 */

/** A heading and its paragraph. */
export interface Titled {
  t: string;
  b: string;
}

export interface Chat {
  name: string;
  tag: string;
  preview: string;
  title: string;
  body: string;
}

export interface Qa {
  q: string;
  a: string;
}

export type Two<T> = [T, T];
export type Three<T> = [T, T, T];
export type Four<T> = [T, T, T, T];
export type Six<T> = [T, T, T, T, T, T];
export type Eight<T> = [T, T, T, T, T, T, T, T];
export type Nine<T> = [T, T, T, T, T, T, T, T, T];
export type Thirteen<T> = [T, T, T, T, T, T, T, T, T, T, T, T, T];

export interface Dict {
  meta: { title: string; description: string };

  nav: {
    modes: string;
    app: string;
    how: string;
    install: string;
    security: string;
    faq: string;
    docs: string;
    /** the language picker's label, for a screen reader */
    language: string;
  };

  hero: {
    title: string;
    lead: string;
    agentInstall: string;
    docs: string;
    security: string;
    meta: string;
  };

  modes: {
    eyebrow: string;
    title: string;
    lead: string;
    /** what each button under a prompt does */
    legend: Four<{ k: string; v: string }>;
    ask: { tag: string; note: string; quote: string; read: string; needs: string };
    auto: { tag: string; note: string; quote: string; risky: string };
    full: { tag: string; note: string; ask: string; quote: string };
    facts: Four<Titled>;
  };

  places: {
    eyebrow: string;
    title: string;
    chats: Three<Chat>;
    /** the chips under each chat; commands and role names stay as they are */
    chips: Three<string[]>;
    roles: {
      title: string;
      lead: string;
      can: string;
      rows: Six<string>;
      anywhere: string;
      rootFolder: string;
      ownChat: string;
      link: string;
    };
  };

  day: {
    eyebrow: string;
    title: string;
    lead: string;
    items: Nine<Titled>;
    /** the voice note shown under the first one */
    heard: string;
    said: string;
    /** the request under the third: Claude sends the file back */
    ask: string;
  };

  app: {
    eyebrow: string;
    title: string;
    lead: string;
    tabs: { sessions: string; settings: string };
    summary: { needs: string; working: string; resting: string; spent: string; finished: string };
    needsYou: string;
    answerInChat: string;
    states: { working: string; needs: string; resting: string };
    settings: {
      updates: string;
      upToDate: string;
      check: string;
      language: string;
      languageNote: string;
      chatPrefs: string;
      chatPrefsNote: string;
      /** the fourth row's value is a mode label, so it comes from the catalog, not from here */
      rows: [{ k: string; v: string }, { k: string; v: string }, { k: string; v: string }, { k: string }];
    };
    close: string;
    facts: Four<Titled>;
    link: string;
  };

  langs: {
    eyebrow: string;
    title: string;
    lead: string;
    facts: Four<Titled>;
    pinned: string;
  };

  under: {
    eyebrow: string;
    title: string;
    lead: string;
    nodes: [Titled, Titled, Titled, Titled, Titled];
    facts: Three<Titled>;
    hooks: string;
  };

  trust: {
    eyebrow: string;
    title: string;
    lead: string;
    cards: Eight<Titled>;
    link: string;
  };

  install: {
    eyebrow: string;
    title: string;
    lead: string;
    agent: { title: string; lead: string; link: string };
    saved: { name: string; count: string };
    lines: Four<{ note: string }>;
    copied: string;
    pm: string;
    pmLink: string;
  };

  faq: {
    eyebrow: string;
    title: string;
    /** the hint in the chat's header once there is more than fits */
    readBack: string;
    items: Thirteen<Qa>;
  };

  cta: { title: string; lead: string; copy: string };

  footer: { changelog: string; issues: string };

  docs: {
    title: string;
    description: string;
    onThisPage: string;
    /** the line every translated page carries */
    translated: string;
    english: string;
    source: string;
    sourceNote: string;
    onGitHub: string;
    prev: string;
    next: string;
    groups: Three<string>;
  };

  /** the evening in the hero: what people say, and what is going on */
  demo: {
    people: { you: string };
    /** Telegram's own two words in a chat header */
    typing: string;
    isTyping: string;
    days: { today: string; yesterday: string; monday: string };
    chats: {
      aipager: { name: string; subtitle: string };
      team: { name: string; subtitle: string };
      mom: { name: string; subtitle: string };
      friends: { name: string; subtitle: string };
      sara: { name: string; subtitle: string };
      saved: { name: string; subtitle: string };
    };
    folders: { all: string; personal: string; work: string; bots: string };
    /** what is already in the chats when the evening starts */
    seed: {
      oldPrompt: string;
      oldAnswer: string;
      teamFlaky: string;
      teamSaw: string;
      momEat: string;
      friendsPitch: string;
      friendsIn: string;
      friendsBall: string;
      saraMerged: string;
      saraThanks: string;
      savedConfig: string;
    };
    /** what people write during the evening */
    says: {
      youPasta: string;
      momLunch: string;
      youLunch: string;
      teamRun: string;
      teamKubectl: string;
      friendsWho: string;
      youIn: string;
      saraVacation: string;
      youTwoMinutes: string;
      youBook: string;
      saraBook: string;
    };
    /** what you ask the sessions for */
    prompts: { fix: string; trip: string; more: string; push: string; teamRun: string };
    /** and what Claude writes back */
    claude: {
      plan: string;
      flaky: string;
      cookie: string;
      answer: string;
      teamTests: string;
      weather: string;
      lisbon: string;
      pr: string;
      shortlist: string;
      teamShort: string;
      twoAgents: string;
      interim: string;
    };
    /** Claude's own question, with its options */
    question: { verb: string; question: string; options: Three<string>; title: string; body: string };
    /** the strip under the desk that says what just happened */
    captions: {
      restAuto: string;
      restAsk: string;
      restFull: string;
      held: string;
      arrived: string;
      took: string;
      glance: string;
      momFirst: string;
      sent: string;
      workAuto: string;
      askRead: string;
      askTest: string;
      workFull: string;
      momAgain: string;
      team: string;
      teamSara: string;
      teamSam: string;
      questionAuto: string;
      questionAsk: string;
      buzzed: string;
      answerTyped: string;
      friends: string;
      answerDone: string;
      evening: string;
      saraPing: string;
      second: string;
      newReady: string;
      weather: string;
      queued: string;
      queueLine: string;
      tookIt: string;
      agents: string;
      agentsWork: string;
      twoSessions: string;
      hold: string;
      reply: string;
      aimed: string;
      interim: string;
      apiFirst: string;
      liveLine: string;
      bothBack: string;
      shortlist: string;
      human: string;
      end: string;
      resting: string;
      fullWho: string;
      fullRestart: string;
    };
    /** the switch above the desk */
    /** the mode labels come from the product's own catalog, not from here */
    switch: { default: string; lines: Three<string> };
    /** idle and quiet are what the two sockets say before anything has happened */
    cable: { idle: string; quiet: string; flick: string; daemon: string };
    /** the words in the sockets at each end of the cable */
    wire: {
      cardEdited: string;
      twoCalls: string;
      trace: string;
      permNeeded: string;
      readRuns: string;
      testRuns: string;
      threeCalls: string;
      question: string;
      answerTyped: string;
      claudeAnswer: string;
      sessionIn: string;
      typedTrip: string;
      newCardTrip: string;
      lisbon: string;
      queued: string;
      tookIt: string;
      twoAgents: string;
      aimed: string;
      cardApi: string;
      interim: string;
      thePr: string;
      flightsDone: string;
      hotelsDone: string;
      shortlist: string;
      switchFull: string;
      restarting: string;
      typedApi: string;
      newCardApi: string;
      yourMessage: string;
      aReply: string;
    };
    /** what the reader is told when they tap something the evening needs */
    hints: { cancel: string; deny: string; stop: string };
    /** Telegram's own context menu */
    menu: Six<string>;
    composer: string;
    search: string;
  };
}
