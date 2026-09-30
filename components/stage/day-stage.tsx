"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CopyButton, GitHubIcon } from "@/components/brand";
import { clock, hourAt, momentAt, MOMENTS } from "@/components/day/timeline";
import { awaitingTap, sceneEnd, SCENES, stageAt, type Tap } from "./script";
import { Terminal } from "./terminal";
import { Phone } from "./phone";
import { Wire } from "./wire";
import { DayStrip } from "./strip";

const INSTALL = "curl -fsSL aipager.run/install | sh";

function Intro({ onGo }: { onGo: () => void }) {
  return (
    <div>
      <div className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--muted)]">aipager · Claude Code, on Telegram</div>
      <h1 className="mt-6 font-serif text-[clamp(48px,4.6vw,80px)] leading-[0.95] tracking-[-0.02em]">
        Claude works at your desk.
        <br />
        <em className="text-[var(--muted)]">You answer from Telegram.</em>
      </h1>
      <p className="mt-6 max-w-[28rem] text-[16.5px] leading-relaxed">
        aipager keeps your Claude Code sessions running in a detached terminal and mirrors them to a Telegram chat. Approve, answer, send the
        next prompt, from wherever your day takes you. It all runs on your machine.
      </p>
      <div className="mt-7 flex max-w-[28rem] items-center gap-2.5 rounded-2xl border border-[var(--line)] bg-[var(--glass)] py-2 pl-4 pr-2 font-mono text-[12.5px] backdrop-blur-xl">
        <span className="text-[var(--muted)]">$</span>
        <span className="min-w-0 flex-1 truncate">{INSTALL}</span>
        <CopyButton text={INSTALL} className="rounded-xl border border-[var(--line)] px-3 py-1.5 text-[12px] text-[var(--muted)] transition-colors hover:text-[var(--ink)]" />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <a href="https://github.com/dev-aly3n/aipager" className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-2.5 text-[14px] font-medium text-[var(--sky-bottom)] transition-opacity hover:opacity-85">
          <GitHubIcon size={15} /> Star on GitHub
        </a>
        <a href="/docs" className="rounded-full border border-[var(--line)] px-5 py-2.5 text-[14px] transition-colors hover:bg-[var(--glass)]">
          Read the docs
        </a>
      </div>
      <button
        type="button"
        onClick={onGo}
        className="mt-10 inline-flex items-center gap-3 rounded-full border border-[var(--line)] bg-[var(--glass)] py-2 pl-2 pr-5 text-[14.5px] font-medium shadow-[0_12px_40px_-12px_rgb(255_160_70/0.55)] backdrop-blur-xl transition-transform hover:-translate-y-0.5"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--ink)] text-[var(--sky-bottom)]">
          <span className="scroll-chevron">↓</span>
        </span>
        Scroll: live one day with aipager
      </button>
    </div>
  );
}

function Label({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <span className="grid h-6 w-6 place-items-center rounded-md border border-[var(--line)] bg-[var(--glass)] text-[12px] backdrop-blur-xl">{icon}</span>
      <span className="font-mono text-[11px] uppercase tracking-[0.14em]">{title}</span>
      <span className="text-[12px] text-[var(--muted)]">{sub}</span>
    </div>
  );
}

/** Milliseconds since the moment began, or its end when the reader came back to it. */
function useClock(scene: number, jumpToEnd: boolean): number {
  const [t, setT] = useState(0);
  useEffect(() => {
    const end = sceneEnd(SCENES[scene]);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now() - (jumpToEnd || reduce ? end : 0);
    const tick = () => setT(performance.now() - start);
    tick();
    const id = window.setInterval(tick, 80);
    return () => window.clearInterval(id);
  }, [scene, jumpToEnd]);
  return t;
}

