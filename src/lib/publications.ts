import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export async function countUserPublications(userId: string): Promise<number> {
  const supabase = await createClient();

  const [{ count: rutas }, { count: bultos }] = await Promise.all([
    supabase
      .from("rutas_conductores")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("anuncios_bultos")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  return (rutas ?? 0) + (bultos ?? 0);
}

export function hasFreePublicationSlot(_publicationCount?: number): boolean {
  return true;
}

export function freePublicationsRemaining(_publicationCount?: number): number {
  return Number.POSITIVE_INFINITY;
}

export async function requiresPublicationPayment(
  _userId?: string,
  _profile?: Pick<Profile, "subscription_active">
): Promise<boolean> {
  return false;
}
