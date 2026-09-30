"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CopyButton, GitHubIcon } from "@/components/brand";
import { Dial } from "./dial";
import { MomentCard } from "./cards";
import { clock, hourAt, momentAt, MOMENTS, SESSIONS } from "./timeline";

const INSTALL = "curl -fsSL aipager.run/install | sh";

function Intro({ onGo }: { onGo: () => void }) {
  return (
    <div>
      <div className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--muted)]">aipager · Claude Code on Telegram</div>
      <h1 className="mt-6 font-serif text-[clamp(52px,5.6vw,92px)] leading-[0.95] tracking-[-0.02em]">
        Claude keeps working.
        <br />
        <em className="text-[var(--muted)]">You get on with your day.</em>
      </h1>
      <p className="mt-7 max-w-[30rem] text-[17px] leading-relaxed">
        aipager runs your Claude Code sessions in a detached terminal and pages you on Telegram when they need you. Answer with a tap, send
        the next prompt, walk on. It all runs on your machine.
      </p>
      <div className="mt-8 flex max-w-[30rem] items-center gap-2.5 rounded-2xl border border-[var(--line)] bg-[var(--glass)] py-2 pl-4 pr-2 font-mono text-[13px] backdrop-blur-xl">
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
        className="mt-12 inline-flex items-center gap-3 rounded-full border border-[var(--line)] bg-[var(--glass)] py-2 pl-2 pr-5 text-[14.5px] font-medium shadow-[0_12px_40px_-12px_rgb(255_160_70/0.55)] backdrop-blur-xl transition-transform hover:-translate-y-0.5"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--ink)] text-[var(--sky-bottom)]">
          <span className="scroll-chevron">↓</span>
        </span>
        Scroll: live one day with aipager
      </button>
    </div>
  );
}

export function Day() {
  const section = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);

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

  const hour = hourAt(p);
  const active = momentAt(p);
  const m = MOMENTS[active];

  /** Scroll to where moment k is told. */
  const goTo = (k: number) => {
    const el = section.current;
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.offsetTop + (span * k) / MOMENTS.length, behavior: "smooth" });
  };

  return (
    <section id="day" ref={section} style={{ height: `${(MOMENTS.length + 1) * 100}vh` }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="wrap grid h-full !max-w-[92rem] grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] items-center gap-10 pt-14">
          {/* the words */}
          <div className="relative">
            <AnimatePresence mode="wait" initial={false}>
              {active === 0 ? (
                <motion.div key="intro" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
                  <Intro onGo={() => goTo(1)} />
                </motion.div>
              ) : (
                <motion.div key="moment" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
                  <div className="font-serif text-[clamp(96px,11vw,176px)] leading-[0.8] tracking-[-0.03em] tabular-nums">{clock(hour)}</div>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                      <div className="mt-6 font-serif text-[26px] italic text-[var(--muted)]">
                        {m.time} · {m.place}
                      </div>
                      <h2 className="mt-3 text-[clamp(28px,2.6vw,38px)] font-semibold leading-[1.1] tracking-[-0.03em]">{m.title}</h2>
                      <p className="mt-4 max-w-[31rem] text-[16.5px] leading-relaxed opacity-85">{m.body}</p>
                      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-1.5 font-mono text-[11.5px] text-[var(--muted)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#3fa9f5]" />
                        {m.under}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* the dial and the moment it paged you */}
          <div className="relative mx-auto aspect-square w-[min(80vh,100%)]">
            <Dial hour={hour} active={active} />
            <div className="absolute -bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-4 whitespace-nowrap font-mono text-[11px] text-[var(--muted)]">
              {SESSIONS.map((s) => (
                <span key={s.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                  {s.name}
                </span>
              ))}
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-3 rounded-sm bg-[#f2b84b]" />
                waiting on you
              </span>
            </div>
            <div className="absolute left-1/2 top-1/2 w-[min(340px,56%)] -translate-x-1/2 -translate-y-1/2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, scale: 0.94, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <MomentCard card={m.card} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* the day at a glance */}
        <div className="absolute inset-x-0 bottom-6">
          <div className="wrap flex !max-w-[92rem] items-center gap-2">
            {MOMENTS.slice(1).map((mm, i) => (
              <button
                key={mm.id}
                type="button"
                onClick={() => goTo(i + 1)}
                className={`rounded-full px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  i + 1 === active ? "bg-[var(--ink)] text-[var(--sky-bottom)]" : i + 1 < active ? "text-[var(--ink)] opacity-70 hover:opacity-100" : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                {mm.time}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
