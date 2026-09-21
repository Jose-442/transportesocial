import { describe, expect, it } from "vitest";
import {
  agruparReservasMismoCobro,
  avisosSinAceptarYRechazarALaVez,
  idReservaDelAviso,
  omitirAvisoPlazaEnLote,
} from "@/lib/reservas/aviso-viaje";

const base = {
  cliente_id: "cli",
  ruta_conductor_id: "ruta",
};

describe("agruparReservasMismoCobro", () => {
  it("junta bulto y plaza del mismo pago y deja aparte una plaza posterior", () => {
    const bulto = {
      ...base,
      id: "bulto",
      tipo: "ruta_directa" as const,
      created_at: "2026-09-19T10:00:00.000Z",
    };
    const plaza1 = {
      ...base,
      id: "plaza1",
      tipo: "capacidad_extra" as const,
      created_at: "2026-09-19T10:00:02.000Z",
    };
    const plaza2 = {
      ...base,
      id: "plaza2",
      tipo: "capacidad_extra" as const,
      created_at: "2026-09-19T18:00:00.000Z",
    };
    const grupos = agruparReservasMismoCobro([bulto, plaza1, plaza2]);
    expect(grupos).toHaveLength(2);
    expect(idReservaDelAviso(grupos[0]!)).toBe("bulto");
    expect(grupos[1]!.map((r) => r.id)).toEqual(["plaza2"]);
  });
});

describe("omitirAvisoPlazaEnLote", () => {
  it("en un pago de bulto y plaza no avisa otra vez por la plaza", () => {
    expect(
      omitirAvisoPlazaEnLote(
        [{ tipo: "ruta_directa" }, { tipo: "capacidad_extra" }],
        "capacidad_extra"
      )
    ).toBe(true);
    expect(
      omitirAvisoPlazaEnLote(
        [{ tipo: "ruta_directa" }, { tipo: "capacidad_extra" }],
        "ruta_directa"
      )
    ).toBe(false);
  });

  it("si solo se paga una plaza suelta sí avisa", () => {
    expect(
      omitirAvisoPlazaEnLote([{ tipo: "capacidad_extra" }], "capacidad_extra")
    ).toBe(false);
  });
});

describe("avisosSinAceptarYRechazarALaVez", () => {
  it("si el mismo viaje está aceptado y rechazado, se queda el aviso más nuevo", () => {
    const reservas = [
      { id: "nueva", cliente_id: "cli", ruta_conductor_id: "ruta" },
      { id: "vieja", cliente_id: "cli", ruta_conductor_id: "ruta" },
    ];
    const avisos = [
      {
        id: "1",
        tipo: "reserva_confirmada",
        enlace: "/reservas/nueva",
      },
      {
        id: "2",
        tipo: "reserva_rechazada",
        enlace: "/reservas/vieja",
      },
    ];
    const out = avisosSinAceptarYRechazarALaVez(avisos, reservas);
    expect(out.map((n) => n.id)).toEqual(["1"]);
  });

  it("deja avisos de otros viajes", () => {
    const reservas = [
      { id: "a", cliente_id: "cli", ruta_conductor_id: "ruta1" },
      { id: "b", cliente_id: "cli", ruta_conductor_id: "ruta2" },
    ];
    const avisos = [
      { id: "1", tipo: "reserva_confirmada", enlace: "/reservas/a" },
      { id: "2", tipo: "reserva_rechazada", enlace: "/reservas/b" },
    ];
    const out = avisosSinAceptarYRechazarALaVez(avisos, reservas);
    expect(out.map((n) => n.id)).toEqual(["1", "2"]);
  });
});
