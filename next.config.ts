import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
