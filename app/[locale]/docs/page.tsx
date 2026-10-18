import { notFound } from "next/navigation";
import { DocsPage } from "@/components/docs-page";
import { getIndex } from "@/lib/docs";
import { dictOf } from "@/lib/i18n";
import { isLocale, LOCALES, type Locale } from "@/lib/i18n/locales";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = dictOf(locale).docs;
  return {
    title: `${t.title} · aipager`,
    description: t.description,
    alternates: { canonical: `/${locale}/docs`, languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/docs`])) },
  };
}

export default async function DocsIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const t = dictOf(locale);
  return <DocsPage doc={getIndex(locale, t.docs)} locale={locale} t={t} />;
}
