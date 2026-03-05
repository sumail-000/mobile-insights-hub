import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
