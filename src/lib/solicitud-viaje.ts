export const TIPOS_SOLICITUD = [
  "solo_bulto",
  "bulto_1_pasajero",
  "bulto_2_pasajeros",
  "bulto_3_pasajeros",
  "solo_1_pasajero",
  "solo_2_pasajeros",
  "solo_3_pasajeros",
] as const;

export type TipoSolicitud = (typeof TIPOS_SOLICITUD)[number];

export const TIPO_SOLICITUD_LABELS: Record<TipoSolicitud, string> = {
  solo_bulto: "Solo para el bulto",
  bulto_1_pasajero: "Bulto + 1 pasajero",
  bulto_2_pasajeros: "Bulto + 2 pasajeros",
  bulto_3_pasajeros: "Bulto + 3 pasajeros",
  solo_1_pasajero: "1 pasajero sin bulto",
  solo_2_pasajeros: "2 pasajeros sin bulto",
  solo_3_pasajeros: "3 pasajeros sin bulto",
};

export type OfertaDesglose = {
  precio_neto_bulto: number | null;
  precio_neto_plaza: number | null;
  /** Plazas de pasajero incluidas en el precio (ofrecidas por el conductor). */
  num_plazas: number;
  plazas_solicitadas: number;
  plazas_ofrecidas: number;
  precio_total_bulto: number | null;
  precio_total_plaza_unitario: number | null;
};

export function isTipoSolicitud(value: string): value is TipoSolicitud {
  return (TIPOS_SOLICITUD as readonly string[]).includes(value);
}

export function incluyeBulto(tipo: TipoSolicitud | ""): boolean {
  if (!tipo) return false;
  return tipo !== "solo_1_pasajero" && tipo !== "solo_2_pasajeros" && tipo !== "solo_3_pasajeros";
}

export function numPasajeros(tipo: TipoSolicitud): number {
  switch (tipo) {
    case "solo_bulto":
      return 0;
    case "bulto_1_pasajero":
    case "solo_1_pasajero":
      return 1;
    case "bulto_2_pasajeros":
    case "solo_2_pasajeros":
      return 2;
    case "bulto_3_pasajeros":
    case "solo_3_pasajeros":
      return 3;
  }
}

/** Arma el tipo de solicitud según si sigue haciendo falta bulto y cuántas plazas. */
export function tipoSolicitudDesdePartes(
  conBulto: boolean,
  plazas: number
): TipoSolicitud | null {
  const n = Math.max(0, Math.trunc(plazas));
  if (n <= 0) return conBulto ? "solo_bulto" : null;
  if (n === 1) return conBulto ? "bulto_1_pasajero" : "solo_1_pasajero";
  if (n === 2) return conBulto ? "bulto_2_pasajeros" : "solo_2_pasajeros";
  return conBulto ? "bulto_3_pasajeros" : "solo_3_pasajeros";
}

/**
 * Tras aceptar una propuesta: qué necesidad queda en el anuncio.
 * Si el conductor cubre el bulto, las plazas restantes salen sin bulto.
 */
export function necesidadRestanteTrasOferta(
  tipoActual: TipoSolicitud,
  desglose: OfertaDesglose | null | undefined
): { cubreTodo: boolean; tipoRestante: TipoSolicitud | null } {
  const plazasSolicitadas =
    desglose?.plazas_solicitadas ?? numPasajeros(tipoActual);
  const plazasCubiertas = Math.min(
    plazasSolicitadas,
    Math.max(0, desglose?.plazas_ofrecidas ?? desglose?.num_plazas ?? 0)
  );
  const restante = Math.max(0, plazasSolicitadas - plazasCubiertas);
  const anuncioTeniaBulto = incluyeBulto(tipoActual);
  // Si el anuncio pedía bulto, la propuesta lo incluye (precio de bulto).
  const ofertaCubreBulto =
    anuncioTeniaBulto &&
    (!desglose ||
      (desglose.precio_neto_bulto != null && desglose.precio_neto_bulto > 0));

  const bultoQueda = anuncioTeniaBulto && !ofertaCubreBulto;
  if (restante <= 0 && !bultoQueda) {
    return { cubreTodo: true, tipoRestante: null };
  }
  return {
    cubreTodo: false,
    tipoRestante: tipoSolicitudDesdePartes(bultoQueda, restante),
  };
}

/** Tipo original del anuncio según el desglose de la propuesta aceptada. */
export function tipoSolicitudDesdeDesglose(
  desglose: OfertaDesglose | null | undefined,
  fallback: TipoSolicitud
): TipoSolicitud {
  if (!desglose) return fallback;
  const plazas = desglose.plazas_solicitadas ?? numPasajeros(fallback);
  const conBulto =
    desglose.precio_neto_bulto != null && desglose.precio_neto_bulto > 0;
  return tipoSolicitudDesdePartes(conBulto, plazas) ?? fallback;
}

import { calcPrecioConComision } from "@/lib/pricing";

export function labelTipoSolicitud(tipo: TipoSolicitud): string {
  return TIPO_SOLICITUD_LABELS[tipo];
}

export const TIPO_SOLICITUD_OPTIONS = TIPOS_SOLICITUD.map((value) => ({
  value,
  label: TIPO_SOLICITUD_LABELS[value],
}));

export function calcOfertaTotales(
  tipo: TipoSolicitud,
  precioNetoBulto: number,
  precioNetoPlaza: number,
  plazasOfrecidas?: number
): {
  precio_neto: number;
  precio_total: number;
  desglose: OfertaDesglose;
} {
  const plazasSolicitadas = numPasajeros(tipo);
  const conBulto = incluyeBulto(tipo);

  let plazas = plazasSolicitadas;
  if (plazasSolicitadas > 0) {
    const ofrecidas = plazasOfrecidas ?? plazasSolicitadas;
    plazas = Math.min(
      Math.max(1, Math.trunc(ofrecidas)),
      plazasSolicitadas
    );
  }

  const netoBulto = conBulto ? precioNetoBulto : 0;
  const netoPlaza = plazas > 0 ? precioNetoPlaza : 0;
  const totalBulto = conBulto ? calcPrecioConComision(precioNetoBulto) : null;
  const totalPlazaUnit =
    plazas > 0 ? calcPrecioConComision(precioNetoPlaza) : null;

  const precio_neto = netoBulto + netoPlaza * plazas;
  const precio_total =
    (totalBulto ?? 0) + (totalPlazaUnit ?? 0) * plazas;

  return {
    precio_neto,
    precio_total: Math.round(precio_total * 100) / 100,
    desglose: {
      precio_neto_bulto: conBulto ? precioNetoBulto : null,
      precio_neto_plaza: plazas > 0 ? precioNetoPlaza : null,
      num_plazas: plazas,
      plazas_solicitadas: plazasSolicitadas,
      plazas_ofrecidas: plazas,
      precio_total_bulto: totalBulto,
      precio_total_plaza_unitario: totalPlazaUnit,
    },
  };
}
