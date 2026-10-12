import { describe, expect, it } from "vitest";
import { deltaParaVerEntero } from "@/lib/scroll-campo";

describe("deltaParaVerEntero", () => {
  const margenArriba = 72;
  const limiteAbajo = 676;

  it("no mueve si el bloque ya cabe entero", () => {
    expect(
      deltaParaVerEntero({
        top: 200,
        bottom: 360,
        margenArriba,
        limiteAbajo,
      })
    ).toBe(0);
  });

  it("sube el bloque que el menú de abajo tapa", () => {
    expect(
      deltaParaVerEntero({
        top: 640,
        bottom: 820,
        margenArriba,
        limiteAbajo,
      })
    ).toBe(144);
  });
});
