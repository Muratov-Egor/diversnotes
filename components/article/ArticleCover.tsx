import { ImageWithRetry } from "@/components/ImageWithRetry";

type Props = { src: string; alt?: string };

export function ArticleCover({ src, alt = "" }: Props) {
  return (
    <div className="mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
      <div className="relative aspect-[16/10] sm:aspect-[2/1] w-full overflow-hidden rounded-3xl bg-neutral-100 dark:bg-neutral-800">
        <ImageWithRetry
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 896px"
          priority
        />
      </div>
    </div>
  );
}
