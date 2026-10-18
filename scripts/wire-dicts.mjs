#!/usr/bin/env node
/**
 * Point lib/i18n/index.ts at every dictionary that exists.
 *
 * A language with no file yet falls back to English, so the site always
 * builds; as each translation lands, running this serves it.
 */

import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "lib", "i18n");
const LOCALES = ["en", "es", "ru", "pt-BR", "zh-Hans", "fr", "de", "ko", "ar", "id", "uk", "it", "tr", "fa", "vi"];

/** `pt-BR` is not an identifier; its file exports `ptBR`. */
const ident = (code) => code.replace(/-(\w)/g, (_, c) => c.toUpperCase());
const key = (code) => (/^[a-z]+$/.test(code) ? code : `"${code}"`);

const have = LOCALES.filter((code) => fs.existsSync(path.join(DIR, "dict", `${code}.ts`)));

const body = `import type { Dict } from "./dict/types";
${have.map((c) => `import { ${ident(c)} } from "./dict/${c}";`).join("\n")}
import { DEFAULT_LOCALE, type Locale } from "./locales";

/**
 * Every language's words, loaded eagerly: the pages are static, so there is
 * nothing to wait for, and a missing one is a build error rather than a
 * blank page. A language still being translated reads in English.
 */
const DICTS: Record<Locale, Dict> = {
${LOCALES.map((c) => `  ${key(c)}: ${have.includes(c) ? ident(c) : "en"},`).join("\n")}
};

export function dictOf(locale: Locale): Dict {
  return DICTS[locale] ?? DICTS[DEFAULT_LOCALE];
}

export type { Dict };
`;

fs.writeFileSync(path.join(DIR, "index.ts"), body);
console.log(`✓ serving ${have.length} of ${LOCALES.length}: ${have.join(", ")}`);
