import { loadAdminPagosResumen } from "@/actions/admin-pagos";
import { AdminPagosPanel } from "@/components/admin/AdminPagosPanel";
import { loadSaldoStripe } from "@/lib/stripe/resumen-saldo";

export const metadata = { title: "Pagos — Administración" };

export default async function AdminPagosPage() {
  const resumen = await loadAdminPagosResumen();
  let saldo = null;
  let errorSaldo: string | null = null;
  try {
    saldo = await loadSaldoStripe();
  } catch (error) {
    console.error("[admin-pagos] saldo", error);
    errorSaldo = "No se ha podido leer el saldo. Prueba otra vez.";
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Pagos</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Solo se ve aquí. Aunque sea modo prueba, dice qué se queda Stripe y
          qué entra en el saldo de la web.
        </p>
      </div>
      <AdminPagosPanel
        resumen={resumen}
        saldo={saldo}
        errorSaldo={errorSaldo}
      />
    </div>
  );
}
