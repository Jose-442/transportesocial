import type { User } from "@supabase/supabase-js";
import type { PerfilPublico, Profile } from "@/types/database";
import type { createClient } from "@/lib/supabase/server";

type ServerClient = Awaited<ReturnType<typeof createClient>>;

export const PROFILE_SOBRE_TI_MAX = 280;

const PERFIL_PUBLICO_SELECT =
  "id, display_name, avatar_url, sobre_ti, vehiculo_marca, vehiculo_modelo, vehiculo_anio, distintivo_ambiental, rating_promedio, rating_cantidad";

const PERFIL_PUBLICO_SELECT_LEGACY =
  "id, display_name, avatar_url, rating_promedio, rating_cantidad";

function isPerfilColumnError(
  error: { code?: string; message?: string } | null,
  column: string
) {
  return (
    error?.code === "42703" ||
    (error?.message?.includes(column) ?? false)
  );
}

function isSobreTiColumnError(error: { code?: string; message?: string } | null) {
  return isPerfilColumnError(error, "sobre_ti");
}

function isVehiculoColumnError(error: { code?: string; message?: string } | null) {
  return (
    isPerfilColumnError(error, "vehiculo_marca") ||
    isPerfilColumnError(error, "vehiculo_modelo") ||
    isPerfilColumnError(error, "distintivo_ambiental")
  );
}

function withPerfilDefaults(
  row: Record<string, unknown>,
  opts: { sobreTi?: boolean; vehiculo?: boolean }
): PerfilPublico {
  return {
    ...row,
    sobre_ti: opts.sobreTi === false ? null : (row.sobre_ti as string | null) ?? null,
    vehiculo_marca:
      opts.vehiculo === false ? null : (row.vehiculo_marca as string | null) ?? null,
    vehiculo_modelo:
      opts.vehiculo === false ? null : (row.vehiculo_modelo as string | null) ?? null,
    vehiculo_anio:
      opts.vehiculo === false ? null : (row.vehiculo_anio as number | null) ?? null,
    distintivo_ambiental:
      opts.vehiculo === false
        ? null
        : (row.distintivo_ambiental as PerfilPublico["distintivo_ambiental"]) ?? null,
  } as PerfilPublico;
}

export async function loadPerfilPublico(
  supabase: ServerClient,
  id: string
): Promise<PerfilPublico | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(PERFIL_PUBLICO_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (data) return withPerfilDefaults(data, {}) as PerfilPublico;

  if (isVehiculoColumnError(error) || isSobreTiColumnError(error)) {
    const legacy = await supabase
      .from("profiles")
      .select(PERFIL_PUBLICO_SELECT_LEGACY)
      .eq("id", id)
      .maybeSingle();
    if (legacy.data) {
      return withPerfilDefaults(legacy.data, {
        sobreTi: false,
        vehiculo: false,
      });
    }
  }

  return null;
}

export async function loadPerfilesPublicos(
  supabase: ServerClient,
  ids: string[]
): Promise<Record<string, PerfilPublico>> {
  if (ids.length === 0) return {};

  const uniqueIds = [...new Set(ids)];
  const { data, error } = await supabase
    .from("profiles")
    .select(PERFIL_PUBLICO_SELECT)
    .in("id", uniqueIds);

  if (data?.length) {
    return Object.fromEntries(
      data.map((p) => [p.id, withPerfilDefaults(p, {}) as PerfilPublico])
    );
  }

  if (isVehiculoColumnError(error) || isSobreTiColumnError(error)) {
    const legacy = await supabase
      .from("profiles")
      .select(PERFIL_PUBLICO_SELECT_LEGACY)
      .in("id", uniqueIds);
    return Object.fromEntries(
      (legacy.data ?? []).map((p) => [
        p.id,
        withPerfilDefaults(p, { sobreTi: false, vehiculo: false }),
      ])
    );
  }

  return {};
}

export function perfilPresentacionIncompleta(profile: {
  avatar_url: string | null;
  sobre_ti: string | null;
}): boolean {
  return !profile.avatar_url || !profile.sobre_ti?.trim();
}

export type ProfileResult =
  | { profile: Profile; error?: undefined }
  | { profile?: undefined; error: string };

function defaultDisplayName(user: User): string {
  const meta = user.user_metadata?.display_name;
  if (typeof meta === "string" && meta.trim()) {
    return meta.trim();
  }
  const email = user.email ?? "";
  const at = email.indexOf("@");
  return at > 0 ? email.slice(0, at) : "Usuario";
}

export async function getOrCreateProfile(
  supabase: ServerClient,
  user: User
): Promise<ProfileResult> {
  const { data: existing, error: readError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (readError) {
    return { error: readError.message };
  }

  if (existing) {
    return { profile: existing as Profile };
  }

  const { data: created, error: insertError } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      display_name: defaultDisplayName(user),
    })
    .select("*")
    .single();

  if (insertError) {
    return {
      error:
        insertError.message ||
        "No se pudo crear tu perfil. Contacta con soporte.",
    };
  }

  return { profile: created as Profile };
}
