import { Bidi } from "@/components/tg/rich";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CopyButton, GitHubIcon } from "@/components/brand";
import { InstallLine } from "@/components/install-line";
import { Desktop } from "@/components/tg/desktop";
import { App, Ask, Day, Languages, Modes, Places, Saved, Trust, Under } from "@/components/tg/sections";
import { dictOf } from "@/lib/i18n";
import { isLocale, LOCALES, type Locale } from "@/lib/i18n/locales";
import { getAipagerVersion } from "@/lib/version";

const INSTALL = "curl -fsSL aipager.run/install | sh";

/**
 * The headline's last mark is drawn in the accent colour. Languages end a
 * sentence with their own mark, so the mark is whatever the sentence ends
 * with, and a sentence that ends without one keeps its shape.
 */
const STOPS = [".", "。", "۔", "।"];
function Headline({ text, className }: { text: string; className: string }) {
  const last = text.slice(-1);
  const mark = STOPS.includes(last);
  return (
    <h1 className={className}>
      {mark ? text.slice(0, -1) : text}
      {mark && <span className="text-[#2aabee]">{last}</span>}
    </h1>
  );
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = dictOf(locale).meta;
  const languages = Object.fromEntries(LOCALES.map((l) => [l, `/${l}`]));
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: `/${locale}`, languages },
    openGraph: { title: t.title, description: t.description, url: `https://aipager.run/${locale}`, siteName: "aipager", type: "website", locale },
    twitter: { card: "summary_large_image", title: t.title, description: t.description },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const t = dictOf(locale);
  const version = await getAipagerVersion();

  return (
    <>
      <Nav locale={locale} />
      <main>
        {/* clipped sideways only: a clip that also ran up and down would stop
            the tablet's side column from staying in view */}
        <section className="relative overflow-x-clip pb-20 pt-[72px]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[700px] bg-[radial-gradient(ellipse_at_30%_0%,rgb(42_171_238/0.16),transparent_62%)]" />
          <div className="wrap relative grid !max-w-[92rem] grid-cols-1 items-center gap-10 xl:grid-cols-[26rem_minmax(0,1fr)] xl:gap-14">
            {/* what it is, and the one command, never below the fold */}
            <div className="text-center xl:text-start">
              <Headline text={t.hero.title} className="text-[clamp(36px,3.6vw,52px)] font-semibold leading-[1.02] tracking-[-0.045em]" />
              <p className="mx-auto mt-4 max-w-xl text-[16.5px] leading-relaxed text-fg-2 xl:mx-0">{t.hero.lead}</p>
              <div className="mt-7">
                <InstallLine cmd={INSTALL} label={t.cta.copy} done={t.install.copied} />
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13.5px] text-fg-3 xl:justify-start">
                {/* the agent route is its own guide, not the four lines below */}
                <a href={`/${locale}/docs/install-with-an-agent`} className="transition-colors hover:text-foreground">
                  {t.hero.agentInstall}
                </a>
                <a href={`/${locale}/docs`} className="transition-colors hover:text-foreground">
                  {t.hero.docs}
                </a>
                <a href={`/${locale}/docs/security`} className="transition-colors hover:text-foreground">
                  {t.hero.security}
                </a>
                <a href="https://github.com/dev-aly3n/aipager" className="inline-flex items-center gap-2 transition-colors hover:text-foreground">
                  <GitHubIcon size={14} /> GitHub
                </a>
              </div>
              {/* written as each name is spelled: uppercase would make macOS "MACOS" */}
              <p className="mt-5 font-mono text-[12px] tracking-[0.02em] text-fg-4"><Bidi text={t.hero.meta} /></p>
            </div>

            {/* the evening itself, with the height it needs */}
            <div className="min-w-0">
              <Desktop t={t} locale={locale} />
            </div>
          </div>
        </section>
        <Modes t={t} locale={locale} />
        <Places t={t} locale={locale} />
        <Day t={t} locale={locale} />
        <App t={t} locale={locale} version={version} />
        <Languages t={t} />
        <Under t={t} />
        <Trust t={t} locale={locale} />
        <Saved t={t} locale={locale} />
        <Ask t={t} />
        <section className="relative overflow-hidden border-t border-white/[0.06] py-24 sm:py-32 lg:py-36">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgb(42_171_238/0.14),transparent_55%)]" />
          <div className="wrap relative text-center">
            <h2 className="text-[clamp(48px,6.5vw,100px)] font-semibold leading-[0.95] tracking-[-0.055em]">
              {STOPS.includes(t.cta.title.slice(-1)) ? t.cta.title.slice(0, -1) : t.cta.title}
              {STOPS.includes(t.cta.title.slice(-1)) && <span className="text-[#2aabee]">{t.cta.title.slice(-1)}</span>}
            </h2>
            <p className="mt-6 text-[19px] text-fg-2">{t.cta.lead}</p>
            {/* on a phone the button goes under the command, so the whole
                command fits on its line rather than lose "| sh" to an ellipsis */}
            <div dir="ltr" className="mx-auto mt-10 flex max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-[#0d1014] py-2.5 pe-2.5 ps-5 font-mono text-[15px] phone:flex-wrap phone:gap-x-2 phone:gap-y-3 phone:py-3 phone:pe-3 phone:ps-4">
              <span className="text-accent">$</span>
              <span className="min-w-0 flex-1 truncate text-start text-foreground phone:text-[clamp(11px,3.4vw,14px)]" dir="ltr">
                {INSTALL}
              </span>
              <CopyButton
                text={INSTALL}
                label={t.cta.copy}
                done={t.install.copied}
                className="rounded-xl border border-white/12 px-4 py-2 text-[13px] text-fg-2 transition-colors hover:border-accent hover:text-foreground phone:basis-full"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
