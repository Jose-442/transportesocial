import { describe, expect, it } from "vitest";
import { desglosePago } from "@/lib/precios/desglose-pago";

describe("desglosePago", () => {
  it("separa el porte, la plaza y los gastos de gestión", () => {
    const { lineas, totalCentimos } = desglosePago([
      {
        tipo: "ruta_directa",
        precio_neto: 40,
        precio_total: 47.2,
        cantidad: 1,
        bulto_descripcion: "maleta",
      },
      {
        tipo: "capacidad_extra",
        precio_neto: 40,
        precio_total: 47.2,
        cantidad: 1,
        bulto_descripcion: "Plaza de acompañante (×1)",
      },
    ]);

    expect(lineas).toEqual([
      { concepto: "Porte de bulto", centimos: 4000 },
      { concepto: "Una plaza", centimos: 4000 },
      { concepto: "Gastos de gestión", centimos: 1440 },
    ]);
    expect(totalCentimos).toBe(9440);
    expect(lineas.reduce((sum, linea) => sum + linea.centimos, 0)).toBe(totalCentimos);
  });

  it("en una propuesta parte el bulto y las plazas", () => {
    const { lineas, totalCentimos } = desglosePago([
      {
        tipo: "bulto_oferta",
        precio_neto: 50,
        precio_total: 59,
        cantidad: 2,
        bulto_descripcion: "caja",
        desglose: {
          precio_neto_bulto: 30,
          precio_neto_plaza: 10,
          num_plazas: 2,
          plazas_solicitadas: 2,
          plazas_ofrecidas: 2,
          precio_total_bulto: 35.4,
          precio_total_plaza_unitario: 11.8,
        },
      },
    ]);

    expect(lineas.map((linea) => linea.concepto)).toEqual([
      "Porte de bulto",
      "2 plazas",
      "Gastos de gestión",
    ]);
    expect(lineas.reduce((sum, linea) => sum + linea.centimos, 0)).toBe(totalCentimos);
  });
});
