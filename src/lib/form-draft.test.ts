import { describe, expect, it } from "vitest";
import { borradorEsDeCuenta } from "@/lib/form-draft";

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
