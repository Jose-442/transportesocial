import { MENSAJE_IDENTIDAD_PARA_PAGAR } from "@/lib/identidad-pago";

export function AvisoIdentidadPago() {
  return (
    <p className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-3 text-base font-semibold text-amber-950">
      {MENSAJE_IDENTIDAD_PARA_PAGAR}
    </p>
  );
}
