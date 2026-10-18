import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Noto_Sans_KR, Noto_Sans_SC } from "next/font/google";
import { notFound } from "next/navigation";
import { dirOf, isLocale, LOCALES } from "@/lib/i18n/locales";
import { LAYOUT_SCRIPT } from "@/lib/layout";
import { OG_IMAGES, TWITTER_IMAGES } from "@/lib/share";
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

/*
 * A typeface for each script Geist does not draw. Korean and Chinese come
 * from next/font, never preloaded: each is declared with its characters'
 * range, so a browser fetches it only when that script is on screen. They
 * come in many small pieces, which cannot be preloaded, so they are
 * "optional": used when already in hand at the first paint (from the second
 * visit on), and otherwise the device's own Korean or Chinese face stays
 * for that visit, so nothing ever swaps and reflows under the reader. Persian, Arabic and Vietnamese are served from public/fonts
 * (globals.css), each page preloading only its own (PRELOAD below). The
 * font stacks reach them through --font-script (and Vietnamese, whose
 * letters Geist lacks, through --font-lead), set per language there.
 */
const notoKr = Noto_Sans_KR({ variable: "--font-noto-kr", preload: false, display: "optional" });
const notoSc = Noto_Sans_SC({ variable: "--font-noto-sc", preload: false, display: "optional" });
const scripts = [notoKr, notoSc].map((f) => f.variable).join(" ");

/** The font files a language's own page needs before its first paint. */
const PRELOAD: Partial<Record<string, string[]>> = {
  fa: ["/fonts/vazirmatn-arabic-100-900.woff2"],
  ar: ["/fonts/noto-sans-arabic-arabic-100-900.woff2"],
  vi: [
    "/fonts/be-vietnam-pro-latin-400.woff2",
    "/fonts/be-vietnam-pro-vietnamese-400.woff2",
    "/fonts/be-vietnam-pro-latin-600.woff2",
    "/fonts/be-vietnam-pro-vietnamese-600.woff2",
  ],
};

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
    images: OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    images: TWITTER_IMAGES,
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
      className={`dark ${geistSans.variable} ${geistMono.variable} ${serif.variable} ${scripts}`}
      // the layout script writes data-layout before React hydrates
      suppressHydrationWarning
    >
      <head>
        {/* which version of the page this screen gets, decided before the first paint */}
        <script dangerouslySetInnerHTML={{ __html: LAYOUT_SCRIPT }} />
        {/* the site's own emoji (14 KB), in hand before the first paint, so
            the mode switch and the chats never re-flow when it swaps in */}
        <link rel="preload" href="/fonts/emoji.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {(PRELOAD[locale] ?? []).map((href) => (
          <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}
      </head>
      <body className="min-h-dvh bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
