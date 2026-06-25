"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Inicio" },
  { href: "/rutas", label: "Viajes propuestos por conductores" },
  { href: "/bultos", label: "Propuestas de personas que necesitan enviar bulto" },
  { href: "/cuenta", label: "Cuenta" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto grid max-w-lg grid-cols-4 gap-1 py-1 md:max-w-2xl lg:max-w-4xl">
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-center text-[10px] font-semibold leading-tight sm:text-xs",
                active ? "text-emerald-700" : "text-zinc-500",
              ].join(" ")}
            >
              <span
                className={[
                  "h-1.5 w-1.5 rounded-full",
                  active ? "bg-emerald-600" : "bg-transparent",
                ].join(" ")}
              />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
