import { describe, expect, it } from "vitest";
import { pdfJustificante } from "@/lib/justificante-pdf";

describe("pdf del justificante", () => {
  it("genera un PDF", async () => {
    const bytes = await pdfJustificante({
      referencia: "ABCD1234",
      cliente: "Ana Pérez",
      conductor: "Luis García",
      origen: "Madrid",
      destino: "A Coruña",
      fechaHora: "lunes, 20 de octubre, 09:00",
      importe: "20,00 EUR",
    });
    const inicio = Buffer.from(bytes.subarray(0, 5)).toString("utf8");
    expect(inicio).toBe("%PDF-");
  });
});
