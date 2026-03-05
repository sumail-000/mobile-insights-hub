import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  serverExternalPackages: ["mysql2", "mysql2/promise", "seq-queue", "iconv-lite", "denque", "lru-cache", "long", "cardinal", "readable-stream"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "fdn2.gsmarena.com" },
      { protocol: "https", hostname: "fdn.gsmarena.com" },
      { protocol: "https", hostname: "cdn.simpleicons.org" },
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
  },
  webpack(config, { isServer }) {
    const reactPath = path.resolve(process.cwd().toLowerCase(), "node_modules/react");
    const reactDomPath = path.resolve(process.cwd().toLowerCase(), "node_modules/react-dom");
    config.resolve.alias = {
      ...config.resolve.alias,
      react: reactPath,
      "react-dom": reactDomPath,
    };
    return config;
  },
};

export default nextConfig;
