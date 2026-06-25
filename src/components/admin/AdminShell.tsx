"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV: { href: string; label: string; exact?: boolean }[] = [
  { href: "/admin", label: "Inicio", exact: true },
  { href: "/admin/disputas", label: "Disputas" },
  { href: "/admin/reservas", label: "Reservas" },
  { href: "/admin/anuncios", label: "Anuncios" },
  { href: "/admin/usuarios", label: "Usuarios" },
  { href: "/admin/pagos", label: "Pagos" },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-6xl space-y-4 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Panel de administración
          </p>
          {title ? (
            <h1 className="text-2xl font-bold text-zinc-900">{title}</h1>
          ) : null}
        </div>
        <Link
          href="/cuenta"
          className="text-sm font-semibold text-zinc-600 hover:text-zinc-900"
        >
          ← Mi cuenta
        </Link>
      </div>

      <nav className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-emerald-700 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
