import { describe, expect, it } from "vitest";
import { formatEspacioDisponibleListado } from "@/lib/espacio-opciones";
import {
  badgeOfertaRuta,
  lineasOfertaRuta,
  ofertaOriginalRuta,
} from "@/lib/oferta-ruta-labels";

describe("formatEspacioDisponibleListado", () => {
  it("amplía Más grande comparándolo con el frigorífico y antepone Tamaño", () => {
    expect(formatEspacioDisponibleListado("Más grande")).toBe(
      "Tamaño Más grande que un frigorífico estándar"
    );
  });

  it("amplía Más grande también si hay detalle detrás", () => {
    expect(formatEspacioDisponibleListado("Más grande. Hueco extra")).toBe(
      "Tamaño Más grande que un frigorífico estándar. Hueco extra"
    );
  });

  it("cambia la frase de referencia antigua a la nueva", () => {
    expect(
      formatEspacioDisponibleListado(
        "Más grande (referencia: frigorífico estándar)"
      )
    ).toBe("Tamaño Más grande que un frigorífico estándar");
  });

  it("antepone Tamaño al resto de opciones", () => {
    expect(formatEspacioDisponibleListado("Medio (Frigorífico estándar)")).toBe(
      "Tamaño Medio (Frigorífico estándar)"
    );
  });
});

describe("lineasOfertaRuta", () => {
  it("muestra bulto y acompañante en líneas separadas", () => {
    expect(
      lineasOfertaRuta({
        espacio_disponible: "Más grande",
        asientoOfrecidas: 1,
        estado: "activa",
      })
    ).toEqual([
      "Bulto (Tamaño Más grande que un frigorífico estándar)",
      "+ 1 acompañante",
    ]);
  });

  it("solo bulto si no hay plazas de acompañante", () => {
    expect(
      lineasOfertaRuta({
        espacio_disponible: "Pequeño (Maleta)",
        asientoOfrecidas: 0,
        estado: "activa",
      })
    ).toEqual([
      "Bulto (Tamaño Pequeño (Maleta))",
    ]);
  });

  it("si el bulto ya está reservado, solo enseña las plazas que quedan", () => {
    expect(
      badgeOfertaRuta({
        espacio_disponible: "Pequeño (Maleta)",
        asientoOfrecidas: 1,
        bultoDisponible: false,
        estado: "activa",
      })
    ).toBe("Solo pasajeros 1 plaza");
    expect(
      lineasOfertaRuta({
        espacio_disponible: "Pequeño (Maleta)",
        asientoOfrecidas: 1,
        bultoDisponible: false,
        estado: "activa",
      })
    ).toEqual(["1 acompañante"]);
  });

  it("solo pasajeros si no hay espacio para bulto", () => {
    expect(
      lineasOfertaRuta({
        espacio_disponible: "Sin espacio para bultos",
        asientoOfrecidas: 2,
        estado: "activa",
      })
    ).toEqual(["2 acompañantes"]);
    expect(
      badgeOfertaRuta({
        espacio_disponible: "Sin espacio para bultos",
        asientoOfrecidas: 2,
        estado: "activa",
      })
    ).toBe("Solo pasajeros 2 plazas");
    expect(
      badgeOfertaRuta({
        espacio_disponible: "Sin espacio para bultos",
        asientoOfrecidas: 1,
        estado: "activa",
      })
    ).toBe("Solo pasajeros 1 plaza");
  });
});

describe("ofertaOriginalRuta", () => {
  it("mantiene bulto y las plazas originales aunque ya no queden libres", () => {
    const original = ofertaOriginalRuta({
      espacio_disponible: "Pequeño (Maleta)",
      plazasTotales: 2,
    });
    expect(badgeOfertaRuta(original)).toBe("Bulto + 2 plazas");
    expect(lineasOfertaRuta(original)).toEqual([
      "Bulto (Tamaño Pequeño (Maleta))",
      "+ 2 acompañantes",
    ]);
  });
});
