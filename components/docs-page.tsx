import Link from "next/link";
import { DocsContent } from "./docs-content";
import { DocsToc } from "./docs-toc";
import { GROUPS, SHORT_TITLES, neighbours, type Doc } from "@/lib/docs";

const SOURCE = "https://github.com/dev-aly3n/aipager/blob/main/docs";

/** One documentation page: where you are, what it is, the body, what is next. */
export function DocsPage({ doc }: { doc: Doc }) {
  const group = GROUPS.find((g) => g.slugs.includes(doc.slug))?.label ?? "Docs";
  const { prev, next } = neighbours(doc.slug);
  const file = doc.slug === "" ? "README.md" : `${doc.slug}.md`;

  return (
    <div className="grid min-w-0 gap-12 xl:grid-cols-[minmax(0,1fr)_13rem]">
      <article className="min-w-0">
        <nav className="flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-fg-4" aria-label="Breadcrumb">
          <Link href="/docs" className="transition-colors hover:text-fg-2">
            Docs
          </Link>
          <span aria-hidden>/</span>
          <span className="text-accent">{group}</span>
        </nav>
        <h1 className="mt-4 text-[clamp(30px,3.4vw,42px)] font-semibold leading-[1.05] tracking-[-0.035em]">{doc.title}</h1>
        {doc.description && <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-fg-2">{doc.description}</p>}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-white/[0.07] py-3 text-[13px] text-fg-4">
          <a href={`${SOURCE}/${file}`} className="transition-colors hover:text-foreground">
            Source on GitHub ↗
          </a>
          <span className="hidden sm:inline">The markdown in the repo is the same text you are reading.</span>
        </div>

        <div className="docs mt-10">
          <DocsContent source={doc.source} />
        </div>

        {(prev || next) && (
          <nav className="mt-16 grid gap-3 border-t border-white/[0.07] pt-8 sm:grid-cols-2" aria-label="More pages">
            {prev ? (
              <Link
                href={prev.slug === "" ? "/docs" : `/docs/${prev.slug}`}
                className="group rounded-xl border border-white/[0.08] px-4 py-3 transition-colors hover:border-white/20"
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-4">← Previous</div>
                <div className="mt-1 text-[15px] font-medium text-fg-2 transition-colors group-hover:text-foreground">
                  {SHORT_TITLES[prev.slug] ?? prev.title}
                </div>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={next.slug === "" ? "/docs" : `/docs/${next.slug}`}
                className="group rounded-xl border border-white/[0.08] px-4 py-3 text-right transition-colors hover:border-white/20 sm:col-start-2"
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-4">Next →</div>
                <div className="mt-1 text-[15px] font-medium text-fg-2 transition-colors group-hover:text-foreground">
                  {SHORT_TITLES[next.slug] ?? next.title}
                </div>
              </Link>
            )}
          </nav>
        )}
      </article>

      <aside className="hidden xl:block">
        <div className="sticky top-[88px] max-h-[calc(100vh-7rem)] overflow-y-auto pb-10">
          <DocsToc heads={doc.headings} />
        </div>
      </aside>
    </div>
  );
}
