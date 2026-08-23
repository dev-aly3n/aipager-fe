import { getAipagerVersion } from "@/lib/version";
import { Mirror } from "./mirror";
import { CopyButton, GitHubIcon } from "./icons";

const INSTALL_CMD = "curl -fsSL aipager.run/install | sh";

export async function Hero() {
  const version = await getAipagerVersion();

  return (
    <section className="relative overflow-hidden pb-16 pt-28 lg:pb-24 lg:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--accent), transparent)" }}
      />
      <div className="wrap relative grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
        {/* min-w-0 so the grid column can shrink below the install pill's
            intrinsic width on small screens and let it truncate instead. */}
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-dim">
            <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-accent">
              v{version}
            </span>
            Telegram remote control for Claude Code
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Claude Code,
            <br />
            in your <span className="text-accent">pocket</span>.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-dim">
            aipager mirrors your Claude Code sessions to Telegram — watch
            progress live, approve permissions, send the next prompt from
            anywhere. It runs on your machine. Nothing else in the middle.
          </p>
          <div className="mt-7 flex max-w-md items-center gap-3 rounded-lg border border-border bg-terminal-bg px-4 py-3 font-mono text-sm">
            <span className="text-dim">$</span>
            <span className="min-w-0 flex-1 truncate text-foreground">{INSTALL_CMD}</span>
            <CopyButton text={INSTALL_CMD} />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href="https://github.com/dev-aly3n/aipager"
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85"
            >
              <GitHubIcon />
              GitHub
            </a>
            <a
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-dim transition-colors hover:border-accent hover:text-foreground"
            >
              Read the docs
            </a>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-dim">
            <span>MIT licensed</span>
            <span aria-hidden>·</span>
            <span>Python 3.10+</span>
            <span aria-hidden>·</span>
            <span className="text-success">Your bot, your machine</span>
          </div>
        </div>
        <Mirror />
      </div>
    </section>
  );
}
