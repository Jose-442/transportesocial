import { describe, expect, it } from "vitest";
import {
  documentoIdentidadValido,
  normalizarDocumentoIdentidad,
  normalizarTelefonoEs,
} from "@/lib/identidad";

describe("identidad", () => {
  it("acepta móvil español", () => {
    expect(normalizarTelefonoEs("612345678")).toBe("+34612345678");
    expect(normalizarTelefonoEs("+34 612 345 678")).toBe("+34612345678");
    expect(normalizarTelefonoEs("712345678")).toBe("+34712345678");
  });

  it("rechaza fijo u otros", () => {
    expect(normalizarTelefonoEs("912345678")).toBeNull();
    expect(normalizarTelefonoEs("61234567")).toBeNull();
  });

  it("valida DNI y NIE", () => {
    expect(documentoIdentidadValido("12345678Z")).toBe(true);
    expect(documentoIdentidadValido("12345678A")).toBe(false);
    expect(normalizarDocumentoIdentidad("x1234567l")).toBe("X1234567L");
    expect(documentoIdentidadValido("X1234567L")).toBe(true);
  });
});
