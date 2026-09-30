"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { skyAt, skyVars } from "./sky";
import { DAY_END, hourAt, MOMENTS } from "./timeline";

/**
 * Holds the page and paints it with the hour: inside the day section the
 * hour comes from its scroll progress; below it, each section names the hour
 * it belongs to (data-hour) and the sky blends between them.
 */
export function SkyRoot({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let raf = 0;
    let last = "";
    const paint = () => {
      raf = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const day = document.getElementById("day");
      let hour = MOMENTS[0].h;
      if (day) {
        const top = day.offsetTop;
        const span = day.offsetHeight - vh;
        if (y < top + span) {
          hour = hourAt(Math.min(1, Math.max(0, (y - top) / span)));
        } else {
          // Below the day: blend between the hours the sections name.
          const marks = [{ at: top + span, hour: DAY_END }].concat(
            [...el.querySelectorAll<HTMLElement>("[data-hour]")].map((s) => ({ at: s.offsetTop - vh * 0.5, hour: Number(s.dataset.hour) })),
          );
          const probe = y;
          hour = marks[marks.length - 1].hour;
          for (let i = 0; i < marks.length - 1; i++) {
            if (probe < marks[i + 1].at) {
              const u = Math.min(1, Math.max(0, (probe - marks[i].at) / (marks[i + 1].at - marks[i].at)));
              hour = marks[i].hour + (marks[i + 1].hour - marks[i].hour) * u;
              break;
            }
          }
        }
      }
      const vars = skyVars(skyAt(hour));
      const key = vars["--sky-top"] + vars["--nightness"];
      if (key === last) return;
      last = key;
      for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={root} className="relative text-[var(--ink)]" style={skyVars(skyAt(MOMENTS[0].h))}>
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: "linear-gradient(180deg, var(--sky-top), var(--sky-bottom))" }} />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
