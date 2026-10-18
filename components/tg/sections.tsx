"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BotAvatar, CopyButton } from "@/components/brand";
import { Ticks } from "./telegram";
import { Bidi, Rich } from "./rich";
import { MiniApp } from "./miniapp";
import { DRAG_CLASS, useDragScroll } from "./drag-scroll";
import STRINGS from "@/lib/bot-strings.json";
import { botOf, fill } from "@/lib/i18n/bot";
import type { Dict } from "@/lib/i18n";
import { arrow, digits, isLocale, type Locale } from "@/lib/i18n/locales";

export { Rich };

/* ---------------- where it lives ---------------- */

/** Role names are the product's own and stay as they are. */
const ROLES = ["owner", "admin", "user", "read_only"] as const;

/** What never changes with the language: the avatars. */
const PLACE_LOOK: { color: string; initials: string; bot?: boolean; mark: string }[] = [
  { color: "#3fa9f5", initials: "ai", bot: true, mark: "⏳ " },
  { color: "#faa774", initials: "BT", mark: "" },
  { color: "#b18cff", initials: "J", mark: "🔐 " },
];

export function Places({ t, locale }: { t: Dict; locale: Locale }) {
  const places = t.places.chats.map((c, i) => ({ ...c, ...PLACE_LOOK[i], chips: t.places.chips[i] }));
  const roles = t.places.roles;
  const can: (boolean | string)[][] = [
    [true, true, true, false],
    [true, true, true, false],
    [true, true, false, false],
    [true, true, roles.ownChat, false],
    [roles.anywhere, roles.anywhere, roles.rootFolder, roles.rootFolder],
    [true, true, false, false],
  ];
  return (
    <section id="where" className="border-t border-white/[0.06] py-20 sm:py-28 lg:py-32">
      <div className="wrap !max-w-[76rem]">
        <div className="eyebrow">{t.places.eyebrow}</div>
        <h2 className="mt-4 max-w-3xl text-[clamp(36px,4vw,56px)] font-semibold leading-[1.02] tracking-[-0.04em]">{t.places.title}</h2>
        <ul className="mt-10 divide-y divide-white/[0.06] overflow-hidden rounded-3xl border border-white/10 bg-[#17212b] sm:mt-16">
          {/* minmax(0,…) on the card's columns, or a long language's longest
              line sizes the column and the card grows past the phone */}
          {places.map((p) => (
            <li key={p.name} className="grid grid-cols-[minmax(0,1fr)] gap-6 px-5 py-6 transition-colors hover:bg-[#1c2835] sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-12">
              {/* a phone's narrower row keeps a chat's whole name on one line */}
              <div className="flex min-w-0 items-center gap-5 phone:gap-4">
                {p.bot ? (
                  <BotAvatar size={68} className="phone:h-[52px] phone:w-[52px]" />
                ) : (
                  <span className="grid h-[68px] w-[68px] shrink-0 place-items-center rounded-full text-[22px] font-semibold text-white phone:h-[52px] phone:w-[52px] phone:text-[18px]" style={{ background: `linear-gradient(160deg, ${p.color}, color-mix(in oklab, ${p.color} 65%, #000))` }}>
                    {p.initials}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  {/* a longer language puts the tag on its own line rather than
                      widening the row past the phone */}
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-[22px] font-semibold text-white phone:text-[19px]">{p.name}</span>
                    <span className="text-[13px] text-[#6ab3f3]">{p.tag}</span>
                  </div>
                  <div className="mt-1 truncate text-[14px] text-[#7d8b99]">{p.mark}{p.preview}</div>
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-[18px] font-semibold tracking-[-0.02em] text-white">{p.title}</div>
                <p className="mt-2 text-[15px] leading-relaxed text-fg-2"><Bidi text={p.body} /></p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {/* a chip that is a command, a role or a path reads left to
                      right in every language; one that is words does not */}
                  {p.chips.map((c) => (
                    <span
                      key={c}
                      dir={/^[\x20-\x7E]+$/.test(c) ? "ltr" : undefined}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 font-mono text-[12px] text-fg-3"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
        {/* what each role may do, for the chat with other people in it */}
        <div className="mt-14 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <h3 className="text-[22px] font-semibold tracking-[-0.03em] text-white">{roles.title}</h3>
          <p className="text-[15.5px] leading-relaxed text-fg-2">{roles.lead}</p>
        </div>
        {/* a table is the one thing allowed to be wider than the phone: it
            scrolls on its own, and the fade says so */}
        <div className="relative mt-6 phone:hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-start">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 pe-4 text-[13px] font-normal text-fg-4">{roles.can}</th>
                {ROLES.map((r) => (
                  <th key={r} className="w-[15%] py-3 pe-3 font-mono text-[13px] font-normal text-fg-2">
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.rows.map((what, r) => (
                <tr key={what} className="border-b border-white/[0.06]">
                  <td className="py-3 pe-4 text-[14.5px] text-fg-2"><Bidi text={what} /></td>
                  {can[r].map((v, i) => (
                    <td key={ROLES[i]} className="py-3 pe-3 text-[14px]">
                      {v === true ? <span className="text-live">✓</span> : v === false ? <span className="text-fg-4">✕</span> : <span className="text-fg-3">{v}</span>}
                    </td>
                  ))}
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className="pointer-events-none absolute inset-y-0 end-0 w-12 bg-gradient-to-l from-[#0a0c0f] to-transparent rtl:bg-gradient-to-r lg:hidden" />
        </div>
        {/* On a phone each row of the table stands on two lines: what a role
            may do, then the four answers under the four names, so nothing has
            to scroll sideways. */}
        <div className="mt-6 hidden phone:block">
          <div className="grid grid-cols-4 gap-1 border-b border-white/10 pb-2.5 text-center font-mono text-[11.5px] text-fg-2">
            {ROLES.map((r) => (
              <span key={r} dir="ltr">
                {r}
              </span>
            ))}
          </div>
          <ul className="divide-y divide-white/[0.06] border-b border-white/[0.06]">
            {roles.rows.map((what, r) => (
              <li key={what} className="py-3">
                <div className="text-[14px] text-fg-2"><Bidi text={what} /></div>
                <div className="mt-1.5 grid grid-cols-4 items-center gap-1 text-center text-[14px]">
                  {can[r].map((v, i) => (
                    <span key={ROLES[i]}>
                      {v === true ? <span className="text-live">✓</span> : v === false ? <span className="text-fg-4">✕</span> : <span className="text-[12px] leading-tight text-fg-3">{v}</span>}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <a href={`/${locale}/docs/groups#roles`} className="mt-6 inline-block text-[14px] text-accent hover:underline">
          {roles.link} {arrow(locale)}
        </a>
      </div>
    </section>
  );
}

/* ---------------- under the chat ---------------- */

/** The colours of the five boxes; their words are in the dictionary. */
const NODE_COLOURS = ["#d97757", "#3fa9f5", "#4fd693", "#2aabee", "#b18cff"];

export function Under({ t }: { t: Dict }) {
  const nodes = t.under.nodes.map((n, i) => ({ ...n, color: NODE_COLOURS[i] }));
  return (
    <section id="how" className="border-t border-white/[0.06] py-20 sm:py-28 lg:py-32">
      <div className="wrap !max-w-[76rem]">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:gap-16">
          <div>
            <div className="eyebrow">{t.under.eyebrow}</div>
            <h2 className="mt-4 text-[clamp(36px,4vw,56px)] font-semibold leading-[1.02] tracking-[-0.04em]">{t.under.title}</h2>
          </div>
          <p className="text-[16.5px] leading-relaxed text-fg-2"><Bidi text={t.under.lead} /></p>
        </div>
        {/* a row on a desk, a list on a phone: five boxes side by side need
            more width than a phone has */}
        <div className="relative mt-12 sm:mt-20">
          <div className="absolute inset-x-[10%] top-[27px] hidden h-px bg-gradient-to-r from-[#d97757]/60 via-[#4fd693]/60 to-[#b18cff]/60 rtl:bg-gradient-to-l sm:block" />
          <span className="flow-dot absolute top-[23px] hidden h-[9px] w-[9px] rounded-full bg-white shadow-[0_0_12px_white] sm:block" />
          <span className="flow-dot flow-back absolute top-[23px] hidden h-[9px] w-[9px] rounded-full bg-live shadow-[0_0_12px_rgb(79_214_147)] sm:block" />
          {/* On a phone the same flow runs down the list: a spine through the
              five boxes, the event travelling down it to your chats and the
              answer coming back up, each box lighting as it passes. */}
          <div className="relative">
            <div className="absolute start-[25.5px] top-[26px] bottom-[26px] w-px bg-gradient-to-b from-[#d97757]/70 via-[#4fd693]/60 to-[#b18cff]/70 sm:hidden" />
            <span className="flow-down absolute start-[21.5px] h-[9px] w-[9px] rounded-full bg-white shadow-[0_0_12px_white] sm:hidden" />
            <span className="flow-up absolute start-[21.5px] h-[9px] w-[9px] rounded-full bg-live shadow-[0_0_12px_rgb(79_214_147)] sm:hidden" />
          <ol className="relative grid gap-4 sm:grid-cols-5 sm:gap-0">
            {nodes.map((n, i) => (
              <li key={n.t} className="flex min-h-[60px] items-center gap-4 sm:block sm:min-h-0 sm:text-center">
                <span
                  className="node-out grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl border bg-[#0d1117] sm:mx-auto sm:h-[56px] sm:w-[56px]"
                  // the event reaches box i on its way down, the answer on its way up
                  style={{ borderColor: `${n.color}66`, animationDelay: `${(i * 0.54).toFixed(2)}s` }}
                >
                  <span
                    className="node-back h-3 w-3 rounded-full"
                    style={{ background: n.color, boxShadow: `0 0 16px ${n.color}`, animationDelay: `${(2.4 + (nodes.length - 1 - i) * 0.54).toFixed(2)}s` }}
                  />
                </span>
                <div className="min-w-0">
                  <div className="text-[16px] font-semibold text-white sm:mt-4">{n.t}</div>
                  <div className="mt-1 text-[13px] text-fg-3">{n.b}</div>
                </div>
              </li>
            ))}
          </ol>
          </div>
          {/* why the sentence above is true, in three facts */}
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {t.under.facts.map((f) => (
              <div key={f.t} className="border-t border-white/10 pt-5">
                <div className="text-[16px] font-semibold tracking-[-0.02em] text-white"><Bidi text={f.t} /></div>
                <p className="mt-2 text-[14.5px] leading-relaxed text-fg-2"><Bidi text={f.b} /></p>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center text-[14px] text-fg-3">{t.under.hooks}</div>
          <div className="mt-5 flex flex-wrap justify-center gap-2 font-mono text-[12px] text-fg-3">
            {[
              "UserPromptSubmit",
              "PreToolUse",
              "PermissionRequest",
              "PostToolUse",
              "PostToolUseFailure",
              "Notification",
              "Stop",
              "StopFailure",
              "SubagentStart",
              "SubagentStop",
              "PreCompact",
              "PostCompact",
              "MessageDisplay",
              "PreModelSwitch",
              "SessionStart",
              "SessionEnd",
              "statusline",
            ].map((h) => (
              <span key={h} className="rounded-full border border-white/10 px-3 py-1">
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- nothing in the middle ---------------- */

export function Trust({ t, locale }: { t: Dict; locale: Locale }) {
  return (
    <section id="trust" className="border-t border-white/[0.06] py-20 sm:py-28 lg:py-32">
      <div className="wrap !max-w-[76rem]">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:gap-16">
          <div>
            <div className="eyebrow">{t.trust.eyebrow}</div>
            <h2 className="mt-4 text-[clamp(36px,4vw,56px)] font-semibold leading-[1.02] tracking-[-0.04em]">{t.trust.title}</h2>
          </div>
          <p className="text-[16.5px] leading-relaxed text-fg-2"><Bidi text={t.trust.lead} /></p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {t.trust.cards.map((card, i) => (
            <div key={card.t} className="border-t border-white/10 pt-6">
              <div className="font-mono text-[12px] text-fg-4">{digits(`0${i + 1}`, locale)}</div>
              <div className="mt-3 text-[18px] font-semibold tracking-[-0.02em] text-white">{card.t}</div>
              <p className="mt-2 text-[14.5px] leading-relaxed text-fg-2"><Bidi text={card.b} /></p>
            </div>
          ))}
        </div>
        <a href={`/${locale}/docs/security`} className="mt-10 inline-block text-[14px] text-accent hover:underline">
          {t.trust.link} {arrow(locale)}
        </a>
      </div>
    </section>
  );
}

/* ---------------- install: your Saved Messages ---------------- */

/** The README's own prompt, verbatim: the guide it names does the rest. */
const AGENT_PROMPT =
  "Install aipager for me by following https://aipager.run/agent.md. My Telegram bot token is in ~/.config/aipager/bot-token and my Telegram user id is <your id>.";

/** The four commands, which are the same in every language. */
const SAVED_CMDS = ["curl -fsSL aipager.run/install | sh", "aipager config", "aipager service install", "aipager session api"];
const SAVED_TIMES = ["10:02", "10:03", "10:04", "10:05"];

export function Saved({ t, locale }: { t: Dict; locale: Locale }) {
  const [copied, setCopied] = useState<string | null>(null);
  const saved = SAVED_CMDS.map((cmd, i) => ({ cmd, note: t.install.lines[i].note, time: SAVED_TIMES[i] }));
  return (
    <section id="install" className="border-t border-white/[0.06] py-20 sm:py-28 lg:py-32">
      <div className="wrap grid !max-w-[76rem] gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
        <div>
          <div className="eyebrow">{t.install.eyebrow}</div>
          <h2 className="mt-4 text-[clamp(36px,4vw,56px)] font-semibold leading-[1.02] tracking-[-0.04em]">{t.install.title}</h2>
          <p className="mt-5 text-[16.5px] leading-relaxed text-fg-2"><Bidi text={t.install.lead} /></p>
          {/* the route the README recommends first: hand it to the agent */}
          <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="text-[15px] font-semibold text-white">{t.install.agent.title}</div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-fg-3">{t.install.agent.lead}</p>
            {/* the prompt holds a path that will not break, and the button's
                word is far longer in some languages, so on a phone the button
                drops under the prompt instead of squeezing it */}
            <div className="mt-3 flex flex-col items-start gap-2 rounded-xl border border-white/10 bg-[#0d1014] p-3 sm:flex-row sm:gap-3">
              <p dir="ltr" className="min-w-0 flex-1 font-mono text-[12.5px] leading-relaxed text-fg-2 [overflow-wrap:anywhere]">{AGENT_PROMPT}</p>
              <CopyButton text={AGENT_PROMPT} label={t.cta.copy} done={t.install.copied} className="shrink-0 self-end rounded-lg border border-white/12 px-3 py-1.5 text-[12.5px] text-fg-3 transition-colors hover:border-accent hover:text-foreground sm:self-auto" />
            </div>
            <a href={`/${locale}/docs/install-with-an-agent`} className="mt-3 inline-block text-[13.5px] text-accent hover:underline">
              {t.install.agent.link} {arrow(locale)}
            </a>
          </div>
          <p className="mt-6 text-[14px] text-fg-3">
            {t.install.pm}{" "}
            <a href="https://github.com/dev-aly3n/aipager#install" className="text-accent hover:underline">
              {t.install.pmLink} {arrow(locale)}
            </a>
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0e1621] shadow-[0_40px_100px_-40px_rgb(0_0_0/0.9)]">
          <div className="flex items-center gap-3 border-b border-black/40 bg-[#17212b] px-4 py-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#3f8ae0] text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
              </svg>
            </span>
            <div className="leading-tight">
              <div className="text-[15px] font-semibold text-white">{t.install.saved.name}</div>
              <div className="text-[12.5px] text-[#6d7f8f]">{t.install.saved.count}</div>
            </div>
          </div>
          <div className="tg-pattern space-y-2 px-5 py-6 phone:px-3">
            {saved.map((s) => (
              <div key={s.cmd} className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard?.writeText(s.cmd).then(() => {
                      setCopied(s.cmd);
                      window.setTimeout(() => setCopied(null), 1400);
                    });
                  }}
                  className="max-w-[88%] rounded-[14px] rounded-ee-[5px] bg-[#2b5278] px-3.5 py-2 text-start transition hover:brightness-110 phone:max-w-[94%]"
                >
                  {/* a narrow bubble breaks the line before the pipe's half, never inside it */}
                  <code className="block font-mono text-[14px] text-white phone:text-[13px]">{s.cmd.replace(/ \| /g, "\u00a0|\u00a0")}</code>
                  <span className="mt-0.5 block text-[12.5px] text-[#a9c6e6]">
                    {copied === s.cmd ? `${t.install.copied} ✓` : s.note}
                    <span className="float-end ms-3 inline-flex items-center gap-1 text-[11px] text-[#7da8d3]">
                      {s.time}
                      <span className="inline-block h-[11px] w-4 text-[#6ab3f3]">
                        <Ticks n={2} />
                      </span>
                    </span>
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- questions, asked in the chat ---------------- */

export function Ask({ t }: { t: Dict }) {
  const faqs = t.faq.items;
  /** every question asked, in order, each with its own id so one can be asked twice */
  const [asked, setAsked] = useState<{ q: number; id: number }[]>([{ q: 0, id: 0 }]);
  const nextId = useRef(1);
  const [typing, setTyping] = useState(false);
  const chat = useDragScroll();
  /** they have taken hold of it, so the hint has done its job */
  const [dragged, setDragged] = useState(false);
  const [over, setOver] = useState(false);
  const ask = (i: number) => {
    if (typing) return;
    setAsked((a) => [...a, { q: i, id: nextId.current++ }]);
    setTyping(true);
    window.setTimeout(() => setTyping(false), 1100);
  };

  // A new message brings the chat back to the bottom, unless they are
  // reading back through it.
  useLayoutEffect(() => {
    const el = chat.ref.current;
    if (!el || chat.busy()) return;
    el.scrollTop = el.scrollHeight;
    setOver(el.scrollHeight - el.clientHeight > 12);
  }, [asked, typing, chat]);

  // Their own scrolling is what retires the hint.
  useEffect(() => {
    const el = chat.ref.current;
    if (!el) return;
    const onScroll = () => {
      if (chat.busy()) setDragged(true);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [chat]);
  return (
    <section id="faq" className="border-t border-white/[0.06] py-20 sm:py-28 lg:py-32">
      <div className="wrap grid !max-w-[76rem] gap-10 tablet:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] tablet:gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <div className="eyebrow">{t.faq.eyebrow}</div>
          <h2 className="mt-4 text-[clamp(36px,4vw,56px)] font-semibold leading-[1.02] tracking-[-0.04em]">{t.faq.title}</h2>
          <div className="mt-8 flex flex-col items-start gap-2 phone:hidden">
            {faqs.map((f, i) => (
              <button
                key={f.q}
                type="button"
                onClick={() => ask(i)}
                className={`rounded-full border px-4 py-2 text-start text-[14.5px] transition-colors hover:border-accent hover:text-foreground ${
                  asked.some((a) => a.q === i) ? "border-white/5 text-fg-4" : "border-white/12 text-fg-2"
                }`}
              >
                {f.q}
              </button>
            ))}
          </div>
        </div>
        {/* it follows you down the list of questions */}
        <div className="flex h-[440px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e1621] sm:h-[520px] tablet:sticky tablet:top-20 tablet:self-start lg:sticky lg:top-20 lg:self-start phone:h-auto">
          <div className="flex items-center gap-3 border-b border-black/40 bg-[#17212b] px-4 py-3">
            <BotAvatar size={40} />
            <div className="leading-tight">
              <div className="text-[15px] font-semibold text-white">aipager</div>
              <div className="text-[12.5px] text-[#6ab3f3]">{typing ? `${t.demo.typing}…` : t.demo.chats.aipager.subtitle}</div>
            </div>
            {/* once there is more than fits, say how to get back to it, in
                the header, where it covers no one's message */}
            <AnimatePresence>
              {over && !dragged && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="ms-auto shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-[12px] text-fg-4"
                >
                  ↑ {t.faq.readBack}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          {/* A reply does not grow out of nothing: while it is being written
              the header says "typing…", the way Telegram says it, and the
              bubble arrives whole. */}
          <div className="relative flex min-h-0 flex-1 flex-col phone:h-[340px] phone:flex-none">
            <div
              ref={chat.ref}
              {...chat.bind}
              className={`tg-pattern flex min-h-0 flex-1 flex-col px-5 py-5 ${DRAG_CLASS}`}
            >
              <div className="mt-auto flex flex-col gap-2">
            {/* No layout animation here: the view is pinned to the bottom, so
                a new message does not move the old ones on screen, and animating
                them anyway slid them straight through the arriving bubble. */}
            <AnimatePresence initial={false}>
              {asked.flatMap(({ q: i, id }, k) => {
                const answering = typing && k === asked.length - 1;
                const arrive = { type: "spring" as const, stiffness: 460, damping: 36 };
                const nodes = [
                  <motion.div
                    key={`q${id}`}
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    transition={arrive}
                    className="flex justify-end"
                  >
                    <div className="max-w-[80%] rounded-[14px] rounded-ee-[5px] bg-[#2b5278] px-3.5 py-2 text-[14px] text-white">{faqs[i].q}</div>
                  </motion.div>,
                ];
                if (answering)
                  // Its own little bubble, not a bubble that will grow: when
                  // the answer lands this one is simply gone (no exit prop,
                  // so it leaves in the same frame the answer arrives).
                  nodes.push(
                    <motion.div
                      key={`t${id}`}
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={arrive}
                      className="flex"
                    >
                      <div className="rounded-[14px] rounded-es-[5px] bg-[#182533] px-3.5 py-3">
                        <span className="flex gap-1">
                          {[0, 1, 2].map((d) => (
                            <span key={d} className="typing-dot h-[6px] w-[6px] rounded-full bg-[#6ab3f3]" style={{ animationDelay: `${d * 0.15}s` }} />
                          ))}
                        </span>
                      </div>
                    </motion.div>,
                  );
                else
                  nodes.push(
                    <motion.div
                      key={`a${id}`}
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      transition={arrive}
                      className="flex"
                    >
                      <div className="max-w-[85%] rounded-[14px] rounded-es-[5px] bg-[#182533] px-3.5 py-2 text-[14px] leading-relaxed text-[#e6edf5]"><Bidi text={faqs[i].a} /></div>
                    </motion.div>,
                  );
                return nodes;
              })}
            </AnimatePresence>
              </div>
            </div>
          </div>
          {/* On a phone the questions are the bot's keyboard, under the chat,
              so an answer lands where you are looking rather than a screen
              further down. */}
          <div className="hidden max-h-[236px] flex-col gap-1.5 overflow-y-auto border-t border-black/40 bg-[#17212b] p-2 phone:flex">
            {faqs.map((f, i) => (
              <button
                key={f.q}
                type="button"
                onClick={() => ask(i)}
                className={`shrink-0 rounded-lg px-3 py-2.5 text-center text-[14px] leading-snug transition-colors ${asked.some((a) => a.q === i) ? "bg-[#1e2a37] text-fg-4" : "bg-[#2b3a4b] text-white"}`}
              >
                {f.q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- ask, or let it run ---------------- */

/**
 * Cards that stand side by side on a desk become, in the hand, a row you
 * swipe through one at a time, with their names above it as tabs that say
 * which one is in view and take you to another.
 */
function Swipe({ labels, className, children }: { labels: string[]; className: string; children: React.ReactNode[] }) {
  const row = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(0);
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    // the one most in view, which on a tablet is not the only one in view
    const seen = new Map<number, number>();
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) seen.set(Number((e.target as HTMLElement).dataset.i), e.intersectionRatio);
        let best = 0;
        seen.forEach((r, i) => {
          if (r > (seen.get(best) ?? 0)) best = i;
        });
        setOn(best);
      },
      { root: el, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    for (const c of Array.from(el.children)) io.observe(c);
    return () => io.disconnect();
  }, []);
  const go = (i: number) => row.current?.children[i]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  return (
    <div>
      <div className="mt-10 hidden gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1 handheld:grid handheld:grid-cols-3 tablet:mx-auto tablet:max-w-[560px]">
        {labels.map((l, i) => (
          <button
            key={l}
            type="button"
            aria-pressed={on === i}
            onClick={() => go(i)}
            className={`rounded-xl px-1.5 py-2 text-center text-[12.5px] font-medium leading-tight transition-colors ${on === i ? "bg-[#2aabee] text-white" : "text-fg-3"}`}
          >
            {l}
          </button>
        ))}
      </div>
      {/* out to the screen's edges, past the gutter .wrap keeps */}
      <div
        ref={row}
        className={`${className} handheld:mt-4 handheld:flex handheld:snap-x handheld:snap-mandatory handheld:gap-3 handheld:overflow-x-auto handheld:[scrollbar-width:none] handheld:-mx-[clamp(20px,4vw,56px)] handheld:px-[clamp(20px,4vw,56px)] handheld:scroll-px-[clamp(20px,4vw,56px)]`}
      >
        {children.map((c, i) => (
          <div key={i} data-i={i} className="handheld:shrink-0 handheld:snap-start phone:w-[calc(100%-24px)] tablet:w-[min(440px,62%)]">
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniChat({ title, tag, note, subtitle, children }: { title: string; tag: string; note: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e1621]">
      <div className="flex items-center gap-3 border-b border-black/40 bg-[#17212b] px-4 py-3">
        <BotAvatar size={34} />
        <div className="leading-tight">
          <div className="text-[14.5px] font-semibold text-white">aipager</div>
          <div className="text-[12px] text-[#6ab3f3]">{subtitle}</div>
        </div>
        <span className="ms-auto min-w-0 truncate rounded-full bg-white/[0.06] px-3 py-1 text-[12.5px] font-medium text-white">{title}</span>
        {/* a phone has no room for it beside the mode's name */}
        <span className="shrink-0 text-[12px] text-fg-4 phone:hidden"><Bidi text={tag} /></span>
      </div>
      <div className="tg-pattern flex flex-1 flex-col gap-2 px-4 py-5 text-[13.5px] leading-[1.4] text-[#f1f5f9]">
        {children}
        {/* what just happened, on the floor of every one of the three */}
        <p className="mt-auto max-w-[88%] px-1 pt-3 text-[12.5px] leading-relaxed text-fg-3">{note}</p>
      </div>
    </div>
  );
}

const In = ({ children }: { children: React.ReactNode }) => <div className="max-w-[88%] rounded-[14px] rounded-es-[5px] bg-[#182533] px-3 py-2">{children}</div>;
const Out = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-end">
    <div className="max-w-[80%] rounded-[14px] rounded-ee-[5px] bg-[#2b5278] px-3 py-2">{children}</div>
  </div>
);
const Key = ({ children, on = false }: { children: React.ReactNode; on?: boolean }) => (
  <span className={`rounded-lg px-2 py-[7px] text-center text-[13px] font-medium text-white ${on ? "bg-[#2e7d57]" : "bg-[#1f3246]/90"}`}>{children}</span>
);
/** Claude's own words, as the card quotes them. */
const Quote = ({ children }: { children: React.ReactNode }) => (
  <div className="relative my-1 rounded-[6px] border-s-[3px] border-[#e8737d] bg-[#2a2029]/80 py-1 ps-2.5 pe-5 leading-[1.38]">
    {children}
    <span className="absolute end-1.5 top-0.5 font-serif text-[13px] leading-none text-[#e8737d]">&rdquo;</span>
  </div>
);

/** The folded-calls line, in the product's own words for this language. */
const Fold = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2 py-[3px] text-[12.5px] text-[#c9d6e3]">
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7d8b99" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
    {text}
  </div>
);

const Row = ({ done, children }: { done: boolean; children: React.ReactNode }) => (
  <div className="flex gap-1.5 text-[12.5px]">
    <span className="w-4 shrink-0">{done ? "✅" : "⏳"}</span>
    <code className="min-w-0 truncate font-mono text-[12px] text-[#9fc6ee]">{children}</code>
  </div>
);

export function Modes({ t, locale }: { t: Dict; locale: Locale }) {
  const m = t.modes;
  const bot = botOf(locale);
  const keys = [bot.allow, bot.deny, bot.always, bot.stop];
  return (
    <section id="modes" className="border-t border-white/[0.06] py-20 sm:py-28 lg:py-32">
      <div className="wrap !max-w-[76rem]">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:gap-16">
          <div>
            <div className="eyebrow">{m.eyebrow}</div>
            <h2 className="mt-4 text-[clamp(36px,4vw,56px)] font-semibold leading-[1.02] tracking-[-0.04em]">{m.title}</h2>
          </div>
          <p className="text-[16.5px] leading-relaxed text-fg-2"><Bidi text={m.lead} /></p>
        </div>
        <Swipe labels={[bot.modes.ask, bot.modes.auto, bot.modes.full]} className="mt-10 grid gap-5 lg:mt-14 lg:grid-cols-3">
          <MiniChat title={bot.modes.ask} tag={m.ask.tag} note={m.ask.note} subtitle={t.demo.chats.aipager.subtitle}>
            <In>
              <Quote>{m.ask.quote}</Quote>
              <div className="mt-1 rounded-lg bg-black/25 px-2.5 py-2">
                <div>🔐 {m.ask.read}</div>
                <code className="mt-1 block font-mono text-[12px] text-[#ffc774]">src/auth/cookie.ts</code>
              </div>
              <div className="mt-2 border-t border-white/[0.07] pt-1.5">
                <Rich html={fill(bot.tpl.permHead, { session: "api" })} />
              </div>
            </In>
            <div className="grid max-w-[88%] grid-cols-2 gap-1">
              {keys.map((k, i) => (
                <Key key={k} on={i === 0}>
                  {k}
                </Key>
              ))}
            </div>
            <In>
              <Rich html={fill(bot.tpl.answerLine, { icon: "✅", session: "api", verb: bot.line.verbAllow, detail: "Read: src/auth/cookie.ts" })} />
            </In>
          </MiniChat>
          <MiniChat title={bot.modes.auto} tag={m.auto.tag} note={m.auto.note} subtitle={t.demo.chats.aipager.subtitle}>
            <In>
              <Quote>{m.auto.quote}</Quote>
              <Row done>Read: src/auth/cookie.ts</Row>
              <Row done>Bash: pnpm test e2e/login --trace on</Row>
              <div className="mt-2 rounded-lg bg-black/25 px-2.5 py-2">
                <div>🔐 {m.auto.risky}</div>
                <code className="mt-1 block font-mono text-[12px] text-[#ffc774]">psql $STAGING_URL -c &apos;select id, …&apos;</code>
              </div>
              <div className="mt-2 border-t border-white/[0.07] pt-1.5">
                <Rich html={fill(bot.tpl.permHead, { session: "api" })} />
              </div>
            </In>
            <div className="grid max-w-[88%] grid-cols-2 gap-1">
              {keys.map((k, i) => (
                <Key key={k} on={i === 0}>
                  {k}
                </Key>
              ))}
            </div>
          </MiniChat>
          <MiniChat title={bot.modes.full} tag={m.full.tag} note={m.full.note} subtitle={t.demo.chats.aipager.subtitle}>
            <Out>/mode full</Out>
            <In><Rich html={fill(bot.tpl.switched, { session: "api", mode: bot.modes.full })} /></In>
            <Out>{m.full.ask}</Out>
            <In>
              <Fold text={bot.count.fold4} />
              <Quote>{m.full.quote}</Quote>
              <Row done>Edit: e2e/login.spec.ts</Row>
              <Row done={false}>Bash: pnpm test e2e/login --repeat 10</Row>
              <div className="mt-2 border-t border-white/[0.07] pt-1.5">
                <Rich html={fill(bot.tpl.cardStatus, { mark: "⏳", session: "api", verb: bot.line.verbWorking })} />{" "}
                <span className="text-[#8fa3b8]">{digits("· 4:02 · Read ×2 · Bash ×3 · Edit ×1", locale)}</span>
              </div>
            </In>
          </MiniChat>
        </Swipe>
        {/* the four buttons above, said plainly once */}
        <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13.5px] text-fg-3 phone:flex-col phone:items-start phone:gap-y-1.5">
          {m.legend.map(({ k, v }, i) => [["✅ ", "❌ ", "🟢 ", "⏹ "][i] + k, v]).map(([k, v]) => (
            <li key={k}>
              <span className="text-fg-2">{k}</span> <span className="text-fg-4">·</span> {v}
            </li>
          ))}
        </ul>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {m.facts.map((f) => (
            <div key={f.t} className="border-t border-white/10 pt-5">
              <div className="font-mono text-[14px] text-white"><Bidi text={f.t} /></div>
              <p className="mt-2 text-[14px] leading-relaxed text-fg-2"><Bidi text={f.b} /></p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- fifteen languages ---------------- */

interface Lang {
  code: string;
  name: string;
  /** the language's name in English, for a reader who cannot read the script */
  english: string;
  rtl: boolean;
  permHead: string;
  allow: string;
  deny: string;
  always: string;
  stop: string;
  /** the pinned bar, which is the line you see all day */
  pinWaiting: string;
  /** the one-line reply under the card after you tap */
  answerLine: string;
  switched: string;
  cardStatus: string;
  clock: string;
  agentsDone: string;
  language: string;
  modes: { ask: string; auto: string; full: string };
}

const LANGS = STRINGS as Lang[];


/** The older name, kept where only <b> can appear. */
function Bold({ html }: { html: string }) {
  return <Rich html={html} />;
}

export function Languages({ t }: { t: Dict }) {
  const [code, setCode] = useState("fa");
  const L = LANGS.find((l) => l.code === code) ?? LANGS[0];
  // Where the chips are one row you swipe, the chosen one is brought to the
  // middle of it. By the difference in place, so it works either way round
  // and never moves the page itself.
  const chips = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const row = chips.current;
    const on = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!row || !on || row.scrollWidth <= row.clientWidth) return;
    const a = on.getBoundingClientRect();
    const r = row.getBoundingClientRect();
    row.scrollBy({ left: a.left + a.width / 2 - (r.left + r.width / 2), behavior: "smooth" });
  }, [code]);
  return (
    <section id="languages" className="border-t border-white/[0.06] py-20 sm:py-28 lg:py-32">
      <div className="wrap !max-w-[76rem]">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:gap-16">
          <div>
            <div className="eyebrow">{t.langs.eyebrow}</div>
            <h2 className="mt-4 text-[clamp(36px,4vw,56px)] font-semibold leading-[1.02] tracking-[-0.04em]">{t.langs.title}</h2>
          </div>
          <p className="text-[16.5px] leading-relaxed text-fg-2"><Bidi text={t.langs.lead} /></p>
        </div>
        {/* In one column the chips are a single row you swipe, with the chat
            right under it, so a tap shows its language where you are looking;
            what the section says comes after the chat. */}
        <div className="mt-12 grid gap-10 max-[719px]:gap-4 tablet:min-[720px]:grid-cols-2 tablet:min-[720px]:items-start tablet:min-[720px]:gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-14">
          <div className="max-[719px]:contents">
            <div ref={chips} className="flex flex-wrap gap-2 max-[719px]:order-1 max-[719px]:-mx-[clamp(20px,4vw,56px)] max-[719px]:flex-nowrap max-[719px]:overflow-x-auto max-[719px]:px-[clamp(20px,4vw,56px)] max-[719px]:pb-1 max-[719px]:[scrollbar-width:none]">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setCode(l.code)}
                  aria-pressed={l.code === code}
                  title={l.english}
                  className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[14px] transition-colors ${
                    l.code === code ? "bg-[#2aabee] text-white" : "border border-white/10 bg-white/[0.03] text-fg-2 hover:border-white/25 hover:text-foreground"
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>
            <div className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 max-[719px]:order-3 max-[719px]:mt-6 tablet:min-[720px]:!grid-cols-1">
              {t.langs.facts.map((f) => (
                <div key={f.t} className="border-t border-white/10 pt-4">
                  <div className="text-[15px] font-semibold text-white"><Bidi text={f.t} /></div>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-fg-3"><Bidi text={f.b} /></p>
                </div>
              ))}
            </div>
          </div>
          <div dir={L.rtl ? "rtl" : "ltr"} lang={L.code} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0e1621] shadow-[0_40px_100px_-40px_rgb(0_0_0/0.9)] max-[719px]:order-2">
            <div className="flex items-center gap-3 border-b border-black/40 bg-[#17212b] px-4 py-3" dir="ltr">
              <BotAvatar size={34} />
              <div className="leading-tight">
                <div className="text-[14.5px] font-semibold text-white">aipager</div>
                <div className="text-[12px] text-[#6ab3f3]">{t.demo.chats.aipager.subtitle}</div>
              </div>
              <span className="ms-auto font-mono text-[12px] text-fg-4">{L.name}</span>
            </div>
            {/* the pinned bar, which is the line you actually live with */}
            <div className="flex items-center gap-2.5 border-b border-black/40 bg-[#17212b] px-4 py-1.5">
              <span className="h-8 w-[3px] shrink-0 rounded-full bg-[#6ab3f3]" />
              <div className="min-w-0 leading-tight">
                {/* Telegram's own label stays Telegram's; the line under it
                    is aipager's, and that is the one that changes */}
                <div className="text-[12.5px] font-semibold text-[#6ab3f3]">{t.langs.pinned}</div>
                <div className="truncate text-[13px] text-[#ffc774]">
                  <Bold html={L.pinWaiting} />
                </div>
              </div>
            </div>
            <div className="tg-pattern space-y-2 px-4 py-5 text-[13.5px] leading-[1.45] text-[#f1f5f9]">
              <div className="max-w-[92%] rounded-[14px] rounded-es-[5px] bg-[#182533] px-3 py-2">
                <div>
                  <Bold html={L.permHead} />
                </div>
                <code className="mt-1.5 block rounded-lg bg-black/25 px-2.5 py-1.5 text-start font-mono text-[12px] text-[#ffc774]" dir="ltr">
                  pnpm test e2e/login --trace on
                </code>
              </div>
              <div className="grid max-w-[92%] grid-cols-2 gap-1">
                {[L.allow, L.deny, L.always, L.stop].map((b) => (
                  <Key key={b}>{b}</Key>
                ))}
              </div>
              {/* what lands after the tap: the audit line, then the card, then
                  the agents that outlived the turn */}
              <div className="max-w-[92%] rounded-[14px] rounded-es-[5px] bg-[#182533] px-3 py-2 text-[#c9d6e3]">
                <Bold html={L.answerLine} />
              </div>
              <div className="max-w-[92%] rounded-[14px] rounded-es-[5px] bg-[#182533] px-3 py-2 text-[#c9d6e3]">
                {/* the tally is written the way the language on show writes numbers */}
                <Bold html={L.cardStatus} /> · {L.clock} {isLocale(L.code) ? digits("· Read ×2 · Bash ×1", L.code) : "· Read ×2 · Bash ×1"}
              </div>
              <div className="max-w-[92%] rounded-[14px] rounded-es-[5px] bg-[#182533] px-3 py-2 text-[#c9d6e3]">
                <Bold html={L.agentsDone} />
              </div>
              <div className="max-w-[92%] px-1 text-[12.5px] text-fg-4">{L.language}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- the dashboard inside Telegram ---------------- */

export function App({ t, locale, version }: { t: Dict; locale: Locale; version: string }) {
  const a = t.app;
  return (
    <section id="app" className="border-t border-white/[0.06] py-20 sm:py-28 lg:py-32">
      <div className="wrap !max-w-[76rem]">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:gap-16">
          <div>
            <div className="eyebrow">{a.eyebrow}</div>
            <h2 className="mt-4 text-[clamp(36px,4vw,56px)] font-semibold leading-[1.02] tracking-[-0.04em]">{a.title}</h2>
          </div>
          <p className="text-[16.5px] leading-relaxed text-fg-2"><Bidi text={a.lead} /></p>
        </div>
        <div className="mt-12 grid gap-10 tablet:min-[720px]:grid-cols-2 tablet:min-[720px]:items-start tablet:min-[720px]:gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:items-start lg:gap-14">
          {/* the app itself, working: tap into a session, the finished ones,
              the settings, a new session or a problem report */}
          <MiniApp t={t} locale={locale} version={version} />
          {/* what it is for */}
          <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2 tablet:min-[720px]:!grid-cols-1 lg:grid-cols-1">
            {a.facts.map((f) => (
              <div key={f.t} className="border-t border-white/10 pt-5">
                <div className="text-[16px] font-semibold tracking-[-0.02em] text-white"><Bidi text={f.t} /></div>
                <p className="mt-2 text-[14.5px] leading-relaxed text-fg-2"><Bidi text={f.b} /></p>
              </div>
            ))}
            <a href={`/${locale}/docs/commands#the-mini-app`} className="text-[14px] text-accent hover:underline sm:col-span-2 tablet:min-[720px]:!col-span-1 lg:col-span-1">
              {a.link} {arrow(locale)}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- what a chat lets you do ---------------- */

/** The marks on the eight, which carry across languages. */
const DAY_ICONS = ["🎙️", "📎", "📤", "👀", "⏸", "🤖", "🔔", "⌨️", "📋"];

/**
 * Claude sending a file back, as it lands: your request, the busy card's
 * line while the file is on its way, then the photo as a reply under the
 * answer, captioned 💬 and the session, with Claude's own caption below.
 * Plays each time it comes into view.
 */
function FileBack({ t, locale }: { t: Dict; locale: Locale }) {
  const bot = botOf(locale);
  const box = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([e]) => {
        timers.forEach((id) => window.clearTimeout(id));
        timers.length = 0;
        if (!e.isIntersecting) return setStep(0);
        timers.push(window.setTimeout(() => setStep(1), 700));
        timers.push(window.setTimeout(() => setStep(2), 2300));
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);
  return (
    <div ref={box} className="mt-3 max-w-[290px] space-y-1.5">
      <div className="flex justify-end">
        <span className="rounded-[14px] rounded-ee-[5px] bg-[#2b5278] px-3 py-1.5 text-[13px] text-white">{t.day.ask}</span>
      </div>
      {/* The photo is always laid out, invisible until it arrives, and the
          "Sending" line sits over the top of the same space: the height is
          the photo's from the first frame, whatever its caption wraps to in
          this language, so nothing under the card moves when it lands. */}
      <div className="grid">
        <motion.div
          initial={false}
          animate={step === 2 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.94, y: 8 }}
          transition={step === 2 ? { type: "spring", stiffness: 380, damping: 28 } : { duration: 0.15 }}
          aria-hidden={step !== 2}
          className="w-[230px] origin-bottom-left overflow-hidden rounded-[14px] rounded-es-[5px] bg-[#182533] [grid-area:1/1] rtl:origin-bottom-right"
        >
          {/* the screenshot itself: a test runner's window, which is English in every language */}
          <div dir="ltr" lang="en" className="m-1 overflow-hidden rounded-[10px] bg-[#0d1117] p-2 font-mono text-[9.5px] leading-[1.5] text-[#8b949e]">
            <div className="mb-1.5 flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="text-[#e6edf3]">e2e/login.spec.ts</div>
            <div><span className="text-[#3fb950]">✓</span> opens the sign-in page</div>
            <div><span className="text-[#f85149]">✗</span> signs in and lands on /home</div>
            <div className="mt-1 rounded bg-[#f85149]/10 px-1.5 py-1 text-[#ffa198]">click 5.0s · Set-Cookie 5.3s</div>
          </div>
          <div className="px-2.5 pb-2 pt-1 text-[12.5px] leading-snug text-[#e6edf5]">
            <div>💬 <b className="font-semibold">api</b></div>
            <div dir="auto" className="text-[#c9d6e3]">{t.modes.auto.quote}</div>
          </div>
        </motion.div>
        <motion.div
          initial={false}
          animate={step === 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: step === 2 ? -4 : 6 }}
          transition={{ duration: 0.25 }}
          aria-hidden={step !== 1}
          className="self-start justify-self-start [grid-area:1/1]"
        >
          <span className="inline-flex rounded-[14px] rounded-es-[5px] bg-[#182533] px-3 py-1.5 text-[12.5px] text-[#c9d6e3]">
            <span className="animate-pulse">{bot.count.sending1}</span>
          </span>
        </motion.div>
      </div>
    </div>
  );
}

/** The one feature nobody expects, shown rather than claimed. */
function VoiceNote({ t, locale }: { t: Dict; locale: Locale }) {
  return (
    <div className="mt-3 max-w-[290px] space-y-1.5">
      <div className="flex justify-end">
        <span className="flex items-center gap-2 rounded-[14px] rounded-ee-[5px] bg-[#2b5278] px-3 py-2">
          {/* drawn, not ▶, which a phone turns into its blue emoji button */}
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/90 text-[#2b5278]" aria-hidden>
            <svg width="10" height="11" viewBox="0 0 10 11" fill="currentColor">
              <path d="M1.5 1.2v8.6c0 .6.6.9 1.1.6l6.6-4.3a.7.7 0 0 0 0-1.2L2.6.6c-.5-.3-1.1 0-1.1.6Z" />
            </svg>
          </span>
          <span className="flex h-6 items-center gap-[2px]" aria-hidden>
            {[6, 11, 16, 9, 20, 14, 8, 17, 12, 22, 10, 15, 7, 13, 18, 9, 5].map((h, i) => (
              <span key={i} className="w-[2px] rounded-full bg-white/70" style={{ height: h }} />
            ))}
          </span>
          <span className="shrink-0 text-[11.5px] text-[#c8dcf0]">{digits("0:07", locale)}</span>
        </span>
      </div>
      <div className="w-fit rounded-[14px] rounded-es-[5px] bg-[#182533] px-3 py-1.5 text-[13px] text-[#e6edf5]">
        {/* a language that ends the label with a full-width colon has its own space in it */}
        🎙️ {t.day.heard}
        {/[：。！？]$/.test(t.day.heard) ? "" : " "}
        <span className="text-white">{t.day.said}</span>
      </div>
    </div>
  );
}

export function Day({ t, locale }: { t: Dict; locale: Locale }) {
  const items = t.day.items.map((d, i) => ({ ...d, icon: DAY_ICONS[i], voice: i === 0, file: i === 2 }));
  return (
    <section id="chat" className="border-t border-white/[0.06] py-20 sm:py-28 lg:py-32">
      <div className="wrap !max-w-[76rem]">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:gap-16">
          <div>
            <div className="eyebrow">{t.day.eyebrow}</div>
            <h2 className="mt-4 text-[clamp(36px,4vw,56px)] font-semibold leading-[1.02] tracking-[-0.04em]">{t.day.title}</h2>
          </div>
          <p className="text-[16.5px] leading-relaxed text-fg-2"><Bidi text={t.day.lead} /></p>
        </div>
        <ul className="mt-12 grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
          {items.map((d) => (
            <li key={d.t} className="flex gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-[17px]">{d.icon}</span>
              <div className="min-w-0">
                <div className="text-[16px] font-semibold tracking-[-0.02em] text-white"><Bidi text={d.t} /></div>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-fg-2"><Bidi text={d.b} /></p>
                {d.voice && <VoiceNote t={t} locale={locale} />}
                {d.file && <FileBack t={t} locale={locale} />}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
