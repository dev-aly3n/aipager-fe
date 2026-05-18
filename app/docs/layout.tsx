import { Nav } from "@/components/nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { DocsSidebar } from "@/components/docs-sidebar";
import { Footer } from "@/components/footer";
import { listDocs } from "@/lib/docs";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const docs = listDocs();

  return (
    <>
      <ThemeToggle />
      <Nav />
      <div className="min-h-screen pt-16">
        <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-10">
          <aside className="md:sticky md:top-20 md:self-start">
            <DocsSidebar docs={docs} />
          </aside>
          <main className="min-w-0">{children}</main>
        </div>
      </div>
      <Footer />
    </>
  );
}
