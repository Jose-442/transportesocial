import { describe, expect, it } from "vitest";
import { fraseQueHasReservado, fraseQueIncluyeReservas } from "@/lib/reservas/labels";

describe("fraseQueHasReservado", () => {
  it("una plaza no dice bulto", () => {
    expect(
      fraseQueHasReservado({
        tipo: "capacidad_extra",
        bulto_descripcion: "Plaza de acompañante (×1)",
        cantidad: 1,
      })
    ).toBe("Has reservado espacio para 1 plaza");
  });

  it("varias plazas", () => {
    expect(
      fraseQueHasReservado({
        tipo: "capacidad_extra",
        bulto_descripcion: "Plazas de acompañante (×2)",
        cantidad: 2,
      })
    ).toBe("Has reservado espacio para 2 plazas");
  });

  it("el porte del bulto", () => {
    expect(
      fraseQueHasReservado({
        tipo: "ruta_directa",
        bulto_descripcion: "lavadora",
        cantidad: 1,
      })
    ).toBe("Has reservado espacio para 1 bulto");
  });

  it("bulto y plaza en una sola frase", () => {
    expect(
      fraseQueHasReservado(
        [
          {
            tipo: "ruta_directa",
            bulto_descripcion: "lavadora",
            cantidad: 1,
          },
          {
            tipo: "capacidad_extra",
            bulto_descripcion: "Plaza de acompañante (×1)",
            cantidad: 1,
          },
        ]
      )
    ).toBe("Has reservado espacio para 1 bulto y 1 plaza");
  });
});

describe("fraseQueIncluyeReservas", () => {
  it("bulto y plaza juntos", () => {
    expect(
      fraseQueIncluyeReservas([
        {
          tipo: "ruta_directa",
          bulto_descripcion: "lavadora",
          cantidad: 1,
        },
        {
          tipo: "capacidad_extra",
          bulto_descripcion: "Plaza de acompañante (×1)",
          cantidad: 1,
        },
      ])
    ).toBe("Reserva para 1 bulto y 1 plaza");
  });
});
