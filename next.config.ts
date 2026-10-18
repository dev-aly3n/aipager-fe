import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Observer bots were removed in aipager 1.2; the page they had is gone.
  async redirects() {
    return [
      { source: "/docs/observers", destination: "/en/docs/groups#roles", permanent: true },
      // Every page lives under its language. The old English paths keep
      // working, and the bare root goes to English for now (a visitor who
      // picks another language is remembered by the switcher).
      { source: "/docs", destination: "/en/docs", permanent: true },
      { source: "/docs/:slug", destination: "/en/docs/:slug", permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/install",
        destination:
          "https://raw.githubusercontent.com/dev-aly3n/aipager/main/install.sh",
      },
    ];
  },
};

export default nextConfig;
