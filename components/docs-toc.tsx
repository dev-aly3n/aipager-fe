"use client";

import { useEffect, useState } from "react";
import type { Head } from "@/lib/docs-nav";

/**
 * On this page. The heading nearest the top of the viewport is the one you
 * are reading, so it is the one marked.
 */
export function DocsToc({ heads }: { heads: Head[] }) {
  const [here, setHere] = useState<string>(heads[0]?.id ?? "");

  useEffect(() => {
    const ids = heads.map((h) => h.id);
    const pick = () => {
      let best = ids[0] ?? "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - 96 <= 0) best = id;
      }
      setHere(best);
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, [heads]);

  if (heads.length < 2) return null;
  return (
    <div className="text-[13.5px]">
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-4">On this page</div>
      <ul className="space-y-[3px] border-l border-white/[0.08]">
        {heads.map((h) => {
          const on = h.id === here;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={`-ml-px block border-l py-[3px] transition-colors ${h.level === 3 ? "pl-6" : "pl-3"} ${
                  on ? "border-accent text-foreground" : "border-transparent text-fg-4 hover:text-fg-2"
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
