import { describe, expect, it } from "vitest";
import {
  fraseAyudaCancelacionCliente,
  fraseAyudaCancelacionConductor,
  politicaCancelacionCliente,
  politicaCancelacionConductor,
  repartoCancelacion,
} from "@/lib/reservas/cancelacion";

const fila = {
  precio_neto: 100,
  precio_total: 118,
  comision_plataforma: 18,
};

const salida = "2026-09-22T10:00:00.000Z";

const pago = "2026-09-20T09:00:00.000Z";

describe("politicaCancelacionCliente", () => {
  it("en la primera hora: viaje menos tarifa del banco, aunque el conductor no haya aceptado", () => {
    expect(
      politicaCancelacionCliente(
        "pendiente_aprobacion",
        salida,
        new Date("2026-09-20T09:30:00.000Z"),
        pago
      )
    ).toEqual({ puede: true, tipo: "viaje_menos_banco" });
  });

  it("en la primera hora: viaje menos tarifa del banco aunque falten menos de 24 h", () => {
    expect(
      politicaCancelacionCliente(
        "confirmada",
        salida,
        new Date("2026-09-21T10:00:00.000Z"),
        "2026-09-21T09:20:00.000Z"
      )
    ).toEqual({ puede: true, tipo: "viaje_menos_banco" });
  });

  it("pasada la hora, antes de que acepte el conductor, se queda el 18 %", () => {
    expect(
      politicaCancelacionCliente(
        "pendiente_aprobacion",
        salida,
        new Date("2026-09-20T10:00:01.000Z"),
        pago
      )
    ).toEqual({ puede: true, tipo: "viaje_sin_gastos" });
  });

  it("tramo sin rebaja aceptada: casi todo menos el banco", () => {
    expect(
      politicaCancelacionCliente(
        "confirmada",
        salida,
        new Date("2026-09-20T10:00:01.000Z"),
        pago,
        {
          esTramo: true,
          pideRebaja: true,
          rebajaRechazada: true,
          rebajaHecha: false,
        }
      )
    ).toEqual({ puede: true, tipo: "viaje_menos_banco" });
  });

  it("tramo sin rebaja: en la primera hora también menos tarifa del banco", () => {
    expect(
      politicaCancelacionCliente(
        "confirmada",
        salida,
        new Date("2026-09-20T09:30:00.000Z"),
        pago,
        {
          esTramo: true,
          pideRebaja: true,
          rebajaRechazada: true,
          rebajaHecha: false,
        }
      )
    ).toEqual({ puede: true, tipo: "viaje_menos_banco" });
  });

  it("pasada la hora y más de 24 h antes de salir: el viaje, sin gastos de gestión", () => {
    expect(
      politicaCancelacionCliente(
        "confirmada",
        salida,
        new Date("2026-09-21T09:00:00.000Z"),
        pago
      )
    ).toEqual({ puede: true, tipo: "viaje_sin_gastos" });
  });

  it("pasada la hora, menos de 24 h y aún no ha salido: la mitad", () => {
    expect(
      politicaCancelacionCliente(
        "confirmada",
        salida,
        new Date("2026-09-22T02:00:00.000Z"),
        pago
      )
    ).toEqual({ puede: true, tipo: "mitad" });
  });

  it("después de la hora de salida ya no se puede cancelar", () => {
    expect(
      politicaCancelacionCliente(
        "confirmada",
        salida,
        new Date("2026-09-22T10:00:01.000Z")
      )
    ).toEqual({ puede: false });
  });

  it("en camino no se cancela por reloj", () => {
    expect(
      politicaCancelacionCliente("en_transito", salida, new Date("2026-09-21T09:00:00.000Z"))
    ).toEqual({ puede: false });
  });
});

describe("politicaCancelacionConductor", () => {
  it("si ya está confirmada y aún no ha salido, cancela y se devuelve el 100 %", () => {
    expect(
      politicaCancelacionConductor(
        "confirmada",
        salida,
        new Date("2026-09-22T09:00:00.000Z")
      )
    ).toEqual({
      puede: true,
      tipo: "total",
    });
  });

  it("ya pasada la hora del viaje, el conductor no puede cancelar", () => {
    expect(
      politicaCancelacionConductor(
        "confirmada",
        salida,
        new Date("2026-09-22T11:00:00.000Z")
      )
    ).toEqual({ puede: false });
  });

  it("mientras espera respuesta usa Rechazar, no este botón", () => {
    expect(politicaCancelacionConductor("pendiente_aprobacion")).toEqual({
      puede: false,
    });
  });
});

describe("repartoCancelacion", () => {
  it("total devuelve lo pagado", () => {
    expect(repartoCancelacion([fila], "total")).toEqual({
      reembolsoCents: 11800,
      conductorCents: 0,
      comisionCents: 0,
    });
  });

  it("con tiempo de sobra se queda el 18 %", () => {
    expect(repartoCancelacion([fila], "viaje_sin_gastos")).toEqual({
      reembolsoCents: 10000,
      conductorCents: 0,
      comisionCents: 1800,
    });
  });

  it("a última hora, mitad para cada uno y la web se queda el 18 %", () => {
    expect(repartoCancelacion([fila], "mitad")).toEqual({
      reembolsoCents: 5000,
      conductorCents: 5000,
      comisionCents: 1800,
    });
  });

  it("en céntimos impares no se pierde un céntimo", () => {
    expect(
      repartoCancelacion(
        [{ precio_neto: 10.01, precio_total: 11.81, comision_plataforma: 1.8 }],
        "mitad"
      )
    ).toEqual({
      reembolsoCents: 501,
      conductorCents: 500,
      comisionCents: 180,
    });
  });
});

describe("frases de cancelación", () => {
  it("dicen el reembolso sin rodeos", () => {
    expect(fraseAyudaCancelacionCliente("total", "118,00 €")).toBe(
      "Te devolvemos el 100 % (118,00 €). El reembolso, lo que tarde tu banco."
    );
    expect(fraseAyudaCancelacionCliente("viaje_sin_gastos", "70,00 €")).toBe(
      "Te devolvemos el viaje (70,00 €). Los gastos ocasionados por la gestión no se devuelven."
    );
    expect(fraseAyudaCancelacionCliente("viaje_sin_gastos", "45,50 €")).toBe(
      "Te devolvemos el viaje (45,50 €). Los gastos ocasionados por la gestión no se devuelven."
    );
    expect(fraseAyudaCancelacionCliente("mitad", "50,00 €")).toBe(
      "Faltan menos de 24 horas. Te devolvemos la mitad del viaje (50,00 €). El conductor se queda la otra mitad. El gasto de gestión no se devuelve."
    );
    expect(fraseAyudaCancelacionCliente("viaje_menos_banco", "59,00 €")).toBe(
      "Te devolvemos el viaje menos la pequeña tarifa del banco por la tarjeta."
    );
    expect(fraseAyudaCancelacionConductor("118,00 €")).toContain("100 %");
  });
});
