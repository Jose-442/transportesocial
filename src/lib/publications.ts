import { createClient } from "@/lib/supabase/server";
import { FREE_PUBLICATIONS } from "@/lib/constants";
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

export function hasFreePublicationSlot(publicationCount: number): boolean {
  return publicationCount < FREE_PUBLICATIONS;
}

export function freePublicationsRemaining(publicationCount: number): number {
  return Math.max(0, FREE_PUBLICATIONS - publicationCount);
}

export async function requiresPublicationPayment(
  userId: string,
  profile: Pick<Profile, "subscription_active">
): Promise<boolean> {
  if (!profile.subscription_active) {
    return false;
  }

  const count = await countUserPublications(userId);
  return !hasFreePublicationSlot(count);
}
