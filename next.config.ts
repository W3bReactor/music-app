import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yavuzceliker.github.io",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
