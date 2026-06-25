import { loadAdminReservas } from "@/actions/admin-reservas";
import { AdminReservasList } from "@/components/admin/AdminReservasList";

export const metadata = { title: "Reservas — Administración" };

export default async function AdminReservasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const estado =
    typeof params.estado === "string" ? params.estado : "todas";
  const q = typeof params.q === "string" ? params.q : "";
  const reservas = await loadAdminReservas({ estado, q });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Reservas</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Listado de reservas. Puedes buscar por ID o filtrar por estado.
        </p>
      </div>
      <AdminReservasList reservas={reservas} estado={estado} q={q} />
    </div>
  );
}
