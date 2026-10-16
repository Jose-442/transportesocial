import Link from "next/link";
import type { AdminPagosResumen } from "@/actions/admin-pagos";
import { Card } from "@/components/ui/Card";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import {
  ESTADO_ESCROW_LABELS,
  TIPO_TRANSACCION_LABELS,
} from "@/lib/admin/labels";
import { centimosAEuros } from "@/lib/reservas/cancelacion";
import { formatEur } from "@/lib/pricing";
import type { PagoConPartes, SaldoStripe } from "@/lib/stripe/resumen-saldo";
import { isStripeTestMode } from "@/lib/stripe/server";

const STRIPE_DASHBOARD = isStripeTestMode()
  ? "https://dashboard.stripe.com/test"
  : "https://dashboard.stripe.com/";

function euros(centimos: number): string {
  return formatEur(centimosAEuros(centimos));
}

function LineaParte({ texto }: { texto: string }) {
  return <p className="text-sm text-zinc-800">{texto}</p>;
}

function PartesDeUnPago({ pago }: { pago: PagoConPartes }) {
  return (
    <Card className="space-y-1">
      <p className="font-semibold text-zinc-900">
        Cobrado {euros(pago.cobradoCents)}
      </p>
      <p className="text-xs text-zinc-500">
        {new Date(pago.cuando).toLocaleString("es-ES", {
          timeZone: "Europe/Madrid",
        })}
      </p>
      <LineaParte
        texto={
          pago.devueltoCents > 0
            ? `${euros(pago.devueltoCents)} vuelven a quien pagó`
            : "No se ha devuelto nada a quien pagó"
        }
      />
      <LineaParte texto={`${euros(pago.stripeCents)} se los queda Stripe`} />
      {pago.webCents != null && pago.conductorCents != null ? (
        <>
          <LineaParte texto={`${euros(pago.webCents)} para la web`} />
          <LineaParte
            texto={`${euros(pago.conductorCents)} para el conductor`}
          />
        </>
      ) : (
        <LineaParte
          texto={`${euros(pago.saldoCents)} los deja Stripe en el saldo`}
        />
      )}
    </Card>
  );
}

export function AdminPagosPanel({
  resumen,
  saldo,
  errorSaldo,
}: {
  resumen: AdminPagosResumen;
  saldo: SaldoStripe | null;
  errorSaldo?: string | null;
}) {
  return (
    <div className="space-y-4">
      {errorSaldo ? (
        <Card>
          <p className="text-sm text-zinc-800">{errorSaldo}</p>
        </Card>
      ) : null}
      {saldo ? (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="space-y-1">
              <p className="text-sm text-zinc-600">Stripe lo deja en tu saldo</p>
              <p className="text-3xl font-bold text-zinc-900">
                {euros(saldo.disponibleCents + saldo.pendienteCents)}
              </p>
              <p className="text-sm text-zinc-600">
                Disponible {euros(saldo.disponibleCents)}. Pendiente{" "}
                {euros(saldo.pendienteCents)}.
              </p>
            </Card>
            <Card className="space-y-1">
              <p className="text-sm text-zinc-600">Stripe se queda las comisiones</p>
              <p className="text-3xl font-bold text-zinc-900">
                {euros(saldo.comisionStripeCents)}
              </p>
              <p className="text-sm text-zinc-600">
                Esa comisión no vuelve. Si Stripe la devuelve en un reembolso,
                esta cifra baja sola.
              </p>
            </Card>
          </div>
          <Card className="space-y-1 text-sm text-zinc-700">
            <p>Cobrado en total: {euros(saldo.cobradoCents)}.</p>
            <p>Vuelto a quien pagó: {euros(saldo.devueltoCents)}.</p>
            <p>Ya mandado al banco: {euros(saldo.alBancoCents)}.</p>
            {saldo.incompleto ? (
              <p>
                Hay tantos movimientos que la comisión y los totales de arriba
                no llegan al último. El saldo sí incluye todos.
              </p>
            ) : (
              <p>Estas sumas salen solas de todos los pagos. No hay que abrirlos uno a uno.</p>
            )}
          </Card>
          <h2 className="text-lg font-semibold text-zinc-900">
            Dónde va cada parte
          </h2>
          <div className="space-y-3">
            {saldo.pagos.map((pago) => (
              <PartesDeUnPago key={pago.id} pago={pago} />
            ))}
          </div>
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <AdminStatCard
          label="Suscripciones antiguas"
          value={resumen.suscripcionesActivas}
        />
        <Card className="flex flex-col justify-center gap-2">
          <p className="text-sm text-zinc-600">Más detalle en Stripe</p>
          <Link
            href={STRIPE_DASHBOARD}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-emerald-700"
          >
            Abrir Stripe Dashboard →
          </Link>
        </Card>
      </div>

      <h2 className="text-lg font-semibold text-zinc-900">
        Transacciones recientes
      </h2>

      {resumen.transacciones.length === 0 ? (
        <Card>
          <p className="text-sm text-zinc-600">No hay transacciones registradas.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {resumen.transacciones.map((t) => (
            <Card key={t.id} className="space-y-1">
              <p className="font-semibold text-zinc-900">
                {TIPO_TRANSACCION_LABELS[t.tipo] ?? t.tipo} · {formatEur(t.monto)}
              </p>
              <p className="text-sm text-zinc-600">
                {ESTADO_ESCROW_LABELS[t.estado_escrow] ?? t.estado_escrow} ·{" "}
                {new Date(t.created_at).toLocaleString("es-ES")}
              </p>
              {t.reserva_id && (
                <Link
                  href={`/reservas/${t.reserva_id}`}
                  className="text-sm font-semibold text-emerald-700"
                >
                  Ver reserva
                </Link>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
