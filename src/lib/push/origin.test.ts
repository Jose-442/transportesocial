import { describe, expect, it } from "vitest";
import { toAbsoluteAppUrl } from "@/lib/push/origin";

describe("toAbsoluteAppUrl", () => {
  it("antepone el origen a rutas relativas", () => {
    const url = toAbsoluteAppUrl("/reservas/abc");
    expect(url).toMatch(/\/reservas\/abc$/);
    expect(url.startsWith("http")).toBe(true);
  });

  it("respeta URLs absolutas", () => {
    expect(toAbsoluteAppUrl("https://transportesocial.es/cuenta")).toBe(
      "https://transportesocial.es/cuenta"
    );
  });
});
