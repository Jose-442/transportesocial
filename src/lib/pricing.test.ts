import { describe, expect, it } from "vitest";
import {
  calcComision,
  calcPrecioConComision,
  formatEur,
} from "@/lib/pricing";

describe("pricing", () => {
  it("aplica comisión del 22 % al precio neto", () => {
    expect(calcPrecioConComision(100)).toBe(122);
    expect(calcComision(100)).toBe(22);
  });

  it("formatea euros en español", () => {
    expect(formatEur(10.5)).toContain("10");
    expect(formatEur(10.5)).toMatch(/€/);
  });
});
