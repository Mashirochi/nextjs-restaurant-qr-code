import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("src/lib/i18n/request.ts");

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

export default withNextIntl(nextConfig);
