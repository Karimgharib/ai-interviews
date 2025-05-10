import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**", // Optional, allow any path
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**", // Optional, allow any path
      },
    ],
  },
};

export default nextConfig;
