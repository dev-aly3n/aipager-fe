import { GitHubIcon, Mark } from "@/components/brand";
import { getAipagerVersion } from "@/lib/version";

const LINKS: { href: string; label: string }[] = [
  { href: "#day", label: "A day" },
  { href: "#how", label: "How it works" },
  { href: "#trust", label: "Security" },
  { href: "#install", label: "Install" },
  { href: "#faq", label: "FAQ" },
  { href: "/docs", label: "Docs" },
];

/** The nav for the day page: it takes the colours of the hour. */
export async function DayNav() {
  const version = await getAipagerVersion();
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[var(--glass)] backdrop-blur-xl">
      <div className="wrap flex h-14 !max-w-[92rem] items-center gap-6 text-[var(--ink)]">
        <a href="/" className="flex items-center gap-2.5 font-medium tracking-[-0.025em]">
          <Mark size={24} />
          <span>
            aipager<span className="text-[#3fa9f5]">.</span>run
          </span>
          <span className="rounded-full border border-[var(--line)] px-2 py-0.5 font-mono text-[11px] font-normal text-[var(--muted)]">v{version}</span>
        </a>
        <div className="ml-auto flex items-center gap-6 text-sm text-[var(--muted)]">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-[var(--ink)]">
              {l.label}
            </a>
          ))}
          <a href="https://github.com/dev-aly3n/aipager" className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3.5 py-1.5 text-[var(--ink)] transition-colors hover:bg-[var(--glass)]">
            <GitHubIcon size={14} /> GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
