import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Geist, Geist_Mono, Instrument_Serif, Noto_Sans_Arabic, Noto_Sans_KR, Noto_Sans_SC, Vazirmatn } from "next/font/google";
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

/*
 * A typeface for each script Geist does not draw. None is preloaded: each is
 * declared with its characters' range, so a browser fetches it only when
 * text in that script is on screen, which on most visits is never. The font
 * stacks in globals.css reach them through --font-script (and Vietnamese,
 * whose letters Geist lacks, through --font-lead), set per language there.
 */
const vazirmatn = Vazirmatn({ variable: "--font-vazirmatn", subsets: ["arabic"], preload: false, display: "swap" });
const notoArabic = Noto_Sans_Arabic({ variable: "--font-noto-arabic", subsets: ["arabic"], preload: false, display: "swap" });
const notoKr = Noto_Sans_KR({ variable: "--font-noto-kr", preload: false, display: "swap" });
const notoSc = Noto_Sans_SC({ variable: "--font-noto-sc", preload: false, display: "swap" });
const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  weight: ["400", "500", "600", "700"],
  subsets: ["vietnamese", "latin", "latin-ext"],
  preload: false,
  display: "swap",
});
const scripts = [vazirmatn, notoArabic, notoKr, notoSc, beVietnam].map((f) => f.variable).join(" ");

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
      className={`dark ${geistSans.variable} ${geistMono.variable} ${serif.variable} ${scripts}`}
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
