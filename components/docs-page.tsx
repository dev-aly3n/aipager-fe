import Link from "next/link";
import { DocsContent } from "./docs-content";
import { DocsToc } from "./docs-toc";
import { GROUPS, navTitle, neighbours, type Doc } from "@/lib/docs";
import type { Dict } from "@/lib/i18n";
import { arrow, outArrow, type Locale } from "@/lib/i18n/locales";

const SOURCE = "https://github.com/dev-aly3n/aipager/blob/main/docs";

/** One documentation page: where you are, what it is, the body, what is next. */
export function DocsPage({ doc, locale, t }: { doc: Doc; locale: Locale; t: Dict }) {
  const i = GROUPS.findIndex((g) => g.slugs.includes(doc.slug));
  const group = i >= 0 ? t.docs.groups[i] : t.docs.title;
  const { prev, next } = neighbours(doc.slug, locale);
  const to = arrow(locale);
  const fro = to === "→" ? "←" : "→";
  const name = doc.slug === "" ? "README.md" : `${doc.slug}.md`;
  // the markdown the reader is actually reading: a translated page lives in
  // its own language's folder, which is what "the same text" has to mean
  const file = doc.translated && !doc.built ? `i18n/${locale}/${name}` : name;

  return (
    <div className="grid min-w-0 gap-12 xl:grid-cols-[minmax(0,1fr)_13rem]">
      <article className="min-w-0">
        <nav className="flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-fg-4" aria-label="Breadcrumb">
          <Link href={`/${locale}/docs`} className="transition-colors hover:text-fg-2">
            {t.docs.title}
          </Link>
          <span aria-hidden>/</span>
          <span className="text-accent">{group}</span>
        </nav>
        <h1 className="mt-4 text-[clamp(30px,3.4vw,42px)] font-semibold leading-[1.05] tracking-[-0.035em]">{doc.title}</h1>
        {doc.description && <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-fg-2">{doc.description}</p>}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-white/[0.07] py-3 text-[13px] text-fg-4">
          <a href={`${SOURCE}/${file}`} className="transition-colors hover:text-foreground">
            {t.docs.source} {outArrow(locale)}
          </a>
          <span className="hidden sm:inline">{t.docs.sourceNote}</span>
          {/* a translated page says so, and where the last word is */}
          {doc.translated && !doc.built && (
            <span className="text-fg-4">
              {t.docs.translated}{" "}
              <a href={`/en/docs/${doc.slug}`} className="text-accent transition-colors hover:underline">
                {t.docs.english}
              </a>
            </span>
          )}
        </div>

        <div className="docs mt-10">
          <DocsContent source={doc.source} anchors={doc.anchors} />
        </div>

        {(prev || next) && (
          <nav className="mt-16 grid gap-3 border-t border-white/[0.07] pt-8 sm:grid-cols-2" aria-label="More pages">
            {prev ? (
              <Link
                href={prev.slug === "" ? `/${locale}/docs` : `/${locale}/docs/${prev.slug}`}
                className="group rounded-xl border border-white/[0.08] px-4 py-3 transition-colors hover:border-white/20"
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-4">{fro} {t.docs.prev}</div>
                <div className="mt-1 text-[15px] font-medium text-fg-2 transition-colors group-hover:text-foreground">
                  {navTitle(prev, t.docs.title)}
                </div>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={next.slug === "" ? `/${locale}/docs` : `/${locale}/docs/${next.slug}`}
                className="group rounded-xl border border-white/[0.08] px-4 py-3 text-end transition-colors hover:border-white/20 sm:col-start-2"
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-4">{t.docs.next} {to}</div>
                <div className="mt-1 text-[15px] font-medium text-fg-2 transition-colors group-hover:text-foreground">
                  {navTitle(next, t.docs.title)}
                </div>
              </Link>
            )}
          </nav>
        )}
      </article>

      <aside className="hidden xl:block">
        <div className="sticky top-[88px] max-h-[calc(100vh-7rem)] overflow-y-auto pb-10">
          <DocsToc heads={doc.headings} label={t.docs.onThisPage} />
        </div>
      </aside>
    </div>
  );
}
