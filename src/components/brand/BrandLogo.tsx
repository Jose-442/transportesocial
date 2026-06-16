import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { BRAND } from "@/lib/brand";

type Size = "sm" | "md" | "lg" | "xl" | "hero";

const sizes: Record<Size, { img: number; text: string }> = {
  sm: { img: 40, text: "text-base" },
  md: { img: 56, text: "text-lg" },
  lg: { img: 72, text: "text-2xl" },
  xl: { img: 96, text: "text-2xl" },
  hero: { img: 384, text: "text-2xl" },
};

function LogoContent({
  img,
  text,
  showText,
  size,
  onDark,
  plain,
  className = "",
}: {
  img: number;
  text: string;
  showText: boolean;
  size: Size;
  onDark?: boolean;
  plain?: boolean;
  className?: string;
}) {
  return (
    <>
      <Image
        src={BRAND.logo}
        alt={`Logo ${APP_NAME}`}
        width={img}
        height={img}
        className={[
          plain
            ? "h-auto w-full object-contain"
            : "rounded-full object-cover shadow-sm",
          className,
        ].join(" ")}
        priority={size === "lg" || size === "hero"}
      />
      {showText && (
        <span
          className={[
            `font-bold ${text}`,
            onDark ? "text-white" : "text-emerald-900",
          ].join(" ")}
        >
          {APP_NAME}
        </span>
      )}
    </>
  );
}

export function BrandLogo({
  size = "sm",
  showText = true,
  linked = true,
  onDark = false,
  plain = false,
  className = "",
}: {
  size?: Size;
  showText?: boolean;
  linked?: boolean;
  onDark?: boolean;
  plain?: boolean;
  className?: string;
}) {
  const { img, text } = sizes[size];
  const wrapClass = [
    "inline-flex items-center gap-2",
    size === "hero" ? "" : "min-h-11 rounded-xl pr-1",
    className,
  ].join(" ");

  if (!linked) {
    return (
      <span className={wrapClass}>
        <LogoContent
          img={img}
          text={text}
          showText={showText}
          size={size}
          onDark={onDark}
          plain={plain}
        />
      </span>
    );
  }

  return (
    <Link href="/" className={`${wrapClass} hover:opacity-90`}>
      <LogoContent
        img={img}
        text={text}
        showText={showText}
        size={size}
        onDark={onDark}
        plain={plain}
      />
    </Link>
  );
}
