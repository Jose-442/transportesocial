import { describe, expect, it } from "vitest";
import {
  lineasJustificante,
  puedeDescargarJustificante,
} from "@/lib/justificante-pago";

describe("justificante de pago", () => {
  it("solo se puede descargar cuando el pago ya está hecho", () => {
    expect(puedeDescargarJustificante("pendiente_pago")).toBe(false);
    expect(puedeDescargarJustificante("cancelado")).toBe(false);
    expect(puedeDescargarJustificante("confirmada")).toBe(true);
    expect(puedeDescargarJustificante("liberado")).toBe(true);
  });

  it("no lo llama factura ni desglosa el IVA", () => {
    const texto = lineasJustificante({
      referencia: "ABCD1234",
      cliente: "Ana",
      conductor: "Luis",
      origen: "Madrid",
      destino: "Valencia",
      fechaHora: "lunes, 20 de octubre, 09:00",
      importe: "20,00 EUR",
    }).join("\n");

    expect(texto).toContain("JUSTIFICANTE DE RESERVA Y PAGO");
    expect(texto).toContain("Importe total abonado: 20,00 EUR");
    expect(texto.toLowerCase()).not.toContain("factura");
    expect(texto).not.toContain("IVA");
  });
});
