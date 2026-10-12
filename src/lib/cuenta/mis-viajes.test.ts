import { describe, expect, it } from "vitest";
import { claveGrupoReserva } from "@/lib/cuenta/grupo-viaje";

const base = {
  cliente_id: "cliente",
  ruta_conductor_id: "ruta",
  estado: "cancelado" as const,
  created_at: "2026-10-12T08:00:00.000Z",
};

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
