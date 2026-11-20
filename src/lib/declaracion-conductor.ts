/** Texto que el conductor acepta al publicar un viaje. */

export const DECLARACION_CONDUCTOR = [
  "Declaro que el desplazamiento que publico ha sido decidido y programado por mí con anterioridad a cualquier solicitud de un pasajero o emisor de un bulto. Confirmo que realizaría dicho desplazamiento igualmente aunque no recibiera ninguna reserva a través de Transporte Social.",
  "Declaro asimismo que el viaje responde a una necesidad o motivo propio, que no organizo el desplazamiento para transportar personas o mercancías por encargo y que las cantidades recibidas se destinan exclusivamente a compartir los gastos admisibles del trayecto, sin obtener beneficio económico por el transporte.",
] as const;

export const MENSAJE_DECLARACION_CONDUCTOR =
  "Tienes que aceptar la declaración del conductor.";

export function declaracionConductorAceptada(
  valor: FormDataEntryValue | null
): boolean {
  const marca = String(valor ?? "");
  return marca === "1" || marca === "on";
}
