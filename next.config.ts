import type { NextConfig } from "next";
import webpack from "webpack";

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
  webpack(config) {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/.*/, (resource: { request: string }) => {
        resource.request = resource.request.replace(/C:\\Inetpub/gi, "C:\\inetpub");
      })
    );
    return config;
  },
};

export default nextConfig;
