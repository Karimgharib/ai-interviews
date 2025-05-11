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
  webpack(config, { isServer }) {
    if (!isServer) {
      // Prevents 'child_process' from being bundled on the client-side
      config.node = {
        ...config.node,
        child_process: "empty",
      };
    }
    return config;
  },
};

export default nextConfig;
