import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Observer bots were removed in aipager 1.2; the page they had is gone.
  async redirects() {
    return [{ source: "/docs/observers", destination: "/docs/groups#roles", permanent: true }];
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
