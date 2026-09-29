"use client";

import { useEffect } from "react";

/** Al venir a rellenar el vehículo, deja «Mi vehículo» a la vista sin que el usuario busque. */
export function ScrollAVehiculo({ activo }: { activo: boolean }) {
  useEffect(() => {
    if (!activo) return;
    const el = document.getElementById("vehiculo");
    if (!el) return;
    // instant: que se vea al instante al llegar
    el.scrollIntoView({ behavior: "auto", block: "start" });
  }, [activo]);

  return null;
}
