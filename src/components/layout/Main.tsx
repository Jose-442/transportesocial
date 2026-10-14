"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export function Main({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    if (window.location.hash) return;
    const subir = () => {
      if (window.location.hash) return;
      window.scrollTo(0, 0);
    };
    subir();
    const frame = requestAnimationFrame(subir);
    const despues = window.setTimeout(subir, 0);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(despues);
    };
  }, [pathname]);

  return (
    <main
      className={[
        "mx-auto w-full flex-1",
        isHome
          ? "max-w-none bg-emerald-100 px-0 py-0 pb-28 md:pb-36"
          : "min-h-[calc(100dvh-7rem)] max-w-lg px-4 py-4 pb-36 md:max-w-2xl md:pb-52 lg:max-w-4xl",
      ].join(" ")}
    >
      {children}
    </main>
  );
}
