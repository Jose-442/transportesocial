import { describe, expect, it } from "vitest";
import {
  calcComision,
  calcPrecioConComision,
  formatEur,
} from "@/lib/pricing";

describe("pricing", () => {
  it("aplica comisión del 17 % al precio neto", () => {
    expect(calcPrecioConComision(100)).toBe(117);
    expect(calcComision(100)).toBe(17);
  });

  it("formatea euros en español", () => {
    expect(formatEur(10.5)).toContain("10");
    expect(formatEur(10.5)).toMatch(/€/);
  });
});
