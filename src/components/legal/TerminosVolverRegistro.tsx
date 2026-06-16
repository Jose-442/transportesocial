"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TERMINOS_VOLVER_REGISTRO_KEY } from "@/lib/terminos-volver-registro";

export function TerminosVolverRegistro() {
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(TERMINOS_VOLVER_REGISTRO_KEY);
    if (stored) setHref(stored);
  }, []);

  if (!href) return null;

  return (
    <Link
      href={href}
      className="hidden h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 lg:inline-flex"
    >
      <span aria-hidden="true">←</span>
      VOLVER
    </Link>
  );
}
