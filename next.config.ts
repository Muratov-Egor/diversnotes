import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["next-mdx-remote"],

  async redirects() {
    return [
      // /ru → главная
      {
        source: "/ru",
        destination: "/",
        permanent: true,
      },
      // /ru/blog → /blog
      {
        source: "/ru/blog",
        destination: "/blog",
        permanent: true,
      },
      // /ru/blog/[slug] → /blog/[slug]
      {
        source: "/ru/blog/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
      // /ru/marine-life → /marine-life
      {
        source: "/ru/marine-life",
        destination: "/marine-life",
        permanent: true,
      },
      // /ru/marine-life/[slug] → /marine-life/[slug]
      {
        source: "/ru/marine-life/:slug",
        destination: "/marine-life/:slug",
        permanent: true,
      },
      // /en/* — не редиректим, пусть отдаёт 404.
      // Английская версия будет добавлена позже.
    ];
  },
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
