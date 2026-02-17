import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["next-mdx-remote"],
  experimental: {
    /** Увеличиваем таймаут оптимизации изображений с 7 до 30 секунд,
     * чтобы избежать таймаутов при загрузке больших изображений с Backblaze B2. */
    imgOptTimeoutInSeconds: 30,
    /** Ограничиваем параллельную обработку изображений для стабильности. */
    imgOptConcurrency: 2,
  },
  images: {
    /** Кеш оптимизированных картинок: сервер реже ходит в B2, браузер дольше хранит (меньше запросов). */
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 дней
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

export default nextConfig;
