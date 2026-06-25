import {
  loadDisputasAdmin,
  type FiltroDisputasAdmin,
} from "@/actions/admin-disputas";
import { DisputasAdminPanel } from "@/components/admin/DisputasAdminPanel";

export const metadata = { title: "Disputas — Administración" };

function parseFiltro(
  raw: string | string[] | undefined
): FiltroDisputasAdmin {
  const v = typeof raw === "string" ? raw : "abiertas";
  if (v === "resueltas" || v === "todas") return v;
  return "abiertas";
}

export default async function AdminDisputasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filtro = parseFiltro(params.filtro);
  const disputas = await loadDisputasAdmin(filtro);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Disputas</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Revisa reclamaciones y resuélvelas a favor del cliente o del
          conductor.
        </p>
      </div>
      <DisputasAdminPanel disputas={disputas} filtro={filtro} />
    </div>
  );
}
