import { notFound } from "next/navigation";
import { DocsPage } from "@/components/docs-page";
import { getDoc, listSlugs } from "@/lib/docs";
import { dictOf } from "@/lib/i18n";
import { isLocale, LOCALES, type Locale } from "@/lib/i18n/locales";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => listSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  try {
    const doc = getDoc(slug, locale);
    return {
      title: `${doc.title} · ${dictOf(locale).docs.title}`,
      description: doc.description,
      alternates: { canonical: `/${locale}/docs/${slug}`, languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/docs/${slug}`])) },
    };
  } catch {
    return {};
  }
}

export default async function DocPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  let doc;
  try {
    doc = getDoc(slug, locale);
  } catch {
    notFound();
  }
  return <DocsPage doc={doc} locale={locale} t={dictOf(locale)} />;
}