export function DayStage() {
  const section = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  const [scene, setScene] = useState(0);
  const [back, setBack] = useState(false);
  const [tap, setTap] = useState<Tap | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const el = section.current;
      if (!el) return;
      const span = el.offsetHeight - window.innerHeight;
      setP(Math.min(1, Math.max(0, (window.scrollY - el.offsetTop) / span)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // The moment being told drives the stage; coming back to one shows how it ended.
  const active = momentAt(p);
  if (active !== scene) {
    setBack(active < scene);
    setScene(active);
    setTap(null);
    setHint(null);
  }
  const t = useClock(scene, back);
  const hour = hourAt(p);
  const m = MOMENTS[scene];
  const { state, packets } = useMemo(() => stageAt(scene, t, tap), [scene, t, tap]);
  const awaiting = awaitingTap(scene, t, tap);
  const night = hour >= 19.5;

  const onTap = (choice: number) => {
    if (tap || !SCENES[scene].gate) return;
    if (SCENES[scene].id === "meeting" && (choice === 1 || choice === 3)) {
      setHint(choice === 1 ? "Deny blocks the call for real. Here the day needs the tests: try Allow." : "Stop interrupts the turn. Here, try Allow.");
      return;
    }
    setTap({ at: t, choice: SCENES[scene].id === "meeting" ? 0 : choice });
  };

  const goTo = (k: number) => {
    const el = section.current;
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.offsetTop + (span * k) / MOMENTS.length, behavior: "smooth" });
  };

  return (
    <section id="day" ref={section} style={{ height: `${(MOMENTS.length + 1) * 100}vh` }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="wrap grid h-full !max-w-[94rem] grid-cols-[minmax(0,24rem)_minmax(0,1fr)] items-center gap-x-[clamp(28px,3.5vw,64px)] pt-14">
          {/* the words */}
          <div>
            <AnimatePresence mode="wait" initial={false}>
              {scene === 0 ? (
                <motion.div key="intro" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
                  <Intro onGo={() => goTo(1)} />
                </motion.div>
              ) : (
                <motion.div key="moment" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
                  <div className="font-serif text-[clamp(84px,9vw,150px)] leading-[0.8] tracking-[-0.03em] tabular-nums">{clock(hour)}</div>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                      <div className="mt-6 font-serif text-[24px] italic text-[var(--muted)]">
                        {m.time} · {m.place}
                      </div>
                      <h2 className="mt-3 text-[clamp(26px,2.4vw,34px)] font-semibold leading-[1.1] tracking-[-0.03em]">{m.title}</h2>
                      <p className="mt-4 text-[16px] leading-relaxed opacity-85">{m.body}</p>
                      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--glass)] px-3 py-1.5 font-mono text-[11px] text-[var(--muted)] backdrop-blur-xl">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#3fa9f5]" />
                        {m.under}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* the desk, the wire, the pocket */}
          <div className="flex h-full flex-col justify-center pb-4">
            <div className="grid grid-cols-[minmax(0,1fr)_clamp(80px,7vw,112px)_clamp(250px,19vw,286px)] items-end pb-3">
              <Label icon="⌨" title="Your desk" sub="Claude Code, in dtach" />
              <span />
              <Label icon="✈" title="Your pocket" sub="Telegram" />
            </div>
            <div className="grid h-[min(600px,calc(100vh-250px))] grid-cols-[minmax(0,1fr)_clamp(80px,7vw,112px)_clamp(250px,19vw,286px)] grid-rows-[minmax(0,1fr)] items-center">
              <div className="h-[88%] min-h-0">
                <Terminal panes={state.panes} detached={state.detached} />
              </div>
              <div className="relative z-10 h-full min-h-0">
                <Wire packets={packets} busy={packets.length > 0} />
              </div>
              <div className="h-full min-h-0">
                <Phone state={state} awaiting={awaiting} onTap={onTap} hint={hint} night={night} />
              </div>
            </div>
            <div className="mt-9 pl-12">
              <DayStrip hour={hour} active={scene} onPick={goTo} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
