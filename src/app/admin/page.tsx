import Link from "next/link";
import { loadAdminDashboardStats } from "@/actions/admin-dashboard";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { Card } from "@/components/ui/Card";

export default async function AdminHomePage() {
  const { stats, avisoServidor } = await loadAdminDashboardStats();

  return (
    <div className="space-y-6">
      {avisoServidor && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {avisoServidor}
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Resumen</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Vista general de la plataforma. Pulsa en cada bloque para ver el
          detalle.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AdminStatCard
          label="Disputas abiertas"
          value={stats.disputasAbiertas}
          href="/admin/disputas"
          urgent
        />
        <AdminStatCard
          label="Reservas esperando al conductor"
          value={stats.reservasPendientesAprobacion}
          href="/admin/reservas?estado=pendiente_aprobacion"
          urgent
        />
        <AdminStatCard
          label="Viajes propuestos activos"
          value={stats.viajesActivos}
          href="/admin/anuncios"
        />
        <AdminStatCard
          label="Propuestas de envío activas"
          value={stats.propuestasBultoActivas}
          href="/admin/anuncios?tab=bultos"
        />
        <AdminStatCard
          label="Usuarios registrados"
          value={stats.usuariosRegistrados}
          href="/admin/usuarios"
        />
        <AdminStatCard
          label="Suscripciones activas"
          value={stats.suscripcionesActivas}
          href="/admin/pagos"
        />
      </div>

      <Card className="space-y-3">
        <h2 className="font-semibold text-zinc-900">Accesos rápidos</h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Link
            href="/admin/disputas"
            className="rounded-xl bg-emerald-700 px-4 py-3 text-center text-sm font-semibold text-white"
          >
            Gestionar disputas
          </Link>
          <Link
            href="/admin/reservas?estado=pendiente_aprobacion"
            className="rounded-xl bg-zinc-100 px-4 py-3 text-center text-sm font-semibold text-zinc-800"
          >
            Ver reservas pendientes
          </Link>
          <Link
            href="/admin/anuncios"
            className="rounded-xl bg-zinc-100 px-4 py-3 text-center text-sm font-semibold text-zinc-800"
          >
            Ver anuncios
          </Link>
        </div>
      </Card>
    </div>
  );
}
