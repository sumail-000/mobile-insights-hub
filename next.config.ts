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
    config.resolve.alias = {
      ...config.resolve.alias,
      react: require.resolve("react"),
      "react-dom": require.resolve("react-dom"),
      "react-dom/server": require.resolve("react-dom/server"),
    };
    return config;
  },
};

export default nextConfig;
