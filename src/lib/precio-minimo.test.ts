import { describe, expect, it } from "vitest";
import {
  mensajePrecioMinimo,
  precioMinimoDesdeMetros,
  precioVisiblePorDebajo,
} from "@/lib/precio-minimo";

describe("precio mínimo por carretera", () => {
  it("redondea al céntimo de arriba", () => {
    expect(precioMinimoDesdeMetros(210_000)).toBe(14.7);
    expect(precioMinimoDesdeMetros(242_468)).toBe(16.98);
    expect(precioMinimoDesdeMetros(0)).toBe(0);
  });

  it("compara el precio visible con el mínimo", () => {
    expect(precioVisiblePorDebajo(16.97, 16.98)).toBe(true);
    expect(precioVisiblePorDebajo(16.98, 16.98)).toBe(false);
  });

  it("escribe el mínimo con los kilómetros", () => {
    expect(mensajePrecioMinimo(16.98, 242)).toContain("16,98");
    expect(mensajePrecioMinimo(16.98, 242)).toContain("242 km por carretera");
  });
});
