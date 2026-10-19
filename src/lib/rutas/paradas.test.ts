import { describe, expect, it } from "vitest";
import {
  esBusquedaDeTramo,
  esTramoElegido,
  prepararParadasParaGuardar,
  puntosRuta,
  rutaCubreTrayecto,
} from "@/lib/rutas/paradas";

describe("puntosRuta", () => {
  it("ordena paradas entre salida y destino", () => {
    expect(
      puntosRuta("Madrid (Madrid)", "Barcelona (Barcelona)", [
        { orden: 2, municipio: "Lleida (Lleida)" },
        { orden: 1, municipio: "Zaragoza (Zaragoza)" },
      ])
    ).toEqual([
      "Madrid (Madrid)",
      "Zaragoza (Zaragoza)",
      "Lleida (Lleida)",
      "Barcelona (Barcelona)",
    ]);
  });
});

describe("rutaCubreTrayecto", () => {
  const puntos = [
    "Madrid (Madrid)",
    "Zaragoza (Zaragoza)",
    "Lleida (Lleida)",
    "Barcelona (Barcelona)",
  ];

  it("encuentra un tramo intermedio", () => {
    expect(
      rutaCubreTrayecto(puntos, "Zaragoza", "Lleida")
    ).toBe(true);
  });

  it("encuentra desde el origen hasta una parada", () => {
    expect(rutaCubreTrayecto(puntos, "Madrid", "Zaragoza")).toBe(true);
  });

  it("encuentra de una parada al destino", () => {
    expect(rutaCubreTrayecto(puntos, "Zaragoza", "Barcelona")).toBe(true);
  });

  it("no acepta el sentido contrario", () => {
    expect(rutaCubreTrayecto(puntos, "Barcelona", "Madrid")).toBe(false);
  });

  it("no acepta un destino que no está en la ruta", () => {
    expect(rutaCubreTrayecto(puntos, "Madrid", "Valencia")).toBe(false);
  });
});

describe("esBusquedaDeTramo", () => {
  const ruta = {
    origen: "Madrid (Madrid)",
    destino: "Barcelona (Barcelona)",
  };
  const paradas = [{ orden: 1, municipio: "Zaragoza (Zaragoza)" }];

  it("marca tramo si no son los extremos del anuncio", () => {
    expect(
      esBusquedaDeTramo(ruta, paradas, "Zaragoza", "Barcelona")
    ).toBe(true);
  });

  it("no marca tramo si busca exactamente el anuncio", () => {
    expect(
      esBusquedaDeTramo(ruta, paradas, "Madrid", "Barcelona")
    ).toBe(false);
  });
});

describe("prepararParadasParaGuardar", () => {
  const ctx = {
    origen: "Madrid (Madrid)",
    destino: "Barcelona (Barcelona)",
    fechaSalida: "2026-11-20",
    horaSalida: "08:00",
  };

  it("acepta sin paradas", () => {
    expect(prepararParadasParaGuardar([], ctx)).toEqual({
      ok: true,
      paradas: [],
    });
  });

  it("exige municipio y hora juntos", () => {
    const r = prepararParadasParaGuardar(
      [{ municipio: "Zaragoza", hora: "" }],
      ctx
    );
    expect(r.ok).toBe(false);
  });

  it("exige hora posterior a la salida", () => {
    const r = prepararParadasParaGuardar(
      [{ municipio: "Zaragoza", hora: "07:00" }],
      ctx
    );
    expect(r.ok).toBe(false);
  });

  it("guarda una parada válida", () => {
    const r = prepararParadasParaGuardar(
      [{ municipio: "Zaragoza", hora: "11:00" }],
      ctx
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.paradas).toHaveLength(1);
    expect(r.paradas[0].orden).toBe(1);
    expect(r.paradas[0].municipio).toContain("Zaragoza");
  });
});

describe("esTramoElegido", () => {
  const puntos = [
    "Madrid (Madrid)",
    "Zaragoza (Zaragoza)",
    "Lleida (Lleida)",
    "Barcelona (Barcelona)",
  ];

  it("punta a punta no es tramo", () => {
    expect(
      esTramoElegido(puntos, "Madrid (Madrid)", "Barcelona (Barcelona)")
    ).toBe(false);
  });

  it("parte del recorrido sí es tramo", () => {
    expect(
      esTramoElegido(puntos, "Zaragoza (Zaragoza)", "Lleida (Lleida)")
    ).toBe(true);
  });
});
