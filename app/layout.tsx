import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${serif.variable}`}
    >
      <body className="min-h-dvh bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
