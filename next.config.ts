import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "c.dns-shop.ru",
      },
      {
        protocol: "https",
        hostname: "**.dns-shop.ru",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
