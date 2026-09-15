import { describe, expect, it } from "vitest";
import { apartadoReserva } from "@/lib/reservas/categorias";

describe("apartadoReserva", () => {
  it("Propuestos no incluye reservas: solo lo que tú publicas", () => {
    expect(apartadoReserva("pendiente_pago", true)).toBe("pagados");
    expect(apartadoReserva("pendiente_pago", false)).toBeNull();
  });

  it("si tú has pagado o tienes el pago a medias, va a Pagados por mí", () => {
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
