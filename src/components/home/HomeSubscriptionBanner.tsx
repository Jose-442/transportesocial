import { Card } from "@/components/ui/Card";
import { COMMISSION_PERCENT_LABEL } from "@/lib/constants";

export function HomeSubscriptionBanner() {
  return (
    <Card className="space-y-4 border-emerald-200 bg-emerald-50/80">
      <div className="space-y-2 text-base text-zinc-800 sm:text-lg">
        <p className="font-semibold text-zinc-900">
          Usar Transporte Social es gratis
        </p>
        <p>
          Registrarse, publicar viajes y buscar es gratis. Solo se paga al
          reservar un viaje: el importe se cobra por adelantado y la web lo
          retiene hasta confirmar que el viaje o el porte ha salido bien. Entonces
          se aplica un {COMMISSION_PERCENT_LABEL} de gestión.
        </p>
      </div>
    </Card>
  );
}
