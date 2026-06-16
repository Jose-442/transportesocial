import { MAX_ASIENTOS_POR_VIAJE } from "@/lib/constants";
import type { OfertaCapacidad } from "@/types/database";

export function plazasLibresOferta(oferta: OfertaCapacidad): number {
  return Math.max(0, oferta.plazas_totales - oferta.plazas_ocupadas);
}

export function ofertaDisponible(oferta: OfertaCapacidad): boolean {
  return oferta.estado === "disponible" && plazasLibresOferta(oferta) > 0;
}

export function plazasAsientoTotalesEnRuta(ofertas: OfertaCapacidad[]): number {
  return ofertas
    .filter((o) => o.tipo === "asiento")
    .reduce((sum, o) => sum + o.plazas_totales, 0);
}

export function plazasAsientoDisponiblesRestantes(
  ofertas: OfertaCapacidad[]
): number {
  const usadas = plazasAsientoTotalesEnRuta(ofertas);
  return Math.max(0, MAX_ASIENTOS_POR_VIAJE - usadas);
}

export function puedeAnadirAsientos(
  ofertas: OfertaCapacidad[],
  nuevasPlazas: number
): boolean {
  return plazasAsientoTotalesEnRuta(ofertas) + nuevasPlazas <= MAX_ASIENTOS_POR_VIAJE;
}

export function resumenAsientosRuta(ofertas: OfertaCapacidad[]): {
  ofrecidas: number;
  ocupadas: number;
} {
  const asientos = ofertas.filter((o) => o.tipo === "asiento");
  if (asientos.length === 0) {
    return { ofrecidas: 0, ocupadas: 0 };
  }
  const ofrecidas = Math.min(
    MAX_ASIENTOS_POR_VIAJE,
    asientos.reduce((sum, o) => sum + o.plazas_totales, 0)
  );
  const ocupadas = asientos.reduce((sum, o) => sum + o.plazas_ocupadas, 0);
  return { ofrecidas, ocupadas };
}
