import { describe, expect, it } from "vitest";
import { alertaCoincideConRuta } from "@/lib/alertas-viaje";

describe("alerta de viaje", () => {
  it("coincide si la salida, la llegada y el día son los mismos", () => {
    expect(
      alertaCoincideConRuta(
        {
          origen: "Madrid",
          destino: "Valencia",
          fecha: "2026-10-20",
        },
        {
          origen: "Madrid",
          destino: "Valencia",
          fecha_salida: "2026-10-20",
        }
      )
    ).toBe(true);
  });

  it("no coincide si el destino es otro", () => {
    expect(
      alertaCoincideConRuta(
        {
          origen: "Madrid",
          destino: "Valencia",
          fecha: "2026-10-20",
        },
        {
          origen: "Madrid",
          destino: "Sevilla",
          fecha_salida: "2026-10-20",
        }
      )
    ).toBe(false);
  });
});
