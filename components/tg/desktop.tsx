"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mark } from "@/components/brand";
import { useStory } from "./engine";
import { TelegramWindow } from "./telegram";
import { Terminal } from "./terminal";
import { PEOPLE, type ChatId } from "./world";

const W = 1200;
const H = 640;

/**
 * Scales the fixed-size desk like a video: to the width it is given, and no
 * taller than the screen below it, so the whole desk is in view at once.
 */
function useFit(): [React.RefObject<HTMLDivElement | null>, number] {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const byWidth = el.clientWidth / W;
      const byHeight = Math.max(0.72, (window.innerHeight - Math.min(top, window.innerHeight * 0.45) - 18) / H);
      setScale(Math.min(1.3, byWidth, byHeight));
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

function MenuBar({ sessions, clock }: { sessions: number; clock: string }) {
  return (
    <div className="absolute inset-x-0 top-0 flex h-[26px] items-center gap-5 bg-black/35 px-4 text-[12.5px] text-white/85 backdrop-blur-md">
      <span className="font-semibold">Telegram</span>
      {["File", "Edit", "View", "Window", "Help"].map((m) => (
        <span key={m} className="text-white/70">
          {m}
        </span>
      ))}
      <span className="ml-auto flex items-center gap-1.5 rounded-md bg-white/[0.07] px-2 py-0.5">
        <Mark size={14} />
        <span className="text-white/80">
          {sessions} session{sessions === 1 ? "" : "s"}
        </span>
      </span>
      <span className="text-white/70">{clock}</span>
    </div>
  );
}

export function Desktop() {
  const [box, scale] = useFit();
  const on = useOnScreen(box);
  const story = useStory(on);
  const { world, waiting } = story;
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
    // Deny and Stop are real buttons; in this evening, Claude needs the test run.
    if (m?.kind === "card" && m.prompt?.kind === "perm" && (choice === 1 || choice === 3)) {
      setHint(choice === 1 ? "Deny would block the call for real. This evening needs the test run: try Allow." : "Stop would interrupt the turn. Try Allow.");
      window.setTimeout(() => setHint(null), 3500);
      return;
    }
    story.tap(world.open, msgId, choice === 2 && m?.kind === "card" && m.prompt?.kind === "perm" ? 0 : choice);
  };

  return (
    <div>
      <div ref={box} className="relative w-full" style={{ height: H * scale }}>
        <div className="absolute top-0 origin-top overflow-hidden rounded-[18px] border border-white/10" style={{ width: W, height: H, left: "50%", transform: `translateX(-50%) scale(${scale})` }}>
          {/* the desk */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,#1b2a44_0%,transparent_55%),radial-gradient(ellipse_at_90%_100%,#2a1d3f_0%,transparent_55%),linear-gradient(180deg,#0b1018,#080b11)]" />
          <MenuBar sessions={world.panes.length} clock={`Tue ${lastTime}`} />
          <div className="absolute left-4 top-[40px] h-[584px] w-[376px]">
            <Terminal panes={world.panes} detached={false} />
          </div>
          <div className="absolute left-[404px] top-[40px] h-[584px] w-[780px]">
            <TelegramWindow world={world} waiting={waiting} onOpen={story.openChat} onFolder={story.setFolder} onTap={onTap} />
          </div>
          {/* notifications */}
          <div className="absolute right-4 top-9 z-30 flex w-[340px] flex-col gap-2">
            <AnimatePresence initial={false}>
              {world.notes.map((n) => {
                const c = world.chats[n.chat];
                return (
                  <motion.button
                    key={n.id}
                    type="button"
                    layout
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 60 }}
                    transition={{ type: "spring", stiffness: 340, damping: 30 }}
                    onClick={() => {
                      story.openChat(n.chat as ChatId);
                      story.dismiss(n.id);
                    }}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#1e2733]/90 p-3 text-left shadow-[0_20px_50px_-15px_rgb(0_0_0/0.8)] backdrop-blur-xl"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[#2aabee] text-white">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M21.5 4.3 2.9 11.5c-1 .4-1 1.1-.2 1.4l4.7 1.5 1.8 5.6c.2.6.4.7.9.7.4 0 .6-.2.9-.5l2.2-2.2 4.6 3.4c.8.5 1.4.2 1.6-.8l3-14.3c.3-1.2-.5-1.8-1.3-1.5ZM8.4 14l9.4-6-7.7 7.3-.3 3.2L8.4 14Z" />
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1 leading-snug">
                      <span className="flex items-center justify-between text-[12.5px] font-semibold text-white">
                        {n.title}
                        <span className="text-[11px] font-normal text-white/45">now</span>
                      </span>
                      <span className="line-clamp-2 text-[12.5px] text-white/75">{n.body}</span>
                    </span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
          {hint && (
            <div className="absolute bottom-6 left-[404px] right-4 z-30 flex justify-center">
              <div className="rounded-full bg-black/75 px-4 py-2 text-[13px] text-white backdrop-blur">{hint}</div>
            </div>
          )}
        </div>
      </div>
      {/* what is happening, in words */}
      <div className="mx-auto mt-6 flex min-h-[3.5rem] max-w-3xl items-start justify-center gap-3 text-center">
        <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${waiting ? "bg-live dot-pulse" : story.held ? "bg-amber" : "bg-accent dot-pulse"}`} />
        <AnimatePresence mode="wait">
          <motion.p key={story.held && !waiting ? "held" : world.caption} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="text-[16px] leading-relaxed text-fg-2">
            {story.held && !waiting ? "Paused while you look around. Leave it for a moment and the evening carries on." : world.caption}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

export { PEOPLE };
