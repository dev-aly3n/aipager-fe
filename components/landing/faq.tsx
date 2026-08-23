const FAQS: { q: string; a: string }[] = [
  {
    q: "How is this different from Claude's mobile apps?",
    a: "Claude's apps talk to Anthropic's hosted assistant. aipager mirrors a Claude Code session running on your own machine — your repo, your tools, your environment. It's not a chat client; it's a remote control for the CLI.",
  },
  {
    q: "Does my code leave my machine?",
    a: "No. The daemon runs locally and talks directly to the Telegram Bot API with your own bot token. Prompts, file contents, and outputs only go to the chats you configure — there is no aipager server in the middle.",
  },
  {
    q: "What's dtach and why do I need it?",
    a: "A ~30 KB terminal multiplexer. It keeps Claude Code alive after your terminal closes or SSH drops, so an approval you send an hour later still reaches a live session. The installer fetches it if you don't have it.",
  },
  {
    q: "Can my team use it?",
    a: "Yes — team mode puts the bot in a group chat with per-user roles (owner, admin, user, read-only). Every message runs with its sender's permissions, rule-denied tools are auto-rejected, and every Allow or Deny is audited in-chat and on disk.",
  },
  {
    q: "What if Claude goes off the rails while I'm away?",
    a: "Permission prompts land as inline Allow / Deny buttons, /stop interrupts the current turn (and discards anything queued), and /kill ends a session outright. Buttons from an already-finished task refuse politely instead of hitting whatever runs now.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="py-16 lg:py-24">
      <div className="wrap max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          FAQ
        </span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Common questions.
        </h2>
        <div className="mt-8 divide-y divide-border rounded-xl border border-border bg-surface">
          {FAQS.map((item) => (
            <details key={item.q} className="faq group px-6 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium marker:content-none">
                {item.q}
                <span
                  aria-hidden
                  className="text-dim transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-dim">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
