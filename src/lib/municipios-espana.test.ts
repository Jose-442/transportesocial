import { describe, expect, it } from "vitest";
import {
  coincideMunicipioBusqueda,
  filtrarMunicipios,
  resolverMunicipio,
} from "@/lib/municipios-espana";

describe("municipios-espana", () => {
  it('filtrarMunicipios("madr") incluye Madrid', () => {
    const resultados = filtrarMunicipios("madr");
    expect(resultados.some((m) => m.nombre === "Madrid")).toBe(true);
  });

  it('filtrarMunicipios("burgos") incluye municipios y/o provincia', () => {
    const resultados = filtrarMunicipios("burgos");
    expect(resultados.length).toBeGreaterThan(0);
    expect(
      resultados.some(
        (m) =>
          m.nombre.toLowerCase().includes("burgos") ||
          m.provincia.toLowerCase().includes("burgos")
      )
    ).toBe(true);
  });

  it('resolverMunicipio("madrid") devuelve Madrid canónico', () => {
    expect(resolverMunicipio("madrid")?.nombre).toBe("Madrid");
  });

  it('resolverMunicipio("texto inventado") devuelve null', () => {
    expect(resolverMunicipio("texto inventado")).toBeNull();
  });

  it("coincideMunicipioBusqueda: Getafe coincide con filtro Madrid", () => {
    expect(coincideMunicipioBusqueda("Getafe", "Madrid")).toBe(true);
    expect(coincideMunicipioBusqueda("Barcelona", "Madrid")).toBe(false);
  });
});
