/** Texto que el conductor acepta al publicar un viaje. */

export type FragmentoDeclaracion = {
  texto: string;
  negrita?: boolean;
};

export const DECLARACION_CONDUCTOR: FragmentoDeclaracion[][] = [
  [
    {
      texto:
        "Confirmo que es un viaje personal (",
    },
    { texto: "no por encargo", negrita: true },
    {
      texto:
        ") y que haría igualmente sin reservas en Transporte Social, y que el importe solo cubre gastos compartidos.",
    },
  ],
];

export const MENSAJE_DECLARACION_CONDUCTOR =
  "Tienes que aceptar la declaración del conductor.";

export function declaracionConductorAceptada(
  valor: FormDataEntryValue | null
): boolean {
  const marca = String(valor ?? "");
  return marca === "1" || marca === "on";
}
