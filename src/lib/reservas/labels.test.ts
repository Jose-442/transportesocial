import { describe, expect, it } from "vitest";
import { chatPermitido, fraseQueHasReservado, fraseQueIncluyeReservas, resumenChatViaje } from "@/lib/reservas/labels";

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

  it("el conductor ve el nombre, lo reservado y las plazas que le quedan", () => {
    expect(
      fraseQueHasReservado(
        [
          {
            tipo: "ruta_directa",
            bulto_descripcion: "maleta",
            cantidad: 1,
          },
          {
            tipo: "capacidad_extra",
            bulto_descripcion: "Plaza de acompañante (×1)",
            cantidad: 1,
          },
        ],
        { esCliente: false, nombreCliente: "Oto", plazasLibres: 2 }
      )
    ).toBe(
      "Oto ha reservado espacio para 1 bulto y 1 plaza, te queda libre 2 plazas"
    );
  });

  it("una plaza libre va en singular", () => {
    expect(
      fraseQueHasReservado(
        {
          tipo: "capacidad_extra",
          bulto_descripcion: "Plazas de acompañante (×2)",
          cantidad: 2,
        },
        { esCliente: false, nombreCliente: "Oto", plazasLibres: 1 }
      )
    ).toBe("Oto ha reservado espacio para 2 plazas, te queda libre 1 plaza");
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

describe("resumenChatViaje", () => {
  it("pone trayecto, bulto y plazas", () => {
    expect(
      resumenChatViaje(
        [
          {
            tipo: "ruta_directa",
            bulto_descripcion: "lavadora",
            cantidad: 1,
          },
          {
            tipo: "capacidad_extra",
            bulto_descripcion: "Plaza de acompañante (×2)",
            cantidad: 2,
          },
        ],
        { origen: "Burgos", destino: "Madrid" }
      )
    ).toBe("Burgos → Madrid, 1 bulto 2 plazas");
  });
});

describe("chatPermitido", () => {
  it("el chat se abre cuando la reserva está confirmada", () => {
    expect(chatPermitido("pendiente_pago")).toBe(false);
    expect(chatPermitido("pendiente_aprobacion")).toBe(false);
    expect(chatPermitido("cancelado")).toBe(false);
    expect(chatPermitido("confirmada")).toBe(true);
    expect(chatPermitido("en_transito")).toBe(true);
    expect(chatPermitido("entregado")).toBe(true);
    expect(chatPermitido("disputa")).toBe(true);
  });
});
