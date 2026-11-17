import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";
import { formatFechaDiaEs } from "@/lib/datetime-form";

export async function CuentaAvisosPedidos({ userId }: { userId: string }) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("alertas_viaje")
    .select("id, origen, destino, fecha")
    .eq("user_id", userId)
    .order("fecha", { ascending: true });

  const avisos = data ?? [];

  return (
    <Card className="space-y-3">
      <div>
        <h2 className="font-semibold text-zinc-900">Avisos que pediste</h2>
        <p className="mt-1 text-base text-zinc-600">
          Cuando un conductor publique esa ruta, te avisamos por correo.
        </p>
      </div>
      {avisos.length === 0 ? (
        <p className="rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-600">
          Aún no has pedido ningún aviso.
        </p>
      ) : (
        <ul className="space-y-2">
          {avisos.map((aviso) => (
            <li
              key={aviso.id}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-800"
            >
              <p className="font-semibold">
                {aviso.origen} → {aviso.destino}
              </p>
              <p className="mt-1 text-zinc-600">
                {formatFechaDiaEs(String(aviso.fecha))}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
