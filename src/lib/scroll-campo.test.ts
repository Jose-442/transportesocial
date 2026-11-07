import { describe, expect, it } from "vitest";
import { deltaParaVerEntero, precioListoParaSaltar } from "@/lib/scroll-campo";

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

  it("salta el precio solo al segundo dígito", () => {
    expect(precioListoParaSaltar("4")).toBe(false);
    expect(precioListoParaSaltar("40")).toBe(true);
    expect(precioListoParaSaltar("44")).toBe(true);
    expect(precioListoParaSaltar("400")).toBe(false);
    expect(precioListoParaSaltar("4,5")).toBe(false);
    expect(precioListoParaSaltar("4.5")).toBe(false);
    expect(precioListoParaSaltar("40,5")).toBe(false);
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
