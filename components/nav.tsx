import { GitHubIcon, Mark } from "@/components/brand";
import { getAipagerVersion } from "@/lib/version";

const LINKS: { href: string; label: string; homeOnly?: boolean }[] = [
  { href: "/#modes", label: "Modes", homeOnly: true },
  { href: "/#how", label: "How it works", homeOnly: true },
  { href: "/#install", label: "Install", homeOnly: true },
  { href: "/#trust", label: "Security", homeOnly: true },
  { href: "/#faq", label: "FAQ", homeOnly: true },
  { href: "/docs", label: "Docs" },
];

// No hamburger on purpose: on small screens the section links drop away and
// the bar keeps just brand + Docs + GitHub. Shared by the landing page and
// the docs layout.
export async function Nav() {
  const version = await getAipagerVersion();
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#0a0c0f]/75 backdrop-blur-md">
      <div className="wrap flex h-14 items-center gap-6">
        <a href="/" className="flex items-center gap-2.5 font-medium tracking-[-0.025em]">
          <Mark size={24} />
          <span>
            aipager<span className="text-accent">.</span>run
          </span>
          <span className="hidden rounded-full border border-white/10 px-2 py-0.5 font-mono text-[11px] font-normal text-fg-3 sm:inline">
            v{version}
          </span>
        </a>
        <div className="ml-auto flex items-center gap-6 text-sm text-fg-3">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-foreground ${link.homeOnly ? "hidden md:inline" : ""}`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/dev-aly3n/aipager"
            aria-label="aipager on GitHub"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 px-3.5 py-1.5 text-foreground transition-colors hover:border-accent"
          >
            <GitHubIcon size={14} />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
