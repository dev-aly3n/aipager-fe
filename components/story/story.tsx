"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CopyButton, GitHubIcon } from "@/components/brand";
import { awaitingTap, sceneEnd, SCENES, stageAt, type Tap } from "./script";
import { Terminal } from "./terminal";
import { Phone } from "./phone";
import { Wire } from "./wire";

const INSTALL = "curl -fsSL aipager.run/install | sh";

interface Chapter {
  label: string;
  eyebrow: string;
  title: ReactNode;
  body: ReactNode;
  wire: string;
}

const Code = ({ children }: { children: ReactNode }) => (
  <code className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[0.86em] text-fg-2">{children}</code>
);

const CHAPTERS: Chapter[] = [
  {
    label: "Start",
    eyebrow: "",
    title: "",
    body: "",
    wire: "SessionStart",
  },
  {
    label: "Detach",
    eyebrow: "01 · dtach",
    title: "Close the terminal. The session stays.",
    body: (
      <>
        Every session runs inside <b className="text-foreground">dtach</b>, a tiny detacher that gives Claude Code a real terminal nobody has to keep
        open. Drop SSH, close the window: <Code>claude-api</Code> keeps running, and aipager keeps reading it.
      </>
    ),
    wire: "Nothing to send yet. The daemon finds the session by its socket, every 2 seconds.",
  },
  {
    label: "Prompt",
    eyebrow: "02 · Send",
    title: "Type in Telegram. It lands in the terminal.",
    body: (
      <>
        Your message is typed straight into the session, even mid-turn: send three and Claude queues them itself, exactly like typing at the
        desk. <span className="whitespace-nowrap">👀 means it reached the session,</span> 👍 means Claude picked it up.
      </>
    ),
    wire: "Your text goes in as keystrokes. UserPromptSubmit comes back when Claude takes it.",
  },
  {
    label: "Watch",
    eyebrow: "03 · Watch",
    title: "One live card, not a wall of logs.",
    body: (
      <>
        A single message per turn that edits itself: what Claude is saying, each tool call as it starts and lands, and a status line with the
        clock and the tally. The pinned bar on top always says what needs you.
      </>
    ),
    wire: "PreToolUse and PostToolUse, one datagram per tool call.",
  },
  {
    label: "Approve",
    eyebrow: "04 · Approve",
    title: "When Claude asks, you tap.",
    body: (
      <>
        The card turns into a permission prompt, with the real command under Claude&apos;s description of it. aipager&apos;s hook holds the tool call
        while you decide, and your tap goes straight back to it as the verdict: nothing is typed into the terminal. Every tap lands in an
        append-only audit log. <span className="text-live">Go on, tap Allow.</span>
      </>
    ),
    wire: "PermissionRequest out; the verdict goes back to the hook that is holding the call.",
  },
  {
    label: "Ask",
    eyebrow: "05 · Answer",
    title: "Questions become buttons.",
    body: (
      <>
        <Code>AskUserQuestion</Code> dialogs arrive as one button per option, checkboxes where Claude allows several. A button from a turn that
        already ended refuses, instead of answering whatever you are doing now. <span className="text-live">Pick one.</span>
      </>
    ),
    wire: "The question out, arrow keys and Enter back.",
  },
  {
    label: "Fleet",
    eyebrow: "06 · Fleet",
    title: "One bot, every session.",
    body: (
      <>
        <Code>/new</Code> starts one from chat: name, mode, model, folder. Each session gets its own command, so <Code>/docs …</Code> prompts it
        without switching. The pinned bar sums them up: who is working, who is idle, who needs you.
      </>
    ),
    wire: "Every session has its own socket; one daemon serves them all.",
  },
  {
    label: "Mini App",
    eyebrow: "07 · Mini App",
    title: "A dashboard inside Telegram.",
    body: (
      <>
        <Code>/app</Code> opens a live board served by the daemon itself: a tile per session with its context ring, model and cost, an amber tray
        for whatever needs you, the diff of every edit, a one-tap Stop. Every request is checked against Telegram&apos;s signature.
      </>
    ),
    wire: "The statusline feeds the rings: model, context and cost.",
  },
  {
    label: "Done",
    eyebrow: "08 · Done",
    title: "Then it pages you.",
    body: (
      <>
        The card settles into a summary and the answer lands under it. Context warnings, compaction, a stalled turn, a session that ended: you
        hear about each one, on the phone you were going to look at anyway.
      </>
    ),
    wire: "The turn ends; the answer follows its card.",
  },
];

