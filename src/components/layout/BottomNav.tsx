"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Inicio" },
  { href: "/rutas", label: "Viajes propuestos por conductores" },
  { href: "/bultos", label: "Propuestas de personas que necesitan enviar bulto" },
  { href: "/cuenta", label: "Cuenta" },
] as const;

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
  label: string;
  active: boolean;
  className: string;
}) {
  return (
    <Link
      href={href}
      className={[
        "flex flex-col items-center justify-center gap-1 text-center font-semibold leading-tight",
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white pb-[env(safe-area-inset-bottom)]">
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

      <div className="mx-auto hidden max-w-6xl grid-cols-4 gap-2 px-6 py-4 md:grid lg:px-10">
        {items.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            active={isActive(pathname, item.href)}
            className="min-h-24 rounded-2xl px-3 text-lg lg:min-h-28 lg:text-xl [&>span:first-child]:h-2.5 [&>span:first-child]:w-2.5"
          />
        ))}
      </div>
    </nav>
  );
}
