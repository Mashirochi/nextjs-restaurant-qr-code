import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    dangerouslyAllowLocalIP: true,
    qualities: [100, 75],

    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.betheo.id.vn",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
