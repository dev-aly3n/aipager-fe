import STRINGS from "@/lib/bot-strings.json";
import { DEFAULT_LOCALE, type Locale } from "./locales";

/**
 * aipager's own words, rendered by aipager itself in every language it
 * speaks (scripts/sync-bot-strings.py). The site never translates what the
 * product says: it fills these in.
 */
export interface BotStrings {
  code: string;
  name: string;
  english: string;
  rtl: boolean;
  permHead: string;
  allow: string;
  deny: string;
  always: string;
  stop: string;
  pinWaiting: string;
  pinWorking: string;
  pinIdle: string;
  answerLine: string;
  cardStatus: string;
  clock: string;
  spin: string[];
  modes: { ask: string; auto: string; full: string };
  switched: string;
  agentsDone: string;
  language: string;
  /** the same lines with their placeholders kept, for the demo to fill */
  tpl: {
    permHead: string;
    cardStatus: string;
    answerLine: string;
    answered: string;
    agentLive: string;
    shellLive: string;
    bgRowWorking: string;
    bgRowDone: string;
    blocked: string;
    pinWaiting: string;
    pinWorking: string;
    pinOneIdle: string;
    pinIdle: string;
    pinCounts: string;
    pinRunning: string;
    pinTarget: string;
    switched: string;
    confirmFull: string;
    ready: string;
    readySettings: string;
    peerFrom: string;
  };
  btn: { toFull: string; cancel: string; sendNow: string };
  line: { queued: string; promise: string; verbDone: string; verbAllow: string; verbWorking: string };
  /** the counts the demo shows, in this language's plural form */
  count: {
    working1: string;
    working2: string;
    idle1: string;
    idle2: string;
    agents1: string;
    agents2: string;
    fold3: string;
    fold4: string;
    fold6: string;
    /** the Mini App's own 'last active' phrase, unit and digits included */
    age2: string;
    age14: string;
    /** the Mini App grid's fold of ended sessions, "Finished (12)" */
    finished12: string;
    agentsWorking1: string;
    agentsWorking2: string;
    agentsDone2: string;
    agentDone11: string;
    agentDone7: string;
  };
  /** the Mini App, in its own words, for the site's working copy of it */
  app: AppStrings;
}

/** One of the app's settings, as its schema gives it: a title and the choices. */
export interface AppGroup {
  field: string;
  title: string;
  options: { value: string | boolean; label: string; lead: string; help: string; swatch?: string[] }[];
}

type Three<T> = { ask: T; auto: T; full: T };
type Seven = Record<"stop" | "restart" | "compact" | "rename" | "kill" | "resume" | "delete", string>;

export interface AppStrings {
  tabs: { sessions: string; settings: string };
  uptime: string;
  pulse: { need1: string; working2: string; working3: string; resting1: string; finished12: string; spent: string };
  needsYou: string;
  answerInChat: string;
  answerSent: string;
  newSession: string;
  state: { busy: string; idle: string; waiting: string; gone: string };
  finished12: string;
  /** a session's state line; resting keeps {age}, working keeps {clock} */
  line: { resting: string; working: string; needs: string; finished: string };
  age: { s2: string; s14: string; m10: string; m40: string; h3: string; d2: string };
  clock: { a: string; b: string; c: string };
  detail: { latestReply: string; sessionSettings: string };
  fact: { model: string; context: string; cost: string; lastActive: string; mode: string; cwd: string; working: string };
  modelTitle: string;
  resetDefaults: string;
  resetDone: string;
  saved: string;
  changed3: string;
  changedNone: string;
  change: { added: string; modified: string; deleted: string };
  timeline5: string;
  timelineEmpty: string;
  timelineNote: string;
  action: Seven;
  done: Seven;
  update: { title: string; upToDate: string; check: string; checking: string };
  language: { title: string; hint: string; auto: string };
  chatPrefs: string;
  prefsIntro: string;
  appearance: string;
  appearanceIntro: string;
  defaultTag: string;
  groups: AppGroup[];
  looks: AppGroup[];
  report: {
    btn: string;
    card: string;
    title: string;
    privacy: string;
    noteLabel: string;
    notePlaceholder: string;
    asWritten: string;
    whatSent: string;
    system: string;
    setup: string;
    setupLine: string;
    errors: string;
    err1: string;
    err1Sub: string;
    err2: string;
    err2Sub: string;
    foot: string;
    send: string;
    sending: string;
    sent: string;
    thanks: string;
  };
  new: {
    title: string;
    sub: string;
    name: string;
    where: string;
    recent: string;
    suggested: string;
    cwdTitle: string;
    newFolder: string;
    newFolderHelp: string;
    default: string;
    defaultModelHelp: string;
    otherModel: string;
    otherModelHelp: string;
    modelName: string;
    modelNeeded: string;
    more: string;
    modeTitle: string;
    modes: Three<string>;
    modeHelp: Three<string>;
    /** keep {where} and {model}; the named ones {name} too */
    summary: Three<string>;
    summaryNamed: Three<string>;
    cliModel: string;
    start: string;
    creating: string;
    created: string;
  };
}

const ALL = STRINGS as BotStrings[];

export function botOf(locale: Locale): BotStrings {
  return ALL.find((s) => s.code === locale) ?? ALL.find((s) => s.code === DEFAULT_LOCALE)!;
}

/** `{name}` becomes what you give it; anything you do not give stays. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) => (key in vars ? String(vars[key]) : whole));
}
