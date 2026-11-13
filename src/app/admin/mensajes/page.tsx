import {
  loadMensajesWebAdmin,
  type FiltroMensajesWeb,
} from "@/actions/mensajes-web";
import { MensajesWebAdminPanel } from "@/components/admin/MensajesWebAdminPanel";

export const metadata = { title: "Mensajes — Administración" };

function parseFiltro(raw: string | string[] | undefined): FiltroMensajesWeb {
  const v = typeof raw === "string" ? raw : "nuevas";
  if (v === "vistas" || v === "todas") return v;
  return "nuevas";
}

export default async function AdminMensajesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filtro = parseFiltro(params.filtro);
  const mensajes = await loadMensajesWebAdmin(filtro);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">
          Incidencias, mejoras y quejas
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Mensajes de quien ha iniciado sesión. Al marcarlos como vistos
          desaparecen del recuadro amarillo.
        </p>
      </div>
      <MensajesWebAdminPanel mensajes={mensajes} filtro={filtro} />
    </div>
  );
}
