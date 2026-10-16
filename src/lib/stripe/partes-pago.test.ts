import { describe, expect, it } from "vitest";
import { partesDelPago, totalesMovimientos } from "@/lib/stripe/partes-pago";

describe("totalesMovimientos", () => {
  it("suma cobros, devoluciones y lo que Stripe se queda", () => {
    expect(
      totalesMovimientos([
        { type: "charge", amount: 4720, fee: 174 },
        { type: "refund", amount: -4000, fee: 0 },
        { type: "payout", amount: -1000, fee: 0 },
      ])
    ).toEqual({
      cobradoCents: 4720,
      devueltoCents: 4000,
      comisionStripeCents: 174,
      alBancoCents: 1000,
    });
  });

  it("si Stripe devuelve comisión, la suma baja", () => {
    expect(
      totalesMovimientos([
        { type: "charge", amount: 4720, fee: 174 },
        { type: "refund", amount: -4720, fee: -174 },
      ]).comisionStripeCents
    ).toBe(0);
  });
});

describe("partesDelPago", () => {
  it("tras devolver el viaje, los 5,46 € son de la web y Stripe se queda 1,74 €", () => {
    expect(
      partesDelPago({
        cobradoCents: 4720,
        devueltoCents: 4000,
        stripeCents: 174,
        gestionCents: 720,
      })
    ).toMatchObject({
      devueltoCents: 4000,
      stripeCents: 174,
      conductorCents: 0,
      webCents: 546,
    });
  });

  it("si nadie cancela, el viaje es del conductor y los gastos, de la web", () => {
    expect(
      partesDelPago({
        cobradoCents: 4720,
        devueltoCents: 0,
        stripeCents: 174,
        gestionCents: 720,
      })
    ).toMatchObject({
      conductorCents: 4000,
      webCents: 546,
    });
  });
});
