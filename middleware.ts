import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale, LOCALES } from "@/lib/i18n/locales";

/**
 * The bare root has no language of its own, so it goes to the reader's: the
 * one they picked here before, else the best match for what their browser
 * asks for, else English. Every other path already names its language.
 */
export function middleware(req: NextRequest) {
  const saved = req.cookies.get("lang")?.value;
  const locale = saved && isLocale(saved) ? saved : fromHeader(req.headers.get("accept-language"));
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}`;
  return NextResponse.redirect(url);
}

function fromHeader(header: string | null) {
  if (!header) return DEFAULT_LOCALE;
  const wanted = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { tag } of wanted) {
    const exact = LOCALES.find((l) => l.toLowerCase() === tag);
    if (exact) return exact;
    // "pt-PT" and "pt" both land on the Portuguese we have; "zh-TW" does not
    // get Simplified Chinese, since the script differs.
    const base = tag.split("-")[0];
    const near = LOCALES.find((l) => l.toLowerCase() === base || l.toLowerCase().startsWith(`${base}-`));
    if (near && !(base === "zh" && !tag.startsWith("zh-hans") && tag !== "zh")) return near;
  }
  return DEFAULT_LOCALE;
}

export const config = { matcher: "/" };
