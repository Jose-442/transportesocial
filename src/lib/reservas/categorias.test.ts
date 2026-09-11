import { describe, expect, it } from "vitest";
import { apartadoReserva } from "@/lib/reservas/categorias";

describe("apartadoReserva", () => {
  it("las propuestas pendientes van a Propuestos", () => {
    expect(apartadoReserva("pendiente_pago", false)).toBe("propuestos");
    expect(apartadoReserva("pendiente_pago", true)).toBe("propuestos");
  });

  it("si tú has pagado, va a Aceptados por mí", () => {
    expect(apartadoReserva("pagado_escrow", true)).toBe("aceptados");
    expect(apartadoReserva("confirmada", true)).toBe("aceptados");
    expect(apartadoReserva("pendiente_aprobacion", true)).toBe("aceptados");
  });

  it("si eres conductor y te han aceptado el viaje, va a Aceptaciones de conductores", () => {
    expect(apartadoReserva("pagado_escrow", false)).toBe("para_mi");
    expect(apartadoReserva("confirmada", false)).toBe("para_mi");
  });

  it("lo cerrado va a Historial", () => {
    expect(apartadoReserva("liberado", false)).toBe("historial");
    expect(apartadoReserva("cancelado", true)).toBe("historial");
  });
});
