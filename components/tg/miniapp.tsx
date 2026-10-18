"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mark } from "@/components/brand";
import type { Dict } from "@/lib/i18n";
import { botOf, fill, type AppGroup, type AppStrings } from "@/lib/i18n/bot";
import { comma, digits, dirOf, LANGUAGES, percent, type Locale } from "@/lib/i18n/locales";

/**
 * The Mini App, working: the sessions grid, a page per session, the finished
 * ones, the settings, a new session and a problem report, each a screen that
 * slides in over the last one the way Telegram's own pages do.
 *
 * Every word on it is aipager's own, rendered from the product's catalog and
 * from the same settings schema the real app draws (lib/bot-strings.json, by
 * scripts/sync-bot-strings.py). Its language is its own, too: pick one under
 * App language and the app changes while Claude's replies stay as they were,
 * which is exactly what the hint under that row promises.
 */

type State = "busy" | "waiting" | "idle" | "gone";
type Mode = "ask" | "auto" | "full";

interface Sess {
  id: string;
  who: string;
  pct: number;
  /** the picker's label for the model it runs */
  model: string;
  cost: string;
  state: State;
  cwd: string;
  mode: Mode;
  since?: keyof AppStrings["age"];
  clock?: keyof AppStrings["clock"];
  /** which of Claude's replies it last sent */
  reply: number;
}

const LIVE: Sess[] = [
  { id: "api", who: "aly", pct: 62, model: "Sonnet 5.5", cost: "$1.84", state: "busy", cwd: "~/work/api", mode: "auto", clock: "a", reply: 0 },
  { id: "web", who: "jim", pct: 38, model: "Sonnet 5.5", cost: "$0.92", state: "waiting", cwd: "~/work/web", mode: "ask", since: "m10", reply: 1 },
  { id: "docs", who: "aly", pct: 44, model: "Opus 5.5 1M", cost: "$1.36", state: "busy", cwd: "~/work/docs", mode: "auto", clock: "b", reply: 2 },
  { id: "e2e", who: "aly", pct: 12, model: "Haiku 5.5", cost: "$0.07", state: "idle", cwd: "~/work/api", mode: "full", since: "m40", reply: 3 },
];

const FINISHED: [string, string][] = [
  ["fix-cors", "web"],
  ["pg-upgrade", "api"],
  ["release-1-3", "aipager"],
  ["docs-i18n", "docs"],
  ["flaky-ci", "api"],
  ["s3-sync", "api"],
  ["rate-limit", "api"],
  ["cookie-fix", "web"],
  ["onboarding", "web"],
  ["bench", "api"],
  ["spike-ws", "web"],
  ["readme", "docs"],
];

/**
 * The model picker, as aipager's own list has it (config.MODEL_CATALOG). The
 * product writes these hints in English in every language, so they are
 * quoted as they are.
 */
const MODELS: [string, string][] = [
  ["Sonnet", "Balanced - the everyday default"],
  ["Opus", "Most capable - deep reasoning, hardest problems"],
  ["Haiku", "Fastest and cheapest - quick edits and lookups"],
  ["Fable", "Newest family alias"],
  ["OpusPlan", "Opus for planning, Sonnet to execute"],
  ["Opus 5.5", ""],
  ["Opus 5.5 1M", ""],
  ["Sonnet 5.5", ""],
  ["Fable 5.1", ""],
  ["Haiku 5.5", ""],
];
/** What Claude Code reports running for a picker label. */
const SHOWN: Record<string, string> = {
  Sonnet: "Sonnet 5.5",
  Opus: "Opus 5.5",
  Haiku: "Haiku 5.5",
  Fable: "Fable 5.1",
  "Opus 5.5 1M": "Opus 5.5 (1M context)",
};
const shown = (label: string) => SHOWN[label] ?? label;

const DIRS: [string, string][] = [
  ["api", "/home/aly/work/api"],
  ["web", "/home/aly/work/web"],
  ["docs", "/home/aly/work/docs"],
  ["aly", "/home/aly"],
];

const FILES: [string, "modified" | "added" | "deleted", string][] = [
  ["e2e/login.spec.ts", "modified", "+14 −6"],
  ["src/auth/cookie.ts", "modified", "+3 −1"],
  ["e2e/helpers/wait.ts", "added", "+22"],
];
const TOOLS: [string, keyof AppStrings["age"]][] = [
  ["Edit: e2e/login.spec.ts", "s2"],
  ["Bash: pnpm test e2e/login", "s14"],
  ["Read: src/auth/cookie.ts", "m10"],
  ["Grep: waitForCookie", "m10"],
  ["Read: e2e/login.spec.ts", "m40"],
];

const STATE_DOT: Record<State, string> = { busy: "bg-[#5a9fe0]", waiting: "bg-[#ffc774]", idle: "bg-[#6b7785]", gone: "bg-[#4a5562]" };
const SWATCH: Record<string, string> = { blue: "#4c8ce6", green: "#4fb35e", red: "#e0533f" };

type Screen = { k: "home" } | { k: "session"; id: string } | { k: "new" } | { k: "report" };

/* ---------------- small parts ---------------- */

function Ring({ pct, on, size, lang }: { pct: number; on: boolean; size: number; lang: Locale }) {
  const r = size / 2 - 5;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute -rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth={size > 56 ? 6 : 4} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={on ? "#5a9fe0" : "#7d8a97"}
          strokeWidth={size > 56 ? 6 : 4}
          strokeLinecap="round"
          strokeDasharray={`${(c * pct) / 100} ${c}`}
          className="transition-[stroke-dasharray] duration-700"
        />
      </svg>
      <span className={`font-semibold text-white ${size > 56 ? "text-[17px]" : "text-[13px]"}`}>
        {digits(String(pct), lang)}
        <span className={`${size > 56 ? "text-[11px]" : "text-[9px]"} text-fg-3`}>{percent(lang)}</span>
      </span>
    </span>
  );
}

