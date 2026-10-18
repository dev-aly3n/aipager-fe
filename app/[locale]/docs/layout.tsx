import Link from "next/link";
import { Nav } from "@/components/nav";
import { DocsSidebar } from "@/components/docs-sidebar";
import { Footer } from "@/components/footer";
import { GROUPS, navTitle, listDocs } from "@/lib/docs";
import { getAipagerVersion } from "@/lib/version";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { dictOf } from "@/lib/i18n";

export default async function DocsLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const docs = listDocs(locale);
  const version = await getAipagerVersion();
  const t = dictOf(locale);
  const flat = GROUPS.flatMap((g) => g.slugs);
  const bySlug = new Map(docs.map((d) => [d.slug, d]));

  return (
    <>
      <Nav locale={locale} />
      <div className="min-h-screen pt-14">
        {/* on a phone the sidebar becomes one scrolling row of pages */}
        <div className="sticky top-14 z-30 border-b border-white/[0.06] bg-[#0a0c0f]/85 backdrop-blur-md lg:hidden">
          <div className="flex gap-2 overflow-x-auto px-5 py-2.5">
            {flat.map((slug) => {
              const doc = bySlug.get(slug);
              if (!doc) return null;
              return (
                <Link
                  key={slug}
                  href={slug === "" ? `/${locale}/docs` : `/${locale}/docs/${slug}`}
                  className="shrink-0 whitespace-nowrap rounded-full border border-white/10 px-3 py-1 text-[13px] text-fg-3 transition-colors hover:border-white/25 hover:text-foreground"
                >
                  {navTitle(doc, t.docs.title)}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14 lg:px-10">
          <aside className="hidden lg:block">
            <div className="sticky top-[88px] max-h-[calc(100vh-7rem)] overflow-y-auto pb-10">
              <DocsSidebar docs={docs} version={version} locale={locale} t={t} />
            </div>
          </aside>
          <main className="min-w-0">{children}</main>
        </div>
      </div>
      <Footer locale={locale} />
    </>
  );
}
