/** Texto que el conductor acepta al publicar un viaje. */

export const DECLARACION_CONDUCTOR = [
  "Confirmo que realizaría este desplazamiento igualmente aunque no recibiera ninguna reserva a través de Transporte Social.",
  "Declaro asimismo que el viaje responde a una necesidad propia, que no es para transportar personas o mercancías por encargo y que las cantidades recibidas se destinan exclusivamente a compartir los gastos admisibles del trayecto.",
] as const;

export const MENSAJE_DECLARACION_CONDUCTOR =
  "Tienes que aceptar la declaración del conductor.";

export function declaracionConductorAceptada(
  valor: FormDataEntryValue | null
): boolean {
  const marca = String(valor ?? "");
  return marca === "1" || marca === "on";
}
