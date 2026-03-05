import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "fdn2.gsmarena.com" },
      { protocol: "https", hostname: "fdn.gsmarena.com" },
      { protocol: "https", hostname: "cdn.simpleicons.org" },
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
  },
  webpack(config) {
    config.resolve.symlinks = false;
    config.resolve.caseSensitive = false;
    config.snapshot = {
      ...(config.snapshot || {}),
      managedPaths: [],
    };
    return config;
  },
};

export default nextConfig;
