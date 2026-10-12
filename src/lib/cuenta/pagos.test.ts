import { describe, expect, it } from "vitest";
import { importeDevuelto, type FilaPago } from "@/lib/cuenta/pagos";
import {
  MOTIVO_CANCELACION_CLIENTE,
  MOTIVO_CANCELACION_CONDUCTOR,
} from "@/lib/reservas/segunda-cancelacion";

function fila(parcial: Partial<FilaPago> = {}): FilaPago {
  return {
    id: "r1",
    tipo: "ruta_directa",
    estado: "confirmada",
    precio_neto: 40,
    precio_total: 47.2,
    comision_plataforma: 7.2,
    cantidad: 1,
    bulto_descripcion: "maleta",
    motivo_cancelacion: null,
    cancelada_en: null,
    fechaSalida: "2026-10-20T09:00:00.000Z",
    ruta_conductor_id: "ruta",
    anuncio_bulto_id: null,
    created_at: "2026-10-11T10:00:00.000Z",
    ...parcial,
  };
}

describe("importeDevuelto", () => {
  it("si el cobro sigue retenido, no hay devolución", () => {
    expect(
      importeDevuelto([fila()], [{ monto: 47.2, estado_escrow: "retenido" }])
    ).toBeNull();
  });

  it("si se devolvió todo, el importe es el pagado", () => {
    expect(
      importeDevuelto(
        [
          fila({
            estado: "cancelado",
            motivo_cancelacion: MOTIVO_CANCELACION_CONDUCTOR,
            cancelada_en: "2026-10-12T10:00:00.000Z",
          }),
        ],
        [{ monto: 47.2, estado_escrow: "reembolsado" }]
      )
    ).toBe(47.2);
  });

  it("si quien reservó cancela con tiempo, devuelve el viaje y no los gastos", () => {
    expect(
      importeDevuelto(
        [
          fila({
            estado: "cancelado",
            motivo_cancelacion: MOTIVO_CANCELACION_CLIENTE,
            cancelada_en: "2026-10-12T10:00:00.000Z",
          }),
        ],
        [{ monto: 47.2, estado_escrow: "liberado" }]
      )
    ).toBe(40);
  });
});
