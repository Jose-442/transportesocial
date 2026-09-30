import { describe, expect, it } from "vitest";
import {
  isMotivoRechazoRecogida,
  motivoCancelacionDesdeRecogida,
} from "@/lib/porte-recogida";

describe("porte-recogida", () => {
  it("valida motivos", () => {
    expect(isMotivoRechazoRecogida("no_coincide")).toBe(true);
    expect(isMotivoRechazoRecogida("otro")).toBe(false);
  });

  it("arma el motivo de cancelación", () => {
    expect(motivoCancelacionDesdeRecogida("sospecha_ilicita")).toContain(
      "Rechazo en recogida"
    );
  });
});
