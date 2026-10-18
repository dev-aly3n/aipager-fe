import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { notFound } from "next/navigation";
import { dirOf, isLocale, LOCALES } from "@/lib/i18n/locales";
import { LAYOUT_SCRIPT } from "@/lib/layout";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "aipager: Claude Code, paging you",
  description:
    "aipager runs your Claude Code sessions in a detached terminal and mirrors them to Telegram: watch them work, approve what they ask, send the next prompt. It runs on your machine.",
  openGraph: {
    title: "aipager: Claude Code, paging you",
    description:
      "aipager runs your Claude Code sessions in a detached terminal and mirrors them to Telegram: watch them work, approve what they ask, send the next prompt. It runs on your machine.",
    url: "https://aipager.run",
    siteName: "aipager",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "aipager: Claude Code, paging you",
    description:
      "aipager runs your Claude Code sessions in a detached terminal and mirrors them to Telegram: watch them work, approve what they ask, send the next prompt. It runs on your machine.",
  },
  metadataBase: new URL("https://aipager.run"),
};

// Explicit rather than relying on Next's default, and `maximumScale` is left
// unset on purpose so the page stays pinch-zoomable.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

/** One static page per language, at build time. */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      className={`dark ${geistSans.variable} ${geistMono.variable} ${serif.variable}`}
      // the layout script writes data-layout before React hydrates
      suppressHydrationWarning
    >
      <head>
        {/* which version of the page this screen gets, decided before the first paint */}
        <script dangerouslySetInnerHTML={{ __html: LAYOUT_SCRIPT }} />
      </head>
      <body className="min-h-dvh bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
