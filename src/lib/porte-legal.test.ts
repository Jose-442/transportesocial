import { describe, expect, it } from "vitest";
import {
  categoriaValida,
  categoriasDeTipo,
  isTipoCarga,
} from "@/lib/porte-legal";

describe("porte-legal", () => {
  it("acepta solo voluminoso o paquete", () => {
    expect(isTipoCarga("voluminoso")).toBe(true);
    expect(isTipoCarga("paquete")).toBe(true);
    expect(isTipoCarga("mudanza")).toBe(false);
  });

  it("categorías dependen del tipo", () => {
    expect(categoriasDeTipo("voluminoso")).toContain("Mueble");
    expect(categoriasDeTipo("paquete")).toContain("Paquete cerrado");
    expect(categoriaValida("voluminoso", "Mueble")).toBe(true);
    expect(categoriaValida("paquete", "Mueble")).toBe(false);
  });
});