function Hero({ onGo }: { onGo: () => void }) {
  return (
    <div className="pt-10">
      <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1.5 pr-3 text-[12.5px] text-fg-2">
        <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[11px] text-accent">open source</span>
        Telegram remote control for Claude Code
      </div>
      <h1 className="text-[clamp(44px,4.4vw,64px)] font-semibold leading-[1] tracking-[-0.045em]">
        Claude Code,
        <br />
        paging you
        <span className="relative ml-1 inline-block h-[0.2em] w-[0.2em] translate-y-[-0.05em] rounded-full bg-accent align-baseline dot-pulse" />
      </h1>
      <p className="mt-7 max-w-[30rem] text-[17px] leading-relaxed text-fg-2">
        aipager runs your Claude Code sessions in a detached terminal and mirrors them to Telegram. Watch them work, answer what they ask, send
        the next prompt, from wherever you are. Everything runs on your machine.
      </p>
      <div className="mt-8 flex max-w-[30rem] items-center gap-2.5 rounded-xl border border-white/10 bg-[#0d1014] py-2 pl-3.5 pr-2 font-mono text-[clamp(12px,0.95vw,13.5px)]">
        <span className="text-fg-4">$</span>
        <span className="min-w-0 flex-1 truncate text-fg-2">{INSTALL}</span>
        <CopyButton text={INSTALL} className="rounded-lg border border-white/10 px-3 py-1.5 text-[12px] text-fg-3 transition-colors hover:border-accent hover:text-foreground" />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <a
          href="https://github.com/dev-aly3n/aipager"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-[#0a0c0f] transition-opacity hover:opacity-90"
        >
          <GitHubIcon size={15} /> Star on GitHub
        </a>
        <a href="/docs" className="rounded-full border border-white/12 px-5 py-2.5 text-[14px] text-fg-2 transition-colors hover:border-white/30 hover:text-foreground">
          Read the docs
        </a>
      </div>
      <ScrollCue onGo={onGo} />
    </div>
  );
}

/**
 * "Scroll to watch it work": under the hero's buttons, fading in once the
 * opening scene has played.
 */
function ScrollCue({ onGo }: { onGo: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setVisible(true), 3600);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <button
      type="button"
      onClick={onGo}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`mt-12 flex items-center gap-3 rounded-full border border-accent/40 bg-[#0d1014]/90 py-2 pl-2.5 pr-4 text-[13.5px] text-fg-2 shadow-[0_10px_40px_-10px_rgb(63_169_245/0.6)] backdrop-blur transition-all duration-500 hover:border-accent hover:text-foreground ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <span className="relative flex h-7 w-[18px] justify-center rounded-full border-[1.5px] border-fg-3">
        <span className="scroll-wheel mt-1.5 h-1.5 w-[3px] rounded-full bg-accent" />
      </span>
      Scroll to watch it work
      <span className="scroll-chevron text-accent">↓</span>
    </button>
  );
}

/** Milliseconds since the scene became active, ticking while it is. */
function useClock(scene: number, jumpToEnd: boolean): number {
  const [t, setT] = useState(0);
  const start = useRef(0);
  useEffect(() => {
    const end = sceneEnd(SCENES[scene]);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    start.current = performance.now() - (jumpToEnd || reduce ? end : 0);
    const tick = () => setT(performance.now() - start.current);
    tick();
    const id = window.setInterval(tick, 80);
    return () => window.clearInterval(id);
  }, [scene, jumpToEnd]);
  return t;
}

export function Story() {
  const [scene, setScene] = useState(0);
  const [back, setBack] = useState(false);
  const [tap, setTap] = useState<Tap | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const blocks = useRef<(HTMLElement | null)[]>([]);
  const current = useRef(0);
  const t = useClock(scene, back);

  // The scene whose text crosses the middle of the screen drives the stage.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const k = Number((e.target as HTMLElement).dataset.scene);
          if (k === current.current) continue;
          setBack(k < current.current);
          current.current = k;
          setScene(k);
          setTap(null);
          setHint(null);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    blocks.current.forEach((b) => b && io.observe(b));
    return () => io.disconnect();
  }, []);

  const { state, packets } = useMemo(() => stageAt(scene, t, tap), [scene, t, tap]);
  const awaiting = awaitingTap(scene, t, tap);
  const busy = packets.length > 0;

  const onTap = (choice: number) => {
    if (tap) return;
    const gate = SCENES[scene].gate;
    if (!gate) return;
    // The story needs the tests to run: Deny and Stop explain instead.
    if (SCENES[scene].id === "approve" && (choice === 1 || choice === 3)) {
      setHint(choice === 1 ? "Denied calls are blocked for real. Here, the story needs the tests: try Allow." : "Stop interrupts the turn. Here, try Allow.");
      return;
    }
    setTap({ at: t, choice: SCENES[scene].id === "approve" ? 0 : choice });
  };

  const jump = (k: number) => blocks.current[k]?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <section id="story" className="relative">
      <div className="wrap grid !max-w-[92rem] grid-cols-[minmax(0,24rem)_minmax(0,1fr)] gap-x-[clamp(32px,3.5vw,64px)]">
        {/* the words */}
        <div>
          {CHAPTERS.map((c, k) => (
            <article
              key={c.label}
              data-scene={k}
              ref={(el) => {
                blocks.current[k] = el;
              }}
              className={`flex min-h-screen flex-col justify-center transition-opacity duration-500 ${k === 0 ? "" : scene === k ? "opacity-100" : "opacity-30"}`}
            >
              {k === 0 ? (
                <Hero onGo={() => jump(1)} />
              ) : (
                <div className="max-w-[28rem]">
                  <div className="eyebrow mb-4">{c.eyebrow}</div>
                  <h2 className="text-[clamp(30px,3vw,44px)] font-semibold leading-[1.05] tracking-[-0.035em]">{c.title}</h2>
                  <p className="mt-5 text-[16.5px] leading-relaxed text-fg-2">{c.body}</p>
                  <div className="mt-7 flex items-start gap-2.5 border-t border-white/[0.07] pt-4 font-mono text-[12px] leading-relaxed text-fg-3">
                    <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {c.wire}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* the stage */}
        <div className="relative">
          <div className="sticky top-0 flex h-screen flex-col justify-center pb-6 pt-20">
            <div className="grid h-[min(640px,calc(100vh-170px))] grid-cols-[minmax(0,1fr)_clamp(88px,8vw,124px)_clamp(250px,19vw,280px)] grid-rows-[minmax(0,1fr)] items-center">
              <div className="h-[86%] min-h-0">
                <Terminal panes={state.panes} detached={state.detached} />
              </div>
              <div className="relative z-10 h-full min-h-0">
                <Wire packets={packets} busy={busy} />
              </div>
              <div className="h-full min-h-0">
                <Phone state={state} awaiting={awaiting} onTap={onTap} hint={hint} />
              </div>
            </div>
            {/* chapters */}
            <div className="mt-6 flex items-center gap-1">
              {CHAPTERS.map((c, k) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => jump(k)}
                  className="group flex-1 text-left"
                  aria-label={`Go to ${c.label}`}
                >
                  <span
                    className={`block h-0.5 rounded-full transition-colors ${k < scene ? "bg-accent/50" : k === scene ? "bg-accent" : "bg-white/10 group-hover:bg-white/25"} ${
                      scene === 0 && k === 1 ? "next-pulse" : ""
                    }`}
                  />
                  <span className={`mt-2 block font-mono text-[10.5px] transition-colors ${k === scene ? "text-fg-2" : scene === 0 && k === 1 ? "text-accent" : "text-fg-4 group-hover:text-fg-3"}`}>
                    {scene === 0 && k === 1 ? `${c.label} ↓` : c.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
