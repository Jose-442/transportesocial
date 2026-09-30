import { describe, expect, it } from "vitest";
import {
  codigosOtpIguales,
  generarCodigoOtp,
  hashCodigoOtp,
  otpFormatoValido,
} from "@/lib/sms/otp";

describe("sms otp", () => {
  it("genera 6 dígitos", () => {
    const c = generarCodigoOtp();
    expect(otpFormatoValido(c)).toBe(true);
  });

  it("hash coincide con el mismo codigo", () => {
    const codigo = "123456";
    const hash = hashCodigoOtp(codigo, "user-1", "+34612345678");
    expect(codigosOtpIguales(hash, codigo, "user-1", "+34612345678")).toBe(
      true
    );
    expect(codigosOtpIguales(hash, "000000", "user-1", "+34612345678")).toBe(
      false
    );
  });
});
