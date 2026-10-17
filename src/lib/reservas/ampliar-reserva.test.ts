import { describe, expect, it } from "vitest";
import {
  etiquetaBotonAmpliar,
  opcionesAmpliarReserva,
} from "@/lib/reservas/ampliar-reserva";
import type { OfertaCapacidad } from "@/types/database";

function oferta(
  partial: Partial<OfertaCapacidad> & Pick<OfertaCapacidad, "tipo">
): OfertaCapacidad {
  return {
    id: partial.id ?? "o1",
    ruta_conductor_id: "r1",
    tipo: partial.tipo,
    espacio_tamano: null,
    espacio_detalle: null,
    plazas_totales: partial.plazas_totales ?? 1,
    plazas_ocupadas: partial.plazas_ocupadas ?? 0,
    precio_neto: 10,
    precio_publicado: 11.8,
    estado: partial.estado ?? "disponible",
    created_at: "",
  };
}

describe("opcionesAmpliarReserva", () => {
  it("plaza si hay asiento libre", () => {
    const o = opcionesAmpliarReserva({
      relacionadas: [
        {
          tipo: "ruta_directa",
          bulto_descripcion: "caja",
          cantidad: 1,
        },
      ],
      ofertas: [oferta({ tipo: "asiento", plazas_totales: 2, plazas_ocupadas: 0 })],
      ofreceBultoOriginalLibre: false,
    });
    expect(o).toEqual({ puedePlaza: true, puedeBulto: false });
    expect(etiquetaBotonAmpliar(o)).toBe("Añadir plaza");
  });

  it("bulto y plazas → botón conjunto", () => {
    const o = opcionesAmpliarReserva({
      relacionadas: [
        {
          tipo: "capacidad_extra",
          bulto_descripcion: "Plaza de acompañante (×1)",
          cantidad: 1,
        },
      ],
      ofertas: [oferta({ tipo: "asiento", plazas_totales: 2, plazas_ocupadas: 1 })],
      ofreceBultoOriginalLibre: true,
    });
    expect(o).toEqual({ puedePlaza: true, puedeBulto: true });
    expect(etiquetaBotonAmpliar(o)).toBe("Añadir bulto o plazas");
  });

  it("no ofrece bulto otra vez si ya lleva porte", () => {
    const o = opcionesAmpliarReserva({
      relacionadas: [
        {
          tipo: "ruta_directa",
          bulto_descripcion: "frigorífico",
          cantidad: 1,
        },
      ],
      ofertas: [],
      ofreceBultoOriginalLibre: true,
    });
    expect(o.puedeBulto).toBe(false);
  });
});
