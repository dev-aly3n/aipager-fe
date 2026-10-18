"use client";

import { createContext, useContext } from "react";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";

/**
 * Which language the demo is being read in, for the few places deep in the
 * chat that have to write a number the way aipager would write it.
 */
const Ctx = createContext<Locale>(DEFAULT_LOCALE);

export const LocaleProvider = Ctx.Provider;

export function useLocale(): Locale {
  return useContext(Ctx);
}
