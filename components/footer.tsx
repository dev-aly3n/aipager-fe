import { Mark } from "@/components/brand";
import { getAipagerVersion } from "@/lib/version";
import { dictOf } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/locales";

export async function Footer({ locale }: { locale: Locale }) {
  const version = await getAipagerVersion();
  const t = dictOf(locale);
  const links: { href: string; label: string }[] = [
    { href: "https://github.com/dev-aly3n/aipager", label: "GitHub" },
    { href: `/${locale}/docs`, label: t.nav.docs },
    { href: "https://pypi.org/project/aipager/", label: "PyPI" },
    { href: "https://github.com/dev-aly3n/aipager/blob/main/CHANGELOG.md", label: t.footer.changelog },
    { href: "https://github.com/dev-aly3n/aipager/issues", label: t.footer.issues },
  ];
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
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
