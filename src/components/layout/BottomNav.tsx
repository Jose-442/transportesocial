"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavItem = {
  href: string;
  label: ReactNode;
};

const items: NavItem[] = [
  { href: "/", label: "Inicio" },
  { href: "/rutas", label: "Viajes propuestos por conductores" },
  {
    href: "/bultos",
    label: (
      <>
        Propuestas de personas que necesitan
        <br />
        enviar bulto
      </>
    ),
  },
  { href: "/cuenta", label: "Cuenta" },
];

const mobileItems = items.filter(
  (item) => item.href === "/" || item.href === "/cuenta"
);

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function NavLink({
  href,
  label,
  active,
  className,
}: {
  href: string;
  label: ReactNode;
  active: boolean;
  className: string;
}) {
  return (
    <Link
      href={href}
      className={[
        "flex w-full flex-col items-center justify-center gap-0.5 text-center font-semibold leading-tight",
        active ? "text-emerald-700" : "text-zinc-500",
        className,
      ].join(" ")}
    >
      <span
        className={[
          "rounded-full",
          active ? "bg-emerald-600" : "bg-transparent",
        ].join(" ")}
      />
      {label}
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white pb-[env(safe-area-inset-bottom)] md:pb-0">
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-1 py-2 md:hidden">
        {mobileItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            active={isActive(pathname, item.href)}
            className="min-h-16 px-2 text-lg [&>span:first-child]:h-2 [&>span:first-child]:w-2"
          />
        ))}
      </div>

      <div className="hidden w-full grid-cols-4 md:grid">
        {items.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            active={isActive(pathname, item.href)}
            className="min-h-[3.75rem] border-r border-zinc-100 px-2 py-1 text-base last:border-r-0 lg:min-h-16 lg:text-lg [&>span:first-child]:h-1.5 [&>span:first-child]:w-1.5"
          />
        ))}
      </div>
    </nav>
  );
}
