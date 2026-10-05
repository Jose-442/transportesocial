import {
  coordenadasMunicipio,
  resolverMunicipio,
} from "@/lib/municipios-espana";

export type CoordenadasGuardadas = {
  origen_lat: number | null;
  origen_lng: number | null;
  destino_lat: number | null;
  destino_lng: number | null;
};

/** Centro del municipio. Si no hay punto en el catálogo, se deja vacío. */
export function coordenadasDeEtiqueta(
  etiqueta: string
): { lat: number; lng: number } | null {
  const municipio = resolverMunicipio(etiqueta, { incluirFrontera: true });
  if (!municipio) return null;
  return coordenadasMunicipio(municipio);
}

export function columnasCoordenadas(
  origen: string,
  destino: string
): CoordenadasGuardadas {
  const salida = coordenadasDeEtiqueta(origen);
  const llegada = coordenadasDeEtiqueta(destino);
  return {
    origen_lat: salida?.lat ?? null,
    origen_lng: salida?.lng ?? null,
    destino_lat: llegada?.lat ?? null,
    destino_lng: llegada?.lng ?? null,
  };
}

/**
 * Datos de la reserva que sí podemos saber al crearla.
 * pasajeroIds solo incluye a quien reserva, y solo si hay plazas.
 */
export function datosCaeAlCrearReserva(input: {
  origen: string;
  destino: string;
  clienteId: string;
  numPasajeros: number;
}) {
  const pasajeros = Math.max(0, Math.floor(input.numPasajeros));
  return {
    ...columnasCoordenadas(input.origen, input.destino),
    num_pasajeros: pasajeros,
    pasajero_ids: pasajeros >= 1 ? [input.clienteId] : null,
  };
}
