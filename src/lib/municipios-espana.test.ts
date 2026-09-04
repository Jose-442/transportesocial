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

  it('resolverMunicipio("Torrelodones (Madrid)") conserva la provincia', () => {
    const municipio = resolverMunicipio("Torrelodones (Madrid)");
    expect(municipio?.nombre).toBe("Torrelodones");
    expect(municipio?.provincia).toBe("Madrid");
  });

  it('resolverMunicipio("torrelodones") sigue resolviendo el municipio', () => {
    expect(resolverMunicipio("torrelodones")?.nombre).toBe("Torrelodones");
  });

  it("coincideMunicipioBusqueda acepta ciudad guardada con provincia", () => {
    expect(
      coincideMunicipioBusqueda("Torrelodones (Madrid)", "Torrelodones")
    ).toBe(true);
    expect(
      coincideMunicipioBusqueda("Torrelodones", "Torrelodones (Madrid)")
    ).toBe(true);
  });

  it('resolverMunicipio("texto inventado") devuelve null', () => {
    expect(resolverMunicipio("texto inventado")).toBeNull();
  });

  it('resolverMunicipio("oporto", { incluirFrontera: true }) devuelve Oporto, Portugal', () => {
    const municipio = resolverMunicipio("oporto", { incluirFrontera: true });
    expect(municipio?.nombre).toBe("Oporto");
    expect(municipio?.provincia).toBe("Portugal");
  });

  it('resolverMunicipio("oporto") sin frontera devuelve null', () => {
    expect(resolverMunicipio("oporto")).toBeNull();
  });

  it("coincideMunicipioBusqueda: Getafe coincide con filtro Madrid", () => {
    expect(coincideMunicipioBusqueda("Getafe", "Madrid")).toBe(true);
    expect(coincideMunicipioBusqueda("Barcelona", "Madrid")).toBe(false);
  });

  it("coincideMunicipioBusqueda: Oporto coincide con filtro Oporto (PT)", () => {
    expect(coincideMunicipioBusqueda("Oporto", "Oporto")).toBe(true);
    expect(coincideMunicipioBusqueda("Oporto", "Lisboa")).toBe(false);
  });
});
