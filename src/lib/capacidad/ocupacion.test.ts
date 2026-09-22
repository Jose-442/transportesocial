import { describe, expect, it } from "vitest";
import {
  aplicarOcupacionAOfertas,
  ocupacionDesdeReservas,
} from "@/lib/capacidad/ocupacion";
import type { OfertaCapacidad } from "@/types/database";

describe("ocupacionDesdeReservas", () => {
  it("resta el bulto y 1 plaza pagados", () => {
    expect(
      ocupacionDesdeReservas([
        {
          tipo: "ruta_directa",
          estado: "pendiente_aprobacion",
          cantidad: 1,
          bulto_descripcion: "maleta",
          oferta_capacidad_id: null,
          ruta_conductor_id: "ruta-1",
        },
        {
          tipo: "capacidad_extra",
          estado: "pendiente_aprobacion",
          cantidad: 1,
          bulto_descripcion: "Plaza de acompañante (×1)",
          oferta_capacidad_id: "asiento-1",
          ruta_conductor_id: "ruta-1",
        },
      ])
    ).toMatchObject({
      bultoOcupado: true,
      plazasOcupadas: 1,
    });
  });
});

describe("aplicarOcupacionAOfertas", () => {
  it("marca 1 de 2 plazas ocupada", () => {
    const ofertas = [
      {
        id: "asiento-1",
        ruta_conductor_id: "ruta-1",
        tipo: "asiento",
        espacio_tamano: null,
        espacio_detalle: null,
        plazas_totales: 2,
        plazas_ocupadas: 0,
        precio_neto: 40,
        precio_publicado: 46.8,
        estado: "disponible",
        created_at: "",
      },
    ] as OfertaCapacidad[];
    const ocupacion = ocupacionDesdeReservas([
      {
        tipo: "capacidad_extra",
        estado: "confirmada",
        cantidad: 1,
        bulto_descripcion: "Plaza de acompañante (×1)",
        oferta_capacidad_id: "asiento-1",
        ruta_conductor_id: "ruta-1",
      },
    ]);
    expect(aplicarOcupacionAOfertas(ofertas, ocupacion)[0]).toMatchObject({
      plazas_ocupadas: 1,
      estado: "disponible",
    });
  });

  it("resta plazas aunque solo venga el total del viaje, sin mapa por oferta", () => {
    const ofertas = [
      {
        id: "asiento-1",
        ruta_conductor_id: "ruta-1",
        tipo: "asiento",
        espacio_tamano: null,
        espacio_detalle: null,
        plazas_totales: 3,
        plazas_ocupadas: 0,
        precio_neto: 40,
        precio_publicado: 47.2,
        estado: "disponible",
        created_at: "",
      },
    ] as OfertaCapacidad[];
    expect(
      aplicarOcupacionAOfertas(ofertas, {
        bultoOcupado: false,
        plazasOcupadas: 1,
        plazasPorOferta: new Map(),
      })[0]
    ).toMatchObject({ plazas_ocupadas: 1 });
  });
});
