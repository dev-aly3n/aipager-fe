import { CopyButton } from "./icons";

const STEPS: { n: string; title: string; cmd: string; note: string }[] = [
  {
    n: "01",
    title: "Install",
    cmd: "curl -fsSL aipager.run/install | sh",
    note: "Detects your platform and picks the best installer (uv → pipx → brew). Pulls dtach if it's missing.",
  },
  {
    n: "02",
    title: "Configure",
    cmd: "aipager config",
    note: "A wizard asks for a bot token (one @BotFather chat away) and your Telegram chat, then wires the Claude Code hooks for you.",
  },
  {
    n: "03",
    title: "Start",
    cmd: "aipager start",
    note: "Message your bot on Telegram. You're live — create a session and walk away from the desk.",
  },
];

const ALTS: { label: string; cmd: string }[] = [
  { label: "uv", cmd: "uv tool install aipager" },
  { label: "pipx", cmd: "pipx install aipager" },
  { label: "brew", cmd: "brew install dev-aly3n/aipager/aipager" },
];

export function Install() {
  return (
    <section id="install" className="py-16 lg:py-24">
      <div className="wrap">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            Install
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Three commands. That&apos;s the setup.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.n} className="min-w-0 rounded-xl border border-border bg-surface p-6">
              <div className="font-mono text-xs text-dim">{step.n}</div>
              <h3 className="mt-1 text-base font-semibold">{step.title}</h3>
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-terminal-bg px-3 py-2.5 font-mono text-[13px]">
                <span className="text-dim">$</span>
                <span className="min-w-0 flex-1 truncate text-foreground">{step.cmd}</span>
                <CopyButton text={step.cmd} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-dim">{step.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-dim">
          <span>Prefer your own package manager?</span>
          {ALTS.map((alt) => (
            <code
              key={alt.label}
              className="rounded-md border border-border px-2 py-1 font-mono text-xs"
            >
              {alt.cmd}
            </code>
          ))}
        </div>
      </div>
    </section>
  );
}
