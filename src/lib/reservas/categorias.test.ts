import { describe, expect, it } from "vitest";
import { apartadoReserva } from "@/lib/reservas/categorias";

describe("apartadoReserva", () => {
  it("las propuestas pendientes van a Propuestos", () => {
    expect(apartadoReserva("pendiente_pago", false)).toBe("propuestos");
    expect(apartadoReserva("pendiente_pago", true)).toBe("propuestos");
  });

  it("si un pasajero pagó tu propuesta, va a Aceptados", () => {
    expect(apartadoReserva("pagado_escrow", false)).toBe("aceptados");
    expect(apartadoReserva("confirmada", false)).toBe("aceptados");
  });

  it("si un conductor te lleva a ti, va a Para mí", () => {
    expect(apartadoReserva("pagado_escrow", true)).toBe("para_mi");
    expect(apartadoReserva("confirmada", true)).toBe("para_mi");
  });

  it("lo cerrado va a Historial", () => {
    expect(apartadoReserva("liberado", false)).toBe("historial");
    expect(apartadoReserva("cancelado", true)).toBe("historial");
  });
});
