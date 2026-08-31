import { isStripeTestMode } from "@/lib/stripe/server";

export function StripeTestBanner() {
  if (!isStripeTestMode()) {
    return null;
  }

  return (
    <div
      role="status"
      className="bg-amber-400 px-3 py-2 text-center text-sm font-semibold text-zinc-900"
    >
      Modo prueba: no se cobra dinero de verdad. Tarjeta: 4242 4242 4242 4242
      (cualquier fecha futura y CVC).
    </div>
  );
}