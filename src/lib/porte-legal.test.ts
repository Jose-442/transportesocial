import { describe, expect, it } from "vitest";
import { isTipoCarga } from "@/lib/porte-legal";

describe("porte-legal", () => {
  it("acepta solo voluminoso o paquete", () => {
    expect(isTipoCarga("voluminoso")).toBe(true);
    expect(isTipoCarga("paquete")).toBe(true);
    expect(isTipoCarga("mudanza")).toBe(false);
  });
});
