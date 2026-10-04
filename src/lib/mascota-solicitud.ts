/** Mascota en la solicitud de quien necesita el viaje. */

export const MASCOTAS_SOLICITUD = ["no", "pequena", "grande"] as const;

export type MascotaSolicitud = (typeof MASCOTAS_SOLICITUD)[number];

export const MASCOTA_SOLICITUD_OPTIONS: {
  value: MascotaSolicitud;
  label: string;
}[] = [
  { value: "no", label: "No lleva mascota" },
  {
    value: "pequena",
    label: "Sí, pequeña. Va con el dueño en el regazo.",
  },
  {
    value: "grande",
    label: "Sí, grande. Necesita su propio espacio.",
  },
];

export function isMascotaSolicitud(value: string): value is MascotaSolicitud {
  return (MASCOTAS_SOLICITUD as readonly string[]).includes(value);
}

/** Texto visible en el anuncio. Null si no viaja mascota o el anuncio es antiguo. */
export function textoMascotaSolicitud(
  mascota: string | null | undefined,
  detalle: string | null | undefined
): string | null {
  const nombre = (detalle ?? "").trim();
  if (mascota === "pequena") {
    return nombre
      ? `Pequeña, va con el dueño en el regazo. ${nombre}.`
      : "Pequeña, va con el dueño en el regazo.";
  }
  if (mascota === "grande") {
    return nombre
      ? `Grande, necesita su propio espacio. ${nombre}.`
      : "Grande, necesita su propio espacio.";
  }
  return null;
}
