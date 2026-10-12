import { describe, expect, it } from "vitest";
import {
  lineasJustificante,
  partirIvaIncluido,
  puedeDescargarJustificante,
} from "@/lib/justificante-pago";

describe("justificante de pago", () => {
  it("solo se puede descargar cuando el pago ya está hecho", () => {
    expect(puedeDescargarJustificante("pendiente_pago")).toBe(false);
    expect(puedeDescargarJustificante("cancelado")).toBe(false);
    expect(puedeDescargarJustificante("confirmada")).toBe(true);
    expect(puedeDescargarJustificante("liberado")).toBe(true);
  });

  it("desglosa el IVA de los gastos de gestión y no lo llama factura", () => {
    const texto = lineasJustificante({
      referencia: "ABCD1234",
      cliente: "Ana",
      conductor: "Luis",
      origen: "Madrid",
      destino: "Valencia",
      fechaHora: "lunes, 20 de octubre, 09:00",
      importe: "94,40 EUR",
      gastosGestion: "14,40 EUR",
      baseImponible: "11,90 EUR",
      iva: "2,50 EUR",
    }).join("\n");

    expect(texto).toContain("JUSTIFICANTE DE PAGO");
    expect(texto).not.toContain("JUSTIFICANTE DE RESERVA");
    expect(texto).toContain("Importe total abonado: 94,40 EUR");
    expect(texto).toContain("Gastos de gestión (IVA incluido): 14,40 EUR");
    expect(texto).toContain("Base imponible: 11,90 EUR");
    expect(texto).toContain("IVA 21 %: 2,50 EUR");
    expect(texto.split("\n")[0]).toBe("JUSTIFICANTE DE PAGO");
    expect(texto.split("\n")[1]).toBe("Estado: Pagado a través de la plataforma.");
    expect(texto.toLowerCase()).not.toContain("factura");
  });

  it("si el viaje se canceló, dice lo devuelto", () => {
    const texto = lineasJustificante({
      referencia: "ABCD1234",
      cliente: "Ana",
      conductor: "Luis",
      origen: "Burgos",
      destino: "Madrid",
      fechaHora: "lunes, 12 de octubre, 17:00",
      importe: "94,40 EUR",
      gastosGestion: "14,40 EUR",
      baseImponible: "11,90 EUR",
      iva: "2,50 EUR",
      devuelto: "94,40 EUR",
    }).join("\n");

    expect(texto.split("\n")[0]).toBe("JUSTIFICANTE DE PAGO");
    expect(texto.split("\n")[1]).toBe("Estado: Cancelado. Devuelto: 94,40 EUR.");
    expect(texto).not.toContain("Estado: Pagado a través de la plataforma.");
  });

  it("el 21 % ya va dentro de los gastos de gestión", () => {
    expect(partirIvaIncluido(1440)).toEqual({ base: 1190, cuota: 250 });
    expect(partirIvaIncluido(720)).toEqual({ base: 595, cuota: 125 });
  });
});
