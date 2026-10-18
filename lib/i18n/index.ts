import type { Dict } from "./dict/types";
import { en } from "./dict/en";
import { es } from "./dict/es";
import { ru } from "./dict/ru";
import { ptBR } from "./dict/pt-BR";
import { zhHans } from "./dict/zh-Hans";
import { fr } from "./dict/fr";
import { de } from "./dict/de";
import { ko } from "./dict/ko";
import { ar } from "./dict/ar";
import { id } from "./dict/id";
import { uk } from "./dict/uk";
import { it } from "./dict/it";
import { tr } from "./dict/tr";
import { fa } from "./dict/fa";
import { vi } from "./dict/vi";
import { DEFAULT_LOCALE, type Locale } from "./locales";

/**
 * Every language's words, loaded eagerly: the pages are static, so there is
 * nothing to wait for, and a missing one is a build error rather than a
 * blank page. A language still being translated reads in English.
 */
const DICTS: Record<Locale, Dict> = {
  en: en,
  es: es,
  ru: ru,
  "pt-BR": ptBR,
  "zh-Hans": zhHans,
  fr: fr,
  de: de,
  ko: ko,
  ar: ar,
  id: id,
  uk: uk,
  it: it,
  tr: tr,
  fa: fa,
  vi: vi,
};

export function dictOf(locale: Locale): Dict {
  return DICTS[locale] ?? DICTS[DEFAULT_LOCALE];
}

export type { Dict };
