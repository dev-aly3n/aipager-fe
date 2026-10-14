"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GROUPS, SHORT_TITLES, type DocSummary } from "@/lib/docs-nav";

/** The pages, grouped, with the one you are on marked. */
export function DocsSidebar({ docs, version }: { docs: DocSummary[]; version: string }) {
  const pathname = usePathname();
  const bySlug = new Map(docs.map((d) => [d.slug, d]));

  return (
    <nav className="text-[14px]">
      {GROUPS.map((group) => (
        <div key={group.label} className="mb-7">
          <div className="mb-2 px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-4">{group.label}</div>
          <ul className="space-y-px">
            {group.slugs.map((slug) => {
              const doc = bySlug.get(slug);
              if (!doc) return null;
              const href = slug === "" ? "/docs" : `/docs/${slug}`;
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`relative block rounded-lg px-3 py-[7px] transition-colors ${
                      active ? "bg-white/[0.06] font-medium text-foreground" : "text-fg-3 hover:bg-white/[0.03] hover:text-foreground"
                    }`}
                  >
                    {active && <span className="absolute inset-y-[7px] left-0 w-[2px] rounded-full bg-accent" aria-hidden />}
                    {SHORT_TITLES[slug] ?? doc.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div className="mt-8 space-y-2 border-t border-white/[0.07] px-3 pt-5 text-[13px] text-fg-4">
        <a href="https://github.com/dev-aly3n/aipager/tree/main/docs" className="block transition-colors hover:text-foreground">
          These pages on GitHub ↗
        </a>
        <a href="https://github.com/dev-aly3n/aipager/blob/main/CHANGELOG.md" className="block transition-colors hover:text-foreground">
          Changelog ↗
        </a>
        <div className="pt-1 font-mono text-[12px]">aipager v{version}</div>
      </div>
    </nav>
  );
}
