import { describe, expect, it } from "vitest";
import { borradorEsDeCuenta, normalizeNuevaRutaDraft } from "@/lib/form-draft";

describe("borradorEsDeCuenta", () => {
  it("acepta el borrador de la misma cuenta", () => {
    expect(borradorEsDeCuenta({ origen: "Madrid", _uid: "user-a" }, "user-a")).toBe(
      true
    );
  });

  it("rechaza el borrador de otra cuenta", () => {
    expect(borradorEsDeCuenta({ origen: "Madrid", _uid: "user-a" }, "user-b")).toBe(
      false
    );
  });

  it("rechaza un borrador viejo sin dueño si hay cuenta iniciada", () => {
    expect(borradorEsDeCuenta({ origen: "Madrid" }, "user-a")).toBe(false);
  });

  it("acepta un borrador sin dueño si no hay sesión", () => {
    expect(borradorEsDeCuenta({ email: "a@b.es" }, "")).toBe(true);
  });

  it("rechaza un borrador de una cuenta si se ha cerrado sesión", () => {
    expect(borradorEsDeCuenta({ origen: "Madrid", _uid: "user-a" }, "")).toBe(
      false
    );
  });
});

describe("normalizeNuevaRutaDraft plazas", () => {
  it("no marca ninguna plaza en un formulario vacío", () => {
    const draft = normalizeNuevaRutaDraft({});
    expect(draft.plazas_acompanante).toBe("");
    expect(draft.plazas_marcadas).toBe(false);
    expect(draft.tipo_oferta).toBe("");
  });

  it("quita el 1 que se guardaba solo, sin precio de acompañante", () => {
    const draft = normalizeNuevaRutaDraft({
      plazas_acompanante: "1",
      precio_neto_plaza: "",
    });
    expect(draft.plazas_acompanante).toBe("");
    expect(draft.tipo_oferta).toBe("");
  });

  it("si había espacio y no plazas, es solo bulto", () => {
    const draft = normalizeNuevaRutaDraft({
      espacio_tamano: "XXL (Mudanza completa)",
      plazas_acompanante: "0",
    });
    expect(draft.tipo_oferta).toBe("solo_bulto");
    expect(draft.plazas_acompanante).toBe("0");
  });

  it("conserva Solo bulto si ya estaba marcado", () => {
    expect(
      normalizeNuevaRutaDraft({ plazas_acompanante: "0" }).plazas_acompanante
    ).toBe("0");
  });

  it("conserva 1 plaza si el conductor ya puso precio", () => {
    const draft = normalizeNuevaRutaDraft({
      plazas_acompanante: "1",
      precio_neto_plaza: "15",
    });
    expect(draft.plazas_acompanante).toBe("1");
    expect(draft.tipo_oferta).toBe("solo_pasajeros");
  });

  it("espacio y plazas con precio es bulto y pasajeros", () => {
    const draft = normalizeNuevaRutaDraft({
      espacio_tamano: "Pequeño (Maleta)",
      plazas_acompanante: "2",
      precio_neto_plaza: "10",
    });
    expect(draft.tipo_oferta).toBe("bulto_y_pasajeros");
    expect(draft.plazas_acompanante).toBe("2");
  });
});
