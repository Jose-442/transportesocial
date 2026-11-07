import { describe, expect, it } from "vitest";
import {
  mensajePrecioMinimo,
  precioEntero,
  precioMinimoDesdeMetros,
  precioVisiblePorDebajo,
  textoPrecioEntero,
} from "@/lib/precio-minimo";

describe("precio mínimo por carretera", () => {
  it("redondea al euro de arriba", () => {
    expect(precioMinimoDesdeMetros(210_000)).toBe(15);
    expect(precioMinimoDesdeMetros(242_468)).toBe(17);
    expect(precioMinimoDesdeMetros(100_000)).toBe(7);
    expect(precioMinimoDesdeMetros(0)).toBe(0);
  });

  it("compara el precio visible con el mínimo", () => {
    expect(precioVisiblePorDebajo(16.5, 17)).toBe(true);
    expect(precioVisiblePorDebajo(17, 17)).toBe(false);
  });

  it("no admite céntimos en el precio", () => {
    expect(textoPrecioEntero("40")).toBe("40");
    expect(textoPrecioEntero("40,5")).toBe("40");
    expect(textoPrecioEntero("40.50")).toBe("40");
    expect(precioEntero("40")).toBe(40);
    expect(precioEntero("40,5")).toBeNull();
    expect(precioEntero("40.5")).toBeNull();
    expect(precioEntero("0")).toBeNull();
  });

  it("escribe el mínimo en euros enteros", () => {
    expect(mensajePrecioMinimo(17, 242)).toContain("17");
    expect(mensajePrecioMinimo(17, 242)).not.toContain("17,00");
    expect(mensajePrecioMinimo(17, 242)).toContain("242 km por carretera");
  });
});
