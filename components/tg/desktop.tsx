"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mark } from "@/components/brand";
import { Cable, STAGE } from "./cable";
import { useStory, type Story } from "./engine";
import { TelegramWindow } from "./telegram";
import { Terminal } from "./terminal";
import { Notes } from "./notes";
import { MobileStage } from "./mobile";
import { isHandheld } from "@/lib/layout";
import { useLayout } from "@/lib/use-layout";
import { initialWorld, PEOPLE, type ChatId, type Mode, type World } from "./world";
import { storyFor } from "./story";
import type { Dict } from "@/lib/i18n";
import { botOf, type BotStrings } from "@/lib/i18n/bot";
import { digits, type Locale } from "@/lib/i18n/locales";
import { LocaleProvider } from "./locale-context";

const { w: W, h: H } = STAGE;
/** the windows stop above the cable zone */
const WIN = { top: 40, h: 540 };
interface Fit {
  scale: number;
}

/** Before paint on the client, after hydration on the server's own render. */
const useMeasure = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Scales the fixed-size desk like a video: to the width it is given, and no
 * taller than the screen below it, so the whole desk is in view at once.
 *
 * Null until it has been measured. The scale cannot be known before the desk
 * is in the page, and a guess would paint the desk at one size and resize it
 * a frame later, which reads as a jump; so it waits, behind the fade the
 * caller gives it, and the first thing anyone sees is the right size.
 */
function useFit(): [React.RefObject<HTMLDivElement | null>, Fit | null] {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<Fit | null>(null);
  useMeasure(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const byWidth = el.clientWidth / W;
      const byHeight = Math.max(0.72, (window.innerHeight - Math.min(top, window.innerHeight * 0.45) - 18) / H);
      setScale({ scale: Math.min(1.3, byWidth, byHeight) });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);
  return [box, scale];
}

/** Plays only while at least a third of it is on screen. */
function useOnScreen(el: React.RefObject<HTMLDivElement | null>): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting && document.visibilityState === "visible"), { threshold: 0.33 });
    io.observe(node);
    const onVis = () => setOn((v) => v && document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [el]);
  return on;
}

/**
 * The Mac's menu bar. Its own menus would be in the reader's language on
 * their Mac, and a page cannot know those words, so it shows only what it
 * can say: the app, aipager's item with the pinned bar's line, and the day
 * and time written the reader's way.
 */
function MenuBar({ status, clock }: { status: string; clock: string }) {
  return (
    <div className="absolute inset-x-0 top-0 flex h-[26px] items-center gap-5 bg-black/35 px-4 text-[12.5px] text-white/85 backdrop-blur-md">
      <span className="font-semibold">Telegram</span>
      {/* a slot of its own width, the item starting at its start: a status
          right-aligned against the clock moved its whole edge every time
          its words got longer or shorter */}
      <span className="ms-auto flex w-[330px] min-w-0">
        <span className="flex min-w-0 max-w-full items-center gap-1.5 rounded-md bg-white/[0.07] px-2 py-0.5">
          <Mark size={14} />
          <span className="truncate text-white/80">{status}</span>
        </span>
      </span>
      <span className="shrink-0 text-white/70">{clock}</span>
    </div>
  );
}

/** A Tuesday, the evening's day, as the reader's language shortens it. */
const tuesday = (locale: Locale): string => new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }).format(Date.UTC(2024, 0, 2, 12));

