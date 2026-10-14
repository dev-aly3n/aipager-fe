import Link from "next/link";
import { Nav } from "@/components/nav";
import { DocsSidebar } from "@/components/docs-sidebar";
import { Footer } from "@/components/footer";
import { GROUPS, SHORT_TITLES, listDocs } from "@/lib/docs";
import { getAipagerVersion } from "@/lib/version";

export default async function DocsLayout({ children }: { children: React.ReactNode }) {
  const docs = listDocs();
  const version = await getAipagerVersion();
  const flat = GROUPS.flatMap((g) => g.slugs);

  return (
    <>
      <Nav />
      <div className="min-h-screen pt-14">
        {/* on a phone the sidebar becomes one scrolling row of pages */}
        <div className="sticky top-14 z-30 border-b border-white/[0.06] bg-[#0a0c0f]/85 backdrop-blur-md lg:hidden">
          <div className="flex gap-2 overflow-x-auto px-5 py-2.5">
            {flat.map((slug) => (
              <Link
                key={slug}
                href={slug === "" ? "/docs" : `/docs/${slug}`}
                className="shrink-0 whitespace-nowrap rounded-full border border-white/10 px-3 py-1 text-[13px] text-fg-3 transition-colors hover:border-white/25 hover:text-foreground"
              >
                {SHORT_TITLES[slug] ?? slug}
              </Link>
            ))}
          </div>
        </div>
        <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14 lg:px-10">
          <aside className="hidden lg:block">
            <div className="sticky top-[88px] max-h-[calc(100vh-7rem)] overflow-y-auto pb-10">
              <DocsSidebar docs={docs} version={version} />
            </div>
          </aside>
          <main className="min-w-0">{children}</main>
        </div>
      </div>
      <Footer />
    </>
  );
}
