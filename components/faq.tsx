"use client";

import { useState } from "react";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How is this different from Claude's official mobile / web apps?",
    a: "Claude's mobile and web apps connect to Anthropic's hosted assistant. aipager mirrors a Claude Code session running on your own machine — with your repo, your tools, your environment. It's not a chat client; it's a remote control for the CLI.",
  },
  {
    q: "Does my code leave my machine?",
    a: "No. The daemon runs locally and talks directly to the Telegram Bot API using your bot token. File contents, prompts, and outputs are only sent to the chat IDs you configure. There is no aipager server in the middle.",
  },
  {
    q: "What's dtach and why do I need it?",
    a: "dtach is a tiny terminal-multiplexer (~30KB). It lets Claude Code keep running after you close your terminal or lose SSH, so a Telegram approval an hour later still goes to a live session. The installer fetches it for you if you don't have it.",
  },
  {
    q: "Why Telegram and not Slack or Discord?",
    a: "Telegram bots are dead-simple to spin up (one BotFather conversation), support inline keyboards, work everywhere, and don't require a workspace or org. Slack and Discord support are tracked in the issues — PRs welcome.",
  },
  {
    q: "Can I share with my team?",
    a: "Yes. Add an observer bot to a group chat as a read-only mirror — your teammates see status and outputs without being able to inject prompts. Or create separate bots for separate humans.",
  },
  {
    q: "What models does it work with?",
    a: "Whatever Claude Code supports — currently sonnet, opus, haiku, and the opusplan alias. Switch per-session from the Models tier of the persistent keyboard.",
  },
  {
    q: "What if Claude stalls or I want to kill it?",
    a: "The keyboard has ⏹ stop (graceful) and ☠ kill (hard) buttons, plus /kill <name> from any chat. Sessions also surface a stall warning if they go silent for too long.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section" id="faq">
      <div className="wrap" style={{ maxWidth: 900 }}>
        <div className="section-head">
          <span className="eyebrow">FAQ</span>
          <h2 className="h2">Common questions.</h2>
        </div>
        <div className="faq-list">
          {FAQS.map((item, i) => (
            <div key={i} className={`faq-item ${open === i ? "open" : ""}`}>
              <button
                type="button"
                className="faq-q"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
              >
                <span>{item.q}</span>
                <span className="plus" aria-hidden="true"></span>
              </button>
              <div className="faq-a">
                <div className="faq-a-inner">{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
