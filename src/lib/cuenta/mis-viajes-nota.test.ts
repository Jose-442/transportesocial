import { describe, expect, it } from "vitest";
import { notaTramoRebajaReserva } from "@/lib/cuenta/nota-tramo-rebaja";

describe("notaTramoRebajaReserva", () => {
  it("tramo con rebaja aceptada", () => {
    expect(
      notaTramoRebajaReserva([
        { es_tramo: true, rebaja_en: "2026-10-19T18:00:00Z" },
      ])
    ).toBe("Tramo del viaje · Rebaja de precio aceptada");
  });

  it("solo tramo", () => {
    expect(notaTramoRebajaReserva([{ es_tramo: true, rebaja_en: null }])).toBe(
      "Tramo del viaje (no el recorrido completo)"
    );
  });

  it("solo rebaja", () => {
    expect(
      notaTramoRebajaReserva([
        { es_tramo: false, rebaja_en: "2026-10-19T18:00:00Z" },
      ])
    ).toBe("Rebaja de precio aceptada");
  });

  it("sin nada especial", () => {
    expect(notaTramoRebajaReserva([{ es_tramo: false, rebaja_en: null }])).toBe(
      null
    );
  });
});