const Chevron = ({ open = false, side = false }: { open?: boolean; side?: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className={`shrink-0 text-fg-4 transition-transform duration-200 ${open ? "rotate-90" : ""} ${side ? "" : "rtl:-scale-x-100"}`}
  >
    <path d="m9 6 6 6-6 6" />
  </svg>
);

const Folder = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
    <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2h9A1.5 1.5 0 0 1 21 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-10Z" />
  </svg>
);

const Sparkle = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden>
    <path d="M10 3.5 11.6 8a2 2 0 0 0 1.2 1.2L17.5 11l-4.7 1.7a2 2 0 0 0-1.2 1.2L10 18.5l-1.6-4.6a2 2 0 0 0-1.2-1.2L2.5 11l4.7-1.8A2 2 0 0 0 8.4 8L10 3.5ZM18.5 15l.6 1.6.6.3 1.8.6-1.8.6-.6.3-.6 1.6-.6-1.6-.6-.3-1.8-.6 1.8-.6.6-.3.6-1.6Z" />
  </svg>
);

/** The bot's line under the app's bar: who the app belongs to. */
function Identity({ version, a }: { version: string; a: AppStrings }) {
  return (
    <div className="flex items-center gap-3 px-4 pb-3 pt-1">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-[#1a2430]">
        <Mark size={24} />
      </span>
      <div className="min-w-0 leading-tight">
        <div className="text-[18px] font-semibold text-white">aipager</div>
        <div className="truncate text-[12.5px] text-fg-3">
          <bdi dir="ltr">@aipagerbot · v{version}</bdi> · {a.uptime}
        </div>
      </div>
    </div>
  );
}

/** A radio dot, filled when chosen, dashed for a row that makes something new. */
function Radio({ on, dashed = false }: { on: boolean; dashed?: boolean }) {
  return (
    <span
      className={`mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border-2 transition-colors ${
        on ? "border-[#6ab3f3]" : "border-[#5f6b78]"
      } ${dashed ? "border-dashed" : ""}`}
    >
      <span className={`h-[10px] w-[10px] rounded-full bg-[#6ab3f3] transition-transform duration-200 ${on ? "scale-100" : "scale-0"}`} />
    </span>
  );
}

interface Option {
  label: string;
  help?: string;
  swatch?: string[];
  tag?: string;
  dashed?: boolean;
}

/**
 * One setting: its title and the choice in force, opening into the choices,
 * each with what it does. The same control the real app uses everywhere.
 */
function Group({
  title,
  value,
  options,
  chosen,
  onPick,
  open,
  onToggle,
  first,
  last,
  children,
}: {
  title: string;
  value: string;
  options: Option[];
  chosen: number;
  onPick: (i: number) => void;
  open: boolean;
  onToggle: () => void;
  first: boolean;
  last: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`${first ? "" : "border-t border-white/[0.06]"}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`flex w-full items-center gap-3 px-4 py-3.5 text-start transition-colors ${open ? "bg-white/[0.04]" : "hover:bg-white/[0.03]"} ${first ? "rounded-t-2xl" : ""} ${last && !open ? "rounded-b-2xl" : ""}`}
      >
        <span className="min-w-0 flex-1 text-[15px] text-white">{title}</span>
        <span className="max-w-[48%] truncate text-[14px] text-fg-3">{value}</span>
        <Chevron open={open} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.06] py-1.5">
              {options.map((o, i) => (
                <button
                  key={`${o.label}-${i}`}
                  type="button"
                  onClick={() => onPick(i)}
                  className="flex w-full items-start gap-3 px-4 py-2.5 text-start transition-colors hover:bg-white/[0.03]"
                >
                  <Radio on={chosen === i} dashed={o.dashed} />
                  <span className="min-w-0 flex-1">
                    <span className={`flex items-center gap-2 text-[14.5px] ${chosen === i ? "font-semibold text-white" : "text-fg-2"}`}>
                      {o.swatch?.map((c) => <span key={c} className="h-3 w-3 shrink-0 rounded-full" style={{ background: SWATCH[c] }} />)}
                      <span className="min-w-0">{o.label}</span>
                      {o.tag && <span className="ms-auto rounded-full bg-white/[0.08] px-2 py-0.5 text-[11px] text-fg-3">{o.tag}</span>}
                    </span>
                    {o.help && <span className="mt-0.5 block text-[12.5px] leading-snug text-fg-4">{o.help}</span>}
                  </span>
                </button>
              ))}
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const fromSchema = (g: AppGroup): Option[] => g.options.map((o) => ({ label: o.label, help: o.help, swatch: o.swatch }));

/** A list of settings from the schema, each opening on its own. */
function Groups({ groups, values, setValue, openKey, setOpen, prefix }: {
  groups: AppGroup[];
  values: Record<string, number>;
  setValue: (field: string, i: number) => void;
  openKey: string | null;
  setOpen: (k: string | null) => void;
  prefix: string;
}) {
  return (
    <div className="rounded-2xl bg-[#19222d]">
      {groups.map((g, gi) => {
        const key = `${prefix}:${g.field}`;
        const i = values[g.field] ?? 0;
        return (
          <Group
            key={key}
            title={g.title}
            value={g.options[i]?.lead ?? ""}
            options={fromSchema(g)}
            chosen={i}
            onPick={(n) => setValue(g.field, n)}
            open={openKey === key}
            onToggle={() => setOpen(openKey === key ? null : key)}
            first={gi === 0}
            last={gi === groups.length - 1}
          />
        );
      })}
    </div>
  );
}

const SectionHead = ({ title, note }: { title: string; note?: string }) => (
  <div className="px-1 pb-2 pt-1">
    <div className="text-[13.5px] font-medium text-fg-3">{title}</div>
    {note && <p className="mt-0.5 text-[12.5px] text-fg-4">{note}</p>}
  </div>
);

/** The flat cell grid the real app uses for facts: label over value. */
function Facts({ cells }: { cells: { k: string; v: React.ReactNode; wide?: boolean; mono?: boolean }[] }) {
  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#19222d]">
      {cells.map((c, i) => (
        <div key={i} className={`border-white/[0.06] px-3.5 py-2.5 ${c.wide ? "col-span-2" : ""} ${i > 1 ? "border-t" : ""} ${!c.wide && i % 2 === 1 ? "border-s" : ""}`}>
          <div className="text-[12px] text-fg-4">{c.k}</div>
          <div className={`mt-0.5 truncate text-[14.5px] font-medium text-white ${c.mono ? "font-mono text-[13px] font-normal" : ""}`}>{c.v}</div>
        </div>
      ))}
    </div>
  );
}

/** A numbered step of the new-session form, on the rail that joins them. */
function Step({ n, title, children, last = false }: { n: string; title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className="relative ps-[46px]">
      <span className="absolute start-0 top-0 grid h-8 w-8 place-items-center rounded-full bg-white text-[14px] font-semibold text-[#17212b]">{n}</span>
      {!last && <span className="absolute bottom-0 start-[15.5px] top-10 w-[2px] rounded-full bg-[#121a23]" />}
      <div className="pb-5 pt-1 text-[16px] font-medium text-white">{title}</div>
      <div className="pb-6">{children}</div>
    </div>
  );
}

/* ---------------- the app ---------------- */

export function MiniApp({ t, locale, version }: { t: Dict; locale: Locale; version: string }) {
  const [lang, setLang] = useState<Locale>(locale);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (auto) setLang(locale);
  }, [locale, auto]);
  const bot = botOf(lang);
  const a = bot.app;
  const rtl = dirOf(lang) === "rtl";
  const num = (s: string) => digits(s, lang);
  // Claude's words are in the language you wrote to it, which the app's own
  // language does not change
  const replies = [t.demo.seed.oldAnswer, t.modes.auto.quote, t.modes.ask.quote, t.modes.full.quote];

  const [stack, setStack] = useState<Screen[]>([{ k: "home" }]);
  const [dir, setDir] = useState(1);
  const screen = stack[stack.length - 1];
  const push = (s: Screen) => {
    // a page opened anew starts at its top; only going back restores
    delete scrolls.current[s.k === "session" ? `s:${s.id}` : s.k];
    setDir(1);
    setStack((st) => [...st, s]);
  };
  const pop = () => {
    setDir(-1);
    setStack((st) => (st.length > 1 ? st.slice(0, -1) : st));
  };

  const [tab, setTab] = useState<"sessions" | "settings">("sessions");
  const [sessions, setSessions] = useState<Sess[]>(LIVE);
  const [finished, setFinished] = useState(FINISHED);
  const [finOpen, setFinOpen] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [chat, setChat] = useState<Record<string, number>>({});
  const [own, setOwn] = useState<Record<string, Record<string, number>>>({});
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef(0);
  const say = (text: string) => {
    setToast(text);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1900);
  };
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);
  // the tile that just arrived, which alone grows in
  const [fresh, setFresh] = useState<string | null>(null);
  // where each page was scrolled to, so back lands where the reader was
  const scrolls = useRef<Record<string, number>>({});
  const [checking, setChecking] = useState(false);
  const [menu, setMenu] = useState(false);
  const [listOpen, setListOpen] = useState<"files" | "timeline" | null>(null);
  const [form, setForm] = useState({ name: "", dir: 3, model: 0, other: "", mode: 1 as 0 | 1 | 2, more: false });
  const [creating, setCreating] = useState(false);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState<"no" | "sending" | "yes">("no");

  const busy = sessions.filter((s) => s.state === "busy").length;
  const sep = comma(lang);

  /* ---- home ---- */
  const tile = (s: Sess) => {
    const pill =
      s.state === "busy" ? "bg-[#5a9fe0]/15 text-[#8fc4f0]" : s.state === "waiting" ? "bg-[#ffc774]/15 text-[#ffc774]" : "bg-white/[0.06] text-fg-3";
    return (
      <motion.button
        key={s.id}
        type="button"
        onClick={() => push({ k: "session", id: s.id })}
        // only a tile that just arrived grows in; the grid sliding back into
        // view after a session's page is not a new grid
        initial={s.id === fresh ? { opacity: 0, scale: 0.94 } : false}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl px-3 py-3 text-start transition-colors hover:brightness-110 ${
          s.state === "busy" ? "bg-[#1b2a3d] ring-1 ring-[#5a9fe0]/30" : s.state === "waiting" ? "bg-[#231f1a] ring-1 ring-[#ffc774]/25" : "bg-[#19222d]"
        }`}
      >
        <div className="flex items-start gap-2">
          <Ring pct={s.pct} on={s.state === "busy"} size={50} lang={lang} />
          <div className="ms-auto text-end">
            <span className={`inline-block whitespace-nowrap rounded-full px-2 py-[3px] text-[11.5px] ${pill}`}>{a.state[s.state]}</span>
            {s.state === "busy" && <div className="mt-1 text-[11.5px] text-fg-4">{s.clock === "a" ? a.age.s2 : a.age.s14}</div>}
          </div>
        </div>
        <div className="mt-2 truncate text-[15.5px] font-semibold text-white">{s.id}</div>
        <div className="truncate text-[13px] text-fg-3">{s.who}</div>
        <div className="truncate text-[12.5px] text-fg-4">
          {shown(s.model)} · {num(s.cost)}
        </div>
      </motion.button>
    );
  };

  const homeView = () => (
    <div className="pb-6">
      <Identity version={version} a={a} />
      <div className="relative mx-4 grid grid-cols-2 rounded-2xl bg-[#2b3846] p-1">
        <span
          aria-hidden
          className="absolute inset-y-1 start-1 w-[calc(50%-4px)] rounded-xl bg-[#19222d] shadow-[0_1px_3px_rgb(0_0_0/0.4)] transition-transform duration-300 ease-[cubic-bezier(0.22,0.9,0.24,1)]"
          style={{ transform: `translateX(${tab === "settings" ? (rtl ? "-100%" : "100%") : "0"})` }}
        />
        {(["sessions", "settings"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              setTab(k);
              setOpen(null);
            }}
            className={`relative rounded-xl py-2 text-[14.5px] font-medium transition-colors ${tab === k ? "text-white" : "text-fg-3 hover:text-fg-2"}`}
          >
            <span className="relative">{a.tabs[k]}</span>
          </button>
        ))}
      </div>
      {tab === "sessions" ? (
        <div className="space-y-2.5 p-4">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[19px] font-semibold leading-snug tracking-[-0.02em] text-white">
                {a.pulse.need1}
                {sep}
                <span className="text-fg-2">{busy === 3 ? a.pulse.working3 : a.pulse.working2}</span>
                <span className="text-fg-3">
                  {sep}
                  {a.pulse.resting1}
                </span>
              </div>
              <div className="mt-0.5 text-[13px] text-fg-3">
                {fill(a.pulse.spent, { cost: num("$4.19") })} · {a.pulse.finished12}
              </div>
            </div>
            <button
              type="button"
              onClick={() => push({ k: "new" })}
              aria-label={a.newSession}
              className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-2xl bg-[#5288c1] text-[24px] leading-none text-white transition hover:brightness-110 active:scale-95"
            >
              +
            </button>
          </div>
          {sessions.some((s) => s.id === "web" && s.state === "waiting") && (
            <div className="rounded-2xl border border-[#ffc774]/30 bg-[#ffc774]/[0.07] px-3.5 py-3">
              <div className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-[#ffc774]">{a.needsYou}</div>
              <button type="button" onClick={() => push({ k: "session", id: "web" })} className="mt-1 block text-start text-[14px] text-white">
                <b className="font-semibold">web</b> · Bash: <code className="font-mono text-[13px] text-[#ffc774]">make deploy</code>
              </button>
              <button
                type="button"
                onClick={() => say(a.answerSent)}
                className="mt-2.5 w-full rounded-xl bg-[#2b3846] py-2 text-[13.5px] font-medium text-white transition-colors hover:bg-[#34445a]"
              >
                {a.answerInChat}
              </button>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2.5">{sessions.map(tile)}</div>
          <button type="button" onClick={() => setFinOpen((v) => !v)} aria-expanded={finOpen} className="flex w-full items-center justify-between px-1 pt-1.5 text-[13.5px] text-fg-3">
            <span>{a.finished12}</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden className={`transition-transform duration-200 ${finOpen ? "rotate-180" : ""}`}>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <AnimatePresence initial={false}>
            {finOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                <div className="divide-y divide-white/[0.06] rounded-2xl bg-[#19222d]">
                  {finished.map(([name, where]) => (
                    <button key={name} type="button" onClick={() => push({ k: "session", id: `gone:${name}` })} className="flex w-full items-center gap-3 px-3.5 py-2.5 text-start transition-colors hover:bg-white/[0.03]">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10">
                        <Mark size={16} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14.5px] text-fg-2">{name}</span>
                        <span className="block truncate text-[12.5px] text-fg-4">{where}</span>
                      </span>
                      <Chevron />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        settingsView()
      )}
    </div>
  );

  /* ---- settings ---- */
  function settingsView() {
    const langOpts: Option[] = [{ label: a.language.auto }, ...LANGUAGES.map((l) => ({ label: l.name }))];
    const langIndex = auto ? 0 : LANGUAGES.findIndex((l) => l.code === lang) + 1;
    return (
      <div className="space-y-3 p-4">
        <div className="rounded-2xl bg-[#19222d] px-4 py-3.5">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-[16.5px] font-semibold text-white">{a.update.title}</span>
            <span className="text-[12.5px] text-fg-3">v{version}</span>
            <button
              type="button"
              disabled={checking}
              onClick={() => {
                setChecking(true);
                window.setTimeout(() => {
                  setChecking(false);
                  say(a.update.upToDate);
                }, 1300);
              }}
              className="ms-auto flex items-center gap-1.5 text-[13.5px] font-medium text-[#6ab3f3]"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden className={checking ? "animate-spin" : ""}>
                <path d="M20 11a8 8 0 0 0-14.6-4.5M4 13a8 8 0 0 0 14.6 4.5M4 4v4h4M20 20v-4h-4" />
              </svg>
              {checking ? a.update.checking : a.update.check}
            </button>
          </div>
          <div className="mt-1.5 text-[14px] text-fg-2">{a.update.upToDate}</div>
        </div>
        <div>
          <div className="rounded-2xl bg-[#19222d]">
            <Group
              title={a.language.title}
              value={auto ? a.language.auto.split(/[(（]/)[0].trim() : bot.name}
              options={langOpts}
              chosen={langIndex}
              onPick={(i) => {
                if (i === 0) {
                  setAuto(true);
                  setLang(locale);
                } else {
                  setAuto(false);
                  setLang(LANGUAGES[i - 1].code);
                }
              }}
              open={open === "lang"}
              onToggle={() => setOpen(open === "lang" ? null : "lang")}
              first
              last
            />
          </div>
          <p className="mt-1.5 px-1 text-[12.5px] text-fg-4">{a.language.hint}</p>
        </div>
        <div>
          <SectionHead title={a.chatPrefs} note={a.prefsIntro} />
          <Groups groups={a.groups} values={chat} setValue={(f, i) => setChat((v) => ({ ...v, [f]: i }))} openKey={open} setOpen={setOpen} prefix="chat" />
        </div>
        <div>
          <SectionHead title={a.appearance} note={a.appearanceIntro} />
          <Groups groups={a.looks} values={chat} setValue={(f, i) => setChat((v) => ({ ...v, [f]: i }))} openKey={open} setOpen={setOpen} prefix="look" />
        </div>
        <div className="rounded-2xl bg-[#19222d] p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#243142] text-[#6ab3f3]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden>
                <circle cx="12" cy="12" r="9" />
                <path d="M9.6 9.3a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4M12 16.8v.2" />
              </svg>
            </span>
            <span className="text-[16px] font-semibold text-white">{a.report.btn}</span>
          </div>
          <p className="mt-2 text-[13px] leading-snug text-fg-3">{a.report.card}</p>
          <button type="button" onClick={() => push({ k: "report" })} className="mt-3 w-full rounded-xl bg-[#5288c1] py-2.5 text-[14.5px] font-semibold text-white transition hover:brightness-110">
            {a.report.btn}
          </button>
        </div>
      </div>
    );
  }

  /* ---- a session's page ---- */
  function sessionView(id: string) {
    const gone = id.startsWith("gone:");
    const s: Sess =
      sessions.find((x) => x.id === id) ??
      ({ id: id.slice(5), who: "aly", pct: 0, model: "Sonnet 5.5", cost: "$0.31", state: "gone", cwd: `~/work/${finished.find(([n]) => n === id.slice(5))?.[1] ?? "api"}`, mode: "auto", since: "d2", reply: 0 } satisfies Sess);
    const prefs = own[s.id] ?? {};
    const modelIndex = Math.max(0, MODELS.findIndex(([l]) => l === s.model)) + 1;
    const line =
      s.state === "busy"
        ? fill(a.line.working, { clock: a.clock[s.clock ?? "a"] })
        : s.state === "waiting"
          ? a.line.needs
          : s.state === "idle"
            ? fill(a.line.resting, { age: a.age[s.since ?? "m10"] })
            : a.line.finished;
    const actions: (keyof AppStrings["action"])[] =
      s.state === "busy" ? ["stop", "compact", "restart", "rename"] : s.state === "waiting" ? ["stop", "rename"] : s.state === "idle" ? ["restart", "compact", "rename", "kill"] : ["resume", "delete"];
    const act = (k: keyof AppStrings["action"]) => {
      setMenu(false);
      say(a.done[k]);
      if (k === "stop") setSessions((ss) => ss.map((x) => (x.id === s.id ? { ...x, state: "idle", since: "s2" } : x)));
      if (k === "kill") {
        setSessions((ss) => ss.filter((x) => x.id !== s.id));
        pop();
      }
      if (k === "delete") {
        setFinished((fs) => fs.filter(([n]) => n !== s.id));
        pop();
      }
      if (k === "resume") {
        setFinished((fs) => fs.filter(([n]) => n !== s.id));
        setSessions((ss) => [...ss, { ...s, state: "busy", clock: "c", pct: 4 }]);
        setFresh(s.id);
        pop();
      }
    };
    return (
      <div className="space-y-3 pb-6">
        <Identity version={version} a={a} />
        <div className="relative flex items-center gap-4 px-4">
          <Ring pct={s.pct} on={s.state === "busy"} size={72} lang={lang} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[21px] font-semibold text-white">{s.id}</div>
            <div className="mt-0.5 flex items-center gap-2.5 text-[13.5px] text-fg-3">
              <span className={`ms-0.5 h-2 w-2 shrink-0 rounded-full ${STATE_DOT[s.state]} ${s.state === "busy" ? "dot-pulse" : ""}`} />
              <span className="min-w-0">{line}</span>
            </div>
          </div>
          <button type="button" onClick={() => setMenu((v) => !v)} aria-expanded={menu} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#19222d] text-fg-2 transition-colors hover:text-white">
            <svg width="4" height="16" viewBox="0 0 4 16" fill="currentColor" aria-hidden>
              <circle cx="2" cy="2" r="1.7" />
              <circle cx="2" cy="8" r="1.7" />
              <circle cx="2" cy="14" r="1.7" />
            </svg>
          </button>
          <AnimatePresence>
            {menu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute end-4 top-[60px] z-20 w-48 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-[#202b38] py-1 shadow-[0_20px_50px_-10px_rgb(0_0_0/0.8)] rtl:origin-top-left"
              >
                {actions.map((k) => (
                  <button key={k} type="button" onClick={() => act(k)} className={`block w-full px-4 py-2.5 text-start text-[14.5px] transition-colors hover:bg-white/[0.05] ${k === "kill" || k === "delete" ? "text-[#f08a83]" : "text-white"}`}>
                    {a.action[k]}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="px-4">
          <div className="px-1 pb-1.5 text-[13.5px] font-medium text-fg-3">{a.detail.latestReply}</div>
          <div className="rounded-2xl bg-[#19222d] px-4 py-3">
            <div className="flex gap-3">
              <span className="w-[3px] shrink-0 rounded-full bg-[#5288c1]" />
              <p dir="auto" className="min-w-0 text-[14px] leading-snug text-[#e6edf5]">
                {replies[s.reply]}
              </p>
            </div>
          </div>
        </div>
        <div className="px-4">
          <Facts
            cells={[
              { k: a.fact.model, v: shown(s.model) },
              { k: a.fact.context, v: `${num(String(s.pct))}${percent(lang)}` },
              { k: a.fact.cost, v: num(s.cost) },
              s.state === "busy" ? { k: a.fact.working, v: a.clock[s.clock ?? "a"] } : { k: a.fact.lastActive, v: a.age[s.since ?? "m10"] },
              { k: a.fact.mode, v: bot.modes[s.mode], wide: true },
              { k: a.fact.cwd, v: <bdi dir="ltr">{s.cwd}</bdi>, wide: true, mono: true },
            ]}
          />
        </div>
        {!gone && (
          <div className="px-4">
            <div className="rounded-2xl bg-[#19222d]">
              <Group
                title={a.modelTitle}
                value={shown(s.model)}
                options={[{ label: a.new.default, help: a.new.defaultModelHelp }, ...MODELS.map(([l, h]) => ({ label: l, help: h }))]}
                chosen={modelIndex}
                onPick={(i) => {
                  const label = i === 0 ? "Sonnet 5.5" : MODELS[i - 1][0];
                  setSessions((ss) => ss.map((x) => (x.id === s.id ? { ...x, model: label } : x)));
                  say(a.saved);
                }}
                open={open === "model"}
                onToggle={() => setOpen(open === "model" ? null : "model")}
                first
                last
              />
            </div>
          </div>
        )}
        {!gone && (
          <div className="px-4">
            <SectionHead title={a.detail.sessionSettings} />
            <Groups
              groups={a.groups}
              values={{ ...chat, ...prefs }}
              setValue={(f, i) => {
                setOwn((o) => ({ ...o, [s.id]: { ...(o[s.id] ?? {}), [f]: i } }));
                say(a.saved);
              }}
              openKey={open}
              setOpen={setOpen}
              prefix="own"
            />
            <button
              type="button"
              onClick={() => {
                setOwn((o) => ({ ...o, [s.id]: {} }));
                say(a.resetDone);
              }}
              className="mt-2.5 px-1 text-[14px] font-medium text-[#f08a83]"
            >
              {a.resetDefaults}
            </button>
          </div>
        )}
        <div className="px-4">
          <div className="rounded-2xl bg-[#19222d]">
            {(["files", "timeline"] as const).map((k, i) => {
              const empty = gone || (k === "files" && s.state === "idle" && s.id === "e2e");
              const title = k === "files" ? (empty ? a.changedNone : a.changed3) : empty ? a.timelineEmpty : a.timeline5;
              const isOpen = listOpen === k && !empty;
              return (
                <div key={k} className={i ? "border-t border-white/[0.06]" : ""}>
                  <button
                    type="button"
                    disabled={empty}
                    onClick={() => setListOpen(isOpen ? null : k)}
                    className={`flex w-full items-center gap-3 px-4 py-3.5 text-start ${empty ? "text-fg-4" : "text-white hover:bg-white/[0.03]"}`}
                  >
                    <span className="min-w-0 flex-1 text-[15px]">{title}</span>
                    {!empty && <Chevron open={isOpen} />}
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                        <div className="space-y-1 border-t border-white/[0.06] px-4 py-2.5" dir="ltr">
                          {k === "files"
                            ? FILES.map(([f, c, n]) => (
                                <div key={f} className="flex items-center gap-2 py-1 font-mono text-[12.5px]">
                                  <span className="min-w-0 flex-1 truncate text-[#c9d6e3]">{f}</span>
                                  <span className={`rounded px-1.5 py-px font-sans text-[11px] ${c === "added" ? "bg-[#4fd693]/15 text-[#7fe0ad]" : "bg-[#5a9fe0]/15 text-[#8fc4f0]"}`} dir={rtl ? "rtl" : "ltr"}>
                                    {a.change[c]}
                                  </span>
                                  <span className="text-fg-4">{n}</span>
                                </div>
                              ))
                            : TOOLS.map(([tool, age], j) => (
                                <div key={j} className="flex items-center gap-2 py-1 text-[12.5px]">
                                  <span className="min-w-0 flex-1 truncate font-mono text-[#c9d6e3]">{tool}</span>
                                  <span className="shrink-0 text-fg-4" dir={rtl ? "rtl" : "ltr"}>
                                    {a.age[age]}
                                  </span>
                                </div>
                              ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ---- a new session ---- */
  const MODE_KEYS: Mode[] = ["ask", "auto", "full"];
  function newView() {
    const mode = MODE_KEYS[form.mode];
    const otherOn = form.model === MODELS.length + 1;
    const modelLabel = form.model === 0 ? a.new.cliModel : otherOn ? form.other || "…" : MODELS[form.model - 1][0];
    const where = DIRS[form.dir][1];
    const summary = form.name.trim()
      ? fill(a.new.summaryNamed[mode], { name: form.name.trim(), where, model: modelLabel })
      : fill(a.new.summary[mode], { where, model: modelLabel });
    const ready = !otherOn || form.other.trim().length > 0;
    const chip = (label: string, on: boolean, onClick: () => void, icon: React.ReactNode) => (
      <button
        key={label}
        type="button"
        onClick={onClick}
        className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[14.5px] font-medium transition-colors ${on ? "border-[#6ab3f3] bg-[#1f2c3b] text-white" : "border-white/[0.06] bg-[#19222d] text-white hover:border-white/20"}`}
      >
        <span className={on ? "text-[#6ab3f3]" : "text-fg-3"}>{icon}</span>
        {label}
      </button>
    );
    return (
      <div>
        <Identity version={version} a={a} />
        <div className="px-4">
          <h3 className="text-[21px] font-semibold text-white">{a.new.title}</h3>
          <p className="mt-0.5 text-[13.5px] text-fg-3">{a.new.sub}</p>
          <div className="mt-5">
            <Step n={num("1")} title={a.new.name}>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 24) }))}
                placeholder="frontend"
                dir="ltr"
                className="w-full rounded-xl border border-white/[0.06] bg-[#19222d] px-4 py-3 text-[15px] text-white outline-none placeholder:text-fg-4 focus:border-[#6ab3f3]"
              />
            </Step>
            <Step n={num("2")} title={a.new.where}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="me-1 text-[13px] font-medium text-fg-4">{a.new.recent}</span>
                {DIRS.map(([d], i) => chip(d, form.dir === i, () => setForm((f) => ({ ...f, dir: i })), <Folder />))}
              </div>
              <div className="mt-3 rounded-2xl bg-[#19222d]">
                <Group
                  title={a.new.cwdTitle}
                  value={DIRS[form.dir][0]}
                  options={[...DIRS.map(([d, p], i) => ({ label: d, help: p, tag: i === 3 ? a.defaultTag : undefined })), { label: a.new.newFolder, help: a.new.newFolderHelp, dashed: true }]}
                  chosen={form.dir}
                  onPick={(i) => i < DIRS.length && setForm((f) => ({ ...f, dir: i }))}
                  open={open === "cwd"}
                  onToggle={() => setOpen(open === "cwd" ? null : "cwd")}
                  first
                  last
                />
              </div>
            </Step>
            <Step n={num("3")} title={a.modelTitle} last>
              <div className="flex flex-wrap items-center gap-2">
                <span className="me-1 text-[13px] font-medium text-fg-4">{a.new.suggested}</span>
                {MODELS.slice(0, 5).map(([l], i) => chip(l, form.model === i + 1, () => setForm((f) => ({ ...f, model: i + 1 })), <Sparkle />))}
              </div>
              <div className="mt-3 rounded-2xl bg-[#19222d]">
                <Group
                  title={a.modelTitle}
                  value={form.model === 0 ? a.new.default : otherOn ? a.new.otherModel : MODELS[form.model - 1][0]}
                  options={[
                    { label: a.new.default, help: a.new.defaultModelHelp },
                    ...MODELS.map(([l, h]) => ({ label: l, help: h })),
                    { label: a.new.otherModel, help: a.new.otherModelHelp, dashed: true },
                  ]}
                  chosen={form.model}
                  onPick={(i) => setForm((f) => ({ ...f, model: i }))}
                  open={open === "nmodel"}
                  onToggle={() => setOpen(open === "nmodel" ? null : "nmodel")}
                  first
                  last
                >
                  {otherOn && (
                    <div className="px-4 pb-3 pt-1">
                      <div className="mb-1.5 text-[12.5px] font-medium text-fg-3">{a.new.modelName}</div>
                      <input
                        value={form.other}
                        onChange={(e) => setForm((f) => ({ ...f, other: e.target.value.replace(/[^A-Za-z0-9.\-[\]]/g, "").slice(0, 40) }))}
                        placeholder="claude-opus-5"
                        dir="ltr"
                        className="w-full rounded-xl border border-[#6ab3f3]/60 bg-[#141c25] px-3.5 py-2.5 font-mono text-[14px] text-white outline-none placeholder:text-fg-4"
                      />
                      {!form.other && <div className="mt-1.5 text-[12.5px] text-fg-4">{a.new.modelNeeded}</div>}
                    </div>
                  )}
                </Group>
              </div>
            </Step>
          </div>
          <button type="button" onClick={() => setForm((f) => ({ ...f, more: !f.more }))} aria-expanded={form.more} className="flex items-center gap-3 text-[16px] text-fg-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#19222d] text-[18px] leading-none text-fg-3">+</span>
            {a.new.more}
            <Chevron open={form.more} />
          </button>
          <AnimatePresence initial={false}>
            {form.more && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                <div className="space-y-3 pt-4">
                  <div className="rounded-2xl bg-[#19222d]">
                    <Group
                      title={a.new.modeTitle}
                      value={a.new.modes[mode]}
                      options={MODE_KEYS.map((k) => ({ label: a.new.modes[k], help: a.new.modeHelp[k] }))}
                      chosen={form.mode}
                      onPick={(i) => setForm((f) => ({ ...f, mode: i === 0 ? 0 : i === 1 ? 1 : 2 }))}
                      open={open === "nmode"}
                      onToggle={() => setOpen(open === "nmode" ? null : "nmode")}
                      first
                      last
                    />
                  </div>
                  <Groups groups={a.groups} values={chat} setValue={(f, i) => setChat((v) => ({ ...v, [f]: i }))} openKey={open} setOpen={setOpen} prefix="new" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-[#19222d] px-4 py-3 text-[13.5px] leading-snug text-fg-3">{summary}</div>
        </div>
        <div className="sticky bottom-0 z-10 mt-6 bg-[#17212b] px-3 pb-3 pt-2.5">
          <button
            type="button"
            disabled={!ready || creating}
            onClick={() => {
              setCreating(true);
              window.setTimeout(() => {
                const id = form.name.trim() || "frontend";
                setFresh(id);
                setSessions((ss) => [
                  ...ss.filter((x) => x.id !== id),
                  { id, who: "aly", pct: 0, model: form.model === 0 ? "Sonnet 5.5" : otherOn ? form.other : MODELS[form.model - 1][0], cost: "$0.00", state: "busy", cwd: DIRS[form.dir][1].replace("/home/aly", "~"), mode, clock: "c", reply: 0 },
                ]);
                setCreating(false);
                setForm({ name: "", dir: 3, model: 0, other: "", mode: 1, more: false });
                setOpen(null);
                setTab("sessions");
                pop();
                say(a.new.created);
              }, 900);
            }}
            className="w-full rounded-xl bg-[#5288c1] py-3 text-[15px] font-semibold text-white transition enabled:hover:brightness-110 disabled:opacity-50"
          >
            {creating ? a.new.creating : a.new.start}
          </button>
        </div>
      </div>
    );
  }

  /* ---- a problem report ---- */
  function reportView() {
    if (sent === "yes")
      return (
        <div className="px-6 pb-10 pt-10 text-center">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 18 }} className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#4fd693]/15 text-[#7fe0ad]">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m5 13 4 4L19 7" />
            </svg>
          </motion.span>
          <div className="mt-4 text-[20px] font-semibold text-white">{a.report.sent}</div>
          <p className="mx-auto mt-2 max-w-[300px] text-[13.5px] leading-snug text-fg-3">{a.report.thanks}</p>
          <code dir="ltr" className="mt-3 inline-block rounded-lg bg-[#19222d] px-3 py-1.5 font-mono text-[14px] text-white">
            AP-7Q2K-91XD
          </code>
        </div>
      );
    return (
      <div>
        <Identity version={version} a={a} />
        <div className="space-y-4 px-4">
          <div>
            <h3 className="text-[21px] font-semibold text-white">{a.report.title}</h3>
            <p className="mt-1 text-[13.5px] leading-snug text-fg-3">{a.report.privacy}</p>
          </div>
          <div>
            <div className="px-1 pb-1.5 text-[13px] font-medium text-fg-3">{a.report.noteLabel}</div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 500))}
              placeholder={a.report.notePlaceholder}
              rows={3}
              dir="auto"
              className="w-full resize-none rounded-2xl border border-white/[0.06] bg-[#19222d] px-4 py-3 text-[14.5px] text-white outline-none placeholder:text-fg-4 focus:border-[#6ab3f3]"
            />
            <div className="flex justify-between px-1 text-[12px] text-fg-4">
              <span>{a.report.asWritten}</span>
              <span>{num(`${note.length} / 500`)}</span>
            </div>
          </div>
          <div>
            <div className="px-1 pb-1.5 text-[13px] font-medium text-fg-3">{a.report.whatSent}</div>
            <Facts
              cells={[
                { k: "aipager", v: <bdi dir="ltr">{`${version} (pipx)`}</bdi> },
                { k: "Claude Code", v: <bdi dir="ltr">2.1.302</bdi> },
                { k: a.report.system, v: <bdi dir="ltr">Ubuntu 24.04</bdi> },
                { k: "Python", v: <bdi dir="ltr">3.12.3</bdi> },
                { k: a.report.setup, v: <span className="whitespace-normal">{a.report.setupLine}</span>, wide: true },
              ]}
            />
          </div>
          <div>
            <div className="px-1 pb-1.5 text-[13px] font-medium text-fg-3">{a.report.errors}</div>
            <div className="divide-y divide-white/[0.06] rounded-2xl bg-[#19222d]">
              {[
                [a.report.err1, a.report.err1Sub],
                [a.report.err2, a.report.err2Sub],
              ].map(([h, sub]) => (
                <div key={h} className="px-4 py-2.5">
                  <div className="text-[14px] text-white">{h}</div>
                  <div className="text-[12.5px] text-fg-4">{sub}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="px-1 text-[12.5px] leading-snug text-fg-4">{a.report.foot}</p>
        </div>
        <div className="sticky bottom-0 z-10 mt-6 bg-[#17212b] px-3 pb-3 pt-2.5">
          <button
            type="button"
            disabled={sent === "sending"}
            onClick={() => {
              setSent("sending");
              window.setTimeout(() => setSent("yes"), 1100);
            }}
            className="w-full rounded-xl bg-[#5288c1] py-3 text-[15px] font-semibold text-white transition enabled:hover:brightness-110 disabled:opacity-70"
          >
            {sent === "sending" ? a.report.sending : a.report.send}
          </button>
        </div>
      </div>
    );
  }

  // a page the reader has left is fresh when they come back to it
  useEffect(() => {
    if (screen.k !== "report") {
      setSent("no");
      setNote("");
    }
    if (screen.k !== "session") {
      setMenu(false);
      setListOpen(null);
    }
  }, [screen.k]);

  const body =
    screen.k === "home" ? homeView() : screen.k === "session" ? sessionView(screen.id) : screen.k === "new" ? newView() : reportView();
  const key = screen.k === "session" ? `s:${screen.id}` : screen.k;
  const away = rtl ? -1 : 1;

  return (
    <div dir={rtl ? "rtl" : "ltr"} lang={lang} className="mx-auto flex h-[680px] w-full max-w-[420px] flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[#212d3b] shadow-[0_40px_100px_-40px_rgb(0_0_0/0.9)]">
      {/* Telegram's own bar over the app */}
      <div className="relative z-20 flex h-[52px] shrink-0 items-center gap-3 bg-[#212d3b] px-3">
        <AnimatePresence initial={false}>
          {stack.length > 1 && (
            <motion.button
              initial={{ opacity: 0, x: -8 * away }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 * away }}
              type="button"
              onClick={pop}
              aria-label="Back"
              className="grid h-9 w-9 place-items-center rounded-full text-fg-2 hover:bg-white/[0.06]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="rtl:-scale-x-100">
                <path d="M19 12H5m6-6-6 6 6 6" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
        <span className={`text-[19px] font-semibold tracking-[-0.02em] text-white ${stack.length > 1 ? "" : "ps-2"}`}>aipager</span>
        <span className="ms-auto text-[18px] leading-none text-fg-3">⋮</span>
        <button
          type="button"
          onClick={() => {
            setDir(-1);
            setStack([{ k: "home" }]);
          }}
          aria-label="Close"
          className="grid h-9 w-9 place-items-center rounded-full text-[17px] leading-none text-fg-3 hover:bg-white/[0.06]"
        >
          ✕
        </button>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* Telegram's stack: going in, the new page slides over the old one,
            which drifts a little the other way; going back, the top page
            slides all the way off and the one under it drifts back home. */}
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={key}
            custom={dir}
            variants={{
              enter: (d: number) => (d > 0 ? { x: `${100 * away}%`, zIndex: 2 } : { x: `${-28 * away}%`, zIndex: 1 }),
              center: (d: number) => ({ x: "0%", zIndex: d > 0 ? 2 : 1 }),
              leave: (d: number) => (d > 0 ? { x: `${-28 * away}%`, zIndex: 1 } : { x: `${100 * away}%`, zIndex: 2 }),
            }}
            initial="enter"
            animate="center"
            exit="leave"
            transition={{ duration: 0.36, ease: [0.22, 0.9, 0.24, 1] }}
            // each page comes back where the reader left it
            ref={(el: HTMLDivElement | null) => {
              if (el && scrolls.current[key] !== undefined && el.dataset.restored !== "1") {
                el.scrollTop = scrolls.current[key];
                el.dataset.restored = "1";
              }
            }}
            onScroll={(e: React.UIEvent<HTMLDivElement>) => {
              scrolls.current[key] = e.currentTarget.scrollTop;
            }}
            // no overscroll-contain: at either end a swipe carries on to the
            // page, or on a phone, where the app fills the screen, the reader
            // would be stuck inside it
            className="absolute inset-0 overflow-y-auto bg-[#212d3b] shadow-[0_0_32px_rgb(0_0_0/0.55)] will-change-transform [backface-visibility:hidden] [scrollbar-width:thin]"
          >
            {body}
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="pointer-events-none absolute inset-x-6 bottom-20 z-30 flex justify-center"
            >
              <span className="rounded-2xl bg-black/85 px-4 py-2.5 text-center text-[13px] leading-snug text-white backdrop-blur">{toast}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="shrink-0 border-t border-white/[0.05] bg-[#17212b] py-2 text-center text-[12.5px] text-fg-4">
        <bdi dir="ltr">@aipagerbot</bdi>
      </div>
    </div>
  );
}
