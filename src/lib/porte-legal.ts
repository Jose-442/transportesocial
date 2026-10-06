/** Textos y opciones legales del porte (entrega a pie de vehículo). */

export const TEXTO_DECLARACION_PORTE =
  "Declaro ser el propietario o estar autorizado para el traslado de estos bienes, que no son de procedencia ilícita ni contienen productos prohibidos (drogas, armas, dinero en efectivo o mercancías peligrosas), y que las fotos y descripción reflejan fielmente la carga. Autorizo al conductor a inspeccionar el contenido de paquetes o bultos cerrados previa carga, y acepto que el servicio contratado se presta a pie de vehículo.";

export type TipoCarga = "voluminoso" | "paquete";

export const TIPO_CARGA_OPTIONS: { value: TipoCarga; label: string }[] = [
  {
    value: "voluminoso",
    label: "Objetos sin embalar",
  },
  {
    value: "paquete",
    label: "Objetos embalados o cerrados",
  },
];

export function isTipoCarga(v: string): v is TipoCarga {
  return v === "voluminoso" || v === "paquete";
}
