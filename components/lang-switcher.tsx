"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LANGUAGES, pathFor, type Locale } from "@/lib/i18n/locales";

/** A year: long enough that a reader never has to pick twice. */
const REMEMBER = 60 * 60 * 24 * 365;

/** The product's order, except that Persian sits just above Arabic. */
const LISTED = LANGUAGES.flatMap((l) => (l.code === "fa" ? [] : l.code === "ar" ? LANGUAGES.filter((x) => x.code === "fa").concat(l) : [l]));

/**
 * The language picker in the bar. It keeps you on the page you are reading,
 * and remembers the choice so the next visit opens in it.
 */
export function LangSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname() ?? `/${locale}`;
  const here = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (code: Locale) => {
    try {
      document.cookie = `lang=${code};path=/;max-age=${REMEMBER};samesite=lax`;
      window.localStorage.setItem("aipager.lang", code);
    } catch {
      // a browser that refuses storage still gets the language it asked for
    }
    setOpen(false);
    router.push(pathFor(pathname, code));
  };

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 transition-colors ${
          open ? "border-accent text-foreground" : "border-white/12 text-fg-3 hover:border-white/25 hover:text-foreground"
        }`}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
        </svg>
        {/* a laptop's bar holds six section links in the longest language, so
            the globe alone stands for the switcher there */}
        <span className="hidden whitespace-nowrap text-[13px] sm:inline laptop:!hidden">{here.name}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.12 } }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            role="listbox"
            aria-label={label}
            className="absolute end-0 top-[calc(100%+10px)] z-50 max-h-[min(70vh,28rem)] w-[min(92vw,30rem)] overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-[#11161c]/95 p-1.5 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.9)] backdrop-blur-xl sm:w-[30rem]"
          >
            <ul className="grid gap-0.5 sm:grid-cols-2">
              {LISTED.map((l) => {
                const on = l.code === locale;
                return (
                  // the list is only for layout: a listbox owns its options
                  <li key={l.code} role="none">
                    <button
                      type="button"
                      role="option"
                      aria-selected={on}
                      lang={l.code}
                      dir={l.rtl ? "rtl" : "ltr"}
                      onClick={() => pick(l.code)}
                      className={`flex w-full items-baseline gap-2 rounded-xl px-3 py-2 text-start transition-colors ${
                        on ? "bg-accent/15 text-foreground" : "text-fg-2 hover:bg-white/[0.06] hover:text-foreground"
                      }`}
                    >
                      <span className="text-[14.5px]">{l.name}</span>
                      <span className="text-[12px] text-fg-4" dir="ltr">
                        {l.english}
                      </span>
                      {on && (
                        <svg className="ms-auto self-center text-accent" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="m4 12 5 5L20 6" />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
