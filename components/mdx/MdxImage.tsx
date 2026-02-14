import Image from "next/image";

const BACKBLAZE_HOSTS = [
  "f003.backblazeb2.com",
  "diversnotes-images.s3.eu-central-003.backblazeb2.com",
];

function isBackblazeUrl(src: string): boolean {
  try {
    const u = new URL(src);
    return BACKBLAZE_HOSTS.some((h) => u.hostname === h);
  } catch {
    return false;
  }
}

type Props = React.ComponentPropsWithoutRef<"img">;

/**
 * Картинки из Markdown. Для URL Backblaze используем next/image,
 * чтобы Next.js проксировал и кешировал — меньше запросов к B2.
 */
export function MdxImage({ src, alt, title, className, ...rest }: Props) {
  const srcStr = typeof src === "string" ? src : "";
  if (!srcStr) return null;

  const roundedClass = "rounded-3xl";

  if (isBackblazeUrl(srcStr)) {
    return (
      <span className="my-4 block">
        <Image
          src={srcStr}
          alt={alt ?? ""}
          width={800}
          height={600}
          className={`w-full h-auto ${roundedClass} ${className ?? ""}`.trim()}
          sizes="(max-width: 768px) 100vw, 720px"
          title={title}
        />
      </span>
    );
  }

  return (
    <span className="my-4 block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={srcStr}
        alt={alt ?? ""}
        title={title}
        className={`w-full ${roundedClass} ${className ?? ""}`.trim()}
        {...rest}
      />
    </span>
  );
}
