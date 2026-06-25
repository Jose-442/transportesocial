import Link from "next/link";
import type { AdminPagosResumen } from "@/actions/admin-pagos";
import { Card } from "@/components/ui/Card";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import {
  ESTADO_ESCROW_LABELS,
  TIPO_TRANSACCION_LABELS,
} from "@/lib/admin/labels";
import { formatEur } from "@/lib/pricing";

const STRIPE_DASHBOARD = "https://dashboard.stripe.com/";

export function AdminPagosPanel({ resumen }: { resumen: AdminPagosResumen }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <AdminStatCard
          label="Suscripciones activas"
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
