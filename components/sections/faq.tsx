const FAQS: { q: string; a: string }[] = [
  {
    q: "How is this different from Claude's mobile apps?",
    a: "Claude's apps talk to Anthropic's hosted assistant. aipager mirrors a Claude Code session running on your own machine: your repo, your tools, your environment. It is not a chat client; it is a remote control for the CLI.",
  },
  {
    q: "Does my code leave my machine?",
    a: "No. The daemon runs locally and talks directly to the Telegram Bot API with your own bot token. Prompts, file contents and outputs only go to the chats you configure. There is no aipager server in the middle.",
  },
  {
    q: "What is dtach and why do I need it?",
    a: "A tiny terminal detacher. It keeps Claude Code alive after your terminal closes or SSH drops, so an approval you send an hour later still reaches a live session. It comes with aipager, through the dtach-bin package or your package manager.",
  },
  {
    q: "What if Claude goes off the rails while I'm away?",
    a: "Permission prompts wait for your tap, /stop interrupts the current turn and discards anything queued, and /kill ends a session outright. Buttons from an already-finished task refuse politely instead of hitting whatever runs now.",
  },
  {
    q: "Can my team use it?",
    a: "Yes. Team mode puts the bot in a group chat with per-user roles (owner, admin, user, read_only). Every message runs with its sender's permissions, rule-denied tools are refused, and every decision is audited.",
  },
  {
    q: "What does it cost?",
    a: "Nothing. aipager is MIT licensed and the Telegram bot is your own. Claude Code runs on whatever plan or API key it already uses.",
  },
  {
    q: "Where does it run?",
    a: "Linux and macOS, any architecture: through the install script, uv, pipx, Homebrew, Docker, Nix, the AUR or Snap. As a service it survives logout with systemd or launchd.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-t border-white/[0.06] py-32">
      <div className="wrap grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-16">
        <div>
          <div className="sticky top-28">
            <div className="eyebrow">FAQ</div>
            <h2 className="mt-4 text-[clamp(34px,3.6vw,52px)] font-semibold leading-[1.04] tracking-[-0.04em]">Questions, answered.</h2>
            <p className="mt-5 text-[15px] text-fg-3">
              The rest is in the{" "}
              <a href="/docs" className="text-accent hover:underline">
                docs
              </a>
              , or ask on{" "}
              <a href="https://github.com/dev-aly3n/aipager/issues" className="text-accent hover:underline">
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
        <div className="border-t border-white/[0.08]">
          {FAQS.map((f, i) => (
            <details key={f.q} className="group border-b border-white/[0.08]" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-baseline gap-6 py-6 marker:content-none">
                <span className="font-mono text-[12px] text-fg-4">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-[19px] font-medium tracking-[-0.015em] text-foreground transition-colors group-hover:text-white">{f.q}</span>
                <span aria-hidden className="text-[20px] leading-none text-fg-3 transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="-mt-2 max-w-2xl pb-7 pl-[calc(12px+1.5rem+0.9ch)] text-[15.5px] leading-relaxed text-fg-2">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
