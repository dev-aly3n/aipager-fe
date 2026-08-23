import { Logo, GitHubIcon } from "@/components/landing/icons";

const LINKS: { href: string; label: string; homeOnly?: boolean }[] = [
  { href: "/#features", label: "Features", homeOnly: true },
  { href: "/#how", label: "How it works", homeOnly: true },
  { href: "/#install", label: "Install", homeOnly: true },
  { href: "/#faq", label: "FAQ", homeOnly: true },
  { href: "/docs", label: "Docs" },
];

// No hamburger on purpose: on small screens the section links drop away and
// the bar keeps just brand + Docs + GitHub, so there is no menu state to get
// stuck. Shared by the landing page and the docs layout.
export function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="wrap flex h-14 items-center gap-6">
        <a href="/" className="flex items-center gap-2 font-semibold">
          <Logo size={22} />
          <span>aipager</span>
        </a>
        <div className="ml-auto flex items-center gap-5 text-sm text-dim">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-foreground ${
                link.homeOnly ? "hidden sm:inline" : ""
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/dev-aly3n/aipager"
            aria-label="aipager on GitHub"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-foreground transition-colors hover:border-accent"
          >
            <GitHubIcon size={14} />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
