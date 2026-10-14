import { describe, expect, it } from "vitest";
import { fechasCercanasAlDia, limitesBusqueda } from "@/lib/listado-filters";
import { etiquetasMunicipiosCercanos } from "@/lib/municipios-espana";

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
});
