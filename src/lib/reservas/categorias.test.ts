import { describe, expect, it } from "vitest";
import { apartadoReserva } from "@/lib/reservas/categorias";

describe("apartadoReserva", () => {
  it("las propuestas pendientes van a Propuestos", () => {
    expect(apartadoReserva("pendiente_pago", false)).toBe("propuestos");
    expect(apartadoReserva("pendiente_pago", true)).toBe("propuestos");
  });

  it("si tú has pagado, va a Pagados por mí", () => {
    expect(apartadoReserva("pagado_escrow", true)).toBe("pagados");
    expect(apartadoReserva("confirmada", true)).toBe("pagados");
    expect(apartadoReserva("pendiente_aprobacion", true)).toBe("pagados");
  });

  it("si eres conductor y te han pagado el viaje, va a Aceptados por mí como conductor", () => {
    expect(apartadoReserva("pagado_escrow", false)).toBe("aceptados");
    expect(apartadoReserva("confirmada", false)).toBe("aceptados");
  });

  it("lo cerrado va a Historial", () => {
    expect(apartadoReserva("liberado", false)).toBe("historial");
    expect(apartadoReserva("cancelado", true)).toBe("historial");
  });
});
