"use client";

import { useEffect } from "react";

/** Al abrir una URL con #ancla, baja hasta ese bloque (cabecera fija). */
export function ScrollToHash() {
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const ir = () => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    ir();
    const t = window.setTimeout(ir, 150);
    return () => window.clearTimeout(t);
  }, []);

  return null;
}
