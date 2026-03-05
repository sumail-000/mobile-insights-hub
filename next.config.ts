import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  output: "standalone",
  serverExternalPackages: ["mysql2", "mysql2/promise", "seq-queue", "iconv-lite", "denque", "lru-cache", "long", "cardinal", "readable-stream"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "fdn2.gsmarena.com" },
      { protocol: "https", hostname: "fdn.gsmarena.com" },
      { protocol: "https", hostname: "cdn.simpleicons.org" },
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
  },
};

export default nextConfig;
