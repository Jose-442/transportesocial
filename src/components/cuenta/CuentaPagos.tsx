import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { CUENTA_BTN_SECONDARY } from "@/components/cuenta/cuenta-ui";
import { createClient } from "@/lib/supabase/server";
import { loadPagosCuenta } from "@/lib/cuenta/pagos";
import { formatEur } from "@/lib/pricing";

export async function CuentaPagos({ userId }: { userId: string }) {
  const supabase = await createClient();
  const pagos = await loadPagosCuenta(supabase, userId);

  return (
    <Card className="space-y-4">
      <h2 className="font-semibold text-zinc-900">Pagos</h2>
      {pagos.length === 0 ? (
        <p className="text-base text-zinc-600">
          Aquí saldrán los viajes que hayas pagado.
        </p>
      ) : (
        <div className="space-y-3">
          {pagos.map((pago) => (
            <Card key={pago.id} className="space-y-2">
              <div>
                <p className="font-semibold text-zinc-900">{pago.titulo}</p>
                <p className="text-xs text-zinc-500">
                  {pago.detalle} ·{" "}
                  {new Date(pago.fecha).toLocaleDateString("es-ES", {
                    timeZone: "Europe/Madrid",
                  })}
                </p>
              </div>
              <p className="text-sm font-medium text-emerald-700">
                Pagado: {formatEur(pago.pagadoEur)}
              </p>
              {pago.devueltoEur != null && pago.devueltoEur > 0 ? (
                <p className="text-sm font-medium text-amber-950">
                  Devuelto: {formatEur(pago.devueltoEur)}
                </p>
              ) : null}
              {pago.resultanteEur != null && pago.resultanteEur > 0 ? (
                <p className="text-sm font-medium text-zinc-700">
                  Cantidad resultante: {formatEur(pago.resultanteEur)}
                </p>
              ) : null}
              {pago.puedeJustificante ? (
                <a
                  href={`/api/reservas/${pago.id}/justificante`}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
                >
                  Descargar justificante de pago
                </a>
              ) : null}
              <ButtonLink
                href={`/reservas/${pago.id}`}
                fullWidth
                variant="secondary"
                className={CUENTA_BTN_SECONDARY}
              >
                Ver viaje
              </ButtonLink>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}
