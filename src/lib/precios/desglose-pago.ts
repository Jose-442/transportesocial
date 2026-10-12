import { esReservaDePlazas } from "@/lib/reservas/labels";
import type { OfertaDesglose } from "@/lib/solicitud-viaje";
import type { Reserva } from "@/types/database";

export type FilaDesglosePago = Pick<
  Reserva,
  "tipo" | "precio_neto" | "precio_total" | "cantidad" | "bulto_descripcion"
> & {
  desglose?: OfertaDesglose | null;
};

export type LineaDesglose = {
  concepto: string;
  centimos: number;
};

function aCentimos(euros: number): number {
  return Math.round(Number(euros) * 100);
}

function conceptoPlazas(n: number): string {
  const plazas = Math.max(1, n);
  return plazas === 1 ? "Una plaza" : `${plazas} plazas`;
}

function lineasServicio(fila: FilaDesglosePago): LineaDesglose[] {
  const desglose = fila.desglose;
  if (fila.tipo === "bulto_oferta" && desglose) {
    const plazas = Math.max(
      0,
      Number(desglose.plazas_ofrecidas ?? desglose.num_plazas) || 0
    );
    const partes: LineaDesglose[] = [];
    if (desglose.precio_neto_bulto != null && desglose.precio_neto_bulto > 0) {
      partes.push({
        concepto: "Porte de bulto",
        centimos: aCentimos(desglose.precio_neto_bulto),
      });
    }
    if (plazas > 0 && desglose.precio_neto_plaza != null && desglose.precio_neto_plaza > 0) {
      partes.push({
        concepto: conceptoPlazas(plazas),
        centimos: aCentimos(desglose.precio_neto_plaza * plazas),
      });
    }
    const neto = aCentimos(fila.precio_neto);
    const suma = partes.reduce((acc, linea) => acc + linea.centimos, 0);
    if (partes.length > 0 && suma !== neto) {
      partes[partes.length - 1].centimos += neto - suma;
    }
    const validas = partes.filter((linea) => linea.centimos > 0);
    if (validas.length > 0) return validas;
  }

  return [
    {
      concepto: esReservaDePlazas(fila) ? conceptoPlazas(fila.cantidad) : "Porte de bulto",
      centimos: aCentimos(fila.precio_neto),
    },
  ].filter((linea) => linea.centimos > 0);
}

/** Precio del viaje y gastos de gestión, en céntimos, sumando el total a cobrar. */
export function desglosePago(filas: FilaDesglosePago[]): {
  lineas: LineaDesglose[];
  totalCentimos: number;
} {
  const servicios = filas.flatMap(lineasServicio);
  const totalCentimos = filas.reduce(
    (acc, fila) => acc + aCentimos(fila.precio_total),
    0
  );
  const servicioCentimos = servicios.reduce((acc, linea) => acc + linea.centimos, 0);
  let gastos = totalCentimos - servicioCentimos;
  if (gastos < 0 && servicios.length > 0) {
    servicios[servicios.length - 1].centimos += gastos;
    gastos = 0;
  }
  const lineas = gastos > 0
    ? [...servicios, { concepto: "Gastos de gestión", centimos: gastos }]
    : servicios;
  return { lineas, totalCentimos };
}
