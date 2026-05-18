import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "aipager — Telegram remote-control for Claude Code",
  description:
    "Mirror Claude Code sessions to Telegram. See status, reply to inject prompts, approve permissions — all from your phone.",
  openGraph: {
    title: "aipager — Telegram remote-control for Claude Code",
    description:
      "Mirror Claude Code sessions to Telegram. See status, reply to inject prompts, approve permissions — all from your phone.",
    url: "https://aipager.run",
    siteName: "aipager",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "aipager — Telegram remote-control for Claude Code",
    description:
      "Mirror Claude Code sessions to Telegram. See status, reply to inject prompts, approve permissions — all from your phone.",
  },
  metadataBase: new URL("https://aipager.run"),
};

const themeScript = `
(function(){
  var t = localStorage.getItem('theme');
  if (t === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
