import { CopyButton, GitHubIcon } from "./icons";

const INSTALL_CMD = "curl -fsSL aipager.run/install | sh";

export function FinalCta() {
  return (
    <section className="py-16 lg:py-24">
      <div className="wrap">
        <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center sm:px-12">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Stop babysitting the terminal.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-dim">
            Two minutes from install to your first session mirrored in Telegram.
          </p>
          <div className="mx-auto mt-7 flex max-w-md items-center gap-3 rounded-lg border border-border bg-terminal-bg px-4 py-3 font-mono text-sm">
            <span className="text-dim">$</span>
            <span className="min-w-0 flex-1 truncate text-left text-foreground">
              {INSTALL_CMD}
            </span>
            <CopyButton text={INSTALL_CMD} />
          </div>
          <a
            href="https://github.com/dev-aly3n/aipager"
            className="mt-5 inline-flex items-center gap-2 text-sm text-dim transition-colors hover:text-foreground"
          >
            <GitHubIcon size={14} />
            Star it on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
