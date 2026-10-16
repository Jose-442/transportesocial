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
    pagada_en: null,
    aceptada_en: null,
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

  it("si el conductor rechaza el viaje, se devuelve todo lo pagado", () => {
    expect(
      importeDevuelto(
        [
          fila({
            id: "bulto",
            estado: "cancelado",
            motivo_cancelacion: "Rechazada por el conductor.",
            cancelada_en: "2026-10-12T10:54:00.000Z",
          }),
          fila({
            id: "plaza",
            tipo: "capacidad_extra",
            estado: "cancelado",
            motivo_cancelacion: "Rechazada por el conductor.",
            cancelada_en: "2026-10-12T10:54:00.000Z",
            bulto_descripcion: null,
          }),
        ],
        [
          { monto: 47.2, estado_escrow: "retenido" },
          { monto: 47.2, estado_escrow: "retenido" },
        ]
      )
    ).toBe(94.4);
  });

  it("si quien reservó cancela con tiempo, devuelve el viaje y no los gastos", () => {
    expect(
      importeDevuelto(
        [
          fila({
            estado: "cancelado",
            motivo_cancelacion: MOTIVO_CANCELACION_CLIENTE,
            cancelada_en: "2026-10-12T10:00:00.000Z",
            aceptada_en: "2026-10-11T12:00:00.000Z",
            pagada_en: "2026-10-11T11:00:00.000Z",
          }),
        ],
        [{ monto: 47.2, estado_escrow: "liberado" }]
      )
    ).toBe(40);
  });

  it("en la primera hora desde el pago se devuelve también el 18 %", () => {
    expect(
      importeDevuelto(
        [
          fila({
            estado: "cancelado",
            motivo_cancelacion: MOTIVO_CANCELACION_CLIENTE,
            pagada_en: "2026-10-12T09:30:00.000Z",
            cancelada_en: "2026-10-12T10:00:00.000Z",
          }),
        ],
        [{ monto: 47.2, estado_escrow: "liberado" }]
      )
    ).toBe(47.2);
  });

  it("pasada la hora, si aún no había aceptado el conductor, no se parte el viaje", () => {
    expect(
      importeDevuelto(
        [
          fila({
            estado: "cancelado",
            motivo_cancelacion: MOTIVO_CANCELACION_CLIENTE,
            pagada_en: "2026-10-19T08:00:00.000Z",
            cancelada_en: "2026-10-19T12:00:00.000Z",
            fechaSalida: "2026-10-20T09:00:00.000Z",
          }),
        ],
        [{ monto: 47.2, estado_escrow: "liberado" }]
      )
    ).toBe(40);
  });
});
