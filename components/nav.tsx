import { GitHubIcon, Mark } from "@/components/brand";
import { LangSwitcher } from "@/components/lang-switcher";
import { getAipagerVersion } from "@/lib/version";
import { dictOf } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/locales";

// No hamburger on purpose: on small screens the section links drop away and
// the bar keeps just brand + Docs + GitHub. Shared by the landing page and
// the docs layout. The six section links only appear at lg: at md even the
// English labels need three lines, and a longer language needs more.
export async function Nav({ locale }: { locale: Locale }) {
  const version = await getAipagerVersion();
  const t = dictOf(locale).nav;
  const links: { href: string; label: string; homeOnly?: boolean }[] = [
    { href: `/${locale}#modes`, label: t.modes, homeOnly: true },
    { href: `/${locale}#app`, label: t.app, homeOnly: true },
    { href: `/${locale}#how`, label: t.how, homeOnly: true },
    { href: `/${locale}#install`, label: t.install, homeOnly: true },
    { href: `/${locale}#trust`, label: t.security, homeOnly: true },
    { href: `/${locale}#faq`, label: t.faq, homeOnly: true },
    { href: `/${locale}/docs`, label: t.docs },
  ];
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#0a0c0f]/75 backdrop-blur-md">
      <div className="wrap flex h-14 items-center gap-6 phone:gap-3">
        <a href={`/${locale}`} className="flex items-center gap-2.5 font-medium tracking-[-0.025em]">
          <Mark size={24} />
          <span>
            aipager<span className="text-accent">.</span>run
          </span>
          <span className="hidden rounded-full border border-white/10 px-2 py-0.5 font-mono text-[11px] font-normal text-fg-3 sm:inline">
            v{version}
          </span>
        </a>
        <div className="ms-auto flex items-center gap-4 text-sm text-fg-3 xl:gap-6 phone:gap-3">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap transition-colors hover:text-foreground ${link.homeOnly ? "hidden lg:inline" : ""}`}
            >
              {link.label}
            </a>
          ))}
          <LangSwitcher locale={locale} label={t.language} />
          {/* under 400px a long language's word for Docs needs its room; the
              hero and the footer both link GitHub */}
          <a
            href="https://github.com/dev-aly3n/aipager"
            aria-label="aipager on GitHub"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 px-3.5 py-1.5 text-foreground transition-colors hover:border-accent max-[399px]:hidden"
          >
            <GitHubIcon size={14} />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
