const CARDS: { title: string; body: string; chips: string[] }[] = [
  {
    title: "Hooks, not scraping",
    body: "Claude Code fires a hook at every step — a prompt picked up, a tool about to run, a turn finished. aipager listens on a local socket and turns each one into a Telegram update, live.",
    chips: ["UserPromptSubmit", "PreToolUse", "MessageDisplay", "Stop"],
  },
  {
    title: "Sessions that survive",
    body: "Every session runs under dtach, a tiny terminal multiplexer. Close the laptop, lose SSH — the session keeps working, and Telegram keeps you attached to it.",
    chips: ["dtach", "/resume", "/status"],
  },
  {
    title: "Nothing in the middle",
    body: "The daemon talks straight to the Telegram Bot API with your own bot token. Code and prompts never touch a third-party server, and every approval lands in a local audit log.",
    chips: ["your token", "audit log", "MIT"],
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-16 lg:py-24">
      <div className="wrap">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            How it works
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            A small daemon. No cloud.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <h3 className="text-base font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-dim">{card.body}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {card.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-dim"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-dim">
          Want the deep dive? Architecture, the full hook reference, and the
          security model are{" "}
          <a href="/docs" className="text-accent hover:underline">
            in the docs →
          </a>
        </p>
      </div>
    </section>
  );
}
