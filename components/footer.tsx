import { Logo } from "@/components/landing/ui";

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
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="left">
          <Logo size={18} />
          <span>aipager · v{version}</span>
          <span style={{ color: "var(--fg-4)" }}>·</span>
          <a href="https://github.com/dev-aly3n/aipager/blob/main/LICENSE">MIT</a>
        </div>
        <div style={{ display: "inline-flex", gap: 22 }}>
          <a href="https://github.com/dev-aly3n/aipager">GitHub</a>
          <a href="/docs">Docs</a>
          <a href="https://github.com/dev-aly3n/aipager/issues">Issues</a>
          <span style={{ color: "var(--fg-4)" }}>designed by dev-aly3n</span>
        </div>
      </div>
    </footer>
  );
}
