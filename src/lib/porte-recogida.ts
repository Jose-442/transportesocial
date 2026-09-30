/** Motivos de rechazo en la recogida (inspección en el punto de carga). */

export const TITULO_ALERTA_RECHAZO_RECOGIDA =
  "Alerta de seguridad: rechazo en recogida";

export const MOTIVOS_RECHAZO_RECOGIDA = [
  {
    value: "no_coincide",
    label: "La carga no coincide con las fotos o descripción",
  },
  {
    value: "no_cabe",
    label: "No cabe en el vehículo / dimensiones no reales",
  },
  {
    value: "no_revisar",
    label: "El emisor no permite revisar el paquete cerrado",
  },
  {
    value: "sospecha_ilicita",
    label: "Sospecha de contenido o procedencia ilícita",
  },
] as const;

export type MotivoRechazoRecogida =
  (typeof MOTIVOS_RECHAZO_RECOGIDA)[number]["value"];

export function isMotivoRechazoRecogida(
  v: string
): v is MotivoRechazoRecogida {
  return MOTIVOS_RECHAZO_RECOGIDA.some((m) => m.value === v);
}

export function labelMotivoRechazoRecogida(
  value: MotivoRechazoRecogida
): string {
  return (
    MOTIVOS_RECHAZO_RECOGIDA.find((m) => m.value === value)?.label ?? value
  );
}

export function motivoCancelacionDesdeRecogida(
  value: MotivoRechazoRecogida
): string {
  return `Rechazo en recogida: ${labelMotivoRechazoRecogida(value)}`;
}
