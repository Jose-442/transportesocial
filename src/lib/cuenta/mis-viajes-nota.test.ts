import { describe, expect, it } from "vitest";
import { partesNotaTramoRebaja } from "@/lib/cuenta/nota-tramo-rebaja";

describe("partesNotaTramoRebaja", () => {
  it("tramo concreto con rebaja", () => {
    expect(
      partesNotaTramoRebaja([
        {
          es_tramo: true,
          rebaja_en: "2026-10-19T18:00:00Z",
          tramo_origen: "Zaragoza (Zaragoza)",
          tramo_destino: "Barcelona (Barcelona)",
        },
      ])
    ).toEqual({
      tramo: "Zaragoza (Zaragoza) → Barcelona (Barcelona)",
      rebajaHecha: true,
    });
  });

  it("solo tramo", () => {
    expect(
      partesNotaTramoRebaja([
        {
          es_tramo: true,
          rebaja_en: null,
          tramo_origen: "Madrid (Madrid)",
          tramo_destino: "Zaragoza (Zaragoza)",
        },
      ])
    ).toEqual({
      tramo: "Madrid (Madrid) → Zaragoza (Zaragoza)",
      rebajaHecha: false,
    });
  });

  it("solo rebaja", () => {
    expect(
      partesNotaTramoRebaja([
        {
          es_tramo: false,
          rebaja_en: "2026-10-19T18:00:00Z",
          tramo_origen: null,
          tramo_destino: null,
        },
      ])
    ).toEqual({ tramo: null, rebajaHecha: true });
  });

  it("sin nada", () => {
    expect(
      partesNotaTramoRebaja([
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