/** Ask or Auto: the evening replays in the mode you pick. */
// The three labels are the product's own, quoted from its catalog with
// their emoji, so the page names a mode exactly as the bot names it.
function ModeSwitch({ mode, onMode, t, bot }: { mode: Mode; onMode: (m: Mode) => void; t: Dict; bot: BotStrings }) {
  const MODES: { id: Mode; label: string; tag?: string; line: string }[] = [
    { id: "ask", label: bot.modes.ask, line: t.demo.switch.lines[0] },
    { id: "auto", label: bot.modes.auto, tag: t.demo.switch.default, line: t.demo.switch.lines[1] },
    { id: "full", label: bot.modes.full, line: t.demo.switch.lines[2] },
  ];
  return (
    <div className="-order-1 mb-3.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 xl:justify-start phone:mx-auto phone:mb-5 phone:max-w-[440px] tablet:mb-0 tablet:block">
      {/* the three names run to 570px in some languages, so on a phone they
          wrap inside the group rather than push the page sideways. At one row
          the radius is capped to half the height, so it still reads as a pill. */}
      {/* in the hand, three equal segments, so a long mode name wraps inside its own */}
      <div className="flex max-w-full flex-wrap justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-1 phone:grid phone:w-full phone:grid-cols-3 phone:gap-1 phone:rounded-2xl tablet:hidden" role="radiogroup" aria-label={t.modes.eyebrow}>
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={mode === m.id}
            onClick={() => onMode(m.id)}
            // tighter on a phone, where a long language's three mode words
            // would otherwise each break after their emoji
            className={`flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[12.5px] font-medium transition-colors sm:gap-1.5 sm:px-4 sm:text-[13.5px] phone:flex-col phone:justify-center phone:gap-1 phone:whitespace-normal phone:rounded-xl phone:px-1.5 phone:py-2 phone:text-center phone:text-[12.5px] phone:leading-tight ${mode === m.id ? "bg-[#2aabee] text-white shadow-[0_6px_20px_-6px_rgb(42_171_238/0.7)]" : "text-fg-3 hover:text-foreground"}`}
          >
            {m.label}
            {m.tag && (
              <span className={`rounded-full px-1.5 py-px font-mono text-[10px] ${mode === m.id ? "bg-white/20 text-white" : "bg-white/[0.06] text-fg-4"}`}>{m.tag}</span>
            )}
          </button>
        ))}
      </div>
      {/* what the mode you picked means: beside the switch when there is room,
          under it on a phone, since three bare tabs say nothing on their own */}
      <span className="w-full text-center text-[13.5px] text-fg-4 lg:w-auto lg:text-start phone:!w-full phone:!text-center tablet:hidden">{MODES.find((m) => m.id === mode)?.line}</span>
      {/* beside the phone on a tablet: the three as cards, each saying what it means */}
      <div className="hidden flex-col gap-2 tablet:flex" role="radiogroup" aria-label={t.modes.eyebrow}>
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={mode === m.id}
            onClick={() => onMode(m.id)}
            className={`rounded-2xl border px-4 py-3 text-start transition-colors ${mode === m.id ? "border-[#2aabee]/60 bg-[#2aabee]/[0.09] shadow-[0_10px_30px_-14px_rgb(42_171_238/0.6)]" : "border-white/10 bg-white/[0.02] hover:border-white/20"}`}
          >
            <span className="flex flex-wrap items-center gap-2 text-[15px] font-medium text-foreground">
              {m.label}
              {m.tag && <span className={`rounded-full px-1.5 py-px font-mono text-[10px] ${mode === m.id ? "bg-[#2aabee]/25 text-white" : "bg-white/[0.06] text-fg-4"}`}>{m.tag}</span>}
            </span>
            <span className={`mt-1 block text-[13.5px] leading-snug ${mode === m.id ? "text-fg-2" : "text-fg-4"}`}>{m.line}</span>
          </button>
        ))}
      </div>
    </div>
  );
}



