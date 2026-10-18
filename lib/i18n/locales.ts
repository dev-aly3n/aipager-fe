import STRINGS from "@/lib/bot-strings.json";

/**
 * The languages the site speaks: exactly the ones aipager itself speaks, in
 * the order its own locale table lists them. `lib/bot-strings.json` is
 * rendered from that table by scripts/sync-bot-strings.py, so the two can
 * never drift apart.
 */
export const LOCALES = ["en", "es", "ru", "pt-BR", "zh-Hans", "fr", "de", "ko", "ar", "id", "uk", "it", "tr", "fa", "vi"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Right to left, by the product's own locale table. */
export const RTL: readonly Locale[] = ["ar", "fa"];

export interface LocaleInfo {
  code: Locale;
  /** the language's name in the language */
  name: string;
  /** and in English, for anyone who cannot read the script */
  english: string;
  rtl: boolean;
}

const INFO = new Map<string, LocaleInfo>(
  (STRINGS as { code: string; name: string; english: string; rtl: boolean }[]).map((s) => [
    s.code,
    { code: s.code as Locale, name: s.name, english: s.english, rtl: s.rtl },
  ]),
);

/** Every language, in the product's order. */
export const LANGUAGES: LocaleInfo[] = LOCALES.map((code) => {
  const found = INFO.get(code);
  if (!found) throw new Error(`bot-strings.json has no entry for ${code}`);
  return found;
});

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): "rtl" | "ltr" {
  return RTL.includes(locale) ? "rtl" : "ltr";
}

export function infoOf(locale: Locale): LocaleInfo {
  return LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];
}

/**
 * The same page in another language. Paths are always `/<locale>/…`, so the
 * swap is the first segment and everything after it is kept.
 */
export function pathFor(pathname: string, locale: Locale): string {
  const rest = pathname.replace(/^\/[^/]+/, "");
  return `/${locale}${rest}`;
}

/** Where an arrow points in this language: the project's own rule. */
export function arrow(locale: Locale): "→" | "←" {
  return RTL.includes(locale) ? "←" : "→";
}

/** The same rule for the arrow on a link that leaves the site. */
export function outArrow(locale: Locale): "↗" | "↖" {
  return RTL.includes(locale) ? "↖" : "↗";
}

/**
 * How a language writes a number, copied from the product's own locale
 * table (aipager/i18n/locales.py): its digits, its decimal mark, its
 * thousands mark and its per-cent sign. Arabic's sign carries the Arabic
 * letter mark after it, as CLDR has it, so the sign stays on the number's
 * side; Persian's does not.
 */
const NUMBERS: Partial<Record<Locale, { digits: string; decimal: string; group: string; percent: string }>> = {
  fa: { digits: "۰۱۲۳۴۵۶۷۸۹", decimal: "٫", group: "٬", percent: "٪" },
  ar: { digits: "٠١٢٣٤٥٦٧٨٩", decimal: "٫", group: "٬", percent: "٪؜" },
};

/** The per-cent sign this language writes after a number. */
export function percent(locale: Locale): string {
  return NUMBERS[locale]?.percent ?? "%";
}

/**
 * A number the demo shows inside aipager's own text, in the digits that
 * language uses. aipager converts its own numbers the same way, so a card
 * that says `Read ×۲` in Persian is what the product would really show.
 * Paths, versions and commands never go through this.
 */
export function digits(text: string, locale: Locale): string {
  const n = NUMBERS[locale];
  if (!n) return text;
  // a run of digits carries its own marks with it, so $1.84 becomes $١٫٨٤
  // while the colon in a clock and the dot in a path are left alone
  return text.replace(/\d(?:[.,]?\d)*/g, (run) =>
    run
      .replace(/[0-9]/g, (d) => n.digits[Number(d)])
      .replace(/\./g, n.decimal)
      .replace(/,/g, n.group),
  );
}

/**
 * What a language puts between items in a list, spacing included: a
 * full-width mark already carries its own space, so Chinese takes none
 * after it.
 */
const COMMA: Partial<Record<Locale, string>> = { fa: "، ", ar: "، ", "zh-Hans": "、" };

export function comma(locale: Locale): string {
  return COMMA[locale] ?? ", ";
}
