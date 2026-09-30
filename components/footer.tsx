import { Mark } from "@/components/brand";
import { getAipagerVersion } from "@/lib/version";

const LINKS: { href: string; label: string }[] = [
  { href: "https://github.com/dev-aly3n/aipager", label: "GitHub" },
  { href: "/docs", label: "Docs" },
  { href: "https://pypi.org/project/aipager/", label: "PyPI" },
  { href: "https://github.com/dev-aly3n/aipager/blob/main/CHANGELOG.md", label: "Changelog" },
  { href: "https://github.com/dev-aly3n/aipager/issues", label: "Issues" },
];

export async function Footer() {
  const version = await getAipagerVersion();
  return (
    <footer className="border-t border-white/[0.06] py-10">
      <div className="wrap flex flex-wrap items-center justify-between gap-6 text-sm text-fg-3">
        <div className="flex items-center gap-3">
          <Mark size={20} />
          <span className="text-fg-2">
            aipager<span className="text-accent">.</span>run
          </span>
          <span className="font-mono text-xs">v{version}</span>
          <span aria-hidden>·</span>
          <a href="https://github.com/dev-aly3n/aipager/blob/main/LICENSE" className="hover:text-foreground">
            MIT
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
