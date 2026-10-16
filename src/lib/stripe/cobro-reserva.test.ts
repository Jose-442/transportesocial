import { describe, expect, it } from "vitest";
import {
  cobroDeEstasReservas,
  reembolsoDesdeCobroStripe,
} from "@/lib/stripe/cobro-reserva";

const reserva = "684c9885-5fa6-4bae-b53a-ace40db26472";

describe("cobroDeEstasReservas", () => {
  it("acepta el cobro de esa reserva", () => {
    expect(
      cobroDeEstasReservas(
        {
          status: "succeeded",
          metadata: { reserva_id: reserva, reserva_ids: reserva },
        },
        [reserva]
      )
    ).toBe(true);
  });

  it("no devuelve un cobro que incluye otra reserva", () => {
    expect(
      cobroDeEstasReservas(
        {
          status: "succeeded",
          metadata: { reserva_ids: `${reserva},otra` },
        },
        [reserva]
      )
    ).toBe(false);
  });

  it("si no es el 100 %, devuelve solo el viaje y no el cobro entero", () => {
    expect(reembolsoDesdeCobroStripe("viaje_sin_gastos", 4720, 4000)).toBe(4000);
    expect(reembolsoDesdeCobroStripe("mitad", 4720, 2000)).toBe(2000);
    expect(reembolsoDesdeCobroStripe("total", 4720, 4720)).toBe(4720);
  });

  it("ignora un cobro que no se ha completado", () => {
    expect(
      cobroDeEstasReservas(
        { status: "requires_payment_method", metadata: { reserva_id: reserva } },
        [reserva]
      )
    ).toBe(false);
  });
});