export function Desktop({ t, locale }: { t: Dict; locale: Locale }) {
  const bot = botOf(locale);
  const layout = useLayout();
  const handheld = isHandheld(layout);
  const [box, fit] = useFit();
  const on = useOnScreen(box);
  const [mode, setMode] = useState<Mode>("auto");
  const story = useStory(on, mode, t, bot);
  const { world, waiting } = story;
  // every caption this mode's evening can show, for the space they need
  const captions = useMemo(() => {
    const all = new Set<string>([initialWorld(t, bot, mode).caption, t.demo.captions.held]);
    for (const step of storyFor(mode, t, bot)) if (step.caption) all.add(step.caption);
    return [...all];
  }, [mode, t, bot]);
  const [hint, setHint] = useState<string | null>(null);

  const lastTime =
    Object.values(world.chats)
      .flatMap((c) => c.msgs)
      .map((m) => (m.kind === "day" ? "" : m.time))
      .filter((t) => /^\d\d:\d\d$/.test(t))
      .sort()
      .pop() ?? "21:04";

  const onTap = (msgId: string, choice: number) => {
    const c = world.chats[world.open];
    const m = c.msgs.find((x) => x.id === msgId);
    // Cancel leaves api in the mode it is already in; this evening goes to Full access.
    if (m?.kind === "confirm" && choice === 1) {
      setHint(t.demo.hints.cancel);
      window.setTimeout(() => setHint(null), 3500);
      return;
    }
    // Deny and Stop are real buttons; in this evening, Claude needs the test run.
    if (m?.kind === "card" && m.prompt?.kind === "perm" && (choice === 1 || choice === 3)) {
      setHint(choice === 1 ? t.demo.hints.deny : t.demo.hints.stop);
      window.setTimeout(() => setHint(null), 3500);
      return;
    }
    story.tap(world.open, msgId, choice === 2 && m?.kind === "card" && m.prompt?.kind === "perm" ? 0 : choice);
  };

  return (
    <LocaleProvider value={locale}>
    <div className="flex flex-col tablet:grid tablet:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] tablet:items-start tablet:gap-x-8">
      {/* The phone stack in the hand, the desk on a desk. The server cannot
          see the screen, so it sends the desk; on a phone or a tablet the
          stylesheet keeps it hidden, with the stack's room already reserved,
          until the right version replaces it a moment later. */}
      <div
        ref={box}
        data-demo={layout === null ? "pending" : handheld ? "handheld" : "desk"}
        data-version={handheld ? undefined : "wide"}
        className={`relative w-full ${!handheld && fit === null ? "aspect-[1200/744]" : ""}`}
        style={!handheld && fit !== null ? { height: H * fit.scale } : undefined}
      >
        {handheld ? (
          <MobileStage world={world} waiting={waiting} story={story} onTap={onTap} playing={on} clock={digits(lastTime, locale)} hint={hint} tablet={layout === "tablet"} t={t} />
        ) : (
          <div
            className="absolute top-0 origin-top overflow-hidden rounded-[18px] border border-white/10 transition-opacity duration-300"
            style={{ width: W, height: H, left: "50%", transform: `translateX(-50%) scale(${fit?.scale ?? 1})`, opacity: fit === null ? 0 : 1 }}
          >
            {/* the desk */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,#1b2a44_0%,transparent_55%),radial-gradient(ellipse_at_90%_100%,#2a1d3f_0%,transparent_55%),linear-gradient(180deg,#0b1018,#080b11)]" />
            {/* Nothing on the desk until the desk has its size. Everything here
                that animates between places (the tab's pill, the chat list,
                a card moving to the bottom) remembers where things were; mounted
                under a scale that is about to change, they all come away from the
                wrong place at once, which is what used to fly the tab pill in from
                the corner. */}
            {fit !== null && (
              <>
                <MenuBar status={world.chats.aipager.pinnedBar ?? ""} clock={`${tuesday(locale)} ${digits(lastTime, locale)}`} />
                <div className="absolute left-4 w-[376px]" style={{ top: WIN.top, height: WIN.h }}>
                  <Terminal panes={world.panes} detached={false} active={world.term} onTab={story.setTerm} />
                </div>
                <div className="absolute left-[404px] w-[780px]" style={{ top: WIN.top, height: WIN.h }}>
                  <TelegramWindow world={world} waiting={waiting} onOpen={story.openChat} onFolder={story.setFolder} onTap={onTap} t={t} />
                </div>
                <Cable world={world} spark={story.spark} t={t} />
                <Notes world={world} onOpen={story.openChat} onDismiss={story.dismiss} className="absolute right-4 top-9 z-30 flex w-[340px] flex-col gap-2" />
                {hint && (
                  <div className="absolute bottom-[146px] left-[404px] right-4 z-30 flex justify-center">
                    <div className="rounded-full bg-black/75 px-4 py-2 text-[13px] text-white backdrop-blur">{hint}</div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      {/* The mode switch above the demo and the words under it; on a tablet
          both stand beside the phone instead, and stay in view all the way
          down its stack. */}
      <div className="contents tablet:sticky tablet:top-[88px] tablet:flex tablet:flex-col tablet:gap-7">
        <ModeSwitch mode={mode} onMode={setMode} t={t} bot={bot} />
        {/* What is happening, in words. Every caption this evening can show
            is laid out, unseen, in the same place, so the space is the
            tallest one's from the start, in this language at this width:
            a caption of three lines after one of one moved everything under
            it. The dot rides at the start of the line it belongs to. */}
        <div className="mx-auto mt-6 grid max-w-3xl text-center tablet:mx-0 tablet:mt-0 tablet:text-start">
          {captions.map((c) => (
            <p key={c} aria-hidden className="invisible text-[16px] leading-relaxed [grid-area:1/1] tablet:text-[17px]">
              <span className="me-3 inline-block h-2 w-2" />
              {c}
            </p>
          ))}
          <AnimatePresence mode="wait">
            <motion.p
              key={story.held && !waiting ? "held" : world.caption}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="self-start text-[16px] leading-relaxed text-fg-2 [grid-area:1/1] tablet:text-[17px]"
            >
              <span className={`me-3 inline-block h-2 w-2 rounded-full align-[0.1em] ${waiting ? "bg-live dot-pulse" : story.held ? "bg-amber" : "bg-accent dot-pulse"}`} />
              {story.held && !waiting ? t.demo.captions.held : world.caption}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
    </LocaleProvider>
  );
}

export { PEOPLE };
