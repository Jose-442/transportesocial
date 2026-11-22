/** Texto que el conductor acepta al publicar un viaje. */

export type FragmentoDeclaracion = {
  texto: string;
  negrita?: boolean;
};

export const DECLARACION_CONDUCTOR: FragmentoDeclaracion[][] = [
  [
    {
      texto:
        "Confirmo que realizaría este desplazamiento igualmente aunque no reciba ninguna reserva a través de Transporte Social.",
    },
  ],
  [
    {
      texto:
        "Declaro asimismo que el viaje responde a una necesidad propia, ",
    },
    { texto: "que no es por encargo", negrita: true },
    {
      texto:
        " y que las cantidades recibidas se destinan exclusivamente a compartir los gastos admisibles del trayecto.",
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
