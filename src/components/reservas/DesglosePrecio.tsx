import { formatEur } from "@/lib/pricing";
import type { LineaDesglose } from "@/lib/precios/desglose-pago";

export function DesglosePrecio({
  lineas,
  totalCentimos,
}: {
  lineas: LineaDesglose[];
  totalCentimos: number;
}) {
  if (totalCentimos <= 0 || lineas.length === 0) return null;

  return (
    <div className="space-y-1 text-sm text-zinc-800">
      {lineas.map((linea, index) => (
        <div key={`${linea.concepto}-${index}`} className="flex justify-between gap-3">
          <span>{linea.concepto}</span>
          <span>{formatEur(linea.centimos / 100)}</span>
        </div>
      ))}
      <div className="flex justify-between gap-3 font-semibold text-emerald-700">
        <span>Total</span>
        <span>{formatEur(totalCentimos / 100)}</span>
      </div>
    </div>
  );
}
