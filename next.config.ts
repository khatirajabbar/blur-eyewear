import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image URLs include an asset version when artwork is replaced in place.
  // Allow that local query string through Next's image optimizer.
  images: {
    localPatterns: [{ pathname: "/**" }],
  },
};

export default nextConfig;
