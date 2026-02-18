import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  transpilePackages: ["next-mdx-remote"],
  experimental: {
    imgOptTimeoutInSeconds: 30,
    imgOptConcurrency: 2,
  },
  images: {
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "f003.backblazeb2.com",
        pathname: "/file/diversnotes-images/**",
      },
      {
        protocol: "https",
        hostname: "diversnotes-images.s3.eu-central-003.backblazeb2.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
