import Image from "next/image";

export function BrandIllustration({
  src,
  alt,
  priority = false,
  framed = true,
  className = "",
  imageClassName = "",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  framed?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div
      className={[
        "relative",
        framed
          ? "overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm"
          : "overflow-hidden bg-transparent",
        className,
      ].join(" ")}
    >
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={800}
        unoptimized
        className={[imageClassName || "h-full w-full object-cover"].join(" ")}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}
