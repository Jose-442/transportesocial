import { describe, expect, it } from "vitest";
import { plazasElegidasDesplegable } from "@/lib/capacidad/asientos";

describe("plazasElegidasDesplegable", () => {
  it("no resta nada si aún no se ha elegido", () => {
    expect(plazasElegidasDesplegable("", 3)).toBe(0);
  });

  it("resta 1 de 3 al elegir 1 plaza", () => {
    expect(plazasElegidasDesplegable("1", 3)).toBe(1);
  });
});
