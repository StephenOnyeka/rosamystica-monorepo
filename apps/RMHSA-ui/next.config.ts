import type { NextConfig } from "next";

const backendUrl =
  process.env.API_URL || "https://rosamystica-monorepo.onrender.com";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
