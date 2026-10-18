"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Cable, PHONE_H, phoneGeo } from "./cable";
import type { Story } from "./engine";
import { useLocale } from "./locale-context";
import { Notes } from "./notes";
import { ChatList, ChatView, FolderTabs } from "./telegram";
import { Terminal } from "./terminal";
import type { ChatId, World } from "./world";
import type { Dict } from "@/lib/i18n";
import { dirOf } from "@/lib/i18n/locales";

/**
 * The demo on a phone or a tablet: Telegram's phone app, the way the reader
 * will actually hold it, with the terminal it is wired to underneath and
 * the cable running from the phone's foot to the terminal's head.
 *
 * It plays the same evening as the desk. Only the drawing changes: where
 * the desk shows the chat list and the chat side by side, a phone has room
 * for one, so every time the story moves to another chat the open one
 * slides away to the list and the next one slides in, as the app does.
 */

/** How Telegram's phone app paces a move between two chats. */
const SLIDE_MS = 380; // one screen sliding over the other
const LINGER_MS = 460; // the list in view, long enough to see what pulled you there
const TAP_MS = 200; // a row pressed, then its chat opens
const OPENING_MS = 1100; // the app opens on the list before the first chat
const EASE = "cubic-bezier(0.22, 0.9, 0.24, 1)";

/** The phone's own top edge: the time, signal, wifi and battery. */
function StatusBar({ clock }: { clock: string }) {
  return (
    <div className="flex shrink-0 items-center bg-[#17212b] px-6 pb-1.5 pt-3 text-[12px] font-semibold text-[#c9d6e3]">
      <span>{clock}</span>
      {/* the camera cut-out the screen is shaped around */}
      <span className="mx-auto h-[22px] w-[86px] rounded-full bg-black" aria-hidden />
      <span className="flex items-center gap-1.5" aria-hidden>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
          <rect x="0" y="7" width="2.6" height="4" rx="0.8" />
          <rect x="4" y="5" width="2.6" height="6" rx="0.8" />
          <rect x="8" y="2.5" width="2.6" height="8.5" rx="0.8" />
          <rect x="12" y="0" width="2.6" height="11" rx="0.8" opacity="0.4" />
        </svg>
        <svg width="13" height="11" viewBox="0 0 24 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M2 7a15 15 0 0 1 20 0M6 11.5a9 9 0 0 1 12 0" />
          <circle cx="12" cy="16.5" r="1.2" fill="currentColor" stroke="none" />
        </svg>
        <svg width="22" height="11" viewBox="0 0 26 12" fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="0.7" y="0.7" width="20" height="10.6" rx="3" />
          <rect x="2.4" y="2.4" width="14" height="7.2" rx="1.6" fill="currentColor" stroke="none" />
          <path d="M23 4.4v3.2" strokeLinecap="round" strokeWidth="2.2" />
        </svg>
      </span>
    </div>
  );
}

/**
 * The top of the chat list. "Telegram" is the app's name, so it needs no
 * translating, which is also what Telegram's Android app puts there.
 */
function ListBar() {
  return (
    <div className="flex h-[52px] shrink-0 items-center gap-5 bg-[#17212b] px-4 text-[#8a98a6]">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
      <span className="text-[18px] font-semibold text-white">Telegram</span>
      <svg className="ms-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    </div>
  );
}

/**
 * The two screens, list and chat, and the move between them. The story
 * says which chat is open; this follows it at the app's pace. A move from
 * one chat to another goes back out to the list first, so the reader sees
 * the conversation that pulled them over, then taps into it. The chat
 * screen slides in from the side the language reads toward, and the list
 * drifts back and dims under it, as on iOS. Nothing moves until the evening
 * starts playing, so the reader always sees the app open on its list.
 */
function Screens({
  world,
  waiting,
  story,
  onTap,
  playing,
  t,
}: {
  world: World;
  waiting: Story["waiting"];
  story: Story;
  onTap: (msg: string, choice: number) => void;
  playing: boolean;
  t: Dict;
}) {
  const rtl = dirOf(useLocale()) === "rtl";
  const target = world.open;
  const [shown, setShown] = useState<ChatId>(target);
  const [screen, setScreen] = useState<"list" | "chat">("list");
  // the row under the finger, lit from the press until its chat has slid in
  const [pressed, setPressed] = useState<ChatId | null>(null);
  const now = useRef({ shown, screen, first: true });
  now.current.shown = shown;
  now.current.screen = screen;
  const timers = useRef<number[]>([]);

  const openAfter = (id: ChatId, ms: number) => {
    timers.current.push(window.setTimeout(() => setPressed(id), Math.max(0, ms - TAP_MS)));
    timers.current.push(
      window.setTimeout(() => {
        now.current.first = false;
        setShown(id);
        setScreen("chat");
      }, ms),
    );
    timers.current.push(window.setTimeout(() => setPressed(null), ms + SLIDE_MS));
  };
  const back = () => {
    setPressed(null);
    setScreen("list");
  };

  useEffect(() => {
    const clear = () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
    clear();
    if (!playing) return clear;
    const { shown: was, screen: on, first } = now.current;
    if (on === "chat" && was === target) return clear;
    if (on === "chat") {
      back();
      openAfter(target, SLIDE_MS + LINGER_MS);
    } else {
      openAfter(target, first ? OPENING_MS : TAP_MS);
    }
    return clear;
  }, [target, playing]);

  // A row tapped for the chat the story already has open changes nothing in
  // the story, so the screen opens it itself.
  const tapRow = (id: ChatId) => {
    story.openChat(id);
    if (id === target) openAfter(id, TAP_MS);
  };

  const away = rtl ? -1 : 1;
  const motion = { transitionProperty: "transform, opacity", transitionDuration: `${SLIDE_MS}ms`, transitionTimingFunction: EASE };
  const inChat = screen === "chat";

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden bg-[#0e1621]">
      <div className="absolute inset-0 flex flex-col" style={{ ...motion, transform: `translateX(${inChat ? -28 * away : 0}%)` }} inert={inChat}>
        <ListBar />
        <FolderTabs world={world} onFolder={story.setFolder} t={t} />
        <ChatList world={world} onOpen={tapRow} t={t} full pressed={pressed} />
        <div className="pointer-events-none absolute inset-0 bg-black" style={{ ...motion, opacity: inChat ? 0.34 : 0 }} />
      </div>
      <div
        className="absolute inset-0 flex flex-col shadow-[0_0_40px_rgb(0_0_0/0.55)]"
        style={{ ...motion, transform: `translateX(${inChat ? 0 : 104 * away}%)` }}
        inert={!inChat}
      >
        <ChatView world={{ ...world, open: shown }} waiting={waiting} onTap={onTap} t={t} onBack={back} />
      </div>
    </div>
  );
}

