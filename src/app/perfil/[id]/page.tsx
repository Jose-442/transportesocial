import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { getResenasPublicasPerfil } from "@/actions/resenas";
import { createClient } from "@/lib/supabase/server";
import { loadPerfilPublico } from "@/lib/profile";
import { resumenVehiculoPublico } from "@/lib/vehiculo";
import { UserAvatar } from "@/components/profile/UserAvatar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const perfil = await loadPerfilPublico(supabase, id);
  return {
    title: perfil?.display_name
      ? `Perfil de ${perfil.display_name}`
      : `Perfil ${id.slice(0, 8)}`,
  };
}

export default async function PerfilPublicoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const perfil = await loadPerfilPublico(supabase, id);
  if (!perfil) notFound();

  const resenas = await getResenasPublicasPerfil(id);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const volverHref = user?.id === id ? "/cuenta" : "/bultos";
  const vehiculo = resumenVehiculoPublico(perfil);

  return (
    <div className="space-y-4">
      <Link
        href={volverHref}
        className="inline-flex min-h-11 items-center text-sm font-semibold text-emerald-700"
      >
        ← Volver
      </Link>

      <Card className="flex items-center gap-4">
        <UserAvatar
          name={perfil.display_name}
          avatarUrl={perfil.avatar_url}
          size={64}
        />
        <div>
          <h1 className="text-xl font-bold text-zinc-900">
            {perfil.display_name}
          </h1>
          {(perfil.rating_cantidad ?? 0) > 0 && (
            <p className="mt-1 text-sm text-amber-600">
              ★ {Number(perfil.rating_promedio).toFixed(1)} ·{" "}
              {perfil.rating_cantidad}{" "}
              {perfil.rating_cantidad === 1 ? "valoración" : "valoraciones"}
            </p>
          )}
          {perfil.sobre_ti?.trim() ? (
            <p className="mt-2 text-base text-zinc-600">{perfil.sobre_ti.trim()}</p>
          ) : (
            <p className="mt-2 text-base text-zinc-500">
              Sin presentación pública aún.
            </p>
          )}
          {vehiculo && (
            <p className="mt-2 text-sm text-zinc-600">
              <span className="font-semibold text-zinc-800">Vehículo:</span>{" "}
              {vehiculo}
            </p>
          )}
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold text-zinc-900">Valoraciones</h2>
        {resenas.length === 0 ? (
          <p className="text-sm text-zinc-500">Sin valoraciones públicas aún.</p>
        ) : (
          resenas.map((r, i) => (
            <div
              key={i}
              className="border-b border-zinc-100 pb-3 last:border-0 last:pb-0"
            >
              <p className="text-amber-500 text-sm">
                {"★".repeat(r.puntuacion)}
              </p>
              <p className="mt-1 text-sm text-zinc-700">{r.comentario}</p>
              <p className="mt-1 text-xs text-zinc-400">
                {new Date(r.created_at).toLocaleDateString("es-ES")}
              </p>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
