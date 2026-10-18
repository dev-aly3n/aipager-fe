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
}

const ALL = STRINGS as BotStrings[];

export function botOf(locale: Locale): BotStrings {
  return ALL.find((s) => s.code === locale) ?? ALL.find((s) => s.code === DEFAULT_LOCALE)!;
}

/** `{name}` becomes what you give it; anything you do not give stays. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) => (key in vars ? String(vars[key]) : whole));
}
