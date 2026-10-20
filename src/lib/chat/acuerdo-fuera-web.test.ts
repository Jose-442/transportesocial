import { describe, expect, it } from "vitest";
import { detectaAcuerdoFueraWeb } from "@/lib/chat/acuerdo-fuera-web";

describe("detectaAcuerdoFueraWeb", () => {
  it("pillá la frase de ejemplo", () => {
    expect(
      detectaAcuerdoFueraWeb(
        "podemos anular el viaje y hacerlo clandestino sin la web"
      )
    ).toBe(true);
  });

  it("fuera de la web", () => {
    expect(detectaAcuerdoFueraWeb("lo hacemos fuera de la web")).toBe(true);
  });

  it("entre nosotros", () => {
    expect(
      detectaAcuerdoFueraWeb("si anulamos y lo hacemos entre nosotros")
    ).toBe(true);
  });

  it("pago en mano", () => {
    expect(detectaAcuerdoFueraWeb("te lo pago en mano")).toBe(true);
    expect(detectaAcuerdoFueraWeb("en mano")).toBe(true);
  });

  it("mensaje normal de coordinación", () => {
    expect(
      detectaAcuerdoFueraWeb("Quedamos a las 10 en la estación, ¿vale?")
    ).toBe(false);
  });
});
