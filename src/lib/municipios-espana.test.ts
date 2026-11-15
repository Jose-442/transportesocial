import { describe, expect, it } from "vitest";
import {
  coincideMunicipioBusqueda,
  coordenadasMunicipio,
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

  it("los pueblos de Piélagos y Camargo salen en el desplegable", () => {
    const nombres = [
      "Arce",
      "Barcenilla",
      "Boo de Piélagos",
      "Carandía",
      "Liencres",
      "Mortera",
      "Oruña",
      "Parbayón",
      "Quijano",
      "Renedo de Piélagos",
      "Vioño de Piélagos",
      "Zurita",
      "Cacicedo",
      "Camargo pueblo",
      "Escobedo",
      "Herrera",
      "Igollo",
      "Maliaño",
      "Muriedas",
      "Revilla",
    ];
    for (const nombre of nombres) {
      const municipio = resolverMunicipio(`${nombre} (Cantabria)`);
      expect(municipio?.nombre).toBe(nombre);
      expect(municipio?.provincia).toBe("Cantabria");
      expect(coordenadasMunicipio(municipio!)).not.toBeNull();
    }
    expect(filtrarMunicipios("liencres").some((m) => m.nombre === "Liencres")).toBe(
      true
    );
    expect(
      filtrarMunicipios("renedo").some((m) => m.nombre === "Renedo de Piélagos")
    ).toBe(true);
    expect(filtrarMunicipios("boo").some((m) => m.nombre === "Boo de Piélagos")).toBe(
      true
    );
    expect(resolverMunicipio("Arce")?.provincia).toBe("Navarra");
    expect(resolverMunicipio("Arce (Cantabria)")?.provincia).toBe("Cantabria");
    expect(resolverMunicipio("Camargo")?.nombre).toBe("Camargo");
  });

  it("coincideMunicipioBusqueda: Oporto coincide con filtro Oporto (PT)", () => {
    expect(coincideMunicipioBusqueda("Oporto", "Oporto")).toBe(true);
    expect(coincideMunicipioBusqueda("Oporto", "Lisboa")).toBe(false);
  });
});
