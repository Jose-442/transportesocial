import { describe, expect, it } from "vitest";
import { numerosDePagina } from "@/lib/listado-paginacion";
import {
  coincideFechaListado,
  fechasCercanasAlDia,
  fechasDeLaSemana,
  limitesBusqueda,
} from "@/lib/listado-filters";
import { etiquetasMunicipiosCercanos } from "@/lib/municipios-espana";

describe("numerosDePagina", () => {
  it("con dos páginas enseña el 1 y el 2", () => {
    expect(numerosDePagina(1, 2)).toEqual([1, 2]);
  });
});

describe("fechasCercanasAlDia", () => {
  it("incluye el mismo día del año anterior y del siguiente", () => {
    expect(fechasCercanasAlDia("2026-10-17")).toEqual([
      "2025-10-17",
      "2026-10-17",
      "2027-10-17",
    ]);
  });

  it("no inventa el 29 de febrero", () => {
    expect(fechasCercanasAlDia("2028-02-29")).toEqual(["2028-02-29"]);
  });
});

describe("etiquetasMunicipiosCercanos", () => {
  it("Burgos entra, Madrid no", () => {
    const zona = etiquetasMunicipiosCercanos("Burgos (Burgos)");
    expect(zona).toContain("Burgos (Burgos)");
    expect(zona).not.toContain("Madrid (Madrid)");
  });
});

describe("limitesBusqueda", () => {
  it("acota salida, destino y día", () => {
    const limites = limitesBusqueda({
      origen: "Burgos (Burgos)",
      destino: "Madrid (Madrid)",
      fecha: "2026-10-17",
    });
    expect(limites?.fechas).toContain("2026-10-17");
    expect(limites?.origenes).toContain("Burgos (Burgos)");
    expect(limites?.destinos).toContain("Madrid (Madrid)");
  });

  it("sin día no acota fechas", () => {
    const limites = limitesBusqueda({
      origen: "Burgos (Burgos)",
      destino: "Madrid (Madrid)",
    });
    expect(limites?.fechas).toBeNull();
    expect(limites?.origenes).toContain("Burgos (Burgos)");
  });

  it("con semana acota lunes a domingo de la semana de hoy (ignora fecha)", () => {
    const limites = limitesBusqueda(
      {
        origen: "Burgos (Burgos)",
        destino: "Madrid (Madrid)",
        fecha: "2026-11-01",
        semana: true,
      },
      new Date("2026-10-17T12:00:00+02:00")
    );
    expect(limites?.fechas).toEqual([
      "2026-10-12",
      "2026-10-13",
      "2026-10-14",
      "2026-10-15",
      "2026-10-16",
      "2026-10-17",
      "2026-10-18",
    ]);
  });
});

describe("fechasDeLaSemana", () => {
  it("un domingo cierra la semana del lunes anterior", () => {
    expect(fechasDeLaSemana("2026-10-18")).toEqual([
      "2026-10-12",
      "2026-10-13",
      "2026-10-14",
      "2026-10-15",
      "2026-10-16",
      "2026-10-17",
      "2026-10-18",
    ]);
  });
});

describe("coincideFechaListado", () => {
  it("en modo semana acepta cualquier día de la semana de hoy", () => {
    const ahora = new Date("2026-10-17T12:00:00+02:00");
    const filtros = { semana: true };
    expect(coincideFechaListado("2026-10-12", filtros, ahora)).toBe(true);
    expect(coincideFechaListado("2026-10-18", filtros, ahora)).toBe(true);
    expect(coincideFechaListado("2026-10-19", filtros, ahora)).toBe(false);
  });

  it("con día concreto solo ese día", () => {
    expect(
      coincideFechaListado("2026-10-17", { fecha: "2026-10-17" })
    ).toBe(true);
    expect(
      coincideFechaListado("2026-10-18", { fecha: "2026-10-17" })
    ).toBe(false);
  });
});
