import { loadAdminPagosResumen } from "@/actions/admin-pagos";
import { AdminPagosPanel } from "@/components/admin/AdminPagosPanel";

export const metadata = { title: "Pagos — Administración" };

export default async function AdminPagosPage() {
  const resumen = await loadAdminPagosResumen();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Pagos y suscripciones</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Resumen de suscripciones y transacciones en la plataforma. Para el
          detalle completo, usa Stripe.
        </p>
      </div>
      <AdminPagosPanel resumen={resumen} />
    </div>
  );
}