/**
 * The cable, laid out for the column's width once it is known, and again
 * only when the width really changes.
 */
function CableWell({ world, spark, t }: { world: World; spark: Story["spark"]; t: Dict }) {
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setW(Math.round(el.clientWidth));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const geo = useMemo(() => (w ? phoneGeo(w) : null), [w]);
  return (
    <div ref={box} className="relative w-full" style={{ height: PHONE_H }}>
      {geo && <Cable world={world} spark={spark} t={t} geo={geo} />}
    </div>
  );
}

export function MobileStage({
  world,
  waiting,
  story,
  onTap,
  playing,
  clock,
  hint,
  tablet,
  t,
}: {
  world: World;
  waiting: Story["waiting"];
  story: Story;
  onTap: (msg: string, choice: number) => void;
  playing: boolean;
  clock: string;
  hint: string | null;
  tablet: boolean;
  t: Dict;
}) {
  return (
    <div className={`relative mx-auto w-full ${tablet ? "max-w-[440px]" : "max-w-[400px]"}`}>
      {/* Telegram's light behind the phone and Claude's behind the terminal,
          the cable's two colours, so the stack reads as one thing lit from
          both ends */}
      <div aria-hidden className="pointer-events-none absolute -inset-x-20 top-6 h-[540px] bg-[radial-gradient(50%_50%_at_50%_45%,rgb(42_171_238/0.34),transparent_72%)] blur-2xl" />
      <div aria-hidden className="pointer-events-none absolute -inset-x-20 -bottom-12 h-[400px] bg-[radial-gradient(50%_50%_at_50%_55%,rgb(217_119_87/0.24),transparent_72%)] blur-2xl" />
      {/* the phone: a metal band round the glass, with its buttons on the band */}
      <div
        className={`relative rounded-[46px] bg-[linear-gradient(155deg,#59636f,#20262e_22%,#151a20_60%,#3b4450)] p-[6px] shadow-[0_0_0_1px_rgb(0_0_0/0.6),0_40px_90px_-30px_rgb(0_0_0/0.95),0_0_80px_-24px_rgb(42_171_238/0.4)] ${tablet ? "h-[640px]" : "h-[580px]"}`}
      >
        <span aria-hidden className="absolute -start-[3px] top-[104px] h-[26px] w-[3px] rounded-s-[2px] bg-[#3a434f]" />
        <span aria-hidden className="absolute -start-[3px] top-[148px] h-[46px] w-[3px] rounded-s-[2px] bg-[#3a434f]" />
        <span aria-hidden className="absolute -start-[3px] top-[204px] h-[46px] w-[3px] rounded-s-[2px] bg-[#3a434f]" />
        <span aria-hidden className="absolute -end-[3px] top-[168px] h-[74px] w-[3px] rounded-e-[2px] bg-[#3a434f]" />
        <div className="relative flex h-full flex-col overflow-hidden rounded-[40px] bg-[#0e1621] ring-1 ring-black/80">
          <StatusBar clock={clock} />
          <Screens world={world} waiting={waiting} story={story} onTap={onTap} playing={playing} t={t} />
          <Notes world={world} onOpen={story.openChat} onDismiss={story.dismiss} className="pointer-events-none absolute inset-x-2.5 top-10 z-30 flex flex-col gap-2" />
          {hint && (
            <div className="absolute inset-x-3 bottom-16 z-30 flex justify-center">
              <div className="rounded-2xl bg-black/80 px-4 py-2.5 text-center text-[13px] leading-snug text-white backdrop-blur">{hint}</div>
            </div>
          )}
          {/* the glass catches a little light */}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-40 bg-[linear-gradient(120deg,rgb(255_255_255/0.055),transparent_30%)]" />
        </div>
      </div>
      <CableWell world={world} spark={story.spark} t={t} />
      <div className={`relative ${tablet ? "h-[320px]" : "h-[300px]"}`}>
        <Terminal panes={world.panes} detached={false} active={world.term} onTab={story.setTerm} />
      </div>
    </div>
  );
}
