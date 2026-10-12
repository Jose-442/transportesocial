import { describe, expect, it } from "vitest";
import { claveGrupoReserva } from "@/lib/cuenta/grupo-viaje";
import { salidaYaPasada } from "@/lib/cuenta/salida-pasada";

const base = {
  cliente_id: "cliente",
  ruta_conductor_id: "ruta",
  estado: "cancelado" as const,
  created_at: "2026-10-12T08:00:00.000Z",
};

describe("salidaYaPasada", () => {
  const ahora = new Date("2026-10-12T17:44:00.000Z");

  it("el viaje de ayer ya va al historial", () => {
    expect(salidaYaPasada("2026-10-11T11:00:00.000Z", ahora)).toBe(true);
  });

  it("un viaje de otro día, si ya pasó, también", () => {
    expect(salidaYaPasada("2026-09-01T08:00:00.000Z", ahora)).toBe(true);
  });

  it("un viaje que aún no ha salido sigue en propuestos", () => {
    expect(salidaYaPasada("2026-10-13T11:00:00.000Z", ahora)).toBe(false);
  });
});

describe("claveGrupoReserva", () => {
  it("junta la plaza y el bulto cancelados del mismo viaje", () => {
    const bulto = claveGrupoReserva(
      { ...base, id: "bulto" },
      "historial"
    );
    const plaza = claveGrupoReserva(
      { ...base, id: "plaza", created_at: "2026-10-12T08:00:20.000Z" },
      "historial"
    );
    expect(plaza).toBe(bulto);
  });

  it("no junta dos viajes cancelados en momentos distintos", () => {
    const primero = claveGrupoReserva(
      { ...base, id: "uno" },
      "historial"
    );
    const segundo = claveGrupoReserva(
      { ...base, id: "dos", created_at: "2026-10-13T08:00:00.000Z" },
      "historial"
    );
    expect(segundo).not.toBe(primero);
  });
});
