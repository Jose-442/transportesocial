"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

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
  { href: "/cuenta", label: "Mi cuenta" },
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
        active ? "text-emerald-200" : "text-white",
        className,
      ].join(" ")}
    >
      <span
        className={[
          "rounded-full",
          active ? "bg-emerald-300" : "bg-transparent",
        ].join(" ")}
      />
      {label}
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const [separacion, setSeparacion] = useState(96);
  const [mostrarSubir, setMostrarSubir] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const medir = () => {
      let tope = nav.getBoundingClientRect().top;
      document.querySelectorAll(".ts-pwa-banner, .fixed.bottom-0").forEach((el) => {
        if (el === nav || el.classList.contains("ts-pwa-banner--out")) return;
        const rect = el.getBoundingClientRect();
        if (rect.height < 8 || rect.bottom < window.innerHeight * 0.5) return;
        tope = Math.min(tope, rect.top);
      });
      setSeparacion(Math.ceil(window.innerHeight - tope) + 12);
    };
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(nav);
    const mut = new MutationObserver(medir);
    mut.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
    window.addEventListener("resize", medir);
    return () => {
      obs.disconnect();
      mut.disconnect();
      window.removeEventListener("resize", medir);
    };
  }, []);

  useEffect(() => {
    const actualizar = () => setMostrarSubir(window.scrollY > 320);
    actualizar();
    window.addEventListener("scroll", actualizar, { passive: true });
    return () => window.removeEventListener("scroll", actualizar);
  }, [pathname]);

  return (
    <>
      {mostrarSubir ? (
        <button
          type="button"
          aria-label="Arriba"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ bottom: separacion }}
          className="fixed right-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg"
        >
          <span aria-hidden="true" className="text-xl leading-none">
            ↑
          </span>
        </button>
      ) : null}
      <nav
        ref={navRef}
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-emerald-800 bg-emerald-900 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(0,0,0,0.25)] md:pb-0"
      >
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
            className="relative min-h-0 border-r border-emerald-800 px-2 pt-2 pb-0.5 text-base last:border-r-0 [&>span:first-child]:absolute [&>span:first-child]:left-1/2 [&>span:first-child]:top-1 [&>span:first-child]:h-1.5 [&>span:first-child]:w-1.5 [&>span:first-child]:-translate-x-1/2"
          />
        ))}
      </div>
    </nav>
    </>
  );
}
