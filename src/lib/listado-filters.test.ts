import { describe, expect, it } from "vitest";
import { coincideFiltrosRuta } from "@/lib/listado-filters";

const FECHA = "2026-06-24";

const filtros = {
  origen: "Burgos",
  destino: "Madrid",
  fecha: FECHA,
};

function ruta(origen: string, destino: string) {
  return {
    origen,
    destino,
    fecha_salida: `${FECHA}T10:00:00.000Z`,
  };
}

describe("coincideFiltrosRuta — provincia y radio 50 km", () => {
  it("caso José: Burgos→Madrid incluye los 4 viajes de la misma provincia/zona", () => {
    const rutas = [
      ruta("Burgos", "Madrid"),
      ruta("Burgos", "Getafe"),
      ruta("Quintanilla del Agua y Tordueles", "Madrid"),
      ruta("Burgos", "Alcobendas"),
    ];
    for (const viaje of rutas) {
      expect(coincideFiltrosRuta(viaje, filtros)).toBe(true);
    }
  });

  it("excluye otra provincia en salida o llegada", () => {
    expect(coincideFiltrosRuta(ruta("Valladolid", "Madrid"), filtros)).toBe(
      false
    );
    expect(coincideFiltrosRuta(ruta("Burgos", "Barcelona"), filtros)).toBe(
      false
    );
  });

  it("exige el mismo día", () => {
    expect(
      coincideFiltrosRuta(
        { ...ruta("Burgos", "Madrid"), fecha_salida: "2026-06-25T10:00:00.000Z" },
        filtros
      )
    ).toBe(false);
  });
});
