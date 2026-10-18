import type { MetadataRoute } from "next";
import { listSlugs } from "@/lib/docs";
import { LOCALES } from "@/lib/i18n/locales";

const SITE = "https://aipager.run";

/**
 * Every page in every language, each one pointing at its own translations so
 * a search engine offers a reader the language they read in.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/docs", ...listSlugs().map((slug) => `/docs/${slug}`)];
  return LOCALES.flatMap((locale) =>
    paths.map((path) => ({
      url: `${SITE}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE}/${l}${path}`])),
      },
    })),
  );
}
