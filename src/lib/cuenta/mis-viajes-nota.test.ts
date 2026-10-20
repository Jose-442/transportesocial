import { describe, expect, it } from "vitest";
import { notaTramoRebajaReserva } from "@/lib/cuenta/nota-tramo-rebaja";

describe("notaTramoRebajaReserva", () => {
  it("tramo concreto con rebaja aceptada", () => {
    expect(
      notaTramoRebajaReserva([
        {
          es_tramo: true,
          rebaja_en: "2026-10-19T18:00:00Z",
          tramo_origen: "Zaragoza (Zaragoza)",
          tramo_destino: "Barcelona (Barcelona)",
        },
      ])
    ).toBe(
      "Tramo Zaragoza → Barcelona · Rebaja de precio aceptada"
    );
  });

  it("solo tramo con ciudades", () => {
    expect(
      notaTramoRebajaReserva([
        {
          es_tramo: true,
          rebaja_en: null,
          tramo_origen: "Madrid (Madrid)",
          tramo_destino: "Zaragoza (Zaragoza)",
        },
      ])
    ).toBe("Tramo Madrid → Zaragoza");
  });

  it("tramo sin ciudades guardadas", () => {
    expect(
      notaTramoRebajaReserva([
        {
          es_tramo: true,
          rebaja_en: null,
          tramo_origen: null,
          tramo_destino: null,
        },
      ])
    ).toBe("Tramo del viaje (no el recorrido completo)");
  });

  it("solo rebaja", () => {
    expect(
      notaTramoRebajaReserva([
        {
          es_tramo: false,
          rebaja_en: "2026-10-19T18:00:00Z",
          tramo_origen: null,
          tramo_destino: null,
        },
      ])
    ).toBe("Rebaja de precio aceptada");
  });

  it("sin nada especial", () => {
    expect(
      notaTramoRebajaReserva([
        {
          es_tramo: false,
          rebaja_en: null,
          tramo_origen: null,
          tramo_destino: null,
        },
      ])
    ).toBe(null);
  });
});
