import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: Do _not_ add this if you actually want lint-pageing 
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: You’ll be shipping code with potential type bugs
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
