import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { formatEur } from "@/lib/pricing";
import { resumenVehiculoPublico } from "@/lib/vehiculo";
import type { OfertaPrecio, PerfilPublico } from "@/types/database";
import { OfertaAcciones } from "./OfertaAcciones";

const estadoTone = {
  pendiente: "amber",
  aceptada: "green",
  rechazada: "zinc",
  expirada: "zinc",
} as const;

export function OfertasList({
  ofertas,
  esDueno,
  perfiles = {},
}: {
  ofertas: OfertaPrecio[];
  esDueno: boolean;
  perfiles?: Record<string, PerfilPublico>;
}) {
  if (ofertas.length === 0) {
    return (
      <p className="text-base text-zinc-500">Aún no hay propuestas de precio.</p>
    );
  }

  return (
    <div className="space-y-3">
      {ofertas.map((oferta) => {
        const perfil = perfiles[oferta.conductor_id];
        const vehiculo = perfil ? resumenVehiculoPublico(perfil) : null;

        return (
          <Card key={oferta.id}>
            {esDueno && perfil && (
              <div className="mb-3 flex items-start gap-3 border-b border-zinc-100 pb-3">
                <UserAvatar
                  name={perfil.display_name}
                  avatarUrl={perfil.avatar_url}
                  size={40}
                />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/perfil/${perfil.id}`}
                    className="font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    {perfil.display_name}
                  </Link>
                  {perfil.sobre_ti?.trim() && (
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
                      {perfil.sobre_ti.trim()}
                    </p>
                  )}
                  {vehiculo && (
                    <p className="mt-1 text-sm text-zinc-600">{vehiculo}</p>
                  )}
                </div>
              </div>
            )}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-emerald-700">
                  Total: {formatEur(Number(oferta.precio_total))}
                </p>
                {oferta.desglose &&
                  oferta.desglose.plazas_solicitadas > 0 &&
                  oferta.desglose.plazas_ofrecidas <
                    oferta.desglose.plazas_solicitadas && (
                    <p className="mt-1 text-sm text-zinc-600">
                      Cubre {oferta.desglose.plazas_ofrecidas} de{" "}
                      {oferta.desglose.plazas_solicitadas} pasajeros
                      solicitados
                    </p>
                  )}
                {oferta.mensaje && (
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-zinc-800">
                      Aclaración del conductor:
                    </p>
                    <p className="mt-0.5 text-base text-zinc-600">{oferta.mensaje}</p>
                  </div>
                )}
              </div>
              <Badge tone={estadoTone[oferta.estado]}>{oferta.estado}</Badge>
            </div>
            {esDueno && oferta.estado === "pendiente" && (
              <OfertaAcciones ofertaId={oferta.id} />
            )}
          </Card>
        );
      })}
    </div>
  );
}
