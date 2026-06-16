import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800",
  secondary:
    "bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50",
  ghost: "bg-transparent text-emerald-800 hover:bg-emerald-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  fullWidth?: boolean;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  fullWidth,
  className = "",
  children,
  ...props
}: Props) {
  return (
    <button
      className={[
        "inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50",
        variants[variant],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  fullWidth,
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl px-4 py-2.5 text-center text-sm font-semibold leading-snug whitespace-normal transition-colors",
        variants[variant],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
