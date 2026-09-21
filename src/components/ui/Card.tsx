import Link from "next/link";
import { type ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const paddingPropio = /(^|\s)(p|px|py|pt|pb|ps|pe)-/.test(className);
  return (
    <div
      className={[
        "rounded-2xl border border-zinc-200 bg-white shadow-sm",
        paddingPropio ? "" : "p-4",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function CardLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={[
        "block rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50/40 active:bg-emerald-50",
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
