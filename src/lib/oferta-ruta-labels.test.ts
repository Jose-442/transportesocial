import { describe, expect, it } from "vitest";
import { formatEspacioDisponibleListado } from "@/lib/espacio-opciones";
import { lineasOfertaRuta } from "@/lib/oferta-ruta-labels";

describe("formatEspacioDisponibleListado", () => {
  it("amplía Más grande con referencia al frigorífico", () => {
    expect(formatEspacioDisponibleListado("Más grande")).toBe(
      "Más grande que un frigorífico estándar"
    );
  });

  it("deja el resto de opciones tal cual", () => {
    expect(formatEspacioDisponibleListado("Medio (Frigorífico estándar)")).toBe(
      "Medio (Frigorífico estándar)"
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
      "Bulto (Tamaño del espacio disponible: Más grande que un frigorífico estándar)",
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
      "Bulto (Tamaño del espacio disponible: Pequeño (Maleta))",
    ]);
  });
});
