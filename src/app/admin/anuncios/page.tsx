import {
  loadAdminPropuestasBulto,
  loadAdminViajes,
} from "@/actions/admin-anuncios";
import { AdminAnunciosPanel } from "@/components/admin/AdminAnunciosPanel";

export const metadata = { title: "Anuncios — Administración" };

export default async function AdminAnunciosPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const tab = params.tab === "bultos" ? "bultos" : "viajes";
  const estado =
    typeof params.estado === "string" ? params.estado : "todas";

  const [viajes, bultos] = await Promise.all([
    tab === "viajes" ? loadAdminViajes(estado) : Promise.resolve([]),
    tab === "bultos"
      ? loadAdminPropuestasBulto(estado)
      : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Anuncios</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Viajes propuestos por conductores y propuestas de personas que
          necesitan enviar bulto.
        </p>
      </div>
      <AdminAnunciosPanel
        tab={tab}
        estado={estado}
        viajes={viajes}
        bultos={bultos}
      />
    </div>
  );
}
