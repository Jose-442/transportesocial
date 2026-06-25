"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function Main({ children }: { children: ReactNode }) {
  const isHome = usePathname() === "/";

  return (
    <main
      className={[
        "mx-auto w-full flex-1",
        isHome
          ? "max-w-none bg-emerald-100 px-0 py-0 pb-24 md:pb-16"
          : "min-h-[calc(100dvh-7rem)] max-w-lg px-4 py-4 pb-24 md:max-w-2xl md:pb-16 lg:max-w-4xl",
      ].join(" ")}
    >
      {children}
    </main>
  );
}
