import { describe, expect, it } from "vitest";
import { identidadListaParaPagar } from "@/lib/identidad-pago";

describe("identidadListaParaPagar", () => {
  it("exige telefono y documento validos", () => {
    expect(identidadListaParaPagar({}).ok).toBe(false);
    expect(
      identidadListaParaPagar({
        phone: "+34612345678",
        documento_identidad: null,
      }).ok
    ).toBe(false);
    expect(
      identidadListaParaPagar({
        phone: "+34612345678",
        documento_identidad: "12345678Z",
      }).ok
    ).toBe(true);
  });
});
