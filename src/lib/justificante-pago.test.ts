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

    expect(texto).toContain("JUSTIFICANTE DE RESERVA Y PAGO");
    expect(texto).toContain("Importe total abonado: 94,40 EUR");
    expect(texto).toContain("Gastos de gestión (IVA incluido): 14,40 EUR");
    expect(texto).toContain("Base imponible: 11,90 EUR");
    expect(texto).toContain("IVA 21 %: 2,50 EUR");
    expect(texto.toLowerCase()).not.toContain("factura");
  });

  it("el 21 % ya va dentro de los gastos de gestión", () => {
    expect(partirIvaIncluido(1440)).toEqual({ base: 1190, cuota: 250 });
    expect(partirIvaIncluido(720)).toEqual({ base: 595, cuota: 125 });
  });
});
