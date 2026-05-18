import { CopyButton } from "./copy-button";

function GitHubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const INSTALL_COMMAND = "curl -fsSL aipager.run/install | sh";

async function getVersion(): Promise<string> {
  try {
    const res = await fetch("https://pypi.org/pypi/aipager/json", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return "0.3.11";
    const data: { info: { version: string } } = await res.json();
    return data.info.version;
  } catch {
    return "0.3.11";
  }
}

export async function Footer() {
  const version = await getVersion();

  return (
    <footer className="px-4 py-20 sm:py-28 border-t border-border">
      <div className="mx-auto max-w-2xl flex flex-col items-center gap-8">
        {/* CTA */}
        <h2 className="text-xl sm:text-2xl font-bold text-center">
          Get started
        </h2>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 font-mono text-sm w-full max-w-xl">
          <code className="text-accent flex-1 select-all break-all">
            {INSTALL_COMMAND}
          </code>
          <CopyButton text={INSTALL_COMMAND} />
        </div>

        {/* links */}
        <div className="flex items-center gap-4 text-sm text-dim">
          <a
            href="https://github.com/dev-aly3n/aipager"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <GitHubIcon size={14} />
            GitHub
          </a>
          <span className="text-border">|</span>
          <span className="font-mono text-xs">v{version}</span>
          <span className="text-border">|</span>
          <a
            href="https://github.com/dev-aly3n/aipager/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            MIT
          </a>
        </div>

        <p className="text-xs text-dim/60">designed by dev-aly3n</p>
      </div>
    </footer>
  );
}
