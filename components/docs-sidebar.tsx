"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DocSummary } from "@/lib/docs";

export function DocsSidebar({ docs }: { docs: DocSummary[] }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 text-sm">
      <div className="text-xs uppercase tracking-wider text-dim mb-3 font-semibold">
        Docs
      </div>
      {docs.map(doc => {
        const href = doc.slug === "" ? "/docs" : `/docs/${doc.slug}`;
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`block px-3 py-1.5 rounded transition-colors ${
              active
                ? "bg-surface text-foreground font-medium"
                : "text-dim hover:text-foreground hover:bg-surface/50"
            }`}
          >
            {doc.title}
          </Link>
        );
      })}
    </nav>
  );
}
