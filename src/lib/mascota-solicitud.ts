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

export const TEXTO_DECLARACION_MASCOTA =
  "Declaro que me responsabilizo de la mascota durante el viaje: de su cuidado, de su sujeción y de la documentación exigida.";

export function isMascotaSolicitud(value: string): value is MascotaSolicitud {
  return (MASCOTAS_SOLICITUD as readonly string[]).includes(value);
}

/** En mascota grande, las preguntas hablan de mascota, no de bulto. */
export function textoMascotaEnVezDeBulto(
  texto: string,
  mascota: string | null | undefined
): string {
  if (mascota !== "grande") return texto;
  return texto
    .replace(/Bultos/g, "Mascotas")
    .replace(/bultos/g, "mascotas")
    .replace(/Bulto/g, "Mascota")
    .replace(/bulto/g, "mascota");
}

/** True si la descripción es solo el nombre que ya se enseña como mascota. */
export function descripcionRepiteMascota(
  mascota: string | null | undefined,
  detalle: string | null | undefined,
  descripcion: string | null | undefined
): boolean {
  if (mascota !== "grande" && mascota !== "pequena") return false;
  const nombre = (detalle ?? "").trim();
  const texto = (descripcion ?? "").trim();
  if (!nombre || !texto) return false;
  return nombre.toLocaleLowerCase("es") === texto.toLocaleLowerCase("es");
}

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
    return "Grande, necesita su propio espacio.";
  }
  return null;
}
